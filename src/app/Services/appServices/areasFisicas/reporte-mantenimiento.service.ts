import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { getDecodedAccessToken } from '../../../utilidades';
import { API_URL } from '../../../constantes';

@Injectable({
    providedIn: 'root'
})
export class ReporteMantenimientoService {

    private apiUrl = API_URL;
    private http = inject(HttpClient);

    constructor() { }

    private getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${token}`
            })
        };
    }

    getAllReportes() {
        return firstValueFrom(this.http.get<any[]>(`${this.apiUrl}/api/reportes-mantenimiento`, this.getAuthHeaders()));
    }

    getReporteById(id: number) {
        return firstValueFrom(this.http.get<any>(`${this.apiUrl}/api/reportes-mantenimiento/${id}`, this.getAuthHeaders()));
    }

    createReporte(reporte: any) {
        return firstValueFrom(this.http.post<any>(`${this.apiUrl}/api/add-reporte-mantenimiento`, reporte, this.getAuthHeaders()));
    }

    updateReporte(id: number, reporte: any) {
        return firstValueFrom(this.http.put<any>(`${this.apiUrl}/api/update-reporte-mantenimiento/${id}`, reporte, this.getAuthHeaders()));
    }

    deleteReporte(id: number) {
        return firstValueFrom(this.http.delete<any>(`${this.apiUrl}/api/delete-reporte-mantenimiento/${id}`, this.getAuthHeaders()));
    }
}
