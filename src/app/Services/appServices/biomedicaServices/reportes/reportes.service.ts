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
}
