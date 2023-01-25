import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SettingsService } from 'src/app/services/settings.service';


@Component({
    selector: 'register-page',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss']
})
export class RegisterPage implements OnInit {
    /** Input: nombre de usuario */ 
    public username: string = '';
    /** Input: contraseña */ 
    public password: string = '';
    /** Input: contraseña repetida */ 
    public repeatedPassword: string = '';
    

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
        const error: string = await this.auth.register(this.username, this.password);
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
                onAccept: () => true
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

        // Valida campo contraseña repetida (requerido | equals[password])
        else if (this.repeatedPassword === '') {
            errors.push('Inserta la contraseña por segunda vez.');
        } else if (this.password !== this.repeatedPassword) {
            errors.push('Las contraseñas no coinciden.');
        }
        
        // Si no es válido, se inserta en el modal de error
        if (errors.length > 0) {
            this.settings.openModal({
                title: 'Error',
                content: errors,
                onAccept: () => true
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
