// Modelo de Formato (campos personalizados)
export interface Formato {
  id: number;
  categoria_id: number;
  nombre_campo: string;
  etiqueta?: string; // Alias para nombre_campo en el template
  tipo_campo: TipoCampo;
  opciones_lista?: string[];
  opciones?: string[]; // Alias para opciones_lista en el template
  placeholder?: string;
  obligatorio: boolean;
  orden: number;
  solo_requerimiento: boolean;
  activo: boolean;
  fecha_creacion: string;
}

export type TipoCampo = 'texto' | 'numero' | 'fecha' | 'lista_desplegable' | 'area_texto' | 'email' | 'telefono' | 'textarea' | 'select';

export interface CrearFormatoDTO {
  categoria_id: number;
  nombre_campo: string;
  tipo_campo: TipoCampo;
  opciones_lista?: string[];
  obligatorio: boolean;
  orden?: number;
  solo_requerimiento?: boolean;
}

export interface ActualizarFormatoDTO {
  nombre_campo?: string;
  tipo_campo?: TipoCampo;
  opciones_lista?: string[];
  obligatorio?: boolean;
  orden?: number;
  solo_requerimiento?: boolean;
  activo?: boolean;
}

export interface Formulario {
  id: number;
  area_id: number;
  tipo_solicitud: 'requerimiento' | 'incidencia' | 'ambos';
  incluir_promesa_valor: boolean;
  campo_ubicacion_especifica_obligatorio: boolean;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
}
