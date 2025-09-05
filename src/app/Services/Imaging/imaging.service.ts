import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { API_ENTERPRICE_URL } from '../../constantes';

@Injectable({
  providedIn: 'root'
})
export class ImagingService {

<<<<<<< Updated upstream
  baseUrl = 'http://192.168.10.14:3003';

=======
>>>>>>> Stashed changes
  constructor(private http: HttpClient) { }

  getAllcites(): Observable<any>{
    const url = API_ENTERPRICE_URL + '/citesCE';
    return this.http.get<any[]>(url, {observe: 'response'})
  }

  getCitesDate(body: any): Observable<any>{
    const url = API_ENTERPRICE_URL + '/citesCEFecha';
    return this.http.post<any[]>(url,body,{observe: 'response'})
  }
}
