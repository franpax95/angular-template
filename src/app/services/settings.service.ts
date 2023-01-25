import { DOCUMENT } from '@angular/common';
import { ComponentFactoryResolver, ComponentRef, Inject, Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PreviewModalComponent } from '../components/preview-modal/preview-modal.component';
import { PrimaryModalComponent, IPrimaryModal } from '../components/primary-modal/primary-modal.component';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    /** Variable que indica si actualmente está el spinner visible */
    private loading: boolean = false;
    /** Subject para actualizar el observable */
    private loadingSub: BehaviorSubject<boolean> = new BehaviorSubject(this.loading);
    /** Observable al que suscribirse para recibir los cambios */
    public loadingObs: Observable<boolean> = this.loadingSub.asObservable();

    /** Array de las referencias a las instancias de modales */
    private modalRefs: Array<ComponentRef<PrimaryModalComponent>> = [];
    /** Variable que guarda la ref del modal de auditoría para su cierre programático */
    private previewModalRef: ComponentRef<PreviewModalComponent> | null = null;

    constructor(
        private resolver: ComponentFactoryResolver,
        private injector: Injector,
        @Inject(DOCUMENT) private document: Document
    ) { }

    /**
     * Muestra u oculta el spinner de cargando
     */
    public setLoading(loading: boolean): void {
        this.loading = loading;
        this.loadingSub.next(this.loading);
    }

    /** 
     * Abre un modal nuevo, que se superpone al actual, en caso de que hubiera.
     */
    public openModal(conf: IPrimaryModal): void {
        const factory = this.resolver.resolveComponentFactory(PrimaryModalComponent);
        const componentRef: ComponentRef<PrimaryModalComponent> = factory.create(this.injector);

        componentRef.instance.level = this.modalRefs.length;
        componentRef.instance.conf = conf;
        componentRef.hostView.detectChanges();
        this.modalRefs.push(componentRef);
        
        const { nativeElement } = componentRef.location;
        this.document.body.appendChild(nativeElement);

        componentRef.instance.afterClose.subscribe(() => {
            componentRef.destroy();
            this.document.body.removeChild(nativeElement);
        });
    }

    /** 
     * Abre un modal de auditoría con la info pasada por parámetro
     */
    public openPreviewModal(image: string, title?: string): void {
        if (this.previewModalRef === null) {
            const factory = this.resolver.resolveComponentFactory(PreviewModalComponent);
            const componentRef: ComponentRef<PreviewModalComponent> = factory.create(this.injector);

            if (title) {
                componentRef.instance.title = title;
            }

            componentRef.instance.image = image;
            componentRef.hostView.detectChanges();
            this.previewModalRef = componentRef;
            
            const { nativeElement } = componentRef.location;
            this.document.body.appendChild(nativeElement);

            componentRef.instance.afterClose.subscribe(() => {
                componentRef.destroy();
                this.document.body.removeChild(nativeElement);
                this.previewModalRef = null;
            });
        }
    }

    /**
     * Cierra el último modal abierto, preservando los anteriores, en caso de que hubiera.
     */
    public closeModal(): void {
        if (this.modalRefs.length > 0) {
            const componentRef: ComponentRef<PrimaryModalComponent> = this.modalRefs.pop();
            componentRef.instance.close();
        }
    }

    /**
     * Cierra todos los modales abiertos.
     */
    public closeAllModals(): void {
        if (this.modalRefs.length > 0) {
            // Cerramos todos los modales
            for (let i = 0; i < this.modalRefs.length; i++) {
                this.modalRefs[i].instance.close();
            }

            // Reiniciamos la variable con los modales
            this.modalRefs = [];
        }
    }

    /**
     * Cierra el modal de mantenimiento/selección
     */
    public closePreviewModal(): void {
        if (this.previewModalRef !== null) {
            this.previewModalRef.instance.close();
        }
    }
}
