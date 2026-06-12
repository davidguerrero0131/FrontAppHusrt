import { HttpInterceptorFn, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, retry, tap } from 'rxjs';
import Swal from 'sweetalert2';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const token = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('utoken') : null;

    let authReq = req;
    const isPublicRoute = req.url.includes('/publico/');
    const isExternalIA = req.url.includes(':8080/api/chat');
    
    if (token && !isPublicRoute && !isExternalIA) {
        authReq = req.clone({
            setHeaders: {
                authorization: token
            }
        });
    }

    return next(authReq).pipe(
        tap(event => {
            if (event instanceof HttpResponse) {
                const newToken = event.headers.get('New-Token');
                if (newToken && typeof sessionStorage !== 'undefined') {
                    sessionStorage.setItem('utoken', newToken);
                }
            }
        }),
        retry(3), // Retry up to 3 times for transient failures
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 && !isPublicRoute && !isExternalIA) {
                // Clear session and redirect to login
                if (typeof sessionStorage !== 'undefined') {
                    sessionStorage.removeItem('utoken');
                    sessionStorage.removeItem('idUser');
                    sessionStorage.removeItem('rol');
                }

                Swal.fire({
                    icon: 'error',
                    title: 'Sesión Expirada',
                    text: 'Su sesión ha expirado o no tiene autorización. Por favor ingrese de nuevo.',
                    confirmButtonText: 'Entendido'
                }).then(() => {
                    router.navigate(['/login']);
                });
            } else if (error.status === 0) {
                // Network error - do NOT logout, just notify
                Swal.fire({
                    icon: 'warning',
                    title: 'Fallo de Conexión',
                    text: 'No se pudo contactar con el servidor. Verifique su internet e intente de nuevo.',
                    toast: true,
                    position: 'top-end',
                    timer: 5000,
                    showConfirmButton: false
                });
            }
            return throwError(() => error);
        })
    );
};
