import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { createHeaders } from '../../../../utilidades';
import { API_URL } from '../../../../constantes';

@Injectable({
    providedIn: 'root'
})
export class IndicadoresIndustrialesService {

    private http = inject(HttpClient);

    constructor() { }

    getIndicadoresCumplimiento(fechaInicio: string, fechaFin: string) {
        return firstValueFrom(
            this.http.post<any>(
                `${API_URL}/api/industriales/indicadores/cumplimiento`,
                { fechaInicio, fechaFin },
                createHeaders()
            )
        );
    }

    getReportesPorRango(fechaInicio: string, fechaFin: string) {
        return firstValueFrom(
            this.http.get<any>(
                `${API_URL}/api/industriales/indicadores/reportes-rango?inicio=${fechaInicio}&fin=${fechaFin}`,
                createHeaders()
            )
        );
    }
}
