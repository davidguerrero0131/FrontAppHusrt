import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../../../constantes';
import { firstValueFrom } from 'rxjs';
import { createHeaders } from '../../../../utilidades';

@Injectable({
    providedIn: 'root'
})
export class ReporteIndustrialService {

    private httpClient = inject(HttpClient);

    constructor() { }

    getReportesEquipo(idEquipo: any) {
        return firstValueFrom(
            this.httpClient.get<any>(`${API_URL}/api/industriales/reportes/equipo/${idEquipo}`, createHeaders())
        )
    }

    getReportesPreventivosMesAño(date: any) {
        return firstValueFrom(
            this.httpClient.post<any>(`${API_URL}/api/industriales/reportes/programacion/preventivosmes`, date, createHeaders())
        )
    }

    getReportesCorrectivosMesAño(date: { anio: number, mes: number, tecnicoId?: number }) {
        return firstValueFrom(
            this.httpClient.post<any>(`${API_URL}/api/industriales/programacion/correctivosmes`, date, createHeaders())
        )
    }

    getReportesPreventivosRango(data: { mesInicio: number, mesFin: number, anio: number }) {
        return firstValueFrom(
            this.httpClient.post<any>(`${API_URL}/api/industriales/reportes/programacion/preventivosrango`, data, createHeaders())
        )
    }

    getReportesCorrectivosRango(data: { mesInicio: number, mesFin: number, anio: number, tecnicoId?: number }) {
        return firstValueFrom(
            this.httpClient.post<any>(`${API_URL}/api/industriales/programacion/correctivosrango`, data, createHeaders())
        )
    }

    updateEstadoCorrectivo(id: number, data: { estado: string, usuarioIdFk?: number }) {
        return firstValueFrom(
            this.httpClient.put<any>(`${API_URL}/api/industriales/correctivos/${id}/estado`, data, createHeaders())
        )
    }

    getReporteById(idReporte: any) {
        return firstValueFrom(
            this.httpClient.get<any>(`${API_URL}/api/industriales/reportes/${idReporte}`, createHeaders())
        )
    }

    createReporte(reporte: FormData) { // Changed type to FormData
        return firstValueFrom(
            this.httpClient.post<any>(`${API_URL}/api/industriales/reportes/add`, reporte, createHeaders())
        )
    }

    updateReporte(idReporte: any, reporte: any) {
        return firstValueFrom(
            this.httpClient.put<any>(`${API_URL}/api/industriales/reportes/update/${idReporte}`, reporte, createHeaders())
        )
    }

    deleteReporte(idReporte: any) {
        return firstValueFrom(
            this.httpClient.delete<any>(`${API_URL}/api/industriales/reportes/delete/${idReporte}`, createHeaders())
        )
    }

    getReporteByPlanDetails(idEquipo: number, mes: number, anio: number, planId?: number) {
        return firstValueFrom(
            this.httpClient.post<any>(`${API_URL}/api/industriales/reportes/buscar/plan`, { idEquipo, mes, anio, planId }, createHeaders())
        )
    }

    getReporteByCorrectivoId(idCorrectivo: number) {
        return firstValueFrom(
            this.httpClient.post<any>(`${API_URL}/api/industriales/reportes/buscar/correctivo`, { idCorrectivo }, createHeaders())
        )
    }

    descargarReportePDF(idReporte: number) {
        return firstValueFrom(
            this.httpClient.get(`${API_URL}/api/industriales/reportes/pdf/${idReporte}`, {
                ...createHeaders(),
                responseType: 'blob'
            })
        );
    }

    subirInformeFirmado(idReporte: number, file: File) {
        const formData = new FormData();
        formData.append('informeFirmado', file);
        return firstValueFrom(
            this.httpClient.put<any>(`${API_URL}/api/industriales/reportes/informefirmado/${idReporte}`, formData, createHeaders())
        );
    }

    descargarInformeFirmado(idReporte: number) {
        return firstValueFrom(
            this.httpClient.get(`${API_URL}/api/industriales/reportes/informefirmado/${idReporte}`, {
                ...createHeaders(),
                responseType: 'blob'
            })
        );
    }
}
