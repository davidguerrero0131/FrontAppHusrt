// Modelo de Caso
export interface Caso {
  id: number;
  numero_caso: string;
  tipo: TipoCaso;
  area_id: number;
  area?: {
    id: number;
    nombre: string;
  };
  area_nombre?: string;
  categoria_id: number;
  categoria?: {
    id: number;
    nombre: string;
  };
  categoria_nombre?: string;
  solicitante_id: number;
  solicitante?: {
    id: number;
    codigo: string;
    nombre_completo: string;
    correo: string;
  };
  usuario_solicitante_id?: number;
  solicitante_nombre?: string;
  solicitante_codigo?: string;
  solicitante_correo?: string;
  promesa_valor?: PromesaValor;
  servicio_id: number;
  servicio?: {
    id: number;
    nombre: string;
  };
  servicio_nombre?: string;
  ubicacion_especifica?: string;
  descripcion: string;
  titulo?: string;
  estado: EstadoCaso;
  prioridad: Prioridad;
  asignado_a_id?: number | null;
  asignadoA?: {
    id: number;
    codigo: string;
    nombre_completo: string;
    correo: string;
  } | null;
  asignado_a_nombre?: string;
  solucion?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  fecha_asignacion?: string;
  fecha_cierre?: string;
  fecha_estimada_resolucion?: string;
  total_asignados?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type TipoCaso = 'requerimiento' | 'incidencia';

export type EstadoCaso = 'nuevo' | 'asignado' | 'en_curso' | 'en_seguimiento' | 'cerrado';

export type Prioridad = 'baja' | 'media' | 'alta' | 'critica';

export type PromesaValor = 'SEGURO' | 'UNIVERSITARIO' | 'MEJORADO' | 'EFICIENTE' | 'RESPONSABLE' | 'CALIDO' | 'EXCELENTE';

export interface CrearCasoDTO {
  tipo: TipoCaso;
  area_id: number;
  categoria_id: number;
  promesa_valor?: PromesaValor;
  servicio_id: number;
  ubicacion_especifica?: string;
  descripcion: string;
  prioridad?: Prioridad;
  datos_formatos?: DatoFormato[];
}

export interface DatoFormato {
  formato_id: number;
  valor: string;
}

export interface AsignarCasoDTO {
  asignado_a_id: number | null;
}

export interface EstadisticasCasos {
  total: number;
  nuevos: number;
  asignados: number;
  en_curso: number;
  en_seguimiento: number;
  cerrados: number;
  requerimientos: number;
  incidencias: number;
  porArea?: EstadisticaPorArea[];
  tiempoPromedioResolucion?: number; // en horas
  tiempoPromedioAsignacion?: number; // en horas
}

export interface EstadisticaPorArea {
  area_id: number;
  area_nombre: string;
  total: number;
  nuevos: number;
  en_curso: number;
  cerrados: number;
}

export interface FiltrosCasos {
  estado?: EstadoCaso;
  tipo?: TipoCaso;
  area_id?: number;
  categoria_id?: number;
  usuario_solicitante_id?: number;
  prioridad?: Prioridad;
  busqueda?: string;
  limite?: number;
  offset?: number;
}

export interface RespuestaPaginadaCasos {
  casos: Caso[];
  total: number;
  pagina: number;
  limite: number;
}
