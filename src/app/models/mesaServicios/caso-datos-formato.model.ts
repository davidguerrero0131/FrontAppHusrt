import { Formato } from './formato.model';

// Modelo de datos dinámicos de formato para un caso
export interface CasoDatosFormato {
  id: number;
  caso_id: number;
  formato_id: number;
  valor: string;
  fecha_creacion?: string;
  formato?: Formato;
  Formato?: Formato; // Relación con Sequelize (con mayúscula)
}

export interface CrearCasoDatosFormatoDTO {
  formato_id: number;
  valor: string;
}

export interface ActualizarCasoDatosFormatoDTO {
  valor: string;
}
