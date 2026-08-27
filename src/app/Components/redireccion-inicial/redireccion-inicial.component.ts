import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { isTokenExpired, getDecodedAccessToken } from '../../utilidades';
import { ROLE_REDIRECTS } from '../../constantes';

@Component({
    selector: 'app-redireccion-inicial',
    standalone: true,
    template: '',
})
export class RedireccionInicialComponent implements OnInit {
    private router = inject(Router);
    private platformId = inject(PLATFORM_ID);

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            if (!isTokenExpired()) {
                const decoded = getDecodedAccessToken();
                const role = decoded?.rol ? decoded.rol.toUpperCase().replace(/\s+/g, '') : null;
                const modulos = decoded?.modulos || [];

                let targetRoute = role ? ROLE_REDIRECTS[role] : null;

                // Si el usuario tiene acceso a módulos (y no es solo INVITADO o un usuario sin módulos asignados en backend),
                // lo enviamos al home unificado (antes exclusivo de superadmin).
                if (modulos.length > 0) {
                    targetRoute = '/homeuser';
                }

                if (targetRoute) {
                    this.router.navigate([targetRoute]);
                } else {
                    this.router.navigate(['/login']);
                }
            } else {
                this.router.navigate(['/interno']);
            }
        }
    }
}
