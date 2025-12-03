import { Usuario } from './usuario.model';

// Modelo de log de auditoría de casos
export interface CasoLog {
  id: number;
  caso_id: number;
  usuario_id: number;
  accion: string;
  estado_anterior?: string;
  estado_nuevo?: string;
  detalle?: string;
  descripcion?: string;
  datos_anteriores?: string;
  datos_nuevos?: string;
  archivos_adjuntos?: any[];
  fecha_creacion: string;
  fecha_accion?: string; // Alias para fecha_creacion
  Usuario?: Usuario;
  usuario?: Usuario;
}

export interface FiltrosLogs {
  accion?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  limite?: number;
  offset?: number;
}

export interface EstadisticasLogs {
  total_acciones: number;
  acciones_por_tipo: { [key: string]: number };
  usuarios_activos: number;
  promedio_acciones_por_dia: number;
}
