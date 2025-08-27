import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class News2Service {

  baseUrl = 'http://172.30.20.18:3002';

  http = inject(HttpClient);

  getServicios(){
    const url = this.baseUrl + '/ubicacionesconpacientes';
    return firstValueFrom(this.http.get<any[]>(url));
  }

  getPacientesServicio(ubicacion: any){
    const url = this.baseUrl + '/pascientesubicacion/' + ubicacion.ubicod;
    return firstValueFrom(this.http.get<any[]>(url));
  }

  getSignosPaciente(epipac: any){
    const url = this.baseUrl + '/signospaciente/' + epipac;
    return firstValueFrom(this.http.get<any>(url));
  }
}
