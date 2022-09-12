import { Component, OnDestroy, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {

    constructor(private settings: SettingsService) { }

    ngOnInit(): void {}

    ngOnDestroy(): void {}

    public onModalOpen(): void {
        this.settings.openModal({
            title: 'Prueba',
            content: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit rutrum sapien id tempor. Cras.'],
            onAccept: () => this.settings.openModal({
                title: 'Prueba 2',
                content: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit rutrum sapien id tempor. Cras.'],
                onAccept: () => this.settings.openModal({
                    title: 'Prueba 3',
                    content: ['Juan'],
                    onCancel: () => this.settings.closeModal(),
                    onAccept: () => this.settings.closeAllModals()
                }),
                onCancel: () => this.settings.closeModal()
            }),
            onCancel: () => this.settings.closeModal()
        });
    }
}
