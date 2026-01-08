import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { createHeaders } from '../../../../utilidades'; // Adjust path if needed
import { API_URL } from '../../../../constantes'; // Adjust path if needed

@Injectable({
    providedIn: 'root'
})
export class IndicadoresService {

    private http = inject(HttpClient);
    private baseUrl = API_URL;

    constructor() { }

    getIndicadoresCumplimiento(fechaInicio: string, fechaFin: string) {
        return firstValueFrom(
            this.http.post<any>(
                `${this.baseUrl}/indicadores/cumplimiento`,
                { fechaInicio, fechaFin },
                createHeaders()
            )
        );
    }
}
