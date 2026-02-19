import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../../../../constantes';
import { createHeaders } from '../../../../utilidades';

@Injectable({
    providedIn: 'root'
})
export class HojaDeVidaIndustrialService {
    private httpClient = inject(HttpClient);
    private router = inject(Router);
    private baseUrl: string;

    constructor() {
        this.baseUrl = `${API_URL}/api/industriales`;
    }

    // =========================================================================
    //  1. HOJA DE VIDA INDUSTRIAL (Entidad Principal)
    // =========================================================================

    async getAllHojasVida(): Promise<any[]> {
        return firstValueFrom(this.httpClient.get<any[]>(`${this.baseUrl}/hojas-vida`, createHeaders()));
    }

    async getAllHojasVidaTodas(): Promise<any[]> {
        return firstValueFrom(this.httpClient.get<any[]>(`${this.baseUrl}/hojas-vida/todos`, createHeaders()));
    }

    async getHojasVidaInactivas(): Promise<any[]> {
        return firstValueFrom(this.httpClient.get<any[]>(`${this.baseUrl}/hojas-vida/inactivas`, createHeaders()));
    }

    async getHojaVidaByEquipo(idEquipo: number): Promise<any> {
        return firstValueFrom(this.httpClient.get<any>(`${this.baseUrl}/hoja-vida/equipo/${idEquipo}`, createHeaders()));
    }

    async getHojaVidaById(id: number): Promise<any> {
        return firstValueFrom(this.httpClient.get<any>(`${this.baseUrl}/hoja-vida/${id}`, createHeaders()));
    }

    async createHojaVida(hojaVida: any): Promise<any> {
        return firstValueFrom(this.httpClient.post<any>(`${this.baseUrl}/addhoja-vida`, hojaVida, createHeaders()));
    }

    async updateHojaVida(id: number, hojaVida: any): Promise<any> {
        return firstValueFrom(this.httpClient.put<any>(`${this.baseUrl}/acthoja-vida/${id}`, hojaVida, createHeaders()));
    }

    async deleteHojaVida(id: number): Promise<any> { // Soft delete usually prefers disable endpoints
        return firstValueFrom(this.httpClient.delete<any>(`${this.baseUrl}/delhoja-vida/${id}`, createHeaders()));
    }

    async disableHojaVida(id: number): Promise<any> {
        return firstValueFrom(this.httpClient.put<any>(`${this.baseUrl}/deshabilitar-hoja-vida/${id}`, {}, createHeaders()));
    }

    async enableHojaVida(id: number): Promise<any> {
        return firstValueFrom(this.httpClient.put<any>(`${this.baseUrl}/habilitar-hoja-vida/${id}`, {}, createHeaders()));
    }

    // =========================================================================
    //  2. DATOS TÉCNICOS
    // =========================================================================

    async getDatosTecnicosByEquipo(idEquipo: number): Promise<any> {
        return firstValueFrom(this.httpClient.get<any>(`${this.baseUrl}/datos-tecnicos/equipo/${idEquipo}`, createHeaders()));
    }

    async getDatosTecnicosById(id: number): Promise<any> {
        return firstValueFrom(this.httpClient.get<any>(`${this.baseUrl}/datos-tecnicos/${id}`, createHeaders()));
    }

    async createDatosTecnicos(datos: any): Promise<any> {
        return firstValueFrom(this.httpClient.post<any>(`${this.baseUrl}/adddatos-tecnicos`, datos, createHeaders()));
    }

    async updateDatosTecnicos(id: number, datos: any): Promise<any> {
        return firstValueFrom(this.httpClient.put<any>(`${this.baseUrl}/actdatos-tecnicos/${id}`, datos, createHeaders()));
    }

    async disableDatosTecnicos(id: number): Promise<any> {
        return firstValueFrom(this.httpClient.put<any>(`${this.baseUrl}/deshabilitar-datos-tecnicos/${id}`, {}, createHeaders()));
    }

    async enableDatosTecnicos(id: number): Promise<any> {
        return firstValueFrom(this.httpClient.put<any>(`${this.baseUrl}/habilitar-datos-tecnicos/${id}`, {}, createHeaders()));
    }

    // =========================================================================
    //  3. PROVEEDORES
    // =========================================================================

    async getAllProveedores(): Promise<any[]> {
        return firstValueFrom(this.httpClient.get<any[]>(`${this.baseUrl}/proveedores`, createHeaders()));
    }

    async getProveedorByEquipo(idEquipo: number): Promise<any> {
        return firstValueFrom(this.httpClient.get<any>(`${this.baseUrl}/proveedor/equipo/${idEquipo}`, createHeaders()));
    }

