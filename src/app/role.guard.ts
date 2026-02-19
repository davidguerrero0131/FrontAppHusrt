import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { getDecodedAccessToken, isTokenExpired } from './utilidades';
import Swal from 'sweetalert2';

export const roleGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);

    if (isTokenExpired()) {
        router.navigate(['/login']);
        return false;
    }

    const tokenData = getDecodedAccessToken();
    const expectedRoles = route.data['roles'] as Array<string>;

    if (tokenData && expectedRoles.includes(tokenData.rol)) {
        return true;
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Acceso Denegado',
            text: 'No tienes permisos para acceder a esta sección.'
        });
        // Redirigir según rol o al login
        router.navigate(['/login']);
        return false;
    }
};
