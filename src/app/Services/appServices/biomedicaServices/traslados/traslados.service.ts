import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../../../constantes';
import { createHeaders } from '../../../../utilidades';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TrasladosService {
    private http = inject(HttpClient);
    private baseUrl = API_URL;

    constructor() { }

    registrarTraslado(data: {
        equipoId: number,
        servicioDestinoId: number,
        nombreReceptor: string,
        cargoReceptor: string,
        observaciones: string,
        usuarioId: number
    }) {
        return firstValueFrom(
            this.http.post(`${this.baseUrl}/traslados`, data, createHeaders())
        );
    }

    getHistorialTraslados(equipoId: number) {
        return firstValueFrom(
            this.http.get<any[]>(`${this.baseUrl}/traslados/equipo/${equipoId}`, createHeaders())
        );
    }

    getHistorialCompleto(equipoId: number) {
        return firstValueFrom(
            this.http.get<any[]>(`${this.baseUrl}/historial/equipo/${equipoId}`, createHeaders())
        );
    }
}
