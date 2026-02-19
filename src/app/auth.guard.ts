import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from './Services/appServices/userServices/user.service';
import Swal from 'sweetalert2';
import { isTokenExpired, getDecodedAccessToken } from './utilidades';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (!isTokenExpired()) {
    const requiredRoles = route.data['roles'] as Array<string>;

    // Si la ruta tiene roles definidos
    if (requiredRoles && requiredRoles.length > 0) {
      const decodedToken = getDecodedAccessToken();
      const userRole = decodedToken ? decodedToken.rol : null;

      if (!userRole || !requiredRoles.includes(userRole)) {
        router.navigate(['/access-denied']);
        return false;
      }
    }

    return true; // Permite el acceso
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Sesion Expirada',
      text: 'Ha llegado al límite de tiempo de sesión activa.'
    })
    router.navigate(['/login']);
    return false; // Bloquea el acceso a la ruta
  }
};
