import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { UserService } from './Services/appServices/userServices/user.service';
import Swal from 'sweetalert2';
import { isTokenExpired, getDecodedAccessToken } from './utilidades';
import { isPlatformBrowser } from '@angular/common';
import { SessionSyncService } from './Services/auth/session-sync.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const sessionSyncService = inject(SessionSyncService);

  if (isPlatformBrowser(platformId)) {
    // Si no hay token, intentar recuperarlo de otras pestañas ANTES de fallar
    if (!sessionStorage.getItem('utoken')) {
      await sessionSyncService.requestSessionFromOtherTabs();
    }
  }

  if (!isTokenExpired()) {
    const requiredRoles = route.data['roles'] as Array<string>;

    // Si la ruta tiene roles definidos
    if (requiredRoles && requiredRoles.length > 0) {
      // Only check roles in the browser where localStorage is available
      if (isPlatformBrowser(platformId)) {
        const decodedToken = getDecodedAccessToken();
        
        let hasPermission = false;
        if (decodedToken) {
          const userRoles = decodedToken.roles || (decodedToken.rol ? [decodedToken.rol] : []);
          hasPermission = userRoles.some((r: string) => requiredRoles.includes(r.toUpperCase().replace(/\s+/g, '')));
          
          if (!hasPermission && decodedToken.mesaRol) {
             const mesaRole = decodedToken.mesaRol.toUpperCase().replace(/\s+/g, '');
             hasPermission = requiredRoles.includes(mesaRole);
          }
        }

        if (!hasPermission) {
          router.navigate(['/access-denied']);
          return false;
        }
      }
    }

    return true; // Permite el acceso
  } else {
    if (isPlatformBrowser(platformId)) {
      Swal.fire({
        icon: 'warning',
        title: 'Sesion Expirada',
        text: 'Ha llegado al límite de tiempo de sesión activa.'
      })
      router.navigate(['/login']);
    }
    return false; // Bloquea el acceso a la ruta
  }
};
