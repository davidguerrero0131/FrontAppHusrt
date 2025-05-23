import { Injectable } from '@angular/core';

import {API_URL} from '../../../../constantes'

@Injectable({
  providedIn: 'root'
})
export class MantenimientosService {

  private baseUrl: string;

  constructor() {
    this.baseUrl = API_URL;
  }
}
