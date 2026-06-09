import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { API_URL } from '../constantes';

@Injectable({
  providedIn: 'root'
})
export class ChequeosIndustrialesService {

  constructor(private http: HttpClient) { }

  obtenerFaltantesHoy(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/api/industriales/diario/faltantes-hoy`);
  }

  obtenerConfigs(includeAll: boolean = false): Observable<any[]> {
    const param = includeAll ? '1' : '0';
    return this.http.get<any[]>(`${API_URL}/api/industriales/diario/config?all=${param}`);
  }

  obtenerTiposEquipo(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/tiposequipoInd`);
  }

  obtenerConfigPorIdentificador(id: any): Observable<any> {
    return this.http.get<any>(`${API_URL}/api/industriales/diario/config/by-identificador/${id}`);
  }

  obtenerEquiposPorTipo(tipoId: any): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/api/industriales/equipos/tipo/${tipoId}`);
  }

  obtenerEstadoDiario(tipo: string, equipoId: any): Observable<any> {
    return this.http.get<any>(`${API_URL}/api/industriales/diario/estado/${tipo}/${equipoId}`);
  }

  obtenerConsolidadoMensual(tipo: string, equipoId: any, anio: any, mes: any): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/api/industriales/diario/mensual/${tipo}/${equipoId}/${anio}/${mes}`);
  }

  descargarPdfChecklist(tipo: string, equipoId: any, anio: any, mes: any): Observable<any> {
    // Para descargas de PDF, se usa 'blob'
    return this.http.get(`${API_URL}/api/industriales/diario/pdf-checklist/${tipo}/${equipoId}/${anio}/${mes}`, { responseType: 'blob' });
  }

  crearChequeo(data: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/api/industriales/diario/crear`, data);
  }

  asignarTipoChequeo(equipoId: any, tipoIdentificador: string): Observable<any> {
    return this.http.put<any>(`${API_URL}/api/industriales/diario/asignar-tipo/${equipoId}`, { tipoIdentificador });
  }

  // --- Configuration & Dynamic Items ---
  obtenerConfigByTipo(tipoId: any): Observable<any> {
    return this.http.get<any>(`${API_URL}/api/industriales/diario/config/by-tipo/${tipoId}`);
  }

  toggleConfigHabilitado(configId: any): Observable<any> {
    return this.http.put<any>(`${API_URL}/api/industriales/diario/config/${configId}/toggle`, {});
  }

  agregarItemCheck(configId: any, item: { nombreItem: string, frecuencia: string }): Observable<any> {
    return this.http.post<any>(`${API_URL}/api/industriales/diario/config/${configId}/items`, item);
  }

  eliminarItemCheck(itemId: any): Observable<any> {
    return this.http.delete<any>(`${API_URL}/api/industriales/diario/config/items/${itemId}`);
  }

  crearConfiguracionBase(payload: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/api/industriales/diario/config`, payload);
  }
}

