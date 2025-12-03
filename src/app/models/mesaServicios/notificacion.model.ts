// Modelo de Notificación
export interface Notificacion {
  id: number;
  usuario_id: number;
  caso_id: number;
  caso_numero?: string;
  tipo: TipoNotificacion;
  mensaje: string;
  leida: boolean;
  fecha_creacion: string;
  fecha_lectura?: string;
}

export type TipoNotificacion = 'asignacion' | 'seguimiento' | 'cierre' | 'comentario';

export interface ContadorNotificaciones {
  no_leidas: number;
  total: number;
}
