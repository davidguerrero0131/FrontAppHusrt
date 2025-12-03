// Servicio para gestión de notificaciones
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../models/mesaServicios/api-response.model';
import { Notificacion, ContadorNotificaciones } from '../../models/mesaServicios/notificacion.model';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  private apiUrl = `${environment.apiUrl}/notificaciones`;
  private intervaloPolling = 30000; // 30 segundos

  constructor(private http: HttpClient) {}

  // Obtener mis notificaciones
  obtenerMias(limite?: number, offset?: number): Observable<ApiResponse<Notificacion[]>> {
    let url = this.apiUrl;
    const params: string[] = [];

    if (limite) params.push(`limite=${limite}`);
    if (offset) params.push(`offset=${offset}`);

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    return this.http.get<ApiResponse<Notificacion[]>>(url);
  }

  // Contar notificaciones no leídas
  contarNoLeidas(): Observable<ApiResponse<ContadorNotificaciones>> {
    return this.http.get<ApiResponse<ContadorNotificaciones>>(`${this.apiUrl}/contar-no-leidas`);
  }

  // Marcar una notificación como leída
  marcarLeida(id: number): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/${id}/marcar-leida`, {});
  }

  // Marcar todas las notificaciones como leídas
  marcarTodasLeidas(): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/marcar-todas-leidas`, {});
  }

  // Polling automático para notificaciones no leídas
  iniciarPolling(): Observable<ApiResponse<ContadorNotificaciones>> {
    return interval(this.intervaloPolling).pipe(
      startWith(0),
      switchMap(() => this.contarNoLeidas())
    );
  }

  // Obtener notificaciones recientes
  obtenerRecientes(limite = 5): Observable<ApiResponse<Notificacion[]>> {
    return this.obtenerMias(limite, 0);
  }
}
