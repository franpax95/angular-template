import { Injectable } from '@angular/core';
import axios from 'axios';

import { config } from 'src/config';
import HTTP_STATUS_CODE from 'src/app/states/http.code';
import { IRequestOptions } from '../interfaces/IRequestOptions';

import { SettingsService } from './settings.service';

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    /** Base URL importada desde el archivo de configuración */
    public readonly baseUrl: string = config.baseUrl;

    constructor(private settings: SettingsService) { }

    /**
     * Manejador de peticiones GET
     */
    public get(url: string, params?: any): Promise<any> {
        const completeUrl: string = this.getCompleteUrl(url, params);
        return axios.get(completeUrl);
    }

    /**
     * Manejador de peticiones POST
     */
    public async post(u: string, b?: any): Promise<any> {
        const url: string = this.getCompleteUrl(u, null, 'POST');
        return axios.post(url, b);
    }

    /**
     * Manejador de peticiones PUT
     */
    public async put(u: string, b?: any): Promise<any> {
        const url: string = this.getCompleteUrl(u, null, 'PUT');
        return axios.put(url, b);
    }

    /**
     * Helper para obtener la url completa
     */
    public getCompleteUrl(url: string, params?: any, method?: string): string {
        const httpMethod = method ? method.toUpperCase() : 'GET';

        switch(httpMethod) {
            case 'POST':
            case 'PUT':
                return `${this.baseUrl}${url}`;
            default:
                const body: string = params !== undefined && params !== null ? `?${this.stringifyUrlParams(params)}` : "";
                return `${this.baseUrl}${url}${body}`;
        }
    }

    /**
     * Helper que devuelve las opciones para las peticiones por defecto
     */
    public getDefaultRequestOptions(): IRequestOptions {
        return ({
            loading: true,
            force: false
        });
    }

    /**
     * Manejador de errores general para las llamadas realizadas.
     * 
     * @param error     Objeto con el error
     */
    public handleStatusError(error: any): void {
        const { status, message } = error;

        // Comprobamos primero si ha habido un error de red (Offline)
        if(!status && message === "Network Error") {
            this.settings.openModal({
                title: 'Error de red',
                content: ['Te encuentras actualmente sin conexión.'],
                onAccept: () => this.settings.closeModal()
            });

            return ;
        }

        // Comprobamos el resto de códigos de estado relevantes
        switch(status) {
            case HTTP_STATUS_CODE.UNAUTHORIZED:
                this.settings.openModal({
                    title: 'Error de red',
                    content: ['Te encuentras actualmente sin conexión.'],
                    onAccept: () => this.settings.closeModal()
                });
                break;

            case HTTP_STATUS_CODE.NOT_FOUND:
                this.settings.openModal({
                    title: 'Error de aplicación',
                    content: [
                        'Ha habido un error de aplicación en la conexión con el servidor.',
                        'Por favor, vuelve a intentarlo de nuevo más tarde.'
                    ],
                    onAccept: () => this.settings.closeModal()
                });
                break;

            case HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR:
                this.settings.openModal({
                    title: 'Error en el servidor',
                    content: [
                        'Ha habido un problema con la comunicación con el servidor. Es posible que actualmente esté en mantenimiento o temporalmente inactivo.',
                        'Por favor, vuelve a intentarlo de nuevo más tarde.'
                    ],
                    onAccept: () => this.settings.closeModal()
                });
                break;
        }

        this.printConsoleError(error);
    }

    /**
     * Función para visualizarla errores de red por consola
     */
    private printConsoleError(msg: string): void {
        console.error();
        console.error("=========================================================");
        console.error(msg);
        console.error("=========================================================");
        console.error();
    }

    /**
     * Devuelve los parámetros de un objeto de primer nivel dado en formato SOAP: ...?key=value&key=value...
     * 
     * @param data  Objeto con los parámetros. La profundidad del objeto debe ser de 1.
     * @returns     String con la cadena formateada
     */
    private stringifyUrlParams(data: any): string {
        if(typeof data === "object") {
            const entries: Array<Array<any>> = Object.entries(data);
            const params: string = entries
                .filter((entry: Array<any>) => (entry[1] !== '' && entry[1] !== null && entry[1] !== -1))
                .map((entry: Array<any>) => {
                    const [key, value] = entry;

                    if(typeof value === "string") {
                        return `${key}=${value.replace(/\s/g, '%20')}`;
                    } else if(typeof value === "number" || typeof value === "boolean") {
                        return `${key}=${value}`;
                    }

                    return "";
                })
                .filter((str: string) => str !== "")
                .join("&");

            return params;
        }

        return "";
    }
}
