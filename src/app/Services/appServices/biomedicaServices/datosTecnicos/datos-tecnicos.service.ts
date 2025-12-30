import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { firstValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

import { API_URL } from '../../../../constantes'

@Injectable({
    providedIn: 'root'
})

export class DatosTecnicosService {

    private httpClient = inject(HttpClient);
    private router = inject(Router);
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_URL;
    }

    getDatosTecnicos() {
        return firstValueFrom(
            this.httpClient.get<any[]>(`${this.baseUrl}/datostecnicos`, this.createHeaders())
        )
    }

    getDatosTecnicosById(id: any) {
        return firstValueFrom(
            this.httpClient.get<any>(`${this.baseUrl}/datostecnicos/${id}`, this.createHeaders())
        )
    }

    addDatosTecnicos(datosTecnicos: any) {
        return firstValueFrom(
            this.httpClient.post<any>(`${this.baseUrl}/datostecnicos`, datosTecnicos, this.createHeaders())
        )
    }

    updateDatosTecnicos(id: any, datosTecnicos: any) {
        return firstValueFrom(
            this.httpClient.put<any>(`${this.baseUrl}/datostecnicos/${id}`, datosTecnicos, this.createHeaders())
        )
    }

    getToken() {
        return sessionStorage.getItem('utoken');
    }

    validateToken(token: string): boolean {
        if (this.isTokenExpired(token)) {
            Swal.fire({
                icon: 'warning',
                title: 'Sesion Expirada',
                text: 'Ha llegado al límite de tiempo de sesión activa.'
            })
            this.router.navigate(['/login']);
            sessionStorage.setItem('utoken', '');
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
                'authorization': sessionStorage.getItem('utoken')!
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
