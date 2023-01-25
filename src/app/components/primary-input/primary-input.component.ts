import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface IPrimaryInput {
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
    onBlur?: (event: Event) => void;
    onChange?: (event: Event) => void;
    onKeyUp?: (event: KeyboardEvent) => void;
}

@Component({
    selector: 'primary-input',
    templateUrl: './primary-input.component.html',
    styleUrls: ['./primary-input.component.scss']
})
export class PrimaryInputComponent {
    /** Label del input (opcional) */
    @Input() public label: string = '';
    /** Valor del input */
    @Input() public value: string = '';
    /** Mensaje de error a mostrar (cadena vacía si no hay error que mostrar) */
    @Input() public error: string = '';
    /** Id del input */
    @Input() public id: string = '';
    /** Atributo 'type' del input */
    @Input() public type: string = 'text';
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
    /** Callback a ejecutar a la hora de hacer blur (para parametrizar el componente) */
    @Input() public onBlurCallback: (event: Event) => void | null = null;
    /** Callback a ejecutar a la hora de hacer change (para parametrizar el componente) */
    @Input() public onChangeCallback: (event: Event) => void | null = null;
    /** Callback a ejecutar a la hora de hacer keyup (para parametrizar el componente) */
    @Input() public onKeyUpCallback: (event: KeyboardEvent) => void | null = null;

    /** Creamos los 'emisores de eventos' */
    @Output() public onChange = new EventEmitter<Event>();
    @Output() public onBlur = new EventEmitter<Event>();
    @Output() public onKeyUp = new EventEmitter<KeyboardEvent>();

    constructor() { }

    /** Manejador de eventos 'blur' del input */
    public onInputBlur(event: Event): void {
        if (this.onBlurCallback) {
            this.onBlurCallback(event);
        }

        this.onBlur.emit(event);
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
}
