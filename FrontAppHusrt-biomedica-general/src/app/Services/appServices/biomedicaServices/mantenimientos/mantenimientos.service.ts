import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { createHeaders } from './../../../../utilidades';

import { API_URL } from '../../../../constantes'

@Injectable({
  providedIn: 'root'
})
export class MantenimientosService {

  private httpClient = inject(HttpClient);

  constructor() {
  }

  getPlanMantenimientoEquipo(idEquipo: any) {
    return firstValueFrom(
      this.httpClient.get<any>(`${API_URL}/planmantenimientoequipo/` + idEquipo, createHeaders())
    )
  }

  getPlanMantenimientoMes(mes: any) {
    return firstValueFrom(
      this.httpClient.post<any>(`${API_URL}/planmantenimientomes`, mes, createHeaders())
    )
  }

  getPlanMantenimientoServicio(idServicio: any) {
    return firstValueFrom(
      this.httpClient.get<any>(`${API_URL}/planmantenimientoservicio/` + idServicio, createHeaders())
    )
  }

  getPlanMantenimientoTipoEquipo(idTipoEquipo: any) {
    return firstValueFrom(
      this.httpClient.get<any>(`${API_URL}/planmantenimientotipoequipo/` + idTipoEquipo, createHeaders())
    )
  }

  programacionMantenimientoResponsable(date: any) {
    return firstValueFrom(
      this.httpClient.post<any>(`${API_URL}/programacionpreventivosresponsable`, date, createHeaders())
    )
  }

  getScheduledMonths() {
    return firstValueFrom(
      this.httpClient.get<any>(`${API_URL}/programacion-preventiva-meses`, createHeaders())
    )
  }
}
