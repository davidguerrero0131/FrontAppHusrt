import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { API_SERVINTE_URL } from '../../constantes';

@Injectable({
  providedIn: 'root'
})
export class EntidadService {


  constructor(private http: HttpClient) { }

  getentidadPaciente(idPaciente: String): Observable<any>{
    const url = API_SERVINTE_URL + '/EntidadPaciente/' + idPaciente + '';
    return this.http.get<any[]>(url, {observe: 'response'})
  }

  getEAPBEntidad(nombreEmpresa: string): Observable<any>{
    const url = API_SERVINTE_URL + '/Entidad/' + nombreEmpresa + '';
    return this.http.get<any[]>(url, {observe: 'response'})
  }

  getConsultasPediatria(object: any): Observable<any>{
    const url = API_SERVINTE_URL + '/evolucionesespecialistas';
    return this.http.post<any[]>(url, object,{observe: 'response'})
  }


  getPacientesCirugia():Observable<any>{
    const url = API_SERVINTE_URL + '/pacientescirugia';
    return this.http.get<any[]>(url,{observe: 'response'});
  }
}
