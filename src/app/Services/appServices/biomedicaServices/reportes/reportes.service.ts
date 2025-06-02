import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { API_URL } from '../../../../constantes'
import { firstValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private httpClient = inject(HttpClient);
  private router = inject(Router);

  constructor() {

  }

  getReportesPreventivosMesAño(date: any) {
    return firstValueFrom(
      this.httpClient.post<any>(`${API_URL}/reportes/preventivosmes`, date, this.createHeaders())
    )
  }

  getReportesCorrectivosMesAño(date: any) {
    return firstValueFrom(
      this.httpClient.post<any>(`${API_URL}/reportes/correctivosmes`, date, this.createHeaders())
    )
  }

  validateToken(token: string): boolean {
    if (this.isTokenExpired(token)) {
      Swal.fire({
        icon: 'warning',
        title: 'Sesion Expirada',
        text: 'Ha llegado al límite de tiempo de sesión activa.'
      })
      this.router.navigate(['/login']);
      localStorage.setItem('utoken', '');
      return true;
    } else {
      return false;
    }
  }

  isTokenExpired(token: string): boolean {
    if (!token) {
      return true; // Si no hay token, se considera expirado
    }
    const decodedToken = this.getDecodedAccessToken(token);
    const currentTime = Math.floor(Date.now() / 1000);

    return decodedToken.exp < currentTime;
  }

  createHeaders() {
    return {
      headers: new HttpHeaders({
        'authorization': localStorage.getItem('utoken')!
      })
    }
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }

}
