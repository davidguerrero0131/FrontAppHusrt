import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableModule, Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import Swal from 'sweetalert2';
import { MantenimientoadminnavbarComponent } from '../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import { PlanMantenimientoIndustrialesService } from '../../../Services/appServices/industrialesServices/planMantenimiento/planMantenimientoIndustriales.service';
import { obtenerNombreMes } from '../../../utilidades';
import { PlanMantenimientoService } from '../../../Services/appServices/areasFisicas/plan-mantenimiento.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-calendario-industrial',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, ButtonModule,
    SelectModule, TagModule, IconFieldModule, InputIconModule, InputTextModule,
    MantenimientoadminnavbarComponent
  ],
  templateUrl: './calendario-industrial.component.html',
  styleUrl: './calendario-industrial.component.css'
})
export class CalendarioIndustrialComponent implements OnInit {

  @ViewChild('dt') dt!: Table;

  planService = inject(PlanMantenimientoIndustrialesService);
  planServiceAreas = inject(PlanMantenimientoService);
  router = inject(Router);

  loading = false;
  planesNoProgramados: any[] = [];
  planesProgramados: any[] = [];

  planesNoProgramadosAreas: any[] = [];
  planesProgramadosAreas: any[] = [];

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

  anios: any[] = [];

  constructor() {
    const currentYear = new Date().getFullYear();
    for (let i = -1; i <= 15; i++) {
      const year = currentYear + i;
      this.anios.push({ label: year.toString(), value: year });
    }
  }

  panelActivo: 'noProgramados' | 'programados' = 'noProgramados';
  panelActivoAreas: 'noProgramados' | 'programados' = 'noProgramados';
  userRole: string = '';

  private getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }

  loadUserRole() {
    const token = sessionStorage.getItem('utoken');
    if (token) {
      const decoded: any = this.getDecodedAccessToken(token);
      this.userRole = decoded ? decoded.rol : '';
    }
  }

  canProgram(): boolean {
    const adminRoles = ['8', 'ADMINMANTENIMIENTO', 'USERMANTENIMIENTO', '1', 'SUPERADMIN', '2', 'SYSTEMADMIN', 'ADMINMANTENIMIENTO'];
    return adminRoles.includes(this.userRole) || this.userRole === 'USERMANTENIMIENTO';
  }

  async ngOnInit() {
    this.loadUserRole();
    await this.cargarPlanes();
  }

  async cargarPlanes() {
    this.loading = true;
    try {
      // Industriales
      const todos = await this.planService.getPlanesByPeriodo(this.anio, this.mesSeleccionado);
      this.planesNoProgramados = todos.filter((p: any) => p.estado === 0);
      this.planesProgramados = todos.filter((p: any) => p.estado >= 1);

      // Areas Fisicas (Carga optimizada con el nuevo endpoint de periodo)
      const planesAreas = await this.planServiceAreas.getPlanesByPeriodo(this.anio, this.mesSeleccionado);
      
      this.planesNoProgramadosAreas = planesAreas.filter((p: any) => Number(p.estado) === 4);
      this.planesProgramadosAreas = planesAreas.filter((p: any) => Number(p.estado) !== 4);

    } catch (e) {
      console.error('Error cargando planes:', e);
    }
    this.loading = false;
  }

  async programarMantenimientosAreas() {
    const mesNombre = obtenerNombreMes(this.mesSeleccionado);

    const result = await Swal.fire({
      title: '¿Programar mantenimientos de Áreas?',
      text: `Se programarán ${this.planesNoProgramadosAreas.length} mantenimiento(s) para ${mesNombre} ${this.anio}.`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Programar ahora',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      const resp = await this.planServiceAreas.programarPlanes(this.anio, this.mesSeleccionado);
      Swal.fire({
        title: '¡Éxito!',
        text: `${resp.registrosActualizados} mantenimientos han sido programados.`,
        icon: 'success',
        timer: 2500,
        showConfirmButton: false
      });
      await this.cargarPlanes();
    } catch (e) {
      Swal.fire('Error', 'No se pudieron programar los mantenimientos de áreas.', 'error');
    }
  }

  async programarMantenimientos() {
    const mesNombre = obtenerNombreMes(this.mesSeleccionado);

    const result = await Swal.fire({
      title: '¿Programar mantenimientos Industriales?',
      text: `Se programarán ${this.planesNoProgramados.length} plan(es) de ${mesNombre} ${this.anio}.`,
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
        text: `${resp.registrosActualizados} plan(es) programados.`,
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

  getEstadoLabel(estado: number, tipo: 'industrial' | 'area' = 'industrial'): string {
    if (tipo === 'area') {
      const mapAreas: { [k: number]: string } = {
        4: 'Sin Programar',
        1: 'Programado / Pendiente',
        2: 'Realizado / En Proceso',
        3: 'Completado',
        0: 'Cancelado'
      };
      return mapAreas[estado] ?? 'Desconocido';
    }

    const mapInd: { [k: number]: string } = {
      0: 'Sin Programar',
      1: 'Programado / Pendiente',
      2: 'Realizado / En Proceso',
      3: 'Completado',
      4: 'Vencido / Pendiente'
    };
    return mapInd[estado] ?? 'Desconocido';
  }

  getEstadoSeverity(estado: number, tipo: 'industrial' | 'area' = 'industrial'): string {
    if (tipo === 'area') {
      const mapAreas: { [k: number]: string } = {
        4: 'warn',
        1: 'info',
        2: 'success',
        3: 'success',
        0: 'danger'
      };
      return mapAreas[estado] ?? 'secondary';
    }

    const mapInd: { [k: number]: string } = {
      0: 'warn',
      1: 'info',
      2: 'success',
      3: 'success',
      4: 'danger'
    };
    return mapInd[estado] ?? 'secondary';
  }

  private location = inject(Location);

  onGlobalFilter(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.dt?.filterGlobal(val, 'contains');
  }

  regresar() {
    window.history.back();
  }
}
