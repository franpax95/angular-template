import { Component, OnDestroy, OnInit } from '@angular/core';
import { IPrimarySelectOption } from 'src/app/components/primary-select/primary-select.component';
import { HttpService } from 'src/app/services/http.service';
import { SettingsService } from 'src/app/services/settings.service';
import { estrella } from 'src/base64/estrella';

@Component({
    selector: 'home-page',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {
    /** para probar input */
    public input: string = '';
    /** para probar input number */
    public inputNumber: number = 0;
    /** */
    public inputSelect: number = 1;
    /**  */
    public selectOptions: Array<IPrimarySelectOption> = [
        { key: 1, value: 'Juan' },
        { key: 2, value: 'Alberto' },
    ];

    /** Guarda un base64 */
    public imgInput: string = '';

    constructor(private http: HttpService, private settings: SettingsService) { }

    public ngOnInit(): void {}

    public ngOnDestroy(): void {}

    /**
     * 
     */
    public onPrintClick(event: MouseEvent): void {
        console.dir(`this.input = ${this.input}`);
        console.dir(`this.inputNumber = ${this.inputNumber}`);
        console.dir(`this.inputSelect = ${this.inputSelect}`);
    }

    /**
     * 
     */
    public onPreviewClick(event: MouseEvent): void {
        this.settings.openPreviewModal(estrella, 'Ceballos');
    }

    /**
     * Manejador de eventos de input de prueba
     */
    public onInputChange(event: Event): void {
        this.input = (<HTMLInputElement> event.target).value;
    }

    /**
     * Manejador de eventos de input de prueba de números
     */
    public onInputNumberChange(value: number | null): void {
        this.inputNumber = value;
    }

    /**
     * Manejador de eventos de selector
     */
    public onSelectChange(event: Event): void {
        this.inputSelect = Number((<HTMLInputElement> event.target).value);
    }

    public onImageChange(value: string): void {
        this.imgInput = value;
    }

    /**
     * Manejador de eventos del botón para lanzar modales anidados
     */
    public onModalOpen(): void {
        /**
         * Ejemplo de display de modales anidados.
         */
        this.settings.openModal({
            title: 'Primer Modal',
            content: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit rutrum sapien id tempor. Cras.'],
            onAccept: () => {
                this.settings.openModal({
                    title: 'Segundo Modal',
                    content: ['Modal de pruebas'],
                    onAccept: () => this.settings.closeAllModals(),
                    onCancel: () => {}
                });

                // Necesario para no cerrar el modal que intentamos abrir de inmediato
                return false;
            },
            onCancel: () => {
                this.settings.openModal({
                    title: 'Modal de Cancelación',
                    content: ['Has cancelado el modal de pruebas correctamente'],
                    onAccept: () => this.settings.closeAllModals(),
                });

                return false;
            }
        });
    }
}
