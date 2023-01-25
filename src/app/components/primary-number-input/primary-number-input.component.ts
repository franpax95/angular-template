import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';

export interface IPrimaryNumberInput {
    label?: string;
    prepend?: string;
    append?: string;
    value?: number | null;
    defaultValue?: number | null;
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
    onBlur?: (event: Event) => number | null;
    onChange?: (event: Event) => void;
    onKeyUp?: (event: KeyboardEvent) => void;
}

@Component({
    selector: 'primary-number-input',
    templateUrl: './primary-number-input.component.html',
    styleUrls: ['./primary-number-input.component.scss']
})
export class PrimaryNumberInputComponent implements OnInit, OnChanges {
    /** Label del input (opcional) */
    @Input() public label: string = '';
    /** Símbolo para añadir al principio del input */
    @Input() public prepend: string = '';
    /** Símbolo para añadir al final del input */
    @Input() public append: string = '';
    /** Valor del input */
    @Input() public value: number | null = null;
    /** Valor por defecto del input cuando no se introduzca uno válido */
    @Input() public defaultValue: number | null = null;
    /** Mensaje de error a mostrar (cadena vacía si no hay error que mostrar) */
    @Input() public error: string = '';
    /** Id del input */
    @Input() public id: string = '';
    /** Atributo 'name' del input */
    @Input() public name: string = '';
    /** Atributo 'placeholder' del input */
    @Input() public placeholder: string = '';
    /** Atributo 'disabled' del input */
    @Input() public disabled: boolean = false;
    /** Atributo 'readonly' del input */
    @Input() public readonly: boolean = false;
    /** Estilos añadidos directamente al input */
    @Input() public styles: any = {};
    /** Estilos añadidor al container del componente */
    @Input() public containerStyles: any = {};
    /** Clase añadida al input directamente (útil para distinguirlo a la hora de buscar en el DOM, p.e.) */
    @Input() public className: string = '';
    /** Clase añadida al container del componente */
    @Input() public containerClassName: string = '';
    /** Callback a ejecutar a la hora de hacer blur (para parametrizar el componente) */
    @Input() public onBlurCallback: (value: number | null) => void | null = null;
    /** Callback a ejecutar a la hora de hacer change (para parametrizar el componente) */
    @Input() public onChangeCallback: (event: Event) => void | null = null;
    /** Callback a ejecutar a la hora de hacer keyup (para parametrizar el componente) */
    @Input() public onKeyUpCallback: (event: KeyboardEvent) => void | null = null;

    /** Creamos los 'emisores de eventos' */
    @Output() public onBlur = new EventEmitter<number | null>();
    @Output() public onChange = new EventEmitter<Event>();
    @Output() public onKeyUp = new EventEmitter<KeyboardEvent>();

    /** Copia de 'value' para usar como ngModel como string */
    public input: string = '';

    constructor() { }

    public ngOnInit(): void {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['value']) {
            const { currentValue, previousValue, firstChange } = changes['value'];
            this.input = this.value2input(currentValue);
        }
    }

    /** Manejador de eventos 'blur' del input */
    public onInputBlur(event: Event): void {
        const { value } = (<HTMLInputElement> event.target);
        this.input = this.sanitizeInputValue(value);
        this.onBlur.emit(this.input2value(this.input));
    }

    /** Manejador de eventos 'change' del input */
    public onInputChange(event: Event): void {
        if (this.onChangeCallback) {
            this.onChangeCallback(event);
        }

        this.onChange.emit(event);
    }

    /** Manejador de eventos 'keyup' del input */
    public onInputKeyUp(event: KeyboardEvent): void {
        if (this.onKeyUpCallback) {
            this.onKeyUpCallback(event);
        }

        this.onKeyUp.emit(event);
    }

    /**
     * Parsea un string a número o null según el caso
     */
    private input2value(input: string): number | null {
        if (input === '' || isNaN(Number(input))) {
            return this.defaultValue;
            // return null;
        }

        return Number(input);
    }

    /**
     * Comprueba que el input introducido sea un número y lo normaliza en caso de que si.
     */
    private sanitizeInputValue(input: string): string {
        if (input === '' || isNaN(Number(input))) {
            return this.defaultValue !== null ? `${this.defaultValue}` : '';
        }

        return `${Number(input)}`;
    }

    /**
     * Parsea un número o null a string
     */
    private value2input(value: number | null): string {
        if (value === null) {
            return '';
        }

        return `${value}`;
    }
}
