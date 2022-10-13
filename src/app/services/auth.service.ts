import { Injectable } from '@angular/core';

import { IUser } from '../interfaces/IUser';
import { HttpService } from './http.service';
import { SettingsService } from './settings.service';

import md5 from 'md5';
import { clone } from 'src/utils';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    /** Nombre del storage donde guardar la información del usuario */
    private readonly USER_STORAGE = '_ANGULAR_TEMPLATE_USER_STORAGE_';
    /** Nombre del storage donde guardar el token */
    private readonly TOKEN_STORAGE = '_ANGULAR_TEMPLATE_TOKEN_STORAGE_';

    /** Variable con la información del usuario, o null si no hubiera uno cargado en la aplicación */
    private user: IUser | null = null;
    /** Token del usuario cargado en la aplicación */
    private token: string | null = null;

    constructor(private http: HttpService, private settings: SettingsService) { }

    /**
     * Indica si hay un usuario autenticado cargado en la aplicación
     */
    public isAuth(): boolean {
        return !!this.user;
    }

    /**
     * Devuelve el token cargado en la aplicación, si lo hubiera
     */
    public getToken(): string | null {
        return this.token !== null ? `${this.token}` : null;
    }

    /**
     * Devuelve el usuario cargado en la aplicación, si lo hubiera
     */
    public getUsuario(): IUser | null {
        return clone(this.user);
    }

    /**
     * Realiza el login a partir de un nombre de usuario y una contraseña.
     * Devuelve cadena vacía si todo ha ido bien o un mensaje de error en caso contrario.
     */
    public async login(username: string, password: string): Promise<string> {
        const url: string = 'login';
        const params = { username, password: md5(password) };

        const error = await this.http.post(url, params, this.http.getAuthorizationHeaders())
            .then(res => {
                const { data } = res;

                // Cargamos el usuario en la aplicación y lo guardamos en el localStorage
                this.user = data.user;
                localStorage.setItem(this.USER_STORAGE, JSON.stringify(this.user));

                // En caso de recibir token, cargamos el token en la aplicación y lo guardamos en el localStorage
                if (data.token) {
                    this.token = data.token;
                    localStorage.setItem(this.TOKEN_STORAGE, this.token);
                }

                return '';
            })
            .catch(err => {
                console.error(err);
                return 'Ha ocurrido un error durante el inicio de sesión. Inténtelo de nuevo más tarde.';
            });

        return error;
    }

    /**
     * Realiza el registro a partir de un nombre de usuario y una contraseña.
     * Devuelve cadena vacía si todo ha ido bien o un mensaje de error en caso contrario.
     */
    public async register(username: string, password: string): Promise<string> {
        const url: string = 'register';
        const params = { username, password: md5(password) };

        const error = await this.http.post(url, params, this.http.getAuthorizationHeaders())
            .then(res => {
                const { data } = res;

                // Cargamos el usuario en la aplicación y lo guardamos en el localStorage
                this.user = data.user;
                localStorage.setItem(this.USER_STORAGE, JSON.stringify(this.user));

                // En caso de recibir token, cargamos el token en la aplicación y lo guardamos en el localStorage
                if (data.token) {
                    this.token = data.token;
                    localStorage.setItem(this.TOKEN_STORAGE, this.token);
                }

                return '';
            })
            .catch(err => {
                console.error(err);
                return 'Ha ocurrido un error durante el registro de usuario. Inténtelo de nuevo más tarde.';
            });

        return error;
    }
}
