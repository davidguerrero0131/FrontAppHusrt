import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { firstValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { createHeaders } from '../../../../utilidades'

import { API_URL } from '../../../../constantes'

@Injectable({
  providedIn: 'root'
})
export class EquiposService {

  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_URL;
  }

  addEquipo(equipo: any) {
    return firstValueFrom(
      this.httpClient.post<any>(`${this.baseUrl}/addequipo`, equipo, createHeaders())
    );
  }

  updateEquipo(id: any, equipo: any) {
    return firstValueFrom(
      this.httpClient.put<any>(`${this.baseUrl}/Actequipo/${id}`, equipo, createHeaders())
    );
  }

  getAllEquipos() {
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/equipos`, createHeaders())
    )
  }

  getAllEquiposSeries() {
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/seriesequipos`, createHeaders())
    )
  }

  getEquipoById(id: any) {
    return firstValueFrom(
      this.httpClient.get<any>(`${this.baseUrl}/equipo/${id}`, createHeaders())
    )
  }

  getAllEquiposBajas() {
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/equipos/bajas`, createHeaders())
    )
  }

  getAllEquiposComodatos(idResponsable: any) {
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/equipos/responsable/${idResponsable}`, createHeaders())
    )
  }

  getAllEquiposTipo(idTipoEquipo: any) {
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/equipos/tipo/${idTipoEquipo}`, createHeaders())
    )
  }

  getAllEquiposServicio(idServicio: any) {
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/equipos/servicio/${idServicio}`, createHeaders())
    )
  }

  getAllEquiposSede(idSede: any) {
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/equipos/sede/${idSede}`, createHeaders())
    )
  }

  getTrazabilidadByEquipo(idEquipo: any) {
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/trazabilidad/equipo/${idEquipo}`, createHeaders())
    )
  }

  createTrazabilidad(trazabilidad: any) {
    return firstValueFrom(
      this.httpClient.post<any>(`${this.baseUrl}/trazabilidad`, trazabilidad, createHeaders())
    )
  }

  getHistorialUnificado(idEquipo: any) {
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/historial/equipo/${idEquipo}`, createHeaders())
    )
  }

  exportarInventario(): Promise<Blob> {
    const headers = createHeaders().headers;
    return firstValueFrom(
      this.httpClient.get(`${this.baseUrl}/exportarInventario`, { headers, responseType: 'blob' })
    );
  }

}
