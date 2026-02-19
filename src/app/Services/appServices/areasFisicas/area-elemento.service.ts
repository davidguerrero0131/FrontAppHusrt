import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '../../../constantes';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AreaElementoService {

    private readonly http = inject(HttpClient);
    private url = API_URL;

    constructor() { }

    // Obtener elementos asignados a un área
    getElementosByArea(idArea: number): Promise<any> {
        return firstValueFrom(this.http.get<any>(`${this.url}/api/areasElemento/area/${idArea}`));
    }

    // Obtener todas las asignaciones
    getAllAsignaciones(): Promise<any> {
        return firstValueFrom(this.http.get<any>(`${this.url}/api/areasElemento`));
    }

    // Asignar múltiples elementos (Bulk)
    crearAsignacionBulk(data: { areaIdFk: number, elementosIds: number[] }): Promise<any> {
        return firstValueFrom(this.http.post<any>(`${this.url}/api/addareaElemento/bulk`, data));
    }

    // Eliminar todas las asignaciones de un área
    eliminarPorArea(idArea: number): Promise<any> {
        return firstValueFrom(this.http.delete<any>(`${this.url}/api/remareaElemento/area/${idArea}`));
    }

}
