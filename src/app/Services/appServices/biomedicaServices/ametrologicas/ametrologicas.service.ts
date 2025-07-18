import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { createHeaders } from './../../../../utilidades';


import { API_URL } from '../../../../constantes'

@Injectable({
  providedIn: 'root'
})
export class AmetrologicasService {

  private httpClient = inject(HttpClient);

  constructor() { }

  getPlanABiometricasMes(mes: any) {
    return firstValueFrom(
      this.httpClient.post<any>(`${API_URL}/planactividadmetrologicames`, mes, createHeaders())
    )
  }
}
