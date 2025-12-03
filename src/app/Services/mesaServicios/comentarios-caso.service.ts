// Servicio de comentarios de casos (tipo chat)
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ArchivoAdjunto {
  id: number;
  nombre_original: string;
  nombre_archivo: string;
  ruta_archivo: string;
  tipo_mime: string;
  tamano_bytes: number;
  fecha_subida: string;
}

export interface ComentarioCaso {
  id: number;
  caso_id: number;
  usuario_id: number;
  comentario: string;
  fecha_creacion: string;
  usuario_nombre: string;
  usuario_codigo: string;
  perfil_nombre: string;
  archivos?: ArchivoAdjunto[];
}

export interface CrearComentarioDto {
  comentario: string;
  archivos?: File[];
}

@Injectable({
  providedIn: 'root'
})
export class ComentariosCasoService {
  private apiUrl = `${environment.apiUrl}/casos`;

  constructor(private http: HttpClient) { }

  // Listar comentarios de un caso
  listar(casoId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${casoId}/comentarios`);
  }

  // Crear un comentario en un caso
  crear(casoId: number, datos: CrearComentarioDto): Observable<any> {
    const formData = new FormData();
    formData.append('comentario', datos.comentario);

    // Agregar archivos si existen
    if (datos.archivos && datos.archivos.length > 0) {
      datos.archivos.forEach((archivo) => {
        formData.append('archivos', archivo, archivo.name);
      });
    }

    return this.http.post(`${this.apiUrl}/${casoId}/comentarios`, formData);
  }

  // Eliminar un comentario
  eliminar(casoId: number, comentarioId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${casoId}/comentarios/${comentarioId}`);
  }

  // Formatear tamaño de archivo para mostrar
  formatearTamano(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  // Verificar si un archivo es imagen
  esImagen(tipoMime: string): boolean {
    return tipoMime.startsWith('image/');
  }
}
