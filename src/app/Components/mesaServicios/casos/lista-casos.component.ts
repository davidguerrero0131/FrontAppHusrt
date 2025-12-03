import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CasosService } from '../../../Services/mesaServicios/casos.service';
import { AreasService } from '../../../Services/mesaServicios/areas.service';
import { AuthService } from '../../../Services/mesaServicios/auth.service';
import { Caso, EstadoCaso, TipoCaso, Prioridad } from '../../../models/mesaServicios/caso.model';
import { Area } from '../../../models/mesaServicios/area.model';
import { AsignarCasoModalComponent } from './asignar-caso-modal.component';
import { fadeInAnimation, listAnimation, modalAnimation, scaleInAnimation } from '../../../animations/animations';

@Component({
  selector: 'app-lista-casos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AsignarCasoModalComponent],
  templateUrl: './lista-casos.component.html',
  animations: [fadeInAnimation, listAnimation, modalAnimation, scaleInAnimation]
})
export class ListaCasosComponent implements OnInit {
  casos: Caso[] = [];
  areas: Area[] = [];
  cargando = true;
  error = '';
  usuarioActual: any = null;
  mostrarModalAsignar = false;
  casoSeleccionado: Caso | null = null;

  filtros = {
    estado: '',
    tipo: '',
    area_id: '',
    prioridad: '',
    busqueda: ''
  };

  estados: EstadoCaso[] = ['nuevo', 'en_curso', 'en_seguimiento', 'cerrado'];
  tipos: TipoCaso[] = ['requerimiento', 'incidencia'];
  prioridades: Prioridad[] = ['baja', 'media', 'alta', 'critica'];

  constructor(
    private casosService: CasosService,
    private areasService: AreasService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuarioActual = this.authService.getUsuarioActual();
    this.cargarAreas();
    this.cargarCasos();
  }

  cargarAreas(): void {
    this.areasService.obtenerGestionSolicitudes().subscribe({
      next: (response) => {
        if (response.exito && response.datos) {
          this.areas = response.datos;
        }
      },
      error: (error) => console.error('Error al cargar áreas:', error)
    });
  }

  cargarCasos(): void {
    this.cargando = true;
    this.error = '';

    const filtrosAPI: any = {};
    if (this.filtros.estado) filtrosAPI.estado = this.filtros.estado;
    if (this.filtros.tipo) filtrosAPI.tipo = this.filtros.tipo;
    if (this.filtros.area_id) filtrosAPI.area_id = parseInt(this.filtros.area_id);
    if (this.filtros.prioridad) filtrosAPI.prioridad = this.filtros.prioridad;
    if (this.filtros.busqueda) filtrosAPI.busqueda = this.filtros.busqueda;

    // Si es usuario regular, solo ver sus casos
    const rol = this.usuarioActual?.perfil_nombre || this.usuarioActual?.rol_nombre;
    if (rol === 'MESASERVICIOSUSUARIO') {
      filtrosAPI.usuario_solicitante_id = this.usuarioActual.id;
    }

    this.casosService.listar(filtrosAPI).subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);
        if (response.exito && response.datos) {
          // El backend devuelve datos con la estructura RespuestaPaginadaCasos
          this.casos = response.datos.casos;
          console.log('Casos asignados:', this.casos);
        }
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los casos';
        this.cargando = false;
        console.error('Error al cargar casos:', err);
      }
    });
  }

  aplicarFiltros(): void {
    this.cargarCasos();
  }

  limpiarFiltros(): void {
    this.filtros = {
      estado: '',
      tipo: '',
      area_id: '',
      prioridad: '',
      busqueda: ''
    };
    this.cargarCasos();
  }

  verDetalle(caso: Caso): void {
    this.router.navigate(['/mesaservicios/casos', caso.id]);
  }

  crearNuevoCaso(): void {
    this.router.navigate(['/mesaservicios/casos/nuevo']);
  }

  getEstadoColor(estado: string): string {
    const colores: { [key: string]: string } = {
      'nuevo': 'badge-nuevo',
      'en_curso': 'badge-en-curso',
      'en_seguimiento': 'badge-en-seguimiento',
      'cerrado': 'badge-cerrado'
    };
    return colores[estado] || 'bg-gray-100 text-gray-800';
  }

  getPrioridadColor(prioridad: string): string {
    const colores: { [key: string]: string } = {
      'baja': 'text-green-600',
      'media': 'text-yellow-600',
      'alta': 'text-orange-600',
      'critica': 'text-red-600'
    };
    return colores[prioridad] || 'text-gray-600';
  }

  formatearEstado(estado: string): string {
    const estados: { [key: string]: string } = {
      'nuevo': 'Nuevo',
      'en_curso': 'En Curso',
      'en_seguimiento': 'En Seguimiento',
      'cerrado': 'Cerrado'
    };
    return estados[estado] || estado;
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Obtener mensaje informativo según el perfil del usuario
  getMensajeVisibilidad(): string {
    if (!this.usuarioActual) return '';

    const rol = this.usuarioActual.perfil_nombre || this.usuarioActual.rol_nombre;

    if (rol === 'SUPERADMIN' || rol === 'MESASERVICIOSADMIN') {
      return 'Como Administrador, puedes ver todos los casos del sistema.';
    } else if (rol === 'MESASERVICIOSUSUARIO') {
      return 'Estás viendo únicamente los casos que has creado.';
    } else if (rol === 'MESASERVICIOSSOPORTE') {
      return 'Estás viendo casos asignados a ti y casos nuevos.';
    }

    return '';
  }

  // Obtener mensaje cuando no hay casos según el perfil
  getMensajeSinCasos(): string {
    if (!this.usuarioActual) return 'No se encontraron casos.';

    const rol = this.usuarioActual.perfil_nombre || this.usuarioActual.rol_nombre;

    if (rol === 'SUPERADMIN' || rol === 'MESASERVICIOSADMIN') {
      return 'No hay casos en el sistema. Los casos aparecerán aquí cuando los usuarios los creen.';
    } else if (rol === 'MESASERVICIOSUSUARIO') {
      return 'Aún no has creado ningún caso. Crea tu primer caso para empezar.';
    } else if (rol === 'MESASERVICIOSSOPORTE') {
      return 'No hay casos disponibles. Verás aquí los casos asignados a ti.';
    }

    return 'No se encontraron casos.';
  }

  // Verificar si debe mostrar el indicador de visibilidad
  mostrarIndicadorVisibilidad(): boolean {
    if (!this.usuarioActual) return false;
    const rol = this.usuarioActual.perfil_nombre || this.usuarioActual.rol_nombre;
    return rol !== 'SUPERADMIN' && rol !== 'MESASERVICIOSADMIN';
  }

  // Abrir modal de asignación
  abrirModalAsignar(caso: Caso, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.casoSeleccionado = caso;
    this.mostrarModalAsignar = true;
  }

  // Cerrar modal de asignación
  cerrarModalAsignar(): void {
    this.mostrarModalAsignar = false;
    this.casoSeleccionado = null;
  }

  // Manejar caso asignado
  onCasoAsignado(casoActualizado: Caso): void {
    // Actualizar el caso en la lista
    const index = this.casos.findIndex(c => c.id === casoActualizado.id);
    if (index !== -1) {
      this.casos[index] = casoActualizado;
    }
  }

  // Verificar si el usuario puede asignar casos
  puedeAsignarCasos(): boolean {
    return this.authService.esAdministrador() || this.authService.esTecnico();
  }
}

