import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CasosService } from '../../../Services/mesaServicios/casos.service';
import { SeguimientosService } from '../../../Services/mesaServicios/seguimientos.service';
import { UsuariosService } from '../../../Services/mesaServicios/usuarios.service';
import { AuthService } from '../../../Services/mesaServicios/auth.service';
import { Caso } from '../../../models/mesaServicios/caso.model';
import { Seguimiento, CrearSeguimientoDTO } from '../../../models/mesaServicios/seguimiento.model';
import { Usuario } from '../../../models/mesaServicios/usuario.model';
import { CasoLog } from '../../../models/mesaServicios/caso-log.model';
import { CasoDatosFormato } from '../../../models/mesaServicios/caso-datos-formato.model';
import { AsignarCasoModalComponent } from './asignar-caso-modal.component';

@Component({
  selector: 'app-detalle-caso',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, AsignarCasoModalComponent],
  templateUrl: './detalle-caso.component.html'
})
export class DetalleCasoComponent implements OnInit {
  caso: Caso | null = null;
  seguimientos: Seguimiento[] = [];
  logs: CasoLog[] = [];
  datosFormatos: CasoDatosFormato[] = [];
  timelineCombinado: any[] = []; // Timeline que combina logs y seguimientos
  cargando = false;
  errorMensaje = '';
  exitoMensaje = '';
  casoId = 0;
  usuarioActual: any;
  mostrarModalAsignar = false;

