import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProtocoloIndustrialService {

    private readonly baseUrl = 'http://localhost:3006/api/industriales';
    httpClient = inject(HttpClient);

    constructor() { }

    createHeaders() {
        const token = sessionStorage.getItem('utoken') || localStorage.getItem('utoken') || '';
        return {
            headers: new HttpHeaders({
                'Authorization': token
            })
        };
    }

    // Get Protocols by Type ID
    getProtocolosPorTipo(id: number) {
        return firstValueFrom(
            this.httpClient.get<any[]>(`${this.baseUrl}/protocolos/tipo/${id}`, this.createHeaders())
        );
    }

    // Create Protocol
    createProtocolo(data: any) {
        return firstValueFrom(
            this.httpClient.post<any>(`${this.baseUrl}/protocolos`, data, this.createHeaders())
        );
    }

    // Update Protocol (e.g. toggle state)
    updateProtocolo(id: number, data: any) {
        return firstValueFrom(
            this.httpClient.put<any>(`${this.baseUrl}/protocolos/${id}`, data, this.createHeaders())
        );
    }

    // Add Compliance
    addCumplimientoProtocolo(data: any) {
        return firstValueFrom(
            this.httpClient.post<any>(`${this.baseUrl}/protocolos/cumplimiento`, data, this.createHeaders())
        );
    }

    // Get Compliance by Report ID
    getCumplimientoProtocoloReporte(reporteId: number) {
        return firstValueFrom(
            this.httpClient.get<any[]>(`${this.baseUrl}/protocolos/cumplimiento/reporte/${reporteId}`, this.createHeaders())
        );
    }
}
