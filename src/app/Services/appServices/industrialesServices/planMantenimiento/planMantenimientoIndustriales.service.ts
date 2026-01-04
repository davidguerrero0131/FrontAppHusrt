import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { createHeaders } from '../../../../utilidades';
import { API_URL } from '../../../../constantes';

@Injectable({
  providedIn: 'root'
})
export class PlanMantenimientoIndustrialesService {
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_URL}/api/industriales`;
  }

  // Obtener todos los planes de mantenimiento
  async getAllPlanes(): Promise<any[]> {
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/planes`, createHeaders())
    );
  }

  // Obtener planes de mantenimiento por equipo
  async getPlanesByEquipo(idEquipo: number): Promise<any[]> {
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/planes/equipo/${idEquipo}`, createHeaders())
    );
  }

  // Obtener planes de mantenimiento por año
  async getPlanesByAno(ano: number): Promise<any[]> {
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/planes/ano/${ano}`, createHeaders())
    );
  }

  // Obtener planes de mantenimiento por mes y año
  async getPlanesByPeriodo(ano: number, mes: number): Promise<any[]> {
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/planes/periodo/${ano}/${mes}`, createHeaders())
    );
  }

  // Obtener un plan por ID
  async getPlanById(id: number): Promise<any> {
    return firstValueFrom(
      this.httpClient.get<any>(`${this.baseUrl}/plan/${id}`, createHeaders())
    );
  }

  // Crear un nuevo plan de mantenimiento
  async addPlan(plan: any): Promise<any> {
    return firstValueFrom(
      this.httpClient.post<any>(`${this.baseUrl}/addplan`, plan, createHeaders())
    );
  }

  // Actualizar un plan de mantenimiento
  async updatePlan(id: number, plan: any): Promise<any> {
    return firstValueFrom(
      this.httpClient.put<any>(`${this.baseUrl}/actplan/${id}`, plan, createHeaders())
    );
  }

  // Deshabilitar un plan de mantenimiento
  async deshabilitarPlan(id: number): Promise<any> {
    return firstValueFrom(
      this.httpClient.put<any>(`${this.baseUrl}/deshabilitarplan/${id}`, {}, createHeaders())
    );
  }

  // Habilitar un plan de mantenimiento
  async habilitarPlan(id: number): Promise<any> {
    return firstValueFrom(
      this.httpClient.put<any>(`${this.baseUrl}/habilitarplan/${id}`, {}, createHeaders())
    );
  }

  // Obtener resumen de planes por equipo
  async getResumenByEquipo(idEquipo: number): Promise<any[]> {
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/resumen/equipo/${idEquipo}`, createHeaders())
    );
  }
}