  // Form data
  nuevoSeguimiento = '';
  enviandoSeguimiento = false;
  solucionCierre = '';
  cerrandoCaso = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public casosService: CasosService,
    private seguimientosService: SeguimientosService,
    private usuariosService: UsuariosService,
    private authService: AuthService
  ) {
    this.usuarioActual = this.authService.getUsuarioActual();
  }

  ngOnInit(): void {
    this.casoId = parseInt(this.route.snapshot.params['id']);
    this.cargarCaso();
    this.cargarSeguimientos();
    this.cargarLogs();
    this.cargarDatosFormatos();
  }

  cargarCaso(): void {
    this.cargando = true;
    this.errorMensaje = '';

    this.casosService.obtenerPorId(this.casoId).subscribe({
      next: (response) => {
        if (response.exito && response.datos) {
          this.caso = response.datos;
        }
        this.cargando = false;
      },
      error: () => {
        this.errorMensaje = 'Error al cargar el caso';
        this.cargando = false;
      }
    });
  }

  cargarSeguimientos(): void {
    this.seguimientosService.listarPorCaso(this.casoId).subscribe({
      next: (response) => {
        if (response.exito && response.datos) {
          this.seguimientos = response.datos;
          this.combinarTimeline();
        }
      },
      error: () => {}
    });
  }

  cargarLogs(): void {
    this.casosService.obtenerLogs(this.casoId).subscribe({
      next: (response) => {
        if (response.exito && response.datos) {
          this.logs = response.datos;
          this.combinarTimeline();
        }
      },
      error: () => {}
    });
  }

  cargarDatosFormatos(): void {
    this.casosService.obtenerDatosFormatos(this.casoId).subscribe({
      next: (response) => {
        if (response.exito && response.datos) {
          this.datosFormatos = response.datos;
        }
      },
      error: () => {}
    });
  }

  combinarTimeline(): void {
    const timeline: any[] = [];

    this.logs.forEach(log => {
      timeline.push({
        tipo: 'log',
        fecha: log.fecha_accion || log.fecha_creacion,
        accion: log.accion,
        descripcion: log.descripcion || log.detalle,
        usuario: log.Usuario?.nombre_completo || log.usuario?.nombre_completo || 'Sistema',
        datos_anteriores: log.datos_anteriores || log.estado_anterior,
        datos_nuevos: log.datos_nuevos || log.estado_nuevo
      });
    });

    this.seguimientos.forEach(seg => {
      timeline.push({
        tipo: seg.tipo || 'seguimiento',
        fecha: seg.fecha_creacion,
        comentario: seg.comentario,
        usuario: seg.Usuario?.nombre_completo || seg.usuario_nombre || 'Usuario',
        es_solucion: seg.es_solucion
      });
    });

    this.timelineCombinado = timeline.sort((a, b) => {
      return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
    });
  }


  puedeAgregarSeguimiento(): boolean {
    return true;
  }

  estaAsignadoAMi(): boolean {
    if (!this.caso) return false;
    const usuarioActual = this.authService.getUsuarioActual();
    return this.caso.asignado_a_id === usuarioActual?.id;
  }

  puedeCerrar(): boolean {
    if (this.authService.esAdministrador()) return true;
    if (this.authService.esSoporte()) {
      return this.estaAsignadoAMi();
    }
    return false;
  }

  agregarSeguimiento(): void {
    if (!this.nuevoSeguimiento || !this.nuevoSeguimiento.trim()) return;

    this.enviandoSeguimiento = true;
    this.errorMensaje = '';

    const datos: CrearSeguimientoDTO = {
      caso_id: this.casoId,
      comentario: this.nuevoSeguimiento,
      es_solucion: false,
      tipo: 'seguimiento'
    };

    this.seguimientosService.crear(datos).subscribe({
      next: (response) => {
        if (response.exito) {
          this.exitoMensaje = 'Seguimiento agregado exitosamente';
          this.nuevoSeguimiento = '';
          this.cargarSeguimientos();
          this.cargarLogs();
          this.cargarCaso();
          setTimeout(() => this.exitoMensaje = '', 3000);
        }
        this.enviandoSeguimiento = false;
      },
      error: (err) => {
        this.errorMensaje = err.error?.mensaje || 'Error al agregar el seguimiento';
        this.enviandoSeguimiento = false;
      }
    });
  }

  cerrarCaso(): void {
    if (!this.solucionCierre || !this.solucionCierre.trim()) return;

    if (!confirm('¿Está seguro de cerrar este caso? Esta acción es permanente.')) return;

    this.cerrandoCaso = true;
    this.errorMensaje = '';

    const datos: CrearSeguimientoDTO = {
      caso_id: this.casoId,
      comentario: this.solucionCierre,
      es_solucion: true,
      tipo: 'solucion'
    };

    this.seguimientosService.crear(datos).subscribe({
      next: (response) => {
        if (response.exito) {
          this.exitoMensaje = 'Caso cerrado exitosamente con solución';
          this.solucionCierre = '';
          this.cargarCaso();
          this.cargarSeguimientos();
          this.cargarLogs();
          setTimeout(() => this.exitoMensaje = '', 3000);
        }
        this.cerrandoCaso = false;
      },
      error: (err) => {
        this.errorMensaje = err.error?.mensaje || 'Error al cerrar el caso';
        this.cerrandoCaso = false;
      }
    });
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

  getEstadoColor(estado: string): string {
    const colores: { [key: string]: string } = {
      'nuevo': 'badge-nuevo',
      'en_curso': 'badge-en-curso',
      'en_seguimiento': 'badge-en-seguimiento',
      'cerrado': 'badge-cerrado'
    };
    return colores[estado] || 'bg-gray-100 text-gray-800';
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

  formatearAccion(accion: string): string {
    const acciones: { [key: string]: string } = {
      'creacion': 'Caso Creado',
      'actualizacion': 'Caso Actualizado',
      'asignacion': 'Caso Asignado',
      'desasignacion': 'Caso Desasignado',
      'cambio_estado': 'Cambio de Estado',
      'cierre': 'Caso Cerrado',
      'seguimiento': 'Seguimiento Agregado',
      'solucion': 'Solución Agregada'
    };
    return acciones[accion] || accion;
  }

  getIconoTimeline(tipo: string): string {
    const iconos: { [key: string]: string } = {
      'log': '📝',
      'seguimiento': '💬',
      'solucion': '✅',
      'asignacion': '👤'
    };
    return iconos[tipo] || '•';
  }

  getPrioridadColor(prioridad: string): string {
    const colores: { [key: string]: string } = {
      'baja': 'badge-prioridad-baja',
      'media': 'badge-prioridad-media',
      'alta': 'badge-prioridad-alta',
      'critica': 'badge-prioridad-critica'
    };
    return colores[prioridad] || 'bg-gray-100 text-gray-800';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/mesaservicios/login']);
  }

  abrirModalAsignar(): void {
    this.mostrarModalAsignar = true;
  }

  cerrarModalAsignar(): void {
    this.mostrarModalAsignar = false;
  }

  onCasoAsignado(casoActualizado: Caso): void {
    this.caso = casoActualizado;
    this.exitoMensaje = 'Caso asignado exitosamente';
    this.cargarLogs();
    setTimeout(() => this.exitoMensaje = '', 3000);
  }

  puedeAsignarCasos(): boolean {
    return this.authService.esAdministrador() || this.authService.esTecnico();
  }

  getNombreCompleto(usuario: any): string {
    if (!usuario) return '';
    if (usuario.nombre_completo) return usuario.nombre_completo;
    if (usuario.nombres && usuario.apellidos) return `${usuario.nombres} ${usuario.apellidos}`;
    return usuario.nombreUsuario || usuario.codigo || 'Usuario';
  }

}
