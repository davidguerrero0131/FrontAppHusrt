import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule, Table } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';
import Swal from 'sweetalert2';
import { PlanMantenimientoIndustrialesService } from '../../../../../Services/appServices/industrialesServices/planMantenimiento/planMantenimientoIndustriales.service';

@Component({
  selector: 'app-gestion-plan-mantenimiento',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    DatePicker
  ],
  templateUrl: './gestion-plan-mantenimiento.component.html',
  styleUrls: ['./gestion-plan-mantenimiento.component.css']
})
export class GestionPlanMantenimientoComponent implements OnInit {

  @ViewChild('dt') dt!: Table;

  planes: any[] = [];
  loading: boolean = true;
  date: Date | undefined;
  fechaActual = new Date();
  mes = this.fechaActual.getMonth() + 1;
  anio = this.fechaActual.getFullYear();

  planMantenimientoService = inject(PlanMantenimientoIndustrialesService);
  private router = inject(Router);

  async ngOnInit() {
  try {
    console.log('Cargando planes...');
    // Temporalmente carga TODOS los planes para verificar
    this.planes = await this.planMantenimientoService.getAllPlanes();
    console.log('Planes recibidos:', this.planes);
    this.loading = false;
  } catch (error) {
    console.error('Error al cargar planes:', error);
    this.loading = false;
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No fue posible cargar los planes de mantenimiento'
    });
  }
}

  async cargarPlanes() {
    try {
      this.loading = true;
      this.planes = await this.planMantenimientoService.getPlanesByPeriodo(this.anio, this.mes);
      this.loading = false;
    } catch (error) {
      this.loading = false;
      throw error;
    }
  }

  async setDate() {
    if (this.date) {
      this.mes = this.date.getMonth() + 1;
      this.anio = this.date.getFullYear();
      await this.cargarPlanes();
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Fecha requerida',
        text: 'Debe seleccionar un mes para continuar'
      });
    }
  }

  crearPlan() {
    this.router.navigate(['/industriales/crear-plan-mantenimiento']);
  }

  verDetalle(idPlan: number) {
    this.router.navigate(['/industriales/detalle-plan-mantenimiento', idPlan]);
  }

  editarPlan(idPlan: number) {
    this.router.navigate(['/industriales/editar-plan-mantenimiento', idPlan]);
  }

  async cambiarEstado(idPlan: number, estadoActual: boolean) {
    const accion = estadoActual ? 'deshabilitar' : 'habilitar';
    const titulo = estadoActual ? '¿Deshabilitar plan?' : '¿Habilitar plan?';

    Swal.fire({
      title: titulo,
      text: `¿Está seguro que desea ${accion} este plan de mantenimiento?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (estadoActual) {
            await this.planMantenimientoService.deshabilitarPlan(idPlan);
          } else {
            await this.planMantenimientoService.habilitarPlan(idPlan);
          }
          
          await this.cargarPlanes();
          
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: `Plan ${accion === 'deshabilitar' ? 'deshabilitado' : 'habilitado'} correctamente`,
            timer: 1500,
            showConfirmButton: false
          });
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `No fue posible ${accion} el plan`
          });
        }
      }
    });
  }

  onGlobalFilter(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target && this.dt) {
      this.dt.filterGlobal(target.value, 'contains');
    }
  }

  obtenerNombreMes(numeroMes: number): string {
    const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return meses[numeroMes - 1] || '';
  }

  regresar() {
    this.router.navigate(['/adminindustriales']);
  }
}