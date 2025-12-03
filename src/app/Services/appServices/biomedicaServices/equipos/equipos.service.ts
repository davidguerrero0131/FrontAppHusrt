import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { firstValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { createHeaders } from '../../../../utilidades'

import {API_URL} from '../../../../constantes'

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

  addEquipo(equipo: any){
    return firstValueFrom(
      this.httpClient.post<any>(`${this.baseUrl}/addequipo`, equipo)
    );
  }

  getAllEquipos() {
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/equipos`)
    )
  }

  getAllEquiposSeries(){
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/seriesequipos`)
    )
  }

  getEquipoById(id: any) {
    return firstValueFrom(
      this.httpClient.get<any>(`${this.baseUrl}/equipo/${id}`)
    )
  }

  getAllEquiposBajas() {
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/equipos/bajas`)
    )
  }

  getAllEquiposComodatos(idResponsable: any) {
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/equipos/responsable/${idResponsable}`)
    )
  }

  getAllEquiposTipo(idTipoEquipo: any) {
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/equipos/tipo/${idTipoEquipo}`)
    )
  }

  getAllEquiposServicio(idServicio: any) {
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/equipos/servicio/${idServicio}`)
    )
  }

}
