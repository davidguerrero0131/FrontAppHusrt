import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../../../constantes';

@Injectable({
    providedIn: 'root'
})
export class InspeccionService {

    private http = inject(HttpClient);
    private url = API_URL;

    constructor() { }

    getAllInspecciones(): Promise<any[]> {
        return firstValueFrom(this.http.get<any[]>(`${this.url}/api/inspecciones`));
    }

    getInspeccionById(id: number): Promise<any> {
        return firstValueFrom(this.http.get<any>(`${this.url}/api/inspecciones/${id}`));
    }

    createInspeccion(inspeccion: any): Promise<any> {
        return firstValueFrom(this.http.post<any>(`${this.url}/api/addinspeccion`, inspeccion));
    }

    updateInspeccion(id: number, inspeccion: any): Promise<any> {
        return firstValueFrom(this.http.put<any>(`${this.url}/api/Actinspeccion/${id}`, inspeccion));
    }

    deleteInspeccion(id: number): Promise<any> {
        return firstValueFrom(this.http.delete<any>(`${this.url}/api/reminspeccion/${id}`));
    }
}
