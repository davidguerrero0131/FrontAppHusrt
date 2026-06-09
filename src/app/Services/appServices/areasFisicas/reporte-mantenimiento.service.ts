import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../../../constantes';
import { createHeaders } from '../../../utilidades';

@Injectable({
    providedIn: 'root'
})
export class ReporteMantenimientoService {

    private apiUrl = API_URL;
    private http = inject(HttpClient);

    constructor() { }

    getAllReportes() {
        return firstValueFrom(this.http.get<any[]>(`${this.apiUrl}/api/reportes-mantenimiento`, createHeaders()));
    }

    getReporteById(id: number) {
        return firstValueFrom(this.http.get<any>(`${this.apiUrl}/api/reportes-mantenimiento/${id}`, createHeaders()));
    }

    createReporte(reporte: any) {
        return firstValueFrom(this.http.post<any>(`${this.apiUrl}/api/add-reporte-mantenimiento`, reporte, createHeaders()));
    }

    updateReporte(id: number, reporte: any) {
        return firstValueFrom(this.http.put<any>(`${this.apiUrl}/api/update-reporte-mantenimiento/${id}`, reporte, createHeaders()));
    }

    deleteReporte(id: number) {
        return firstValueFrom(this.http.delete<any>(`${this.apiUrl}/api/delete-reporte-mantenimiento/${id}`, createHeaders()));
    }

    subirInformeFirmado(id: number, file: File) {
        const formData = new FormData();
        formData.append('informeFirmado', file);
        return firstValueFrom(this.http.put<any>(`${this.apiUrl}/api/reportes-mantenimiento/subir-firmado/${id}`, formData, createHeaders()));
    }

    descargarInformeFirmado(id: number) {
        return firstValueFrom(this.http.get(`${this.apiUrl}/api/reportes-mantenimiento/ver-firmado/${id}`, {
            ...createHeaders(),
            responseType: 'blob'
        }));
    }
}
