import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { getDecodedAccessToken } from '../utilidades';

export const soporteGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('utoken');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  const decoded = getDecodedAccessToken();
  const rolesPermitidos = ['SUPERADMIN', 'MESASERVICIOSADMIN', 'MESASERVICIOSSOPORTE'];

  if (rolesPermitidos.includes(decoded?.rol)) {
    return true;
  } else {
    router.navigate(['/mesaservicios']);
    return false;
  }
};
