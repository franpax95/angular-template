import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { clone } from 'src/utils';

export interface IPrimarySelectOption {
    key: string | number | null;
    value: string | number;
}

export interface IPrimarySelect {
    label?: string;
    value?: string | number | null;
    options?: Array<IPrimarySelectOption>;
    error?: string;
    emptyOption?: string;
    id?: string;
    title?: string;
    name?: string;
    disabled?: boolean;
    styles?: any;
    containerStyles?: any;
    className?: string;
    containerClassName?: string;
    onChange?: (event: Event) => void;
}

@Component({
    selector: 'primary-select',
    templateUrl: './primary-select.component.html',
    styleUrls: ['./primary-select.component.scss']
})
export class PrimarySelectComponent implements OnInit, OnChanges {
    /** Label del input (opcional) */
    @Input() public label: string = '';
    /** Valor del input */
    @Input() public value: string | number | null = null;
    /** Opciones cargadas en el input */
    @Input() public options: Array<IPrimarySelectOption> = [];
    /** Mensaje de error a mostrar (cadena vacía si no hay error que mostrar) */
    @Input() public error: string = '';
    /** Si se especifica, añade una opción 'vacía' con el texto pasado */
    @Input() public emptyOption: string = '';
    /** Id del input */
    @Input() public id: string = '';
    /** Title del input */
    @Input() public title: string = '';
    /** Atributo 'name' del input */
    @Input() public name: string = '';
    /** Atributo 'disabled' del input */
    @Input() public disabled: boolean = false;
    /** Estilos añadidos directamente al input */
    @Input() public styles: any = {};
    /** Estilos añadidor al container del componente */
    @Input() public containerStyles: any = {};
    /** Clase añadida al input directamente (útil para distinguirlo a la hora de buscar en el DOM, p.e.) */
    @Input() public className: string = '';
    /** Clase añadida al container del componente */
    @Input() public containerClassName: string = '';

    /** Callback a ejecutar a la hora de hacer change (para parametrizar el componente) */
    @Input() public onChangeCallback: (event: Event) => void | null = null;

    /** Creamos los 'emisores de eventos' */
    @Output() public onChange = new EventEmitter<Event>();

    /** Objeto con las opciones a renderizar */
    public selectOptions: Array<IPrimarySelectOption> = [];


    constructor() { }

    public ngOnInit(): void {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['options'] && changes['emptyOption']) {
            const { currentValue: cvValue, previousValue: pvValue, firstChange: fcValue } = changes['options'];
            const { currentValue: cvEmpty, previousValue: pvEmpty, firstChange: fcEmpty } = changes['emptyOption'];
            this.selectOptions = this.getOptions(cvValue, cvEmpty);
        } else if (changes['options']) {
            const { currentValue, previousValue, firstChange } = changes['options'];
            this.selectOptions = this.getOptions(currentValue, this.emptyOption);
        } else if (changes['emptyOption']) {
            const { currentValue, previousValue, firstChange } = changes['emptyOption'];
            this.selectOptions = this.getOptions(this.options, currentValue);
        }
    }

    /** Manejador de eventos 'keyup' y 'change' del input */
    public onSelectChange(event: Event): void {
        if (this.onChangeCallback) {
            this.onChangeCallback(event);
        }
        this.onChange.emit(event as Event);
    }

    /** Shortcut para obtener las opciones */
    private getOptions(options: Array<IPrimarySelectOption>, emptyOption: string): Array<IPrimarySelectOption> {
        let opts: Array<IPrimarySelectOption> = clone(options);

        if (emptyOption !== '') {
            return [{ key: null, value: emptyOption }, ...opts];
        } 
        
        return opts;
    }
}
