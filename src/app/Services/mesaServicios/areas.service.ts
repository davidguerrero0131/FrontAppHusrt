// Servicio de gestión de áreas
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Area, CrearAreaDTO, ActualizarAreaDTO, ArbolArea } from '../../models/mesaServicios/area.model';
import { ApiResponse } from '../../models/mesaServicios/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AreasService {
  private apiUrl = `${environment.apiUrl}/areas`;

  constructor(private http: HttpClient) { }

  listar(): Observable<ApiResponse<Area[]>> {
    return this.http.get<ApiResponse<Area[]>>(this.apiUrl);
  }

  listarGestionanSolicitudes(): Observable<ApiResponse<Area[]>> {
    return this.http.get<ApiResponse<Area[]>>(`${this.apiUrl}?gestiona_solicitudes=true`);
  }

  // Alias para compatibilidad
  obtenerGestionSolicitudes(): Observable<ApiResponse<Area[]>> {
    return this.listarGestionanSolicitudes();
  }

  obtenerPorId(id: number): Observable<ApiResponse<Area>> {
    return this.http.get<ApiResponse<Area>>(`${this.apiUrl}/${id}`);
  }

  obtenerArbol(): Observable<ApiResponse<ArbolArea[]>> {
    return this.http.get<ApiResponse<ArbolArea[]>>(`${this.apiUrl}/arbol`);
  }

  crear(area: CrearAreaDTO): Observable<ApiResponse<Area>> {
    return this.http.post<ApiResponse<Area>>(this.apiUrl, area);
  }

  actualizar(id: number, datos: ActualizarAreaDTO): Observable<ApiResponse<Area>> {
    return this.http.put<ApiResponse<Area>>(`${this.apiUrl}/${id}`, datos);
  }

  eliminar(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}

// Re-exportar tipos para uso en componentes
export type { Area, CrearAreaDTO, ActualizarAreaDTO, ArbolArea } from '../../models/mesaServicios/area.model';
