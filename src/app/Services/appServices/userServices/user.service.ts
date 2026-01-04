import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { firstValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { isTokenExpired, createHeaders, validateToken, getDecodedAccessToken } from '../../../utilidades';
import { API_URL } from '../../../constantes'


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

  getToken() {
    return localStorage.getItem('utoken');
  }

  registro(formValue: any) {
    return firstValueFrom(
      this.httpClient.post<any>(`${this.baseUrl}/adduser`, formValue)
    )
  }

  recuperarContrasena(email: String) {
    return firstValueFrom(
      this.httpClient.post<any>(`${this.baseUrl}/olvidocontrasena`, { email })
    )
  }

  cambiarContrasena(formValue: any) {
    return firstValueFrom(
      this.httpClient.put<any>(`${this.baseUrl}/cambiarcontrasena`, formValue, createHeaders())
    )
  }

  update(formValue: any, idUser: number) {
    return firstValueFrom(
      this.httpClient.put<any>(`${this.baseUrl}/users/update/` + idUser, formValue, createHeaders())
    )
  }

  desactivarUsuario(idUser: number) {
    return firstValueFrom(
      this.httpClient.put<any>(`${this.baseUrl}/desactivarusuario/` + idUser, {}, createHeaders())
    )
  }

  activarUsuario(idUser: number) {
    return firstValueFrom(
      this.httpClient.put<any>(`${this.baseUrl}/activarusuario/` + idUser, {},createHeaders())
    )
  }


  getNameUSer(idUser: number) {
    return firstValueFrom(
      this.httpClient.get<any>(`${this.baseUrl}/nombreusuario/` + idUser, createHeaders())
    )
  }

  getUserProfil(idUser: any) {
    return firstValueFrom(
      this.httpClient.get<any>(`${this.baseUrl}/userprofil/` + idUser, createHeaders())
    );
  }

  login(formValue: any) {
  console.log('🔄 UserService - Enviando al backend:', formValue); // ✅ Log para debugging
  
  return firstValueFrom(
    this.httpClient.post<any>(`${this.baseUrl}/login`, formValue)
  );
}

  getAllUsers() {
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/users`, createHeaders())
    )
  }

  getAllRoles() {
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/roles`, createHeaders())
    )
  }


}

