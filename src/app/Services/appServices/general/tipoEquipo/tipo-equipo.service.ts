import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { firstValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

import {API_URL} from '../../../../constantes';

@Injectable({
  providedIn: 'root'
})
export class TipoEquipoService {

  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_URL;

  }

  getAllTiposEquipos() {
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/tiposequipo`, this.createHeaders())
    )
  }

  getCantidadEquipos(idTipoEquipo: any){
    return firstValueFrom(
      this.httpClient.get<any>(`${this.baseUrl}/cantidadequipostipo/${idTipoEquipo}`, this.createHeaders())
    )
  }

  getAllTiposEquiposBiomedica() {
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/tiposequipoBio`, this.createHeaders())
    )
  }

  getTipoEquipo(idTipoEquipo: any) {
    return firstValueFrom(
      this.httpClient.get<any>(`${this.baseUrl}/tiposequipo/${idTipoEquipo}`, this.createHeaders())
    )
  }

  getToken() {
    return localStorage.getItem('utoken');
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
