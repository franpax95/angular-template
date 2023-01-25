import { Component, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';

export interface IPrimaryDateInput {
    label?: string;
    value?: string;
    error?: string;
    id?: string;
    type?: string;
    title?: string;
    name?: string;
    placeholder?: string;
    autocomplete?: string;
    disabled?: boolean;
    styles?: any;
    containerStyles?: any;
    className?: string;
    containerClassName?: string;
    symbol?: string;
    onBlur?: (event: Event) => void;
    onChange?: (event: Event) => void;
    onKeyUp?: (event: KeyboardEvent) => void;
}

@Component({
    selector: 'primary-date-input',
    templateUrl: './primary-date-input.component.html',
    styleUrls: ['./primary-date-input.component.scss']
})
export class PrimaryDateInputComponent implements OnChanges {
    /** Label del input (opcional) */
    @Input() public label: string = '';
    /** Valor del input. Debe venir vacío o en formato 'DD-MM-YYYY' */
    @Input() public value: string = '';
    /** Mensaje de error a mostrar (cadena vacía si no hay error que mostrar) */
    @Input() public error: string = '';
    /** Id del input */
    @Input() public id: string = '';
    /** Atributo 'name' del input */
    @Input() public name: string = '';
    /** Atributo 'placeholder' del input */
    @Input() public placeholder: string = '';
    /** Atributo 'autocomplete' del input */
    @Input() public autocomplete: string = 'off';
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
    /** Símbolo entre valores de la fecha pasada por parámetro. Se permite "/" o "-" */
    @Input() public symbol: string = '-';

    /** Creamos los 'emisores de eventos' */
    @Output() public onBlur = new EventEmitter<string>();
    @Output() public onChange = new EventEmitter<string>();

    /** Valor interno del input */
    public date: string = '';

    constructor() { }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['value']) {
            const { currentValue, previousValue, firstChange } = changes['value'];
            this.date = this.value2date(currentValue);
        }
    }

    /** Manejador de eventos 'blur' del input */
    public onInputBlur(event: Event): void {
        const value = this.date2value((<HTMLInputElement> event.target).value);
        this.onBlur.emit(value);
    }

    /** Manejador de evento 'change' del input */
    public onInputChange(event: Event): void {
        const value = this.date2value((<HTMLInputElement> event.target).value);
        this.onChange.emit(value);
    }

    /**
     * Parsea una fecha en formato 'YYYY-MM-DD' a formato 'DD-MM-YYYY'
     */
    private date2value(date: string): string {
        if (date === '') {
            return '';
        }

        const [yyyy, mm, dd] = date.split('-');
        const DD: string = dd.padStart(2, '0');
        const MM: string = mm.padStart(2, '0');
        const YYYY: string = yyyy.padStart(4, '0');
        return `${DD}${this.symbol}${MM}${this.symbol}${YYYY}`;
    }

    /**
     * Parsea una fecha en formato 'DD-MM-YYYY' a formato 'YYYY-MM-DD'
     */
    private value2date(value: string): string {
        if (value === '') {
            return '';
        }

        const [dd, mm, yyyy] = value.split(this.symbol);
        const DD: string = dd.padStart(2, '0');
        const MM: string = mm.padStart(2, '0');
        const YYYY: string = yyyy.padStart(4, '0');
        return `${YYYY}-${MM}-${DD}`;
    }
}
