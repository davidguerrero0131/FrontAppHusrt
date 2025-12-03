// Modelo de Usuario Unificado - AppHUSRT Integrado
export interface Usuario {
  id: number;
  codigo: string;
  tipoId: string;
  numeroId: string;
  nombres: string;
  apellidos: string;
  nombreUsuario: string;
  email: string;
  telefono?: string;
  registroInvima?: string;
  rol?: Rol;
  rolId: number;
  area?: Area;
  areaId?: number;
  servicio?: Servicio;
  servicioId?: number;
  estado: boolean;
  ultimoAcceso?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Rol {
  id: number;
  nombre: string;
  descripcion: string;
  modulo: string;
  activo: boolean;
}

export interface Area {
  id: number;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export interface Servicio {
  id: number;
  nombre: string;
  descripcion?: string;
  areaId?: number;
  area?: Area;
  activo?: boolean;
}

export interface LoginResponse {
  token: string;
  idUser: number;
}

export interface TokenPayload {
  id: number;
  nombreUsuario: string;
  rol: string;
  rolId: number;
  areaId?: number;
  servicioId?: number;
  email: string;
  iat?: number;
  exp?: number;
}

export interface CrearUsuarioDTO {
  codigo: string;
  tipoId: string;
  numeroId: string;
  nombres: string;
  apellidos: string;
  nombreUsuario: string;
  email: string;
  contraseña: string;
  telefono?: string;
  registroInvima?: string;
  rolId: number;
  areaId?: number;
  servicioId?: number;
}

export interface ActualizarUsuarioDTO {
  codigo?: string;
  tipoId?: string;
  numeroId?: string;
  nombres?: string;
  apellidos?: string;
  nombreUsuario?: string;
  email?: string;
  telefono?: string;
  registroInvima?: string;
  rolId?: number;
  areaId?: number;
  servicioId?: number;
  estado?: boolean;
  contraseña?: string;
}

export interface CambiarContrasenaDTO {
  contrasenaActual: string;
  contrasenaNueva: string;
  confirmarContrasena: string;
}
