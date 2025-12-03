import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Obtener el token del localStorage
  const token = localStorage.getItem('utoken');

  // Clonar la petición y agregar el header de autorización si existe token
  let authReq = req;
  if (token && token !== '') {
    authReq = req.clone({
      setHeaders: {
        authorization: token
      }
    });
  }

  // Manejar la respuesta y posibles errores
  return next(authReq).pipe(
    catchError((error) => {
      // Si el error es 401 (No autorizado), redirigir al login
      if (error.status === 401) {
        localStorage.removeItem('utoken');
        localStorage.removeItem('usuario');
        router.navigate(['/login']);
      }

      // Si el error es 403 (Prohibido), mostrar mensaje
      if (error.status === 403) {
        console.error('Acceso denegado: No tienes permisos para esta acción');
      }

      return throwError(() => error);
    })
  );
};
