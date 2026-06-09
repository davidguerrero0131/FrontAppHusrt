import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '../../../constantes';
import { firstValueFrom } from 'rxjs';
import { createHeaders } from '../../../utilidades';

@Injectable({
    providedIn: 'root'
})
export class ElementosService {

    private readonly http = inject(HttpClient);
    private url = API_URL;

    constructor() { }

    // Obtener todos los elementos
    getAllElementos(): Promise<any> {
        return firstValueFrom(this.http.get<any>(`${this.url}/api/elementos`, createHeaders()));
    }

    // Obtener elementos inactivos
    getAllElementosInactivos(): Promise<any> {
        return firstValueFrom(this.http.get<any>(`${this.url}/api/elementos/inactivo`, createHeaders()));
    }

    // Obtener elemento por ID
    getElementoById(id: number): Promise<any> {
        return firstValueFrom(this.http.get<any>(`${this.url}/api/elemento/${id}`, createHeaders()));
    }

    // Crear elemento
    createElemento(elemento: any): Promise<any> {
        return firstValueFrom(this.http.post<any>(`${this.url}/api/addelemento`, elemento, createHeaders()));
    }

    // Actualizar elemento
    updateElemento(id: number, elemento: any): Promise<any> {
        return firstValueFrom(this.http.put<any>(`${this.url}/api/Actelemento/${id}`, elemento, createHeaders()));
    }

    // Cambiar estado
    changeEstado(id: number, estado: boolean): Promise<any> {
        return firstValueFrom(this.http.put<any>(`${this.url}/api/elemento/estado/${id}`, { estado }, createHeaders()));
    }

    // Eliminar elemento
    deleteElemento(id: number): Promise<any> {
        return firstValueFrom(this.http.delete<any>(`${this.url}/api/remelemento/${id}`, createHeaders()));
    }

}
