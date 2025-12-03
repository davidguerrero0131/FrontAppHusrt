// Modelo de Área
export interface Area {
  id: number;
  nombre: string;
  descripcion?: string;
  area_padre_id?: number;
  area_padre_nombre?: string;
  gestiona_solicitudes: boolean;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
  hijas?: Area[];
  nivel?: number; // Para vista jerárquica
  ruta_completa?: string; // Para vista jerárquica (ej: "Área Padre > Área Hija")
}

export interface CrearAreaDTO {
  nombre: string;
  descripcion?: string;
  area_padre_id?: number;
  gestiona_solicitudes?: boolean;
}

export interface ActualizarAreaDTO {
  nombre?: string;
  descripcion?: string;
  area_padre_id?: number;
  gestiona_solicitudes?: boolean;
  activo?: boolean;
}

export interface ArbolArea extends Area {
  children: ArbolArea[];
  nivel: number;
}
