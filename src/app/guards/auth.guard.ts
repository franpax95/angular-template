import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { config } from 'src/config';


@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    /** Array de urls que no están protegidas por el guard, normalmente las relacionadas con el inicio de sesión */
    private readonly EXCEPTION_URLS: Array<string> = [
        /** Insert here the urls to avoid with the guard, like 'login' or 'register' */
        'login',
        'register',
    ];
    
    constructor(private auth: AuthService, private router: Router) {}

    public canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        // Si se deshabilitan los guards desde config, permite siempre el paso
        if (config.disableGuards) {
            return true;
        }

        // Comprobamos que haya un usuario cargado en la aplicación
        const isAuth: boolean = this.auth.isAuth();

        // Preparamos la URL actual para la comparación
        const rawUrl: string = (route.routeConfig && route.routeConfig.path) ? route.routeConfig.path : "";
        const url: string = rawUrl.toLowerCase();

        // Si intenta acceder a la aplicación sin estar autenticado antes...
        if (!this.EXCEPTION_URLS.includes(url) && !isAuth) {
            // ... se redirecciona al usuario al login
            this.router.navigateByUrl("login");

            return false;
        }
    
        // Si no, si intenta acceder a una de las rutas de logeo habiendo sido autenticado...
        else if (this.EXCEPTION_URLS.includes(url) && isAuth) {
            // ... se redirecciona al usuario a la ruta raíz
            this.router.navigateByUrl("");

            return false;
        }

        return true;
    }
}
