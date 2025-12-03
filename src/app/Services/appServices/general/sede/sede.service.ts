import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { firstValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { createHeaders } from  '../../../../utilidades';

import { API_URL } from '../../../../constantes';

@Injectable({
  providedIn: 'root'
})
export class SedeService {

  router = inject(Router);
  httpClient = inject(HttpClient);

  constructor() { }

  getAllSedes() {
    return firstValueFrom(
      this.httpClient.get<any[]>(`${API_URL}/sedes`)
    )
  }

}
