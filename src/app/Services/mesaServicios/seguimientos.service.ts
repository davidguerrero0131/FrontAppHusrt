import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../models/mesaServicios/api-response.model';
import { Seguimiento, CrearSeguimientoDTO, ArchivoAdjunto } from '../../models/mesaServicios/seguimiento.model';

@Injectable({
  providedIn: 'root'
})
export class SeguimientosService {
  private apiUrl = `${environment.apiUrl}/seguimientos`;
  private apiUrlArchivos = `${environment.apiUrl}/archivos`;

  constructor(private http: HttpClient) {}

  crear(datos: CrearSeguimientoDTO): Observable<ApiResponse<Seguimiento>> {
    return this.http.post<ApiResponse<Seguimiento>>(this.apiUrl, datos);
  }

  listarPorCaso(casoId: number, incluirArchivos = false): Observable<ApiResponse<Seguimiento[]>> {
    let params = new HttpParams();
    if (incluirArchivos) {
      params = params.set('incluir_archivos', 'true');
    }
    return this.http.get<ApiResponse<Seguimiento[]>>(`${environment.apiUrl}/casos/${casoId}/seguimientos`, { params });
  }

  obtenerSolucion(casoId: number): Observable<ApiResponse<Seguimiento>> {
    return this.http.get<ApiResponse<Seguimiento>>(`${this.apiUrl}/caso/${casoId}/solucion`);
  }

  obtenerPorId(id: number): Observable<ApiResponse<Seguimiento>> {
    return this.http.get<ApiResponse<Seguimiento>>(`${this.apiUrl}/${id}`);
  }

  subirArchivo(archivo: File, referenciaTipo: 'caso' | 'seguimiento', referenciaId: number): Observable<ApiResponse<ArchivoAdjunto>> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('referencia_tipo', referenciaTipo);
    formData.append('referencia_id', referenciaId.toString());
    return this.http.post<ApiResponse<ArchivoAdjunto>>(`${this.apiUrlArchivos}/subir`, formData);
  }

  obtenerArchivos(referenciaTipo: 'caso' | 'seguimiento', referenciaId: number): Observable<ApiResponse<ArchivoAdjunto[]>> {
    return this.http.get<ApiResponse<ArchivoAdjunto[]>>(`${this.apiUrlArchivos}/${referenciaTipo}/${referenciaId}`);
  }

  descargarArchivo(id: number): string {
    return `${this.apiUrlArchivos}/descargar/${id}`;
  }
}
