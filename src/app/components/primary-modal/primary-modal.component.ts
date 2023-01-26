import { AfterContentInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

export interface IPrimaryModal {
    title: string;
    content: Array<string>;
    onAccept?: () => void | boolean;
    onCancel?: () => void | boolean;
}

@Component({
    selector: 'primary-modal',
    templateUrl: './primary-modal.component.html',
    styleUrls: ['./primary-modal.component.scss']
})
export class PrimaryModalComponent implements AfterContentInit {
    /** Nombre del keyframe (CSS) de la animación de movimiento de salida */
    private readonly ANIMATION_TRANSLATE_OUT: string = 'primaryModalTranslateOut';
    /** Nombre del keyframe (CSS) de la animación de opacidad de salida */
    private readonly ANIMATION_FADE_OUT: string = 'primaryModalFadeOut';
    /** Variable con el nombre de la clase del modal */
    public readonly CLASSNAME: string = 'PrimaryModalComponent';

    /** Objeto configuración del modal */
    @Input() public conf: IPrimaryModal;
    /** Profundidad (z-index) del modal */
    @Input() public level: number = 0;
    /** Dispara un evento cuando se ha terminado la animación de salida, en el método 'animationDone' */
    @Output() public afterClose = new EventEmitter();

    constructor(
        private settings: SettingsService,
        private cd: ChangeDetectorRef,
        private host: ElementRef<HTMLElement>, 
    ) { }

    public get container(): HTMLElement {
        return this.host.nativeElement.querySelector(`.${this.CLASSNAME}`) as HTMLElement;
    }

    public get modal(): HTMLElement {
        return this.host.nativeElement.querySelector(`.${this.CLASSNAME} .modal`) as HTMLElement;
    }

    public ngAfterContentInit(): void {
        setTimeout(() => {
            const acceptBtn: HTMLButtonElement | null = <HTMLButtonElement> document.getElementById(`primary-modal-success-btn-${this.level}`);
            const cancelBtn: HTMLButtonElement | null = <HTMLButtonElement> document.getElementById(`primary-modal-danger-btn-${this.level}`);
            const defaultBtn: HTMLButtonElement | null = <HTMLButtonElement> document.getElementById(`primary-modal-default-btn-${this.level}`);

            // Comprobamos primero el botón por defecto, sino el de aceptar y, por último, el de cancelar
            if (defaultBtn) {
                defaultBtn.focus();
            } else if (acceptBtn) {
                acceptBtn.focus();
            } else if (cancelBtn) { 
                cancelBtn.focus();
            }
        }, 100);
    }

    /**
     * Manejador de eventos cuando acaba la transición de salida del modal, para destruirlo cuando termina
     */
    public animationDone(event: AnimationEvent): void {
        if (event.animationName === this.ANIMATION_FADE_OUT) {
            this.afterClose.emit(true);
        }
    }

    /**
     * Activa la animación de salida antes de cerrar el componente. 
     * Cuando la animación acaba, salta el método 'animationDone'.
     */
    public close(): void {
        this.modal.style.animation = `${this.ANIMATION_TRANSLATE_OUT} .3s`;
        this.container.style.animation = `${this.ANIMATION_FADE_OUT} .4s`;
    }

    /**
     * Manejador de eventos de 'Aceptar'.
     * Ejecuta el callback 'onAccept' y cierra el modal si éste va bien.
     */
    public onAcceptClick = (event: MouseEvent): void => {
        event.preventDefault();
        event.stopPropagation();

        // Si se pasa callback y devuelve 'true', cierra el modal.
        if (this.conf && this.conf.onAccept !== undefined) {
            const success: boolean | void = this.conf.onAccept();
            if (success !== false) {
                this.settings.closeModal();
            }
        } else {
            this.settings.closeModal();
        }
    }

    /**
     * Manejador de eventos de 'Cancelar'.
     * Ejecuta el callback 'onCancel' y cierra el modal si éste va bien.
     */
    public onCancelClick = (event: MouseEvent): void => {
        event.preventDefault();
        event.stopPropagation();

        // Si se pasa callback y devuelve 'true', cierra el modal.
        if (this.conf && this.conf.onCancel !== undefined) {
            const success: boolean | void = this.conf.onCancel();
            if (success !== false) {
                this.settings.closeModal();
            }
        } else {
            this.settings.closeModal();
        }
    }

    /**
     * Manejador de eventos del botón por defecto.
     * Cierra el modal.
     */
    public onDefaultClick(event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.settings.closeModal();
    }


    /************************************************************************************************************************/


    /**
     * Shortcut de 'this.cd.detectChanges()'.
     * Para forzar el render en los cambios visuales del modal.
     */
    private apply(delay: number = 0): void {
        setTimeout(() => this.cd.detectChanges(), delay);
    }
}
