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

  getPlanMetrologiaEquipo(idEquipo: any) {
    return firstValueFrom(
      this.httpClient.get<any>(`${API_URL}/planmetrologiaequipo/${idEquipo}`, createHeaders())
    )
  }

  getReportesActividadesMesAño(date: any) {
    return firstValueFrom(
      this.httpClient.post<any>(`${API_URL}/reportesMetrologicosmes`, date, createHeaders())
    )
  }

  getPlanActividadesMesAño(date: any) {
    return firstValueFrom(
      this.httpClient.post<any>(`${API_URL}/planactividadmetrologicames`, date, createHeaders())
    )
  }

  getPlanAMetrologicasTipoEquipo(idTipoEquipo: any) {
    return firstValueFrom(
      this.httpClient.get<any>(`${API_URL}/planametrologicastipoequipo/` + idTipoEquipo, createHeaders())
    )
  }

  getPlanAMetrologicasServicio(idServicio: any) {
    return firstValueFrom(
      this.httpClient.get<any>(`${API_URL}/planametrologicasservicio/` + idServicio, createHeaders())
    )
  }

  programarActividadesMetrologicasMes(date: any) {
    return firstValueFrom(
      this.httpClient.post<any>(`${API_URL}/programacionmetrologiames`, date, createHeaders())
    )
  }

  updateActividadMetrologica(id: any, formData: FormData) {
    // No usamos createHeaders() aquí porque FormData necesita que el navegador establezca el Content-Type automáticamente con el boundary correcto
    // Sin embargo, si createHeaders agrega Authorization, necesitamos manejarlo.
    // Generalmente angular maneja content-type multipart si pasamos FormData.
    // Vamos a asumir que createHeaders devuelve un objeto con headers. 
    // Si Content-Type está en createHeaders, podría dar problemas.
    // Mejor construimos headers manualmente o modificamos createHeaders para aceptar flag.

    // Simplificación: Asumimos que createHeaders solo pone Authorization. 
    // Si pone Content-Type: application/json, esto fallará.
    // Verificaremos utilidades.

    // Solución segura: Obtener token manualmente aqui
    const token = sessionStorage.getItem('utoken');
    const headers = { 'Authorization': token || '' };

    return firstValueFrom(
      this.httpClient.put<any>(`${API_URL}/actactividad/${id}`, formData, { headers })
    )
  }

  registrarActividadConArchivo(formData: FormData) {
    const token = sessionStorage.getItem('utoken');
    const headers = { 'Authorization': token || '' };
    return firstValueFrom(
      this.httpClient.post<any>(`${API_URL}/addactividadWithFile`, formData, { headers })
    )
  }

  getScheduledMetrologyMonths() {
    return firstValueFrom(
      this.httpClient.get<any>(`${API_URL}/programacion-metrologia-meses`, createHeaders())
    )
  }
}
