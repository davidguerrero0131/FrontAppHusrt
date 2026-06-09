import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { MantenimientoadminnavbarComponent } from '../../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import { PlanMantenimientoService } from '../../../../Services/appServices/areasFisicas/plan-mantenimiento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listado-programacion',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ToolbarModule,
    TagModule,
    TooltipModule,
    SelectModule,
    FormsModule,
    MantenimientoadminnavbarComponent
  ],
  templateUrl: './listado-programacion.component.html',
  styleUrl: './listado-programacion.component.css'
})
export class ListadoProgramacionComponent implements OnInit {

  planesOriginales: any[] = [];
  planesSinProgramar: any[] = [];
  planesProgramados: any[] = [];
  loading: boolean = true;
  panelActivo: 'noProgramados' | 'programados' = 'noProgramados';
  mesSeleccionado: number | null = new Date().getMonth() + 1; // Default to current month
  anioSeleccionado: number | null = new Date().getFullYear(); // Default to current year

  private router = inject(Router);
  private planService = inject(PlanMantenimientoService);

  meses = [
    { label: 'Enero', value: 1 }, { label: 'Febrero', value: 2 },
    { label: 'Marzo', value: 3 }, { label: 'Abril', value: 4 },
    { label: 'Mayo', value: 5 }, { label: 'Junio', value: 6 },
    { label: 'Julio', value: 7 }, { label: 'Agosto', value: 8 },
    { label: 'Septiembre', value: 9 }, { label: 'Octubre', value: 10 },
    { label: 'Noviembre', value: 11 }, { label: 'Diciembre', value: 12 }
  ];

  anios: any[] = [];

  constructor() {
    const startYear = 2024;
    const currentYear = new Date().getFullYear();
    for (let year = startYear; year <= currentYear + 5; year++) {
      this.anios.push({ label: year.toString(), value: year });
    }
  }

  ngOnInit(): void {
    this.loadPlanes();
  }

  async loadPlanes() {
    if (!this.mesSeleccionado || !this.anioSeleccionado) return;
    this.loading = true;
    try {
      const res = await this.planService.getPlanesByPeriodo(this.anioSeleccionado, this.mesSeleccionado);
      const data = Array.isArray(res) ? res : (res.data || []);
      
      let todosMantenimientos: any[] = [];
      data.forEach((mant: any) => {
        todosMantenimientos.push({
            ...mant.plan,
            mantenimientoId: mant.id,
            mes: mant.mes,
            anio: mant.anio,
            estado: mant.estado,
            area: mant.area || mant.plan?.area,
            isVirtual: mant.isVirtual,
            anioMesFormat: `${mant.anio}-${mant.mes.toString().padStart(2, '0')}`
        });
      });

      this.planesOriginales = todosMantenimientos.sort((a: any, b: any) => a.anioMesFormat.localeCompare(b.anioMesFormat));
      
      this.planesSinProgramar = this.planesOriginales.filter(p => Number(p.estado) === 4);
      this.planesProgramados = this.planesOriginales.filter(p => Number(p.estado) !== 4);
    } catch (error) {
      console.error('Error cargando planes:', error);
      Swal.fire('Error', 'No se pudieron cargar los planes.', 'error');
    } finally {
      this.loading = false;
    }
  }

  filtrarPorFecha() {
    this.loadPlanes();
  }

  getNombreMes(m: number): string {
    return this.getMesLabel(m);
  }

  getEstadoLabel(estado: number): string {
    const mapAreas: { [k: number]: string } = {
      4: 'Sin Programar',
      1: 'Programado / Pendiente',
      2: 'Realizado / En Proceso',
      3: 'Completado',
      0: 'Cancelado'
    };
    return mapAreas[estado] ?? 'Desconocido';
  }

  getEstadoSeverity(estado: number): string {
    const mapAreas: { [k: number]: string } = {
      4: 'warn',
      1: 'info',
      2: 'success',
      3: 'success',
      0: 'danger'
    };
    return mapAreas[estado] ?? 'secondary';
  }

  getMesLabel(mes: number): string {
    const found = this.meses.find(m => m.value === Number(mes));
    return found ? found.label : mes.toString();
  }

  generarProgramacion() {
    this.router.navigate(['/adminmantenimiento/programacion']);
  }

  goBack() {
    this.router.navigate(['/adminmantenimiento/gestion-operativa']);
  }

  async programarPlan(plan: any) {
    try {
      const result = await Swal.fire({
        title: '¿Programar este mantenimiento?',
        text: 'Una vez programado, aparecerá en estado "Pendiente" en las listas de ejecución operativas.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, programar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        // Enviar estado 1 = Pendiente
        await this.planService.changeMantenimientoEstado(plan.mantenimientoId, 1);
        Swal.fire('Programado', 'El mantenimiento ha sido programado con éxito.', 'success');
        this.loadPlanes(); // Recargar la tabla quitando el recién programado
      }
    } catch (error) {
      console.error('Error al programar plan', error);
      Swal.fire('Error', 'Hubo un error al programar el mantenimiento.', 'error');
    }
  }

  async programarPorMes(mes: number, anio: number) {
    try {
      const result = await Swal.fire({
        title: `¿Programar todos los mantenimientos de ${this.getMesLabel(mes)} de ${anio}?`,
        text: 'Se activarán todos los mantenimientos sin programar para este mes y año.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, programar todos',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        this.loading = true;
        
        // Use the backend bulk endpoint which handles virtual records and load balancing
        await this.planService.programarPlanes(anio, mes);
        
        Swal.fire('Completado', 'Los mantenimientos se han programado y asignado correctamente.', 'success');
        this.loadPlanes();
      }
    } catch (error) {
      this.loading = false;
      console.error('Error al programar mantenimientos por mes', error);
      Swal.fire('Error', 'Hubo un error al programar los mantenimientos.', 'error');
    }
  }

  programarMesActual() {
      if(this.mesSeleccionado && this.anioSeleccionado) {
          this.programarPorMes(this.mesSeleccionado, this.anioSeleccionado);
      } else {
          Swal.fire('Atención', 'Seleccione un mes y año válidos.', 'warning');
      }
  }
}
