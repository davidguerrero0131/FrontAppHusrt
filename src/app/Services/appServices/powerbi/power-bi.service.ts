import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../../constantes';

@Injectable({
  providedIn: 'root'
})
export class PowerBiService {
  private apiUrl = API_URL + '/api/powerbi';

  constructor(private http: HttpClient) { }

  private createHeaders() {
    const token = sessionStorage.getItem('utoken');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  getAllDashboards(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/dashboards`, this.createHeaders());
  }

  getDashboardById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboards/${id}`, this.createHeaders());
  }

  createDashboard(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/dashboards`, data, this.createHeaders());
  }

  updateDashboard(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/dashboards/${id}`, data, this.createHeaders());
  }

  toggleDashboard(id: number, usuarioIdAccion: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/dashboards/${id}/toggle`, { usuarioIdAccion }, this.createHeaders());
  }

  assignUsersToDashboard(id: number, usuariosIds: number[], usuarioIdAccion: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/dashboards/${id}/usuarios`, { usuariosIds, usuarioIdAccion }, this.createHeaders());
  }

  getUserDashboards(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mis-tableros/${usuarioId}`, this.createHeaders());
  }

  getBitacora(dashboardId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/dashboards/${dashboardId}/bitacora`, this.createHeaders());
  }
}
