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
                const targetRoute = role ? ROLE_REDIRECTS[role] : null;

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
