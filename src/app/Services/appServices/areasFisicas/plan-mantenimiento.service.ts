import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '../../../constantes';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PlanMantenimientoService {

    private readonly http = inject(HttpClient);
    private url = API_URL;

    constructor() { }

    // Obtener todos los planes
    getAllPlanes(): Promise<any> {
        return firstValueFrom(this.http.get<any>(`${this.url}/api/planesMantenimiento`));
    }

    // Obtener planes por área
    getPlanesByArea(areaId: number): Promise<any> {
        return firstValueFrom(this.http.get<any>(`${this.url}/api/planesMantenimiento/area/${areaId}`));
    }

    // Obtener plan por ID
    getPlanById(id: number): Promise<any> {
        return firstValueFrom(this.http.get<any>(`${this.url}/api/planMantenimiento/${id}`));
    }

    // Crear plan
    createPlan(plan: any): Promise<any> {
        return firstValueFrom(this.http.post<any>(`${this.url}/api/addPlanMantenimiento`, plan));
    }

    // Actualizar plan
    updatePlan(id: number, plan: any): Promise<any> {
        return firstValueFrom(this.http.put<any>(`${this.url}/api/ActPlanMantenimiento/${id}`, plan));
    }

    // Cambiar estado
    changeEstado(id: number, estado: number): Promise<any> {
        return firstValueFrom(this.http.put<any>(`${this.url}/api/planMantenimiento/estado/${id}`, { estado }));
    }

    // Eliminar plan
    deletePlan(id: number): Promise<any> {
        return firstValueFrom(this.http.delete<any>(`${this.url}/api/remPlanMantenimiento/${id}`));
    }

}
