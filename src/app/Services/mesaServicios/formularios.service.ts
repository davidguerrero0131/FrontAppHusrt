import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Formulario } from '../../models/mesaServicios/formato.model';
import { ApiResponse } from '../../models/mesaServicios/api-response.model';

export interface CrearFormularioDTO {
  area_id: number;
  tipo_solicitud: 'requerimiento' | 'incidencia' | 'ambos';
  incluir_promesa_valor: boolean;
  campo_ubicacion_especifica_obligatorio: boolean;
}

export interface ActualizarFormularioDTO {
  tipo_solicitud?: 'requerimiento' | 'incidencia' | 'ambos';
  incluir_promesa_valor?: boolean;
  campo_ubicacion_especifica_obligatorio?: boolean;
  activo?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FormulariosService {
  private apiUrl = `${environment.apiUrl}/formularios`;

  constructor(private http: HttpClient) { }

  obtenerPorArea(areaId: number): Observable<ApiResponse<Formulario>> {
    return this.http.get<ApiResponse<Formulario>>(`${this.apiUrl}/area/${areaId}`);
  }

  crearOActualizar(formulario: CrearFormularioDTO): Observable<ApiResponse<Formulario>> {
    return this.http.post<ApiResponse<Formulario>>(this.apiUrl, formulario);
  }

  actualizar(id: number, formulario: ActualizarFormularioDTO): Observable<ApiResponse<Formulario>> {
    return this.http.put<ApiResponse<Formulario>>(`${this.apiUrl}/${id}`, formulario);
  }
}
