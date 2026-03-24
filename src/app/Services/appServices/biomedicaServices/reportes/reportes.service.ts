import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'
import { API_URL } from '../../../../constantes'
import { firstValueFrom } from 'rxjs';
import { createHeaders } from './../../../../utilidades'

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private httpClient = inject(HttpClient);
  private router = inject(Router);

  constructor() {

  }

  // Note: The original instruction's "Code Edit" snippet contained `construc` which seems like a typo.
  // Assuming the intention was to place the new method after the constructor.
  // Also, the `createHeaders` and `baseUrl` used in `descargarPdfReporte` are not defined in the original context.
  // I'm replacing `this.createHeaders()` with the globally imported `createHeaders()` function.
  // And `this.baseUrl` with `API_URL`.

  descargarPdfReporte(idReporte: number): void {
    const headers = createHeaders(); // Using the imported createHeaders function
    this.httpClient.get(`${API_URL}/pdf-preventivo/${idReporte}`, { headers: headers.headers, responseType: 'blob' }).subscribe({ // Accessing headers property
      next: (blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `ReportePreventivo_${idReporte}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      },
      error: (err) => {
        console.error('Error al descargar PDF:', err);
        alert('No se pudo generar el PDF del reporte.');
      }
    });
  }

  getToken() {

  }

  getReportesEquipo(idEquipo: any) {
    return firstValueFrom(
      this.httpClient.get<any>(`${API_URL}/reportes/equipo/${idEquipo}`, createHeaders())
    )
  }

  getReportesPreventivosMesAño(date: any) {
    return firstValueFrom(
      this.httpClient.post<any>(`${API_URL}/reportes/preventivosmes`, date, createHeaders())
    )
  }

  getReportesCorrectivosMesAño(date: any) {
    return firstValueFrom(
      this.httpClient.post<any>(`${API_URL}/reportes/correctivosmes`, date, createHeaders())
    )
  }

  getReportesPreventivosRango(data: { mesInicio: number, mesFin: number, anio: number }) {
    return firstValueFrom(
      this.httpClient.post<any>(`${API_URL}/reportes/preventivosrango`, data, createHeaders())
    )
  }

  getReportesCorrectivosRango(data: { mesInicio: number, mesFin: number, anio: number }) {
    return firstValueFrom(
      this.httpClient.post<any>(`${API_URL}/reportes/correctivosrango`, data, createHeaders())
    )
  }

  getPreventivoProgramado(idReporte: any) {
    return firstValueFrom(
      this.httpClient.get<any>(`${API_URL}/reporte/${idReporte}`, createHeaders())
    )
  }

  ActualizarPreventivoProgramado(idReporte: any, reporte: any) {
    return firstValueFrom(
      this.httpClient.put<any>(`${API_URL}/actualizarreporte/${idReporte}`, reporte, createHeaders())
    )
  }

  CrearReporteCorrectivo(reporte: any) {
    return firstValueFrom(
      this.httpClient.post<any>(`${API_URL}/addreporte`, reporte, createHeaders())
    )
  }

  getReporteById(idReporte: any) {
    return firstValueFrom(
      this.httpClient.get<any>(`${API_URL}/reporte/${idReporte}`, createHeaders())
    )
  }

  getReportesPorRango(inicio: string, fin: string, limit = 1000, offset = 0) {
    const base = createHeaders(); // { headers: ..., withCredentials?: ... }
    const options = {
      ...(base || {}),
      params: { inicio, fin, limit, offset } as any
    };
    return firstValueFrom(
      this.httpClient.get<any>(`${API_URL}/reportes/rango`, options)
    );
  }

  getReportesUsuario(idUsuario: any) {
    return firstValueFrom(
      this.httpClient.get<any>(`${API_URL}/reportes/usuario/${idUsuario}`, createHeaders())
    )
  }
}
