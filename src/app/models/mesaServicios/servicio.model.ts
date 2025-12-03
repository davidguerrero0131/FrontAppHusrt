// Modelo de Servicio Institucional
export interface Servicio {
  id: number;
  nombre: string;
  descripcion?: string;
  areaId: number;
  activo: boolean;
  orden: number;
  fecha_creacion: string;
  area?: {
    id: number;
    nombre: string;
  };
}

export interface CrearServicioDTO {
  nombre: string;
  descripcion?: string;
  areaId: number;
  orden?: number;
}

export interface ActualizarServicioDTO {
  nombre?: string;
  descripcion?: string;
  areaId?: number;
  orden?: number;
  activo?: boolean;
}

export interface ReordenarServiciosDTO {
  servicios: { id: number; orden: number }[];
}
