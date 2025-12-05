// Modelo de Usuario - Adaptado a AppHUSRT
export interface Usuario {
  id: number;
  codigo: string;
  numeroId: string;
  nombres: string;
  apellidos: string;
  nombre_completo: string; // Campo virtual calculado en backend
  nombreUsuario: string;
  email: string;
  correo: string; // Campo virtual alias de email
  telefono?: string;
  rolId: number;
  rol?: {
    id: number;
    nombre: string;
    descripcion?: string;
  };
  rol_nombre?: string; // Para compatibilidad con el backend
  perfil_nombre?: string; // Alias de rol_nombre para compatibilidad
  areaId?: number;
  area?: {
    id: number;
    nombre: string;
  };
  servicioId?: number;
  servicio?: {
    id: number;
    nombre: string;
  };
  estado: boolean;
  activo?: boolean; // Alias de estado
  createdAt?: string;
  updatedAt?: string;
  ultimoAcceso?: string;
  permisos?: Permisos;
}

export interface Permisos {
  crear_casos: boolean;
  ver_mis_casos: boolean;
  ver_casos_area?: boolean;
  ver_todos_casos?: boolean;
  comentar_mis_casos?: boolean;
  comentar_casos_asignados?: boolean;
  comentar_todos_casos?: boolean;
  asignar_casos?: boolean;
  autoasignarse?: boolean;
  cerrar_casos?: boolean;
  administrar_usuarios?: boolean;
  administrar_areas?: boolean;
  administrar_categorias?: boolean;
  administrar_formatos?: boolean;
  ver_logs?: boolean;
  administrar_configuracion?: boolean;
}

export interface Perfil {
  id: number;
  nombre: string;
  descripcion: string;
  permisos?: Permisos;
  fecha_creacion?: string;
}

// Alias de Perfil para Rol
export interface Rol {
  id: number;
  nombre: string;
  descripcion: string;
  modulo?: string;
  activo?: boolean;
}

export interface CrearUsuarioDTO {
  codigo?: string;
  tipoId?: string;
  contraseña: string;
  email: string;
  numeroId: string;
  nombres: string;
  apellidos: string;
  nombreUsuario: string;
  telefono?: string;
  rolId: number;
  areaId?: number;
  servicioId?: number;
}

export interface ActualizarUsuarioDTO {
  codigo?: string;
  email?: string;
  numeroId?: string;
  nombres?: string;
  apellidos?: string;
  nombreUsuario?: string;
  telefono?: string;
  rolId?: number;
  areaId?: number;
  servicioId?: number;
  estado?: boolean;
  activo?: boolean; // Alias de estado para compatibilidad
  contraseña?: string; // Para cambio de contraseña
  contrasena?: string; // Alias de contraseña para compatibilidad
}

export interface CambiarContrasenaDTO {
  contrasenaActual: string;
  contrasenaNueva: string;
  confirmarContrasena: string;
}
