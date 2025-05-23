import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { firstValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

import {API_URL} from '../../../constantes'


@Injectable({
  providedIn: 'root'
})


export class UserService {

  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_URL;
   }

   getToken(){
    return localStorage.getItem('utoken');
   }

   registro(formValue: any) {
    return firstValueFrom(
      this.httpClient.post<any>(`${this.baseUrl}/adduser`, formValue)
    )
  }

  recuperarContrasena(email: String){
    return firstValueFrom(
      this.httpClient.post<any>(`${this.baseUrl}/olvidocontrasena`, {email})
    )
  }

  cambiarContrasena(formValue: any) {
    return firstValueFrom(
      this.httpClient.put<any>(`${this.baseUrl}/cambiarcontrasena`, formValue, this.createHeaders())
    )
  }

  update(formValue: any, idUser: number) {
    return firstValueFrom(
      this.httpClient.put<any>(`${this.baseUrl}/users/update/` + idUser, formValue, this.createHeaders())
    )
  }

  getUserProfil(idUser: any){
    return firstValueFrom(
      this.httpClient.get<any>(`${this.baseUrl}/userprofil/` + idUser, this.createHeaders())
    );
  }

  login(formValue: any) {
    return firstValueFrom(
      this.httpClient.post<any>(`${this.baseUrl}/login`, formValue)
    )
  }

  getAllUsers(){
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/users`, this.createHeaders())
    )
  }

  getAllRoles(){
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/roles`, this.createHeaders())
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

  createHeaders(){
    return{
      headers: new HttpHeaders ({
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

