// Componente Dashboard con estadísticas
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../Services/mesaServicios/auth.service';
import { CasosService } from '../../../Services/mesaServicios/casos.service';
import { EstadisticasCasos, Caso } from '../../../models/mesaServicios/caso.model';
import { fadeInAnimation, listAnimation, modalAnimation, scaleInAnimation } from '../../../animations/animations';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  animations: [fadeInAnimation, listAnimation, modalAnimation, scaleInAnimation]
})
export class DashboardComponent implements OnInit {
  usuario: any;
  estadisticas: EstadisticasCasos | null = null;
  casosRecientes: Caso[] = [];
  cargando = true;

  constructor(
    private authService: AuthService,
    private casosService: CasosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuarioActual();
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;

    // Cargar estadísticas
    this.casosService.obtenerEstadisticas().subscribe({
      next: (response) => {
        if (response.exito && response.datos) {
          this.estadisticas = response.datos;
        }
      },
      error: (error) => console.error('Error al cargar estadísticas:', error)
    });

    // Cargar casos recientes
    const filtros: any = { limite: 5 };

    // Si es solicitante, ver solo sus casos
    if (this.usuario?.perfil_nombre === 'Solicitante') {
      filtros.usuario_solicitante_id = this.usuario.id;
    }

    this.casosService.listar(filtros).subscribe({
      next: (response) => {
        if (response.exito && response.datos) {
          // El backend devuelve datos con la estructura RespuestaPaginadaCasos
          this.casosRecientes = response.datos.casos;
        }
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar casos recientes:', error);
        this.cargando = false;
      }
    });
  }

  irANuevoCaso(): void {
    this.router.navigate(['/mesaservicios/casos/nuevo']);
  }

  irACasos(): void {
    this.router.navigate(['/mesaservicios/casos']);
  }

  verDetalleCaso(caso: Caso): void {
    this.router.navigate(['/mesaservicios/casos', caso.id]);
  }

  getEstadoColor(estado: string): string {
    const colores: { [key: string]: string } = {
      'nuevo': 'bg-blue-100 text-blue-800',
      'en_curso': 'bg-yellow-100 text-yellow-800',
      'en_seguimiento': 'bg-orange-100 text-orange-800',
      'cerrado': 'bg-green-100 text-green-800'
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
    const ahora = new Date();
    const diferencia = ahora.getTime() - date.getTime();
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

    if (dias === 0) return 'Hoy';
    if (dias === 1) return 'Ayer';
    if (dias < 7) return `Hace ${dias} días`;

    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  formatearTiempo(horas?: number): string {
    if (!horas || horas === 0) return 'N/A';

    if (horas < 1) {
      const minutos = Math.round(horas * 60);
      return `${minutos} min`;
    }

    if (horas < 24) {
      return `${Math.round(horas)} h`;
    }

    const dias = Math.floor(horas / 24);
    const horasRestantes = Math.round(horas % 24);
    if (horasRestantes > 0) {
      return `${dias}d ${horasRestantes}h`;
    }
    return `${dias} días`;
  }

  getColorPorcentaje(porcentaje: number): string {
    if (porcentaje >= 70) return 'bg-green-500';
    if (porcentaje >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  calcularPorcentaje(cantidad: number): number {
    if (!this.estadisticas || this.estadisticas.total === 0) return 0;
    return Math.round((cantidad / this.estadisticas.total) * 100);
  }
}
