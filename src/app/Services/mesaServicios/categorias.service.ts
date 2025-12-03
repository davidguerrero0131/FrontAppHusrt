// Servicio de gestión de categorías
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  servicio_id: number;
  area_id?: number;
  area_nombre?: string;
  tipo?: string;
  activo: boolean;
  servicio?: {
    id: number;
    nombre: string;
  };
}

export interface CrearCategoriaDto {
  nombre: string;
  descripcion?: string;
  servicio_id: number;
  activo?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private apiUrl = `${environment.apiUrl}/categorias`;

  constructor(private http: HttpClient) { }

  listar(filtros?: { servicio_id?: number; area_id?: number }): Observable<any> {
    let params = new HttpParams();

    if (filtros) {
      Object.keys(filtros).forEach(key => {
        const value = (filtros as any)[key];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get(this.apiUrl, { params });
  }

  obtenerPorArea(areaId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?area_id=${areaId}`);
  }

  obtenerPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  crear(categoria: CrearCategoriaDto): Observable<any> {
    return this.http.post(this.apiUrl, categoria);
  }

  actualizar(id: number, datos: Partial<CrearCategoriaDto>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, datos);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
