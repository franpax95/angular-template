import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface IPrimaryButton {
    content?: string;
    id?: string;
    type?: string;
    disabled?: string;
    icon?: string;
    className?: string;
    styles?: any;
    tooltip?: string;
    tooltipPlacement?: string;
    onClick?: (event: MouseEvent) => void;
}   

@Component({
    selector: 'primary-button',
    templateUrl: './primary-button.component.html',
    styleUrls: ['./primary-button.component.scss']
})
export class PrimaryButtonComponent {
    /** Id del botón */
    @Input() public id: string = '';
    /** Tipo del botón: 'button' o 'submit' */
    @Input() public type: string = '';
    /** Indica si el botón está deshabilitado */
    @Input() public disabled: boolean = false;
    /** Nombre del mat-icon a renderizar con el botón */
    @Input() public icon: string = '';
    /** Clase adicional del componente. 'success' o 'danger' son dos valores posibles. */
    @Input() public className: string = '';
    /** Estilos del botón */
    @Input() public styles: any = {};
    /** Texto a poner en el tooltip. Dejar vacío si no se quiere tooltip. */
    @Input() public tooltip: string = '';
    /** Lugar donde colocar el tooltip. Se admiten 'top', 'bottom', 'left', 'right' como valores. */
    @Input() public tooltipPlacement: string = 'top';
    /** Callback a ejecutar a la hora de hacer change (para parametrizar el componente) */
    @Input() public onClickCallback: (event: MouseEvent) => void | null = null;
    /** 'Emisor de evento' del evento 'click' */
    @Output() public onClick = new EventEmitter<MouseEvent>();

    constructor() { }

    /**
     * Manejador de eventos 'click' del botón
     */
    public onButtonClick(event: MouseEvent): void {
        if (this.onClickCallback) {
            this.onClickCallback(event);
        }

        this.onClick.emit(event);
    }
}
