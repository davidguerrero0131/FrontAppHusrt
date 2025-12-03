import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario, CrearUsuarioDTO, ActualizarUsuarioDTO, Perfil } from '../../models/mesaServicios/usuario.model';
import { ApiResponse } from '../../models/mesaServicios/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) { }

  listar(filtros?: {
    perfil_id?: number;
    area_id?: number;
    activo?: boolean;
    busqueda?: string;
  }): Observable<ApiResponse<Usuario[]>> {
    let params = new HttpParams();

    if (filtros) {
      Object.keys(filtros).forEach(key => {
        const value = (filtros as any)[key];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<Usuario[]>>(this.apiUrl, { params });
  }

  obtenerPorId(id: number): Observable<ApiResponse<Usuario>> {
    return this.http.get<ApiResponse<Usuario>>(`${this.apiUrl}/${id}`);
  }

  crear(usuario: CrearUsuarioDTO): Observable<ApiResponse<Usuario>> {
    return this.http.post<ApiResponse<Usuario>>(this.apiUrl, usuario);
  }

  actualizar(id: number, datos: ActualizarUsuarioDTO): Observable<ApiResponse<Usuario>> {
    return this.http.put<ApiResponse<Usuario>>(`${this.apiUrl}/${id}`, datos);
  }

  eliminar(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  desactivar(id: number): Observable<ApiResponse<Usuario>> {
    return this.actualizar(id, { activo: false });
  }

  activar(id: number): Observable<ApiResponse<Usuario>> {
    return this.actualizar(id, { activo: true });
  }

  obtenerPerfiles(): Observable<ApiResponse<Perfil[]>> {
    return this.http.get<ApiResponse<Perfil[]>>(`${environment.apiUrl}/perfiles`);
  }

  obtenerTecnicos(): Observable<ApiResponse<Usuario[]>> {
    return this.http.get<ApiResponse<Usuario[]>>(`${this.apiUrl}/tecnicos/lista`);
  }
}

// Re-exportar tipos para uso en componentes
export type { Usuario, CrearUsuarioDTO, ActualizarUsuarioDTO, Perfil } from '../../models/mesaServicios/usuario.model';
