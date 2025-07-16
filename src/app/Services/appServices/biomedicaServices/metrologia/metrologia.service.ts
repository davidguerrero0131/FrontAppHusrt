import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { createHeaders } from './../../../../utilidades'
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../../../../constantes'

@Injectable({
  providedIn: 'root'
})

export class MetrologiaService {

  private httpClient = inject(HttpClient);
  private router = inject(Router);

  constructor() { }

  getReportesMetrologiaEquipo(idEquipo: any) {
    return firstValueFrom(
      this.httpClient.get<any>(`${API_URL}/actividadesequipo/${idEquipo}`, createHeaders())
    )
  }

  getReportesActividadesMesAño(date: any) {
    return firstValueFrom(
      this.httpClient.post<any>(`${API_URL}/reportesMetrologicosmes`, date, createHeaders())
    )
  }
}
