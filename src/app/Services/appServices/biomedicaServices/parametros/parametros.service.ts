import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../../../../constantes';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {

  private httpClient = inject(HttpClient);

  constructor() { }

  getParametro(clave: string) {
    return firstValueFrom(
      this.httpClient.get<any>(`${API_URL}/parametros/${clave}`)
    );
  }

  updateParametro(clave: string, valor: string) {
    return firstValueFrom(
      this.httpClient.put<any>(`${API_URL}/parametros/${clave}`, { valor })
    );
  }
}
