import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class EntidadService {

  baseUrl = 'http://172.30.20.18:3002';

  constructor(private http: HttpClient) { }

  getentidadPaciente(idPaciente: String): Observable<any>{
    const url = this.baseUrl + '/EntidadPaciente/' + idPaciente + '';
    return this.http.get<any[]>(url, {observe: 'response'})
  }

  getEAPBEntidad(nombreEmpresa: string): Observable<any>{
    const url = this.baseUrl + '/Entidad/' + nombreEmpresa + '';
    return this.http.get<any[]>(url, {observe: 'response'})
  }

  getConsultasPediatria(object: any): Observable<any>{
    const url = this.baseUrl + '/evolucionesespecialistas';
    return this.http.post<any[]>(url, object,{observe: 'response'})
  }
}
