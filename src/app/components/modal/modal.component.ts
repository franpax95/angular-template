import { AfterContentInit, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IModal } from 'src/app/interfaces/IModal';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, AfterContentInit {
    /** Nombre del keyframe (CSS) de la animación de movimiento de salida */
    private readonly ANIMATION_TRANSLATE_OUT: string = 'primaryModalTranslateOut';
    /** Nombre del keyframe (CSS) de la animación de opacidad de salida */
    private readonly ANIMATION_FADE_OUT: string = 'primaryModalFadeOut';

    /** Objeto configuración del modal */
    @Input() public conf: IModal | null = null;
    /** Profundidad (z-index) del modal */
    @Input() public level: number | null = null;

    /** Dispara un evento cuando se ha terminado la animación de salida, en el método 'animationDone' */
    @Output() public afterClose = new EventEmitter();


    constructor(private host: ElementRef<HTMLElement>) {}

    public ngOnInit(): void {}

    public ngAfterContentInit(): void {
        setTimeout(() => {
            const acceptBtn: HTMLButtonElement | null = <HTMLButtonElement> document.getElementById(`general-modal-success-btn-${this.level}`);
            const cancelBtn: HTMLButtonElement | null = <HTMLButtonElement> document.getElementById(`general-modal-danger-btn-${this.level}`);

            if (acceptBtn) {
                acceptBtn.focus();
            } else if (cancelBtn) { 
                cancelBtn.focus();
            }
        }, 100);
    }

    public get container(): HTMLElement {
        return this.host.nativeElement.querySelector('.ModalComponent') as HTMLElement;
    }

    public get modal(): HTMLElement {
        return this.host.nativeElement.querySelector('.ModalComponent .modal') as HTMLElement;
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
     * Manejador de eventos de 'Aceptar'
     */
    public onAcceptClick = (event: MouseEvent): void => {
        event.preventDefault();
        event.stopPropagation();

        if (this.conf && this.conf.onAccept !== undefined) {
            this.conf.onAccept();
        }
    }

    /**
     * Manejador de eventos de 'Cancelar'
     */
    public onCancelClick = (event: MouseEvent): void => {
        event.preventDefault();
        event.stopPropagation();

        if (this.conf && this.conf.onCancel !== undefined) {
            this.conf.onCancel();
        }
    }
}
