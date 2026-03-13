import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../constantes';

@Injectable({
    providedIn: 'root'
})
export class ChequeosIndustrialesService {
    private apiUrl = `${API_URL}/api/industriales/diario`;
    private baseApiUrl = `${API_URL}/api`;

    constructor(private http: HttpClient) { }

    createHeaders() {
        return {
            headers: new HttpHeaders({
                'authorization': sessionStorage.getItem('utoken') || ''
            })
        };
    }

    // Obtener todos los tipos de equipo
    obtenerTiposEquipo(): Observable<any[]> {
        return this.http.get<any[]>(`${API_URL}/tiposequipo`, this.createHeaders());
    }

    // Obtener equipos por tipo
    obtenerEquiposPorTipo(tipoId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseApiUrl}/industriales/equipos/tipo/${tipoId}`, this.createHeaders());
    }

    // Consulta el estado (si ya se hizo hoy)
    obtenerEstadoDiario(tipoEquipoStr: string, equipoId: number): Observable<{ existe: boolean }> {
        return this.http.get<{ existe: boolean }>(`${this.apiUrl}/estado/${tipoEquipoStr}/${equipoId}`, this.createHeaders());
    }

    // Crea un nuevo chequeo diario
    crearChequeo(tipoEquipoIdentificador: string, formData: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/crear`, {
            tipoEquipoIdentificador,
            formData
        }, this.createHeaders());
    }

    // Consulta el consolidado de un mes
    obtenerConsolidadoMensual(tipoEquipoStr: string, equipoId: number, anio: number, mes: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/mensual/${tipoEquipoStr}/${equipoId}/${anio}/${mes}`, this.createHeaders());
    }

    // Equipos sin chequeo diario hoy (todos los tipos)
    obtenerFaltantesHoy(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/faltantes-hoy`, this.createHeaders());
    }

    // Asignar tipo de chequeo a un equipo (actualiza tipoEquipoIdFk via identificador string)
    asignarTipoChequeo(equipoId: number, tipoIdentificador: string): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/asignar-tipo/${equipoId}`, { tipoIdentificador }, this.createHeaders());
    }

    // ===== Configuracion Chequeo Tipo =====
    obtenerConfigs(all = false): Observable<any[]> {
        const url = all ? `${this.apiUrl}/config?all=1` : `${this.apiUrl}/config`;
        return this.http.get<any[]>(url, this.createHeaders());
    }
    obtenerConfigPorTipo(tipoEquipoId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/config/by-tipo/${tipoEquipoId}`, this.createHeaders());
    }
    obtenerConfigPorIdentificador(identificador: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/config/by-identificador/${identificador}`, this.createHeaders());
    }
    crearConfig(body: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/config`, body, this.createHeaders());
    }
    toggleConfig(id: number): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/config/${id}/toggle`, {}, this.createHeaders());
    }
    agregarItemConfig(configId: number, nombreItem: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/config/${configId}/items`, { nombreItem }, this.createHeaders());
    }
    eliminarItemConfig(itemId: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/config/items/${itemId}`, this.createHeaders());
    }
}
