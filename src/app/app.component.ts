import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { SettingsService } from './services/settings.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    /** Suscripción al loader del servicio de ajustes para que cualquier componente pueda lanzar el spinner de carga */
    private loadingSubscription!: Subscription;
    /** True para renderizar spinner de carga */
    public loading: boolean = false;

    constructor(private settings: SettingsService) {}

    public ngOnInit(): void {
        // Nos suscribimos al observable loading del settings service para mostrar el spinner de carga
        this.loadingSubscription = this.settings.loadingObs.subscribe((loading: boolean) => this.loading = loading);
    }

    public ngOnDestroy(): void {
        // Nos dessuscribimos de los diferentes observables
        if (this.loadingSubscription) {
            this.loadingSubscription.unsubscribe();
        }
    }
}
