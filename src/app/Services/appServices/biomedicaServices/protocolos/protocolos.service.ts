import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { createHeaders } from '../../../../utilidades'
import { firstValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

import { API_URL } from '../../../../constantes'

@Injectable({
  providedIn: 'root'
})
export class ProtocolosService {

  private httpClient = inject(HttpClient);
  private router = inject(Router);


  constructor() { }

  getProtocoloTipoEquipo(idTipoEquipo: any) {
    return firstValueFrom(
      this.httpClient.get<any[]>(`${API_URL}/protocolos/tipoequipo/` + idTipoEquipo, createHeaders())
    )
  }

  addCumplimientoProtocolo(protocolo: any) {
    return firstValueFrom(
      this.httpClient.post<any>(`${API_URL}/addcumplimiento`, protocolo, createHeaders())
    )
  }
}
