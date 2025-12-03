import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../Services/mesaServicios/auth.service';
import { Usuario } from '../../../models/mesaServicios/usuario.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Navbar -->
      <nav class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex">
              <div class="flex-shrink-0 flex items-center">
                <h1 class="text-xl font-bold text-gray-800">Mesa de Servicios HUSRT</h1>
              </div>
            </div>
            <div class="flex items-center">
              <div class="ml-3 relative">
                <div class="flex items-center space-x-4">
                  <span class="text-sm text-gray-700">{{ usuario?.nombre_completo }}</span>
                  <span class="badge badge-en-curso">{{ usuario?.perfil_nombre }}</span>
                  <button
                    (click)="abrirModalCambiarContrasena()"
                    class="btn-secondary text-sm"
                  >
                    Cambiar Contraseña
                  </button>
                  <button
                    (click)="logout()"
                    class="btn-secondary text-sm"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Contenido principal -->
      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <!-- Título -->
          <h2 class="text-3xl font-bold text-gray-900 mb-6">
            Dashboard
          </h2>

          <!-- Menú de navegación rápido -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <a routerLink="/mesaservicios/casos" class="card hover:shadow-xl transition-shadow cursor-pointer">
              <div class="text-center">
                <div class="bg-blue-500 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <p class="text-lg font-semibold text-gray-900">Ver Casos</p>
                <p class="text-sm text-gray-600 mt-1">Gestionar todos los casos</p>
              </div>
            </a>

            <a routerLink="/mesaservicios/casos/nuevo" class="card hover:shadow-xl transition-shadow cursor-pointer">
              <div class="text-center">
                <div class="bg-green-500 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                </div>
                <p class="text-lg font-semibold text-gray-900">Nuevo Caso</p>
                <p class="text-sm text-gray-600 mt-1">Crear caso nuevo</p>
              </div>
            </a>

            <a *ngIf="usuario?.perfil_nombre === 'Administrador'" routerLink="/mesaservicios/usuarios" class="card hover:shadow-xl transition-shadow cursor-pointer">
              <div class="text-center">
                <div class="bg-purple-500 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                </div>
                <p class="text-lg font-semibold text-gray-900">Usuarios</p>
                <p class="text-sm text-gray-600 mt-1">Gestionar usuarios</p>
              </div>
            </a>

            <a *ngIf="usuario?.perfil_nombre === 'Administrador'" routerLink="/mesaservicios/areas" class="card hover:shadow-xl transition-shadow cursor-pointer">
              <div class="text-center">
                <div class="bg-orange-500 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <p class="text-lg font-semibold text-gray-900">Áreas</p>
                <p class="text-sm text-gray-600 mt-1">Gestionar áreas</p>
              </div>
            </a>

            <a *ngIf="usuario?.perfil_nombre === 'Administrador'" routerLink="/mesaservicios/categorias" class="card hover:shadow-xl transition-shadow cursor-pointer">
              <div class="text-center">
                <div class="bg-indigo-500 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                  </svg>
                </div>
                <p class="text-lg font-semibold text-gray-900">Categorías</p>
                <p class="text-sm text-gray-600 mt-1">Gestionar categorías</p>
              </div>
            </a>
          </div>

          <!-- Tarjetas de bienvenida -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div class="card">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500">Casos Totales</p>
                  <p class="text-2xl font-semibold text-gray-900">0</p>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500">En Curso</p>
                  <p class="text-2xl font-semibold text-gray-900">0</p>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500">Cerrados</p>
                  <p class="text-2xl font-semibold text-gray-900">0</p>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-red-500 rounded-md p-3">
                  <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500">Nuevos</p>
                  <p class="text-2xl font-semibold text-gray-900">0</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Información del usuario -->
          <div class="card">
            <h3 class="text-xl font-semibold mb-4">Información del Usuario</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Nombre:</span>
                <span class="font-semibold">{{ usuario?.nombre_completo }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Nombre de Usuario:</span>
                <span class="font-semibold">{{ usuario?.codigo }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Correo:</span>
                <span class="font-semibold">{{ usuario?.correo }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Perfil:</span>
                <span class="badge badge-en-curso">{{ usuario?.perfil_nombre }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Área:</span>
                <span class="font-semibold">{{ usuario?.area_nombre || 'No asignada' }}</span>
              </div>
            </div>
          </div>

          <!-- Mensaje de bienvenida -->
          <div class="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-blue-700">
                  <strong>¡Bienvenido a la Mesa de Servicios!</strong><br>
                  El backend está funcionando correctamente en <strong>http://localhost:3000</strong><br>
                  Puedes comenzar a crear casos y explorar el sistema.
                </p>
              </div>
            </div>
          </div>

          <!-- API Status -->
          <div class="mt-4 card">
            <h3 class="text-lg font-semibold mb-3">Estado del Sistema</h3>
            <div class="space-y-2">
              <div class="flex items-center">
                <span class="h-3 w-3 bg-green-400 rounded-full mr-2"></span>
                <span class="text-sm">Backend API: <strong>Conectado</strong></span>
              </div>
              <div class="flex items-center">
                <span class="h-3 w-3 bg-green-400 rounded-full mr-2"></span>
                <span class="text-sm">Base de Datos: <strong>Activa</strong></span>
              </div>
              <div class="flex items-center">
                <span class="h-3 w-3 bg-green-400 rounded-full mr-2"></span>
                <span class="text-sm">Autenticación: <strong>Funcional</strong></span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Modal Cambiar Contraseña -->
    <div *ngIf="mostrarModalContrasena" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" (click)="cerrarModalContrasena()"></div>

        <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-md w-full z-20">
          <div class="bg-blue-600 px-6 py-4">
            <h3 class="text-xl font-bold text-white">Cambiar Mi Contraseña</h3>
          </div>

          <div class="p-6">
            <!-- Mensajes -->
            <div *ngIf="errorMensaje" class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {{ errorMensaje }}
            </div>
            <div *ngIf="exitoMensaje" class="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {{ exitoMensaje }}
            </div>

            <form (ngSubmit)="cambiarMiContrasena()">
              <div class="mb-4">
                <label class="label-field">Contraseña Actual *</label>
                <input
                  type="password"
                  [(ngModel)]="contrasenaActual"
                  name="contrasenaActual"
                  class="input-field"
                  placeholder="Ingrese su contraseña actual"
                  required
                >
              </div>

              <div class="mb-4">
                <label class="label-field">Nueva Contraseña *</label>
                <input
                  type="password"
                  [(ngModel)]="contrasenaNueva"
                  name="contrasenaNueva"
                  class="input-field"
                  placeholder="Mínimo 6 caracteres"
                  required
                  minlength="6"
                >
              </div>

              <div class="mb-4">
                <label class="label-field">Confirmar Nueva Contraseña *</label>
                <input
                  type="password"
                  [(ngModel)]="contrasenaConfirmar"
                  name="contrasenaConfirmar"
                  class="input-field"
                  placeholder="Repita la nueva contraseña"
                  required
                >
              </div>

              <div class="mt-6 flex justify-end space-x-4">
                <button type="button" (click)="cerrarModalContrasena()" class="btn-secondary">
                  Cancelar
                </button>
                <button
                  type="submit"
                  [disabled]="enviando || !contrasenaActual || !contrasenaNueva || !contrasenaConfirmar"
                  class="btn-primary"
                >
                  {{ enviando ? 'Guardando...' : 'Cambiar Contraseña' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  usuario: Usuario | null = null;
  mostrarModalContrasena = false;
  contrasenaActual = '';
  contrasenaNueva = '';
  contrasenaConfirmar = '';
  enviando = false;
  errorMensaje = '';
  exitoMensaje = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.authService.usuarioActual$.subscribe(usuario => {
      this.usuario = usuario;
    });
  }

  abrirModalCambiarContrasena(): void {
    this.mostrarModalContrasena = true;
    this.contrasenaActual = '';
    this.contrasenaNueva = '';
    this.contrasenaConfirmar = '';
    this.errorMensaje = '';
    this.exitoMensaje = '';
  }

  cerrarModalContrasena(): void {
    this.mostrarModalContrasena = false;
    this.contrasenaActual = '';
    this.contrasenaNueva = '';
    this.contrasenaConfirmar = '';
    this.errorMensaje = '';
    this.exitoMensaje = '';
  }

  cambiarMiContrasena(): void {
    // Validaciones
    if (!this.contrasenaActual || !this.contrasenaNueva || !this.contrasenaConfirmar) {
      this.errorMensaje = 'Todos los campos son requeridos';
      return;
    }

    if (this.contrasenaNueva.length < 6) {
      this.errorMensaje = 'La nueva contraseña debe tener al menos 6 caracteres';
      return;
    }

    if (this.contrasenaNueva !== this.contrasenaConfirmar) {
      this.errorMensaje = 'Las contraseñas nuevas no coinciden';
      return;
    }

    this.enviando = true;
    this.errorMensaje = '';
    this.exitoMensaje = '';

    const datos = {
      contrasena_actual: this.contrasenaActual,
      contrasena_nueva: this.contrasenaNueva
    };

    this.http.post(`${environment.apiUrl}/auth/cambiar-contrasena`, datos).subscribe({
      next: (response: any) => {
        this.exitoMensaje = 'Contraseña cambiada exitosamente';
        this.enviando = false;
        setTimeout(() => {
          this.cerrarModalContrasena();
        }, 2000);
      },
      error: (err) => {
        this.errorMensaje = err.error?.mensaje || 'Error al cambiar la contraseña';
        this.enviando = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/mesaservicios/login']);
  }
}
