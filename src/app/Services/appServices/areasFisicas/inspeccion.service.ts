import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../../../constantes';
import { createHeaders } from '../../../utilidades';

@Injectable({
    providedIn: 'root'
})
export class InspeccionService {

    private http = inject(HttpClient);
    private url = API_URL;

    constructor() { }

    getAllInspecciones(): Promise<any[]> {
        return firstValueFrom(this.http.get<any[]>(`${this.url}/api/inspecciones`, createHeaders()));
    }

    getInspeccionesByTecnico(usuarioId: number): Promise<any[]> {
        return firstValueFrom(this.http.get<any[]>(`${this.url}/api/inspecciones/tecnico/${usuarioId}`, createHeaders()));
    }

    getInspeccionById(id: number): Promise<any> {
        return firstValueFrom(this.http.get<any>(`${this.url}/api/inspecciones/${id}`, createHeaders()));
    }

    createInspeccion(inspeccion: any): Promise<any> {
        return firstValueFrom(this.http.post<any>(`${this.url}/api/addinspeccion`, inspeccion, createHeaders()));
    }

    updateInspeccion(id: number, inspeccion: any): Promise<any> {
        return firstValueFrom(this.http.put<any>(`${this.url}/api/Actinspeccion/${id}`, inspeccion, createHeaders()));
    }

    deleteInspeccion(id: number): Promise<any> {
        return firstValueFrom(this.http.delete<any>(`${this.url}/api/reminspeccion/${id}`, createHeaders()));
    }
}
