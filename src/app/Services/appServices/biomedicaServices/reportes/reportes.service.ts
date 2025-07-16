import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'
import { API_URL } from '../../../../constantes'
import { firstValueFrom } from 'rxjs';
import { createHeaders} from './../../../../utilidades'

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
}
