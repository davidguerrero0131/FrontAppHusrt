import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MantenimientoadminnavbarComponent } from '../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import { AreasService } from '../../../Services/appServices/areasFisicas/areas.service';
import { ServicioService } from '../../../Services/appServices/general/servicio/servicio.service';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-areas-por-servicio',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TooltipModule, MantenimientoadminnavbarComponent, MenuModule, TagModule],
  templateUrl: './areas-por-servicio.component.html',
  styleUrl: './areas-por-servicio.component.css'
})
export class AreasPorServicioComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private areasService = inject(AreasService);
  private servicioService = inject(ServicioService);

  serviceId: number = 0;
  areasFisicas: any[] = [];
  servicioSeleccionado: any = null;
  items: MenuItem[] | undefined;
  selectedArea: any;

  ngOnInit() {
    this.route.params.subscribe(async params => {
      this.serviceId = +params['id'];
      await this.loadData();
    });
  }

  async loadData() {
    try {
      // Load Service Info
      const servicio: any = await this.servicioService.getServicio(this.serviceId);
      this.servicioSeleccionado = servicio;

      // Load Areas
      const areas: any = await this.areasService.getAreasByServicio(this.serviceId);
      this.areasFisicas = areas;

    } catch (error) {
      console.error("Error loading data", error);
    }
  }

  backToDashboard() {
    this.router.navigate(['/adminmantenimiento/servicios']);
  }

  setMenuArea(area: any) {
    this.selectedArea = area;
    const isActive = area.estado === 1 || area.estado === true;

    this.items = [
      {
        label: 'Opciones',
        items: [
          {
            label: 'Editar Área',
            icon: 'pi pi-pencil',
            command: () => this.editarArea(area.id)
          },
          {
            label: 'Gestionar Planes',
            icon: 'pi pi-calendar',
            command: () => this.viewMantenimientos(area.id)
          },
          {
            label: 'Ver Inspecciones',
            icon: 'pi pi-check-square',
            command: () => this.viewInspecciones(area.id)
          },
          {
            label: 'Ver Reportes',
            icon: 'pi pi-file',
            command: () => this.viewReportes(area.id)
          },
          {
            label: 'Gestionar Elementos',
            icon: 'pi pi-box',
            command: () => this.viewElementos(area.id)
          },
          {
            separator: true
          },
          {
            label: isActive ? 'Inhabilitar' : 'Habilitar',
            icon: isActive ? 'pi pi-ban' : 'pi pi-check-circle',
            command: () => this.toggleEstadoArea(area),
            styleClass: isActive ? 'text-warning' : 'text-success'
          }
        ]
      }
    ];
  }

  editarArea(id: number) {
    this.router.navigate(['/areas/editar', id]);
  }

  viewMantenimientos(areaId: number) {
    this.router.navigate(['/adminmantenimiento/mantenimientos-area', areaId]);
  }

  viewInspecciones(areaId: number) {
    this.router.navigate(['/adminmantenimiento/inspecciones-area', areaId]);
  }

  viewReportes(areaId: number) {
    this.router.navigate(['/adminmantenimiento/reportes-area', areaId]);
  }

  viewElementos(areaId: number) {
    this.router.navigate(['/areas/asignar-elementos/gestionar', areaId]);
  }

  async toggleEstadoArea(area: any) {
    const isActive = area.estado === 1 || area.estado === true;
    const actionText = isActive ? 'inhabilitar' : 'habilitar';
    const confirmButtonText = isActive ? 'Sí, inhabilitar' : 'Sí, habilitar';
    const successText = isActive ? 'inhabilitada' : 'habilitada';
    const newState = !isActive;

    Swal.fire({
      title: '¿Estás seguro?',
      text: `El área pasará a estado ${isActive ? 'inactivo' : 'activo'}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: isActive ? '#ffc107' : '#28a745',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmButtonText,
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await this.areasService.changeEstado(area.id, newState);
          Swal.fire('Éxito!', `El área ha sido ${successText}.`, 'success');
          this.loadData();
        } catch (error) {
          console.error(error);
          Swal.fire('Error!', `No se pudo ${actionText} el área.`, 'error');
        }
      }
    })
  }
}

