import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SettingsService } from 'src/app/services/settings.service';
import { fileToBase64, getBase64Format, getPromise, getRandomInt } from 'src/utils';

export interface IPrimaryImageInput {
    label?: string;
    value?: string;
    error?: string;
    id?: string;
    title?: string;
    name?: string;
    disabled?: boolean;
    accept?: string;
    maxHeight?: number | null;
    maxWidth?: number | null;
    maxSize?: number | null;
    styles?: any;
    className?: string;
    onChange?: (event: Event) => void;
}

@Component({
    selector: 'primary-image-input',
    templateUrl: './primary-image-input.component.html',
    styleUrls: ['./primary-image-input.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PrimaryImageInputComponent implements OnInit, OnChanges {
    /** Label del input (opcional) */
    @Input() public label: string = 'Subir archivo';
    /** Valor del input */
    @Input() public value: string = '';
    /** Mensaje de error a mostrar (cadena vacía si no hay error que mostrar) */
    @Input() public error: string = '';
    /** Id del input */
    @Input() public id: string = `primary-file-input-${getRandomInt(0, 100000)}`;
    /** Title del input */
    @Input() public title: string = '';
    /** Atributo 'name' del input */
    @Input() public name: string = '';
    /** Atributo 'disabled' del input */
    @Input() public disabled: boolean = false;
    /** Atributo 'accept' del input */
    @Input() public accept: string = 'image/*';
    /** Máxima altura permitida para la imagen */
    @Input() public maxHeight: number | null = null;
    /** Máxima anchura permitida para la imagen */
    @Input() public maxWidth: number | null = null;
    /** Máximo tamaño permitido para la imagen */
    @Input() public maxSize: number | null = null;
    /** Estilos añadidos directamente al input */
    @Input() public styles: any = {};
    /** Clase añadida al input directamente (útil para distinguirlo a la hora de buscar en el DOM, p.e.) */
    @Input() public className: string = '';
    /** Callback a ejecutar a la hora de hacer change (para parametrizar el componente) */
    @Input() public onChangeCallback: (event: string) => void | null = null;

    /** Creamos los 'emisores de eventos' */
    @Output() public onChange = new EventEmitter<string>();

    /** Loader de carga de imagen */
    public loading: boolean = false;
    /** Base64 con formato (desde this.value) */
    public image: SafeResourceUrl | string = '';

    constructor(private sanitizer: DomSanitizer, private settings: SettingsService) { }

    public ngOnInit(): void {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['value']) {
            const { currentValue, previousValue, firstChange } = changes['value'];
            this.image = currentValue !== '' 
                ? this.sanitizer.bypassSecurityTrustResourceUrl(`${getBase64Format(currentValue)}${currentValue}`) 
                : '';
        }
    }

    /** Manejador de evento 'change' del input */
    public async onInputChange(event: Event): Promise<void> {
        const file = (<HTMLInputElement> event.target).files[0];
        const { size } = file;

        // Comprobamos el tamaño
        if (this.maxSize && size > this.maxSize) {
            this.settings.openModal({
                title: 'Aviso',
                content: [`El tamaño máximo permitido para la imagen es ${this.maxSize}kb. La imagen subida (${size}kb) supera el límite.`],
                onAccept: () => this.settings.closeModal()
            });
            return;
        }   

        // Sacamos el base64 de la imagen
        this.loading = true;
        const b64 = await fileToBase64(file);

        // Conseguimos la altura y el ancho de la imagen si es necesario comprobar alguna de éstas
        if (this.maxHeight || this.maxWidth) {
            const [prom, resolve] = getPromise();
            const img = new Image();
            img.onload = function() {
                resolve(this);
            }
            img.src = b64 as string;
            const { width, height } = await prom;
            
            // Comprobamos que ninguna supere el límite de dimensiones establecido
            if (this.maxWidth && this.maxHeight && (width > this.maxWidth || height > this.maxHeight)) {
                // Si la imagen supera tanto ancho como alto el límite...
                this.settings.openModal({
                    title: 'Aviso',
                    content: [`La imagen elegida (${width}x${height}) es superior a las dimensiones establecidas. Debes subir una imagen de ${this.maxWidth}x${this.maxHeight}.`],
                    onAccept: () => this.settings.closeModal()
                });
                this.loading = false;
                return;
            } else if (this.maxWidth && width > this.maxWidth) {
                // Si la imagen supera el ancho...
                this.settings.openModal({
                    title: 'Aviso',
                    content: [`La imagen elegida (${width}x${height}) supera el límite de ancho establecido de ${this.maxWidth}`],
                    onAccept: () => this.settings.closeModal()
                });
                this.loading = false;
                return;
            } else if (this.maxHeight && height > this.maxHeight) {
                // Si la imagen supera el alto...
                this.settings.openModal({
                    title: 'Aviso',
                    content: [`La imagen elegida (${width}x${height}) supera el límite de alto establecido de ${this.maxHeight}`],
                    onAccept: () => this.settings.closeModal()
                });
                this.loading = false;
                return;
            }
        }
        this.loading = false;
        
        // Si cumple todas las condiciones, se emite el base64
        const base64: string = `${b64}`.split(',')[1];

        if (this.onChangeCallback) {
            this.onChangeCallback(base64);
        }
        this.onChange.emit(base64);
    }

    /** Manejador de eventos 'click' para lanzar el input file */
    public onClick(event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();

        const labelDOM = document.getElementById(`${this.id}-label`);
        if (labelDOM) {
            labelDOM.click();
        }
    }

    /** Manejador de eventos 'click' del botón de quitar */
    public onClearClick(event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();

        if (this.onChangeCallback) {
            this.onChangeCallback('');
        }
        this.onChange.emit('');

        const inputDOM = document.getElementById(this.id);
        if (inputDOM) {
            (<HTMLInputElement> inputDOM).value = '';
        }
    }

    /** Manejador de eventos 'click' del botón de Previsualización */
    public onPreviewClick(event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();

        this.settings.openPreviewModal(this.value, this.label);
    }
}
