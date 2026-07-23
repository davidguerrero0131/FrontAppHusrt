import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../constantes';

export interface ReservaEspacio {
  id?: number;
  nombreCompleto: string;
  telefono: string;
  correoElectronico: string;
  servicioSolicitante: string;
  institucionEducativa?: string;
  tipoActividad: string;
  espacioReservaIdFk: number;
  fechaReserva: string;
  horaInicio: string;
  horaFin: string;
  cantidadParticipantes: number;
  estado?: string;
  motivoCancelacion?: string;
  espacioReserva?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ReservasEspaciosService {
  private apiUrl = `${API_URL}/reservasespacios`;

  constructor(private http: HttpClient) { }

  getReservas(): Observable<ReservaEspacio[]> {
    return this.http.get<ReservaEspacio[]>(this.apiUrl);
  }

  createReserva(reserva: ReservaEspacio): Observable<ReservaEspacio> {
    return this.http.post<ReservaEspacio>(this.apiUrl, reserva);
  }

  updateReserva(id: number, reserva: ReservaEspacio): Observable<ReservaEspacio> {
    return this.http.put<ReservaEspacio>(`${this.apiUrl}/${id}`, reserva);
  }

  deleteReserva(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
