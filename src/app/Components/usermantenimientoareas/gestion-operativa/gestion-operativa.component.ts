import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MantenimientoadminnavbarComponent } from '../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import { getDecodedAccessToken } from '../../../utilidades';
import { ObservacionesService } from '../../../Services/appServices/areasFisicas/observaciones.service';

@Component({
  selector: 'app-gestion-operativa',
  standalone: true,
  imports: [CommonModule, ButtonModule, MantenimientoadminnavbarComponent],
  templateUrl: './gestion-operativa.component.html',
  styleUrl: './gestion-operativa.component.css'
})
export class GestionOperativaComponent implements OnInit {
  private router = inject(Router);
  private observacionesService = inject(ObservacionesService);

  userRole: string = '';
  myId: number | null = null;
  pendingTasksCount: number = 0;

  async ngOnInit() {
    const tokenData = getDecodedAccessToken();
    if (tokenData) {
      this.userRole = 'Administrador';
      if (tokenData.rol === 'TECNICOMANTENIMIENTO') {
        this.userRole = 'Técnico';
      } else if (tokenData.rol === 'USERMANTENIMIENTO') {
        this.userRole = 'Usuario';
      }
      this.myId = tokenData.id || tokenData.usuarioId || tokenData.uid;
    }

    if (this.myId) {
      try {
        const tokenData = getDecodedAccessToken();
        let resObs: any;

        // Si es administrador (o superadmin), cargamos todas las observaciones. Si es técnico/usuario, solo las suyas.
        if (tokenData && ['ADMINMANTENIMIENTO', 'USERMANTENIMIENTO', 'SUPERADMIN', 'SYSTEMADMIN'].includes(tokenData.rol)) {
          resObs = await this.observacionesService.getAllObservaciones();
        } else {
          resObs = await this.observacionesService.getObservacionesByTecnico(this.myId);
        }

        let observaciones: any[] = [];
        if (Array.isArray(resObs)) observaciones = resObs;
        else if (resObs && resObs.data) observaciones = resObs.data;

        // Filtro de consistencia: ocultar tareas genéricas (sin impacto técnico real) para que el contador coincida con la lista
        const tareasReales = observaciones.filter((o: any) => {
          const desc = (o.descripcion || '').toLowerCase();
          return !desc.includes('elemento reportado en estado') && !desc.includes('sin observación técnica detallada');
        });

        this.pendingTasksCount = tareasReales.filter((o: any) => o.estado === 'Pendiente').length;
      } catch (e) {
        console.error('Error fetching tareas:', e);
      }
    }
  }

  backToDashboard() {
    this.router.navigate(['/adminmantenimiento']);
  }

  showViewInventario() {
    this.router.navigate(['/adminmantenimiento/inventario'], { queryParams: { returnUrl: this.router.url } });
  }

  showViewMantenimiento() {
    this.router.navigate(['/adminmantenimiento/gestion-operativa/mantenimiento']);
  }

  showMisTareas() {
    this.router.navigate(['/adminmantenimiento/gestion-operativa/mis-tareas']);
  }

  showViewProgramacion() {
    this.router.navigate(['/adminmantenimiento/listado-programacion']);
  }


  showViewReportes() {
    this.router.navigate(['/adminmantenimiento/reportes-general'], { queryParams: { flow: 'area' } });
  }

  goToIndicadoresAreasFisicas() {
    this.router.navigate(['/adminmantenimiento/indicadores-areas-fisicas']);
  }
}
