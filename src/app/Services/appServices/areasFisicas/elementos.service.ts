import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '../../../constantes';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ElementosService {

    private readonly http = inject(HttpClient);
    private url = API_URL;

    constructor() { }

    // Obtener todos los elementos
    getAllElementos(): Promise<any> {
        return firstValueFrom(this.http.get<any>(`${this.url}/api/elementos`));
    }

    // Obtener elementos inactivos
    getAllElementosInactivos(): Promise<any> {
        return firstValueFrom(this.http.get<any>(`${this.url}/api/elementos/inactivo`));
    }

    // Obtener elemento por ID
    getElementoById(id: number): Promise<any> {
        return firstValueFrom(this.http.get<any>(`${this.url}/api/elemento/${id}`));
    }

    // Crear elemento
    createElemento(elemento: any): Promise<any> {
        return firstValueFrom(this.http.post<any>(`${this.url}/api/addelemento`, elemento));
    }

    // Actualizar elemento
    updateElemento(id: number, elemento: any): Promise<any> {
        return firstValueFrom(this.http.put<any>(`${this.url}/api/Actelemento/${id}`, elemento));
    }

    // Cambiar estado
    changeEstado(id: number, estado: boolean): Promise<any> {
        return firstValueFrom(this.http.put<any>(`${this.url}/api/elemento/estado/${id}`, { estado }));
    }

    // Eliminar elemento
    deleteElemento(id: number): Promise<any> {
        return firstValueFrom(this.http.delete<any>(`${this.url}/api/remelemento/${id}`));
    }

}
