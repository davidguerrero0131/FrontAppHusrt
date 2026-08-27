import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { API_URL } from '../../../../constantes';

export type SysMantenimiento = any;
export type DashboardMantenimientoResponse = any;
export type SysMantenimientoResponse = any;
export type CatalogoItem = any;

@Injectable({
  providedIn: 'root'
})
export class SysmantenimientoService {
  private http = inject(HttpClient);
  private apiUrl = API_URL + '/sysmantenimiento';

  getAll(filters?: any): Observable<SysMantenimiento[]> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params = params.append(key, filters[key]);
        }
      });
    }
    return this.http.get<SysMantenimiento[]>(this.apiUrl, { params });
  }

  async getById(id: number): Promise<SysMantenimiento> {
    return firstValueFrom(
      this.http.get<SysMantenimiento>(this.apiUrl + '/' + id)
    );
  }

  getByEquipo(idEquipo: number): Observable<SysMantenimiento[]> {
    return this.http.get<SysMantenimiento[]>(this.apiUrl + '/equipo/' + idEquipo);
  }

  getByTecnico(idUsuario: number, filters?: any): Observable<SysMantenimiento[]> {
    let params = new HttpParams();
    return this.http.get<SysMantenimiento[]>(this.apiUrl + '/tecnico/' + idUsuario, { params });
  }

  getReportesUsuario(idUsuario: any) {
    return firstValueFrom(
      this.http.get<any>(this.apiUrl + '/usuario/' + idUsuario)
    )
  }

  getDashboard(filters?: any): Observable<DashboardMantenimientoResponse> {
    let params = new HttpParams();
    return this.http.get<DashboardMantenimientoResponse>(this.apiUrl + '/dashboard', { params });
  }

  create(mantenimiento: Partial<SysMantenimiento>): Promise<SysMantenimientoResponse> {
    return firstValueFrom(
      this.http.post<SysMantenimientoResponse>(this.apiUrl, mantenimiento)
    );
  }

  update(id: number, mantenimiento: Partial<SysMantenimiento>): Promise<SysMantenimientoResponse> {
    return firstValueFrom(
      this.http.put<SysMantenimientoResponse>(this.apiUrl + '/' + id, mantenimiento)
    );
  }

  delete(id: number): Observable<SysMantenimientoResponse> {
    return this.http.delete<SysMantenimientoResponse>(this.apiUrl + '/' + id);
  }

  getTiposMantenimiento(): Observable<{ success: boolean; data: CatalogoItem[] }> {
    return this.http.get<{ success: boolean; data: CatalogoItem[] }>(this.apiUrl + '/catalogos/tipos-mantenimiento');
  }

  getTiposFalla(): Observable<{ success: boolean; data: CatalogoItem[] }> {
    return this.http.get<{ success: boolean; data: CatalogoItem[] }>(this.apiUrl + '/catalogos/tipos-falla');
  }

  subirPdf(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('archivo', file);
    return this.http.post(this.apiUrl + '/' + id + '/upload-pdf', formData);
  }

  descargarPdf(id: number): Promise<Blob> {
    return firstValueFrom(
      this.http.get(this.apiUrl + '/' + id + '/pdf', { responseType: 'blob' })
    );
  }

  getCumplimientoProtocoloMantenimiento(idReporte: number): Promise<any[]> {
    return firstValueFrom(this.http.get<any[]>(API_URL + '/syscumplimiento/cumplimientos/mantenimiento/' + idReporte));
  }

  addCumplimientoProtocolo(cp: any): Observable<any> {
    return this.http.post<any>(API_URL + '/syscumplimiento/addcumplimiento', cp);
  }
}