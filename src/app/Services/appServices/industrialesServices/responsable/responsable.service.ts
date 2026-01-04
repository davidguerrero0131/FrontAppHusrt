import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { createHeaders } from '../../../../utilidades';
import { API_URL } from '../../../../constantes';

@Injectable({
  providedIn: 'root'
})
export class ResponsableService {
  router = inject(Router);
  httpClient = inject(HttpClient);

  constructor() {}

  getAllResponsables() {
    return firstValueFrom(
      this.httpClient.get<any[]>(`${API_URL}/responsables`, createHeaders())
    );
  }

  getResponsableById(id: number) {
    return firstValueFrom(
      this.httpClient.get<any>(`${API_URL}/responsables/${id}`, createHeaders())
    );
  }

  addResponsable(responsable: any) {
    return firstValueFrom(
      this.httpClient.post<any>(`${API_URL}/responsables`, responsable, createHeaders())
    );
  }

  updateResponsable(id: number, responsable: any) {
    return firstValueFrom(
      this.httpClient.put<any>(`${API_URL}/responsables/${id}`, responsable, createHeaders())
    );
  }

  deleteResponsable(id: number) {
    return firstValueFrom(
      this.httpClient.delete<any>(`${API_URL}/responsables/${id}`, createHeaders())
    );
  }
}