// Servicio de gestión de perfiles
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Perfil {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export interface CrearPerfilDto {
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PerfilesService {
  private apiUrl = `${environment.apiUrl}/perfiles`;

  constructor(private http: HttpClient) { }

  listar(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  crear(perfil: CrearPerfilDto): Observable<any> {
    return this.http.post(this.apiUrl, perfil);
  }

  actualizar(id: number, datos: Partial<CrearPerfilDto>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, datos);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
