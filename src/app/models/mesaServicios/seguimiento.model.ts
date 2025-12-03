import { Usuario } from './usuario.model';

export interface Seguimiento {
  id: number;
  caso_id: number;
  usuario_id: number;
  usuario_nombre: string;
  usuario_codigo: string;
  usuario_correo?: string;
  comentario: string;
  es_solucion: boolean;
  tipo: TipoSeguimiento;
  fecha_creacion: string;
  archivos?: ArchivoAdjunto[];
  Usuario?: Usuario;
}

export type TipoSeguimiento = 'seguimiento' | 'solucion';

export interface CrearSeguimientoDTO {
  caso_id: number;
  comentario: string;
  es_solucion?: boolean;
  tipo?: TipoSeguimiento;
}

export interface ArchivoAdjunto {
  id: number;
  nombre_original: string;
  nombre_archivo: string;
  ruta_archivo: string;
  tipo_mime: string;
  tamano_bytes: number;
  referencia_tipo: 'caso' | 'seguimiento';
  referencia_id: number;
  usuario_id: number;
  fecha_subida: string;
}

export interface SubirArchivoDTO {
  archivo: File;
  referencia_tipo: 'caso' | 'seguimiento';
  referencia_id: number;
}
