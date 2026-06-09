import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '../../../constantes';
import { firstValueFrom } from 'rxjs';
import { createHeaders } from '../../../utilidades';

@Injectable({
    providedIn: 'root'
})
export class PlanMantenimientoService {

    private readonly http = inject(HttpClient);
    private url = API_URL;

    constructor() { }

    // Obtener todos los planes
    getAllPlanes(): Promise<any> {
        return firstValueFrom(this.http.get<any>(`${this.url}/api/planesMantenimiento`, createHeaders()));
    }

    // Obtener planes por área
    getPlanesByArea(areaId: number): Promise<any> {
        return firstValueFrom(this.http.get<any>(`${this.url}/api/planesMantenimiento/area/${areaId}`, createHeaders()));
    }

    // Obtener plan por ID
    getPlanById(id: number): Promise<any> {
        return firstValueFrom(this.http.get<any>(`${this.url}/api/planMantenimiento/${id}`, createHeaders()));
    }

    // Crear plan
    createPlan(plan: any): Promise<any> {
        return firstValueFrom(this.http.post<any>(`${this.url}/api/addPlanMantenimiento`, plan, createHeaders()));
    }

    // Programar automáticamente múltiples meses
    postProgramacionAutomatica(programacion: any): Promise<any> {
        return firstValueFrom(this.http.post<any>(`${this.url}/api/addPlanMantenimientoAutomatico`, programacion, createHeaders()));
    }

    // Actualizar plan
    updatePlan(id: number, plan: any): Promise<any> {
        return firstValueFrom(this.http.put<any>(`${this.url}/api/ActPlanMantenimiento/${id}`, plan, createHeaders()));
    }

    // Cambiar estado del plan general
    changeEstado(id: number, estado: number): Promise<any> {
        return firstValueFrom(this.http.put<any>(`${this.url}/api/planMantenimiento/estado/${id}`, { estado }, createHeaders()));
    }

    // Cambiar estado de mantenimiento preventivo mensual
    changeMantenimientoEstado(id: any, estado?: number, data?: any): Promise<any> {
        let body = data;
        if (!body && estado !== undefined) {
            body = { estado };
        }
        
        // Si enviamos FormData, no pasamos createHeaders() porque Angular maneja el boundary
        const headers = (body instanceof FormData) ? {} : createHeaders();
        return firstValueFrom(this.http.put<any>(`${this.url}/api/mantenimientoPreventivo/estado/${id}`, body, headers));
    }

    // Obtener mantenimientos por periodo (mes y año)
    getPlanesByPeriodo(anio: number, mes: number): Promise<any> {
        return firstValueFrom(this.http.get<any>(`${this.url}/api/planesMantenimiento/periodo/${mes}/${anio}`, createHeaders()));
    }

    // Programar masivamente por periodo
    programarPlanes(anio: number, mes: number): Promise<any> {
        return firstValueFrom(this.http.put<any>(`${this.url}/api/planesMantenimiento/programar/${mes}/${anio}`, {}, createHeaders()));
    }

    // Obtener mantenimientos por técnico
    getMantenimientosByTecnico(tecnicoId: number): Promise<any> {
        return firstValueFrom(this.http.get<any>(`${this.url}/api/mantenimientos/tecnico/${tecnicoId}`, createHeaders()));
    }

    // Eliminar plan
    deletePlan(id: number): Promise<any> {
        return firstValueFrom(this.http.delete<any>(`${this.url}/api/remPlanMantenimiento/${id}`, createHeaders()));
    }

    // Obtener todos los mantenimientos preventivos mensuales (para admin)
    getAllMantenimientos(): Promise<any> {
        return firstValueFrom(this.http.get<any>(`${this.url}/api/mantenimientos/todas`, createHeaders()));
    }

}
