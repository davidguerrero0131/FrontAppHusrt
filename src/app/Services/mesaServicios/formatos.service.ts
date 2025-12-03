import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Formato, CrearFormatoDTO, ActualizarFormatoDTO } from '../../models/mesaServicios/formato.model';
import { ApiResponse } from '../../models/mesaServicios/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class FormatosService {
  private apiUrl = `${environment.apiUrl}/formatos`;

  constructor(private http: HttpClient) { }

  listarPorCategoria(categoriaId: number): Observable<ApiResponse<Formato[]>> {
    return this.http.get<ApiResponse<Formato[]>>(`${this.apiUrl}/categoria/${categoriaId}`);
  }

  crear(formato: CrearFormatoDTO): Observable<ApiResponse<Formato>> {
    return this.http.post<ApiResponse<Formato>>(this.apiUrl, formato);
  }

  actualizar(id: number, formato: ActualizarFormatoDTO): Observable<ApiResponse<Formato>> {
    return this.http.put<ApiResponse<Formato>>(`${this.apiUrl}/${id}`, formato);
  }

  eliminar(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  // Método auxiliar para obtener placeholder según tipo de campo
  getPlaceholderPorTipo(tipoCampo: string): string {
    const placeholders: Record<string, string> = {
      'texto': 'Ingrese texto',
      'numero': 'Ingrese número',
      'fecha': 'Seleccione fecha',
      'lista_desplegable': 'Seleccione opción',
      'select': 'Seleccione opción',
      'area_texto': 'Ingrese texto largo',
      'textarea': 'Ingrese texto largo',
      'email': 'correo@ejemplo.com',
      'telefono': '3001234567'
    };
    return placeholders[tipoCampo] || 'Ingrese valor';
  }

  // Método auxiliar para validar valor según tipo
  validarValor(valor: string, tipoCampo: string): { valido: boolean; mensaje?: string } {
    if (!valor || valor.trim() === '') {
      return { valido: false, mensaje: 'El campo no puede estar vacío' };
    }

    switch (tipoCampo) {
      case 'numero':
        if (isNaN(Number(valor))) {
          return { valido: false, mensaje: 'Debe ingresar un número válido' };
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(valor)) {
          return { valido: false, mensaje: 'Debe ingresar un correo electrónico válido' };
        }
        break;
      case 'telefono':
        const telefonoRegex = /^[0-9]{7,10}$/;
        if (!telefonoRegex.test(valor)) {
          return { valido: false, mensaje: 'Debe ingresar un teléfono válido (7-10 dígitos)' };
        }
        break;
      case 'fecha':
        const fecha = new Date(valor);
        if (isNaN(fecha.getTime())) {
          return { valido: false, mensaje: 'Debe ingresar una fecha válida' };
        }
        break;
    }

    return { valido: true };
  }
}
