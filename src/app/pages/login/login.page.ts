import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SettingsService } from 'src/app/services/settings.service';


@Component({
    selector: 'login-page',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
    /** Input: nombre de usuario */ 
    public username: string = '';
    /** Input: contraseña */ 
    public password: string = '';

    constructor(private router: Router, private auth: AuthService, private settings: SettingsService) {}

    public ngOnInit(): void {}

    /**
     * Manejador de eventos 'submit' del formulario de Login
     */
    public async onSubmit(event: Event): Promise<void> {
        event.preventDefault();

        // Validamos el formulario. Si no es válido.
        if (!this.validate()) {
            return ;
        }

        this.settings.setLoading(true);
        const error: string = await this.auth.login(this.username, this.password);
        this.settings.setLoading(false);
        
        // Si el logueo ha ido bien, se redirige al usuario al /
        if (!error) {
            this.router.navigateByUrl("/");
            this.reset();
        }

        // Si el logueo falla y success es un mensaje de error, se avisa al usuario
        else {
            this.settings.openModal({
                title: 'Error de Autenticación',
                content: [error],
                onAccept: () => this.settings.closeModal()
            });
        }
    }

    /**
     * Valida los campos del formulario
     * @returns True si el formulario es válido, false si no
     */
    private validate(): boolean {
        const errors: Array<string> = [];

        // Valida campo username (requerido)
        if (this.username === '') {
            errors.push('Inserta un nombre de usuario.');
        } 

        // Valida campo contraseña (requerido | minlength = 6)
        if (this.password === '') {
            errors.push('Inserta una contraseña.');
        } else if (this.password.length < 6) {
            errors.push('La contraseña debe tener una longitud mayor que 6.');
        }
        
        if (errors.length > 0) {
            this.settings.openModal({
                title: 'Error',
                content: errors,
                onAccept: () => this.settings.closeModal()
            });
        }

        return errors.length === 0;
    }

    /**
     * Resetea los campos del formulario a sus valores iniciales
     */
    private reset(): void {
        this.username = '';
        this.password = '';
    }
}
