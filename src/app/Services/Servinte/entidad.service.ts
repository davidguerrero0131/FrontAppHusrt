import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { API_SERVINTE_URL, API_URL } from '../../constantes';



@Injectable({
  providedIn: 'root'
})
export class EntidadService {

  private httpClient = inject(HttpClient);
  private router = inject(Router);

  constructor() { }

  getentidadPaciente(idPaciente: String) {
    const url = API_SERVINTE_URL + '/EntidadPaciente/' + idPaciente + '';
    return firstValueFrom(this.httpClient.get<any[]>(url))
  }

  getEAPBEntidad(nombreEmpresa: string) {
    const url = API_SERVINTE_URL + '/Entidad/' + nombreEmpresa + '';
    return firstValueFrom(this.httpClient.get<any[]>(url));
  }

  getDatosEntidad(object: any) {
    const url = API_SERVINTE_URL + '/datosentidad';
    return firstValueFrom(this.httpClient.post<any[]>(url, object));
  }

  getConsultasPediatria(object: any) {
    const url = API_SERVINTE_URL + '/evolucionesespecialistas';
    return firstValueFrom(this.httpClient.post<any[]>(url, object));
  }

  getPacientesCirugia() {
    const url = API_SERVINTE_URL + '/pacientescirugia';
    return firstValueFrom(this.httpClient.get<any[]>(url));
  }

  getDatosCirugiaPaciente(episodio: string) {
    const url = API_SERVINTE_URL + '/datoscirugiapaciente/' + episodio + '';
    return firstValueFrom(this.httpClient.get<any[]>(url));
  }

  getDatosPaciente(idPaciente: string) {
    const url = API_SERVINTE_URL + '/paciente/' + idPaciente + '';
    return firstValueFrom(this.httpClient.get<any[]>(url));
  }

  getPacienteLocal(idPaciente: string) {
    const url = API_URL + '/citas-pediatria/paciente-info/' + idPaciente;
    return firstValueFrom(this.httpClient.get<any>(url));
  }

  createAppointment(data: any) {
    const url = API_URL + '/citas-pediatria';
    return firstValueFrom(this.httpClient.post<any>(url, data));
  }

  getAllAppointmentsLocal() {
    const url = API_URL + '/citas-pediatria';
    return firstValueFrom(this.httpClient.get<any[]>(url));
  }

  validateAppointmentLocal(id: number) {
    const url = API_URL + `/citas-pediatria/${id}/validar`;
    return firstValueFrom(this.httpClient.put<any>(url, {}));
  }

  exportAppointmentsExcel(startDate: string, endDate: string): Observable<Blob> {
    const url = `${API_URL}/citas-pediatria/export/excel?startDate=${startDate}&endDate=${endDate}`;
    return this.httpClient.get(url, { responseType: 'blob' });
  }

  updateAppointmentLocal(id: number, data: any) {
    const url = API_URL + `/citas-pediatria/${id}`;
    return firstValueFrom(this.httpClient.put<any>(url, data));
  }

  getDashboardStats(startDate?: string, endDate?: string) {
    let url = API_URL + '/citas-pediatria/stats';
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    return firstValueFrom(this.httpClient.get<any>(url));
  }

  // --- MÉTODOS PARA MÉDICOS DE MADRE CANGURO ---
  getMedicosLocal() {
    const url = API_URL + '/citas-pediatria-medicos';
    return firstValueFrom(this.httpClient.get<any[]>(url));
  }

  createMedicoLocal(data: any) {
    const url = API_URL + '/citas-pediatria-medicos';
    return firstValueFrom(this.httpClient.post<any>(url, data));
  }

  updateMedicoLocal(id: number, data: any) {
    const url = API_URL + `/citas-pediatria-medicos/${id}`;
    return firstValueFrom(this.httpClient.put<any>(url, data));
  }

  // --- MÉTODOS PARA ESPECIALIDADES DE MADRE CANGURO ---
  getEspecialidadesLocal() {
    const url = API_URL + '/citas-pediatria-especialidades';
    return firstValueFrom(this.httpClient.get<any[]>(url));
  }

  createEspecialidadLocal(data: any) {
    const url = API_URL + '/citas-pediatria-especialidades';
    return firstValueFrom(this.httpClient.post<any>(url, data));
  }

  updateEspecialidadLocal(id: number, data: any) {
    const url = API_URL + `/citas-pediatria-especialidades/${id}`;
    return firstValueFrom(this.httpClient.put<any>(url, data));
  }

  getTriagePacientes() {
    const url = API_SERVINTE_URL + `/TriageQuirurgico`;
    return firstValueFrom(this.httpClient.get<any[]>(url));
  }
}
