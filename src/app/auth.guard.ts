import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from './Services/appServices/userServices/user.service';
import Swal from 'sweetalert2';
import { isTokenExpired, getDecodedAccessToken } from './utilidades';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  if (!isTokenExpired()) {
    return true; // Permite el acceso a la ruta
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
