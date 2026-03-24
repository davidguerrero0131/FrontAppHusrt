import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableModule, Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import Swal from 'sweetalert2';

import { PlanMantenimientoIndustrialesService } from '../../../Services/appServices/industrialesServices/planMantenimiento/planMantenimientoIndustriales.service';
import { obtenerNombreMes } from '../../../utilidades';

@Component({
  selector: 'app-calendario-industrial',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, ButtonModule,
    SelectModule, TagModule, IconFieldModule, InputIconModule, InputTextModule
  ],
  templateUrl: './calendario-industrial.component.html',
  styleUrl: './calendario-industrial.component.css'
})
export class CalendarioIndustrialComponent implements OnInit {

  @ViewChild('dt') dt!: Table;

  planService = inject(PlanMantenimientoIndustrialesService);
  router = inject(Router);

  loading = false;
  planesNoProgramados: any[] = [];
  planesProgramados: any[] = [];

  fechaActual = new Date();
  anio: number = this.fechaActual.getFullYear();
  mesSeleccionado: number = this.fechaActual.getMonth() + 1;

  meses = [
    { label: 'Enero', value: 1 },
    { label: 'Febrero', value: 2 },
    { label: 'Marzo', value: 3 },
    { label: 'Abril', value: 4 },
    { label: 'Mayo', value: 5 },
    { label: 'Junio', value: 6 },
    { label: 'Julio', value: 7 },
    { label: 'Agosto', value: 8 },
    { label: 'Septiembre', value: 9 },
    { label: 'Octubre', value: 10 },
    { label: 'Noviembre', value: 11 },
    { label: 'Diciembre', value: 12 }
  ];

  anios = [
    this.fechaActual.getFullYear() - 1,
    this.fechaActual.getFullYear(),
    this.fechaActual.getFullYear() + 1,
  ];

  panelActivo: 'noProgramados' | 'programados' = 'noProgramados';

  async ngOnInit() {
    await this.cargarPlanes();
  }

  async cargarPlanes() {
    this.loading = true;
    try {
      const todos = await this.planService.getPlanesByPeriodo(this.anio, this.mesSeleccionado);
      this.planesNoProgramados = todos.filter((p: any) => p.estado === 0);
      this.planesProgramados = todos.filter((p: any) => p.estado >= 1);
    } catch (e) {
      console.error('Error cargando planes:', e);
    }
    this.loading = false;
  }

  async programarMantenimientos() {
    const mesNombre = obtenerNombreMes(this.mesSeleccionado);

    const result = await Swal.fire({
      title: '¿Programar mantenimientos?',
      text: `Se programarán ${this.planesNoProgramados.length} plan(es) de ${mesNombre} ${this.anio}. Se creará un registro de reporte preliminar para cada uno.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0d7377',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Programar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      const resp = await this.planService.programarPlanes(this.anio, this.mesSeleccionado);
      Swal.fire({
        title: '¡Programados!',
        text: `${resp.registrosActualizados} plan(es) programados. ${resp.stubsReporteCreados ?? 0} reporte(s) creados.`,
        icon: 'success',
        timer: 2500,
        showConfirmButton: false
      });
      await this.cargarPlanes();
    } catch (e) {
      Swal.fire('Error', 'No se pudieron programar los mantenimientos.', 'error');
    }
  }

  getNombreMes(m: number): string {
    return obtenerNombreMes(m);
  }

  getEstadoLabel(estado: number): string {
    const map: { [k: number]: string } = {
      0: 'No Programado',
      1: 'Programado',
      2: 'Realizado',
      3: 'Completado',
      4: 'Pendiente'
    };
    return map[estado] ?? 'Desconocido';
  }

  getEstadoSeverity(estado: number): string {
    const map: { [k: number]: string } = {
      0: 'warn',
      1: 'info',
      2: 'success',
      3: 'success',
      4: 'danger'
    };
    return map[estado] ?? 'secondary';
  }

  onGlobalFilter(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.dt?.filterGlobal(val, 'contains');
  }

  regresar() {
    this.router.navigate(['/adminindustriales']);
  }
}
