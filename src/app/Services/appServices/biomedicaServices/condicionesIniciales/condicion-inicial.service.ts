import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../../../constantes';

import { createHeaders } from '../../../../utilidades';

@Injectable({
    providedIn: 'root'
})
export class CondicionInicialService {

    private url = API_URL + '/condicionesiniciales';

    constructor(private http: HttpClient) { }

    getAll(): Observable<any> {
        return this.http.get(this.url, createHeaders());
    }

    getActive(): Observable<any> {
        return this.http.get(this.url + '/activas', createHeaders());
    }

    create(condicion: any): Observable<any> {
        return this.http.post(this.url, condicion, createHeaders());
    }

    update(id: number, condicion: any): Observable<any> {
        return this.http.put(this.url + '/' + id, condicion, createHeaders());
    }

    delete(id: number): Observable<any> {
        return this.http.delete(this.url + '/' + id, createHeaders());
    }
}

