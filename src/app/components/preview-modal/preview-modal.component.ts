import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SettingsService } from 'src/app/services/settings.service';
import { getBase64Format } from 'src/utils';

@Component({
    selector: 'preview-modal',
    templateUrl: './preview-modal.component.html',
    styleUrls: ['./preview-modal.component.scss']
})
export class PreviewModalComponent {
    /** Nombre del keyframe (CSS) de la animación de movimiento de salida */
    private readonly ANIMATION_TRANSLATE_OUT: string = 'primaryModalTranslateOut';
    /** Nombre del keyframe (CSS) de la animación de opacidad de salida */
    private readonly ANIMATION_FADE_OUT: string = 'primaryModalFadeOut';
    /** Variable con el nombre de la clase del modal */
    public readonly CLASSNAME: string = 'ModalPreviewComponent';

    /** Título del modal (opcional) */
    @Input() public title: string = 'Previsualización de Imagen';
    /** Objeto configuración del modal */
    @Input() public image: string = '';
    /** Dispara un evento cuando se ha terminado la animación de salida, en el método 'animationDone' */
    @Output() public afterClose = new EventEmitter();

    constructor(
        private cd: ChangeDetectorRef, 
        private host: ElementRef<HTMLElement>, 
        private sanitizer: DomSanitizer,
        private settings: SettingsService
    ) {}

    public get container(): HTMLElement {
        return this.host.nativeElement.querySelector(`.${this.CLASSNAME}`) as HTMLElement;
    }

    public get modal(): HTMLElement {
        return this.host.nativeElement.querySelector(`.${this.CLASSNAME} .modal`) as HTMLElement;
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
     * Manejador de eventos de 'Cerrar'
     */
    public onCloseClick(event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.settings.closePreviewModal();
    }

    /**
     * Devuelve el b64 con formato
     */
    public format(b64: string): SafeResourceUrl | string {
        return b64 !== '' 
            ? this.sanitizer.bypassSecurityTrustResourceUrl(`${getBase64Format(b64)}${b64}`)
            : '';
    }

    /**
     * Previene y para la propagación de click.
     * Se usa para evitar cerrar el modal cuando se hace click en éste.
     */
    public preventClick(event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();
    }


    /*************************************************************************************************************************/


    /**
     * Shortcut de 'this.cd.detectChanges()'.
     * Para forzar el render en los cambios visuales del modal.
     */
    private apply(delay: number = 0): void {
        setTimeout(() => this.cd.detectChanges(), delay);
    }
}
