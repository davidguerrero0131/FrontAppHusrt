import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../../../../constantes';
import { createHeaders } from '../../../../utilidades';

export interface SysEquipo {
  id?: number;
  nombre?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class SysequiposService {
  private httpClient = inject(HttpClient);
  private baseUrl = API_URL;

  constructor() { }

  getEquipos(): Promise<any[]> {
    return firstValueFrom(this.httpClient.get<any[]>(`${this.baseUrl}/api/sistemas/equipos`, createHeaders()));
  }

  createEquipo(equipo: any): Promise<any> {
    return firstValueFrom(this.httpClient.post<any>(`${this.baseUrl}/api/sistemas/equipos`, equipo, createHeaders()));
  }

  updateEquipo(id: number, equipo: any): Promise<any> {
    return firstValueFrom(this.httpClient.put<any>(`${this.baseUrl}/api/sistemas/equipos/${id}`, equipo, createHeaders()));
  }

  exportarInventario(tipo?: string, obsolescencia?: boolean, otro?: boolean): Promise<Blob> {
    return firstValueFrom(this.httpClient.get(`${this.baseUrl}/api/sistemas/exportar`, { responseType: 'blob', ...createHeaders() }));
  }
}
