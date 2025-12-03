// Servicio de autenticación
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario } from '../../models/mesaServicios/usuario.model';

export interface LoginResponse {
  exito: boolean;
  mensaje: string;
  datos: {
    token: string;
    usuario: Usuario;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private usuarioActualSubject = new BehaviorSubject<Usuario | null>(null);
  public usuarioActual$ = this.usuarioActualSubject.asObservable();

  constructor(private http: HttpClient) {
    // Cargar usuario desde localStorage si existe
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.usuarioActualSubject.next(JSON.parse(usuarioGuardado));
    }
  }

  login(codigo: string, contrasena: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/api/auth/login`, {
      email: codigo,
      password: contrasena
    }).pipe(
      tap(response => {
        // Guardar token y usuario usando el mismo nombre que AppHUSRT ('utoken')
        if (response.exito && response.datos) {
          localStorage.setItem('utoken', response.datos.token);
          localStorage.setItem('usuario', JSON.stringify(response.datos.usuario));
          this.usuarioActualSubject.next(response.datos.usuario);
        }
      })
    );
  }

  logout(): void {
    // Limpiar datos locales
    localStorage.removeItem('utoken');
    localStorage.removeItem('usuario');
    this.usuarioActualSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('utoken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUsuarioActual(): Usuario | null {
    return this.usuarioActualSubject.value;
  }

  esAdministrador(): boolean {
    // Intentar obtener el usuario del BehaviorSubject primero
    let usuario = this.usuarioActualSubject.value;

    // Si no hay usuario en el subject, intentar cargarlo desde localStorage
    if (!usuario) {
      const usuarioGuardado = localStorage.getItem('usuario');
      if (usuarioGuardado) {
        usuario = JSON.parse(usuarioGuardado);
        this.usuarioActualSubject.next(usuario);
      }
    }

    const rol = usuario?.rol?.nombre || usuario?.rol_nombre || usuario?.perfil_nombre;
    return rol === 'SUPERADMIN' || rol === 'MESASERVICIOSADMIN';
  }

  esTecnico(): boolean {
    // Intentar obtener el usuario del BehaviorSubject primero
    let usuario = this.usuarioActualSubject.value;

    // Si no hay usuario en el subject, intentar cargarlo desde localStorage
    if (!usuario) {
      const usuarioGuardado = localStorage.getItem('usuario');
      if (usuarioGuardado) {
        usuario = JSON.parse(usuarioGuardado);
        this.usuarioActualSubject.next(usuario);
      }
    }

    const rol = usuario?.rol?.nombre || usuario?.rol_nombre || usuario?.perfil_nombre;
    return rol === 'SUPERADMIN' || rol === 'MESASERVICIOSADMIN' || rol === 'MESASERVICIOSSOPORTE';
  }

  esSoporte(): boolean {
    // Intentar obtener el usuario del BehaviorSubject primero
    let usuario = this.usuarioActualSubject.value;

    // Si no hay usuario en el subject, intentar cargarlo desde localStorage
    if (!usuario) {
      const usuarioGuardado = localStorage.getItem('usuario');
      if (usuarioGuardado) {
        usuario = JSON.parse(usuarioGuardado);
        this.usuarioActualSubject.next(usuario);
      }
    }

    const rol = usuario?.rol?.nombre || usuario?.rol_nombre || usuario?.perfil_nombre;
    return rol === 'SUPERADMIN' || rol === 'MESASERVICIOSADMIN' || rol === 'MESASERVICIOSSOPORTE';
  }

  esUsuarioFinal(): boolean {
    // Intentar obtener el usuario del BehaviorSubject primero
    let usuario = this.usuarioActualSubject.value;

    // Si no hay usuario en el subject, intentar cargarlo desde localStorage
    if (!usuario) {
      const usuarioGuardado = localStorage.getItem('usuario');
      if (usuarioGuardado) {
        usuario = JSON.parse(usuarioGuardado);
        this.usuarioActualSubject.next(usuario);
      }
    }

    const rol = usuario?.rol?.nombre || usuario?.rol_nombre || usuario?.perfil_nombre;
    return rol === 'MESASERVICIOSUSUARIO';
  }
}
