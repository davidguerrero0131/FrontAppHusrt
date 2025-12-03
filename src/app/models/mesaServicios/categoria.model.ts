// Modelo de Categoría
export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  servicio_id: number;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
  servicio?: {
    id: number;
    nombre: string;
    area_id?: number;
    area?: {
      id: number;
      nombre: string;
    };
  };
}

export interface CrearCategoriaDTO {
  nombre: string;
  descripcion?: string;
  servicio_id: number;
}

export interface ActualizarCategoriaDTO {
  nombre?: string;
  descripcion?: string;
  servicio_id?: number;
  activo?: boolean;
}
