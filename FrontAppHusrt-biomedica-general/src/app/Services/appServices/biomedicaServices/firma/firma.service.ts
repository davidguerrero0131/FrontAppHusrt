import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../../../constantes';
import { firstValueFrom } from 'rxjs';
import { createHeaders } from '../../../../utilidades';

@Injectable({
    providedIn: 'root'
})
export class FirmaService {

    private httpClient = inject(HttpClient);

    constructor() { }

    guardarFirma(image: string, idUsuario: number) {
        return firstValueFrom(
            this.httpClient.post<any>(`${API_URL}/firma`, { image, idUsuario }, createHeaders())
        );
    }

    getFirma(idUsuario: number) {
        return firstValueFrom(
            this.httpClient.get<any>(`${API_URL}/firma/${idUsuario}`, createHeaders())
        );
    }

    getFirmaImage(idUsuario: number) {
        const headers = createHeaders();
        return firstValueFrom(
            this.httpClient.post(`${API_URL}/firma/ver`, { idUsuario }, { ...headers, responseType: 'blob' })
        );
    }
}
