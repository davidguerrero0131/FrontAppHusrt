import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '../../../constantes';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AreasService {

    private readonly http = inject(HttpClient);
    private url = API_URL;

    constructor() { }

    // Obtener todas las areas activas
    getAllAreas(): Promise<any> {
        return firstValueFrom(this.http.get<any>(`${this.url}/api/areas`));
    }

    // Obtener todas las areas inactivas
    getAllAreasInactivas(): Promise<any> {
        return firstValueFrom(this.http.get<any>(`${this.url}/api/areas/inactivo`));
    }

    // Obtener areas por servicio
    getAreasByServicio(idServicio: number): Promise<any> {
        return firstValueFrom(this.http.get<any>(`${this.url}/api/areas/servicio/${idServicio}`));
    }

    // Obtener area por ID
    getAreaById(id: number): Promise<any> {
        return firstValueFrom(this.http.get<any>(`${this.url}/api/area/${id}`));
    }

    // Crear area
    createArea(area: any): Promise<any> {
        return firstValueFrom(this.http.post<any>(`${this.url}/api/addarea`, area));
    }

    // Actualizar area
    updateArea(id: number, area: any): Promise<any> {
        return firstValueFrom(this.http.put<any>(`${this.url}/api/Actarea/${id}`, area));
    }

    // Cambiar estado (Activo/Inactivo)
    changeEstado(id: number, estado: boolean): Promise<any> {
        return firstValueFrom(this.http.put<any>(`${this.url}/api/area/estado/${id}`, { estado }));
    }

    // Eliminar area (Físicamente)
    deleteArea(id: number): Promise<any> {
        return firstValueFrom(this.http.delete<any>(`${this.url}/api/remarea/${id}`));
    }

}