    async getProveedorById(id: number): Promise<any> {
        return firstValueFrom(this.httpClient.get<any>(`${this.baseUrl}/proveedor/${id}`, createHeaders()));
    }

    async createProveedor(proveedor: any): Promise<any> {
        return firstValueFrom(this.httpClient.post<any>(`${this.baseUrl}/addproveedor`, proveedor, createHeaders()));
    }

    async updateProveedor(id: number, proveedor: any): Promise<any> {
        return firstValueFrom(this.httpClient.put<any>(`${this.baseUrl}/actproveedor/${id}`, proveedor, createHeaders()));
    }

    async disableProveedor(id: number): Promise<any> {
        return firstValueFrom(this.httpClient.put<any>(`${this.baseUrl}/deshabilitar-proveedor/${id}`, {}, createHeaders()));
    }

    async enableProveedor(id: number): Promise<any> {
        return firstValueFrom(this.httpClient.put<any>(`${this.baseUrl}/habilitar-proveedor/${id}`, {}, createHeaders()));
    }

    // =========================================================================
    //  4. REGISTRO DE APOYO
    // =========================================================================

    async getRegistroApoyoByEquipo(idEquipo: number): Promise<any> {
        return firstValueFrom(this.httpClient.get<any>(`${this.baseUrl}/registro-apoyo/equipo/${idEquipo}`, createHeaders()));
    }

    async getRegistroApoyoById(id: number): Promise<any> {
        return firstValueFrom(this.httpClient.get<any>(`${this.baseUrl}/registro-apoyo/${id}`, createHeaders()));
    }

    async createRegistroApoyo(registro: any): Promise<any> {
        return firstValueFrom(this.httpClient.post<any>(`${this.baseUrl}/addregistro-apoyo`, registro, createHeaders()));
    }

    async updateRegistroApoyo(id: number, registro: any): Promise<any> {
        return firstValueFrom(this.httpClient.put<any>(`${this.baseUrl}/actregistro-apoyo/${id}`, registro, createHeaders()));
    }

    async disableRegistroApoyo(id: number): Promise<any> {
        return firstValueFrom(this.httpClient.put<any>(`${this.baseUrl}/deshabilitar-registro-apoyo/${id}`, {}, createHeaders()));
    }

    async enableRegistroApoyo(id: number): Promise<any> {
        return firstValueFrom(this.httpClient.put<any>(`${this.baseUrl}/habilitar-registro-apoyo/${id}`, {}, createHeaders()));
    }

    // =========================================================================
    //  5. FABRICANTES (Entidad independiente, no depende de Equipo ID directamente en endpoints)
    // =========================================================================

    async getAllFabricantes(): Promise<any[]> {
        return firstValueFrom(this.httpClient.get<any[]>(`${this.baseUrl}/fabricantes`, createHeaders()));
    }

    async getFabricanteById(id: number): Promise<any> {
        return firstValueFrom(this.httpClient.get<any>(`${this.baseUrl}/fabricante/${id}`, createHeaders()));
    }

    async createFabricante(fabricante: any): Promise<any> {
        return firstValueFrom(this.httpClient.post<any>(`${this.baseUrl}/fabricante/`, fabricante, createHeaders()));
    }

    async updateFabricante(id: number, fabricante: any): Promise<any> {
        return firstValueFrom(this.httpClient.put<any>(`${this.baseUrl}/fabricante/${id}`, fabricante, createHeaders()));
    }

    async deleteFabricante(id: number): Promise<any> {
        return firstValueFrom(this.httpClient.delete<any>(`${this.baseUrl}/fabricante/${id}`, createHeaders()));
    }
    // =========================================================================
    //  6. DOCUMENTOS INDUSTRIALES
    // =========================================================================

    async uploadDocument(equipoId: number, file: File): Promise<any> {
        const formData = new FormData();
        formData.append('archivo', file);

        return firstValueFrom(this.httpClient.post<any>(`${this.baseUrl}/doc-ind/upload/${equipoId}`, formData, createHeaders()));
    }

    async getDocumentsByEquipo(equipoId: number): Promise<any[]> {
        return firstValueFrom(this.httpClient.get<any[]>(`${this.baseUrl}/doc-ind/equipo/${equipoId}`, createHeaders()));
    }

    async deleteDocument(id: number): Promise<any> {
        return firstValueFrom(this.httpClient.delete<any>(`${this.baseUrl}/doc-ind/${id}`, createHeaders()));
    }

    downloadDocument(id: number): any {
        return this.httpClient.get(`${this.baseUrl}/doc-ind/download/${id}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('utoken')}` },
            responseType: 'blob'
        });
    }
}
