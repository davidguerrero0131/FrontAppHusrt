import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ImagingService {

  baseUrl = 'http://192.168.10.14:3003';

  constructor(private http: HttpClient) { }

  getAllcites(): Observable<any>{
    const url = this.baseUrl + '/citesCE';
    return this.http.get<any[]>(url, {observe: 'response'})
  }

  getCitesDate(body: any): Observable<any>{
    const url = this.baseUrl + '/citesCEFecha';
    return this.http.post<any[]>(url,body,{observe: 'response'})
  }
}
