import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

export function obtenerNombreMes(numeroMes: number): string {
  const meses: string[] = [
    "Enero", "Febrero", "Marzo", "Abril",
    "Mayo", "Junio", "Julio", "Agosto",
    "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  if (numeroMes < 1 || numeroMes > 12) {
    throw new Error("El número debe estar entre 1 y 12.");
  }
  return meses[numeroMes - 1];
}

export function validateToken(token: string): boolean {
  const router = inject(Router);
  if (isTokenExpired()) {
    Swal.fire({
      icon: 'warning',
      title: 'Sesion Expirada',
      text: 'Ha llegado al límite de tiempo de sesión activa.'
    })
    router.navigate(['/login']);
    sessionStorage.setItem('utoken', '');
    return true;
  } else {
    return false;
  }
}

export function isTokenExpired(): boolean {
  const token = sessionStorage?.getItem('utoken')!;
  if (!token) {
    return true; // Si no hay token, se considera expirado
  }
  const decodedToken = getDecodedAccessToken();
  const currentTime = Math.floor(Date.now() / 1000);

  return decodedToken.exp < currentTime;
}

export function createHeaders() {
  return {
    headers: new HttpHeaders({
      'authorization': sessionStorage.getItem('utoken')!
    })
  }
}

export function getDecodedAccessToken(): any {
  const token = sessionStorage.getItem('utoken')!;
  try {
    return jwtDecode(token);
  } catch (Error) {
    return null;
  }
}

