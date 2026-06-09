import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../../constantes';
import { createHeaders } from '../../../utilidades';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObservacionesService {

  private apiURL = API_URL;

  constructor(private http: HttpClient) { }

  getAllObservaciones(): Promise<any> {
    const api = `${this.apiURL}/api/observaciones`;
    return lastValueFrom(this.http.get(api, createHeaders()));
  }

  getObservacionesByTecnico(tecnicoId: number): Promise<any> {
    const api = `${this.apiURL}/api/observaciones/tecnico/${tecnicoId}`;
    return lastValueFrom(this.http.get(api, createHeaders()));
  }

  updateObservacion(id: number, data: any): Promise<any> {
    const api = `${this.apiURL}/api/observaciones/${id}`;
    return lastValueFrom(this.http.put(api, data, createHeaders()));
  }
}
