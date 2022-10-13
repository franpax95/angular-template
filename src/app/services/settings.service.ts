import { DOCUMENT } from '@angular/common';
import { ComponentFactoryResolver, ComponentRef, Inject, Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ModalComponent } from '../components/modal/modal.component';

import { IModal } from '../interfaces/IModal';

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
    private modalRefs: Array<ComponentRef<ModalComponent>> = [];

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
    public openModal(conf: IModal): void {
        const factory = this.resolver.resolveComponentFactory(ModalComponent);
        const componentRef: ComponentRef<ModalComponent> = factory.create(this.injector);

        componentRef.instance.conf = conf;
        componentRef.instance.level = this.modalRefs.length;
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
     * Cierra el último modal abierto, preservando los anteriores, en caso de que hubiera.
     */
    public closeModal(): void {
        const componentRef: ComponentRef<ModalComponent> = this.modalRefs.pop();
        componentRef.instance.close();
    }

    /**
     * Cierra todos los modales abiertos.
     */
    public closeAllModals(): void {
        // Cerramos todos los modales
        for (let i = 0; i < this.modalRefs.length; i++) {
            this.modalRefs[i].instance.close();
        }

        // Reiniciamos la variable con los modales
        this.modalRefs = [];
    }
}
