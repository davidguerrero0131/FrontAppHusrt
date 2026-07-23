import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../constantes';

export interface EspacioReserva {
  id?: number;
  nombre: string;
  ubicacion: string;
  aforoMinimo?: number;
  aforoMaximo?: number;
  tipoDisponibilidad?: string;
  diasEspecificos?: string | null;
  horaInicio?: string;
  horaFin?: string;
  estado?: boolean;
  responsablesIds?: number[];
  responsables?: any[];
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EspaciosReservaService {
  private apiUrl = `${API_URL}/espaciosreserva`;

  constructor(private http: HttpClient) { }

  getEspacios(): Observable<EspacioReserva[]> {
    return this.http.get<EspacioReserva[]>(this.apiUrl);
  }

  getMisEspacios(idResponsable: number): Observable<EspacioReserva[]> {
    return this.http.get<EspacioReserva[]>(`${this.apiUrl}/responsable/${idResponsable}`);
  }

  createEspacio(espacio: EspacioReserva): Observable<EspacioReserva> {
    return this.http.post<EspacioReserva>(this.apiUrl, espacio);
  }

  updateEspacio(id: number, espacio: EspacioReserva): Observable<EspacioReserva> {
    return this.http.put<EspacioReserva>(`${this.apiUrl}/${id}`, espacio);
  }

  deleteEspacio(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
