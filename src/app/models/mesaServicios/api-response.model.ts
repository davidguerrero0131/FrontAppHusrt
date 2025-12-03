// Modelo de respuestas de la API
export interface ApiResponse<T = any> {
  exito: boolean;
  mensaje?: string;
  datos?: T;
  errores?: any[];
  error?: string;
  total?: number;
  pagina?: number;
  porPagina?: number;
}

export interface LoginResponse {
  token: string;
  usuario: {
    id: number;
    codigo: string;
    nombre_completo: string;
    correo: string;
    perfil_nombre: string;
    area_id?: number;
    area_nombre?: string;
    permisos: any;
  };
}
