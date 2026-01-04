import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { createHeaders } from '../../../../utilidades';
import { API_URL } from '../../../../constantes';

@Injectable({
  providedIn: 'root'
})
export class EquiposIndustrialesService {
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private baseUrl: string;

  constructor() {
    // Agregar /api/industriales para diferenciar de biomédica
    this.baseUrl = `${API_URL}/api/industriales`;
  }

  // Obtener TODOS los equipos (activos e inactivos)
async getAllEquiposTodos(): Promise<any[]> {
  return firstValueFrom(
    this.httpClient.get<any[]>(`${this.baseUrl}/equipos/todos`, createHeaders())
  );
}

  // Obtener todos los equipos industriales activos
  async getAllEquipos(): Promise<any[]> {
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/equipos`, createHeaders())
    );
  }

  // Obtener todos los equipos dados de baja
  async getEquiposBajas(): Promise<any[]> {
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/equipos/bajas`, createHeaders())
    );
  }

  // Obtener un equipo por ID
  async getEquipoById(id: number): Promise<any> {
    return firstValueFrom(
      this.httpClient.get<any>(`${this.baseUrl}/equipo/${id}`, createHeaders())
    );
  }

  // Obtener equipos por tipo
  async getEquiposByTipo(idTipo: number): Promise<any[]> {
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/equipos/tipo/${idTipo}`, createHeaders())
    );
  }

  // Obtener equipos por servicio
  async getEquiposByServicio(idServicio: number): Promise<any[]> {
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/equipos/servicio/${idServicio}`, createHeaders())
    );
  }

  // Obtener equipos por responsable
  async getEquiposByResponsable(idResponsable: number): Promise<any[]> {
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/equipos/responsable/${idResponsable}`, createHeaders())
    );
  }

  // Obtener equipos por sede
  async getEquiposBySede(idSede: number): Promise<any[]> {
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/equipos/sede/${idSede}`, createHeaders())
    );
  }

  // Obtener solo id y serie de equipos activos
  async getSeriesEquipos(): Promise<any[]> {
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/seriesequipos`, createHeaders())
    );
  }

  // Crear un nuevo equipo industrial
  async addEquipo(equipo: any): Promise<any> {
    return firstValueFrom(
      this.httpClient.post<any>(`${this.baseUrl}/addequipo`, equipo, createHeaders())
    );
  }

  // Actualizar un equipo industrial
  async updateEquipo(id: number, equipo: any): Promise<any> {
    return firstValueFrom(
      this.httpClient.put<any>(`${this.baseUrl}/Actequipo/${id}`, equipo, createHeaders())
    );
  }

  // Dar de baja un equipo (soft delete)
  async darDeBajaEquipo(idEquipo: number): Promise<any> {
    return firstValueFrom(
      this.httpClient.put<any>(`${this.baseUrl}/bajaequipo/${idEquipo}`, {}, createHeaders())
    );
  }

  // Reactivar un equipo dado de baja
  async reactivarEquipo(idEquipo: number): Promise<any> {
    return firstValueFrom(
      this.httpClient.put<any>(`${this.baseUrl}/p/${idEquipo}`, {}, createHeaders())
    );
  }
}