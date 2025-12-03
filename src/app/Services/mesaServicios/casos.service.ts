import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Caso, CrearCasoDTO, FiltrosCasos, EstadisticasCasos, AsignarCasoDTO, RespuestaPaginadaCasos } from '../../models/mesaServicios/caso.model';
import { CasoDatosFormato, CrearCasoDatosFormatoDTO } from '../../models/mesaServicios/caso-datos-formato.model';
import { CasoLog, EstadisticasLogs } from '../../models/mesaServicios/caso-log.model';
import { ApiResponse } from '../../models/mesaServicios/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class CasosService {
  private apiUrl = `${environment.apiUrl}/casos`;

  constructor(private http: HttpClient) { }

  // Operaciones CRUD básicas
  crear(caso: CrearCasoDTO): Observable<ApiResponse<Caso>> {
    return this.http.post<ApiResponse<Caso>>(this.apiUrl, caso);
  }

  listar(filtros?: FiltrosCasos): Observable<ApiResponse<RespuestaPaginadaCasos>> {
    let params = new HttpParams();

    if (filtros) {
      Object.keys(filtros).forEach(key => {
        const value = (filtros as any)[key];
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<RespuestaPaginadaCasos>>(this.apiUrl, { params });
  }

  obtenerPorId(id: number): Observable<ApiResponse<Caso>> {
    return this.http.get<ApiResponse<Caso>>(`${this.apiUrl}/${id}`);
  }

  actualizar(id: number, datos: Partial<CrearCasoDTO>): Observable<ApiResponse<Caso>> {
    return this.http.put<ApiResponse<Caso>>(`${this.apiUrl}/${id}`, datos);
  }

  eliminar(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  // Asignación y gestión de casos
  asignar(casoId: number, datos: AsignarCasoDTO): Observable<ApiResponse<Caso>> {
    return this.http.post<ApiResponse<Caso>>(`${this.apiUrl}/${casoId}/asignar`, datos);
  }

  cambiarEstado(casoId: number, nuevoEstado: string): Observable<ApiResponse<Caso>> {
    return this.http.patch<ApiResponse<Caso>>(`${this.apiUrl}/${casoId}/estado`, {
      estado: nuevoEstado
    });
  }

  // Estadísticas
  obtenerEstadisticas(): Observable<ApiResponse<EstadisticasCasos>> {
    return this.http.get<ApiResponse<EstadisticasCasos>>(`${this.apiUrl}/estadisticas/generales`);
  }

  obtenerEstadisticasUsuario(usuarioId: number): Observable<ApiResponse<EstadisticasCasos>> {
    return this.http.get<ApiResponse<EstadisticasCasos>>(`${this.apiUrl}/estadisticas/usuario/${usuarioId}`);
  }

  // Datos de formatos dinámicos
  obtenerDatosFormatos(casoId: number): Observable<ApiResponse<CasoDatosFormato[]>> {
    return this.http.get<ApiResponse<CasoDatosFormato[]>>(`${this.apiUrl}/${casoId}/datos-formatos`);
  }

  guardarDatosFormatos(casoId: number, datos: CrearCasoDatosFormatoDTO[]): Observable<ApiResponse<CasoDatosFormato[]>> {
    return this.http.post<ApiResponse<CasoDatosFormato[]>>(`${this.apiUrl}/${casoId}/datos-formatos`, { datos });
  }

  // Logs de auditoría
  obtenerLogs(casoId: number): Observable<ApiResponse<CasoLog[]>> {
    return this.http.get<ApiResponse<CasoLog[]>>(`${this.apiUrl}/${casoId}/logs`);
  }

  obtenerEstadisticasLogs(casoId: number): Observable<ApiResponse<EstadisticasLogs>> {
    return this.http.get<ApiResponse<EstadisticasLogs>>(`${this.apiUrl}/${casoId}/logs/estadisticas`);
  }

  // Métodos auxiliares para obtener colores y etiquetas
  getEstadoColor(estado: string): string {
    const colores: Record<string, string> = {
      'nuevo': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'en_curso': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'en_seguimiento': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'cerrado': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };
    return colores[estado] || 'bg-gray-100 text-gray-800';
  }

  getEstadoTexto(estado: string): string {
    const textos: Record<string, string> = {
      'nuevo': 'Nuevo',
      'en_curso': 'En Curso',
      'en_seguimiento': 'En Seguimiento',
      'cerrado': 'Cerrado'
    };
    return textos[estado] || estado;
  }

  getPrioridadColor(prioridad: string): string {
    const colores: Record<string, string> = {
      'baja': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      'media': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'alta': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'critica': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return colores[prioridad] || 'bg-gray-100 text-gray-800';
  }

  getPrioridadTexto(prioridad: string): string {
    const textos: Record<string, string> = {
      'baja': 'Baja',
      'media': 'Media',
      'alta': 'Alta',
      'critica': 'Crítica'
    };
    return textos[prioridad] || prioridad;
  }

  getTipoColor(tipo: string): string {
    const colores: Record<string, string> = {
      'requerimiento': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'incidencia': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    };
    return colores[tipo] || 'bg-gray-100 text-gray-800';
  }

  getTipoTexto(tipo: string): string {
    const textos: Record<string, string> = {
      'requerimiento': 'Requerimiento',
      'incidencia': 'Incidencia'
    };
    return textos[tipo] || tipo;
  }
}
