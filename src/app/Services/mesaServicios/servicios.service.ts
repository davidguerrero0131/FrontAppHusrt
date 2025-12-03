import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Servicio, CrearServicioDTO, ActualizarServicioDTO } from '../../models/mesaServicios/servicio.model';
import { ApiResponse } from '../../models/mesaServicios/api-response.model';

export interface ReordenarServicioDTO {
  id: number;
  orden: number;
}

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  private apiUrl = `${environment.apiUrl}/servicios`;

  constructor(private http: HttpClient) {}

  listar(filtros?: { busqueda?: string }): Observable<ApiResponse<Servicio[]>> {
    let url = this.apiUrl;
    if (filtros?.busqueda) {
      url += `?busqueda=${encodeURIComponent(filtros.busqueda)}`;
    }
    return this.http.get<ApiResponse<Servicio[]>>(url);
  }

  obtenerPorId(id: number): Observable<ApiResponse<Servicio>> {
    return this.http.get<ApiResponse<Servicio>>(`${this.apiUrl}/${id}`);
  }

  obtenerPorArea(areaId: number): Observable<ApiResponse<Servicio[]>> {
    return this.http.get<ApiResponse<Servicio[]>>(`${this.apiUrl}?area_id=${areaId}`);
  }

  desactivar(id: number): Observable<ApiResponse<Servicio>> {
    return this.actualizar(id, { activo: false });
  }

  crear(datos: CrearServicioDTO): Observable<ApiResponse<Servicio>> {
    return this.http.post<ApiResponse<Servicio>>(this.apiUrl, datos);
  }

  actualizar(id: number, datos: ActualizarServicioDTO): Observable<ApiResponse<Servicio>> {
    return this.http.put<ApiResponse<Servicio>>(`${this.apiUrl}/${id}`, datos);
  }

  eliminar(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  reordenar(servicios: ReordenarServicioDTO[]): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/reordenar`, { servicios });
  }
}
