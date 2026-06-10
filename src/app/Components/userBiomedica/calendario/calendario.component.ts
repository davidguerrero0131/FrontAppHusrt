import { LoginComponent } from './../../login/login.component';
import { Component, inject, OnInit, ViewChild, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DatePicker } from 'primeng/datepicker'
import { IconFieldModule } from 'primeng/iconfield';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { Table } from 'primeng/table';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { MantenimientosService } from '../../../Services/appServices/biomedicaServices/mantenimientos/mantenimientos.service';
import { MetrologiaService } from '../../../Services/appServices/biomedicaServices/metrologia/metrologia.service';
import { ServicioService } from '../../../Services/appServices/general/servicio/servicio.service';
import { TipoEquipoService } from '../../../Services/appServices/general/tipoEquipo/tipo-equipo.service';

import { obtenerNombreMes, getDecodedAccessToken } from '../../../utilidades';
import { TableStateService } from '../../../Services/appServices/shared/table-state.service';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarModule,
    DatePicker, Select, TableModule, IconFieldModule, InputIconModule, InputTextModule, DialogModule, ButtonModule, TooltipModule],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css'
})

export class CalendarioComponent implements OnInit {

  // ... (existing properties)
  platformId = inject(PLATFORM_ID);
  stateService = inject(TableStateService);
  isBrowser: boolean = false;

  first: number = 0;
  searchText: string = '';

  get canProgram(): boolean {
    const token = getDecodedAccessToken();
    return token?.rol !== 'BIOMEDICATECNICO';
  }

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  fechaPlan = new Date();
  mesPlan = this.fechaPlan.getMonth() + 1;
  anioPlan = this.fechaPlan.getFullYear();

  loading: boolean = false;
  @ViewChild('dt2') dt2!: Table;

  tiposEquipo: any[] = [];
  selectedTipoEquipo: any;
  servicios: any[] = [];
  selectedServicio: any;

  equiposPlanPreventivoMes: any[] = [];
  equiposPlanMantenimientoServicio: any[] = [];
  equiposPlanMantenimientoTipoEquipo: any[] = [];
  equiposPlanMetrologiaMes: any[] = [];
  equiposPlanAMetrologicasServicio: any[] = [];
  equiposPlanAMetrologicasTipoEquipo: any[] = [];


  viewPlanTipoEquipo: boolean = false;

  viewPlanTipoEquipoMantenimiento: boolean = true;
  viewPlanTipoEquipoMetrologia: boolean = false;

  viewPlanServicio: boolean = false;

  viewPlanServicioMantenimiento: boolean = true;
  viewPlanServicioMetrologia: boolean = false;

  viewPlanMes: boolean = true;

  viewPlanMesMantenimiento: boolean = true;
  viewPlanMesMetrologia: boolean = false;

  date: Date | undefined;
  panelActivo: 'mantenimientos' | 'metrologia' | 'mensuales' = 'mensuales';

  mantenimientoServices = inject(MantenimientosService);
  metrologiaService = inject(MetrologiaService);
  serviciosServices = inject(ServicioService);
  tiposEquipoServices = inject(TipoEquipoService);

  // Scheduled Months Variables
  scheduledPreventiveMonths: any[] = [];
  scheduledMetrologyMonths: any[] = [];
  showScheduledPreventiveModal: boolean = false;
  showScheduledMetrologyModal: boolean = false;

  async viewScheduledPreventiveMonths() {
    try {
      const data = await this.mantenimientoServices.getScheduledMonths();
      this.scheduledPreventiveMonths = data;
      this.showScheduledPreventiveModal = true;
    } catch (err: any) {
      console.error(err);
      Swal.fire('Error', 'No se pudieron cargar los meses programados de preventivos', 'error');
    }
  }

  async viewScheduledMetrologyMonths() {
    try {
      const data = await this.metrologiaService.getScheduledMetrologyMonths();
      this.scheduledMetrologyMonths = data;
      this.showScheduledMetrologyModal = true;
    } catch (err: any) {
      console.error(err);
      Swal.fire('Error', 'No se pudieron cargar los meses programados de metrología', 'error');
    }
  }

  async programarFaltantes(item: any) {
    const nombreMes = this.getNombreMes(item.mes);
    Swal.fire({
      title: `¿Programar equipos faltantes?`,
      text: `Se buscarán equipos que no hayan sido programados en ${nombreMes} ${item.anio} y se les asignará un técnico.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sincronizar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.fire({
            title: 'Procesando...',
            didOpen: () => { Swal.showLoading(); }
          });

          const user = getDecodedAccessToken();
          const res = await this.mantenimientoServices.programacionSuplementariaMes({ mes: item.mes, anio: item.anio, usuarioId: user?.id });

          const cantidad = Array.isArray(res) ? res.length : 0;
          const texto = cantidad > 0 
            ? `Se han programado ${cantidad} equipos faltantes exitosamente.` 
            : `No se encontraron equipos faltantes por programar.`;

          Swal.fire({
            title: "Proceso completado",
            text: texto,
            icon: cantidad > 0 ? "success" : "info"
          });

          // Refresh statistics or data for the current view
          this.equiposPlanPreventivoMes = await this.mantenimientoServices.getPlanMantenimientoMes({ mes: this.mesPlan, ano: this.anioPlan });
          this.equiposPlanMetrologiaMes = await this.metrologiaService.getPlanActividadesMesAño({ mes: this.mesPlan, ano: this.anioPlan });

        } catch (error: any) {
          console.error(error);
          Swal.fire('Error', error?.error?.error || 'No se pudo completar la programación suplementaria', 'error');
        }
      }
    });
  }

  async ngOnInit() {
    this.equiposPlanPreventivoMes = await this.mantenimientoServices.getPlanMantenimientoMes({ mes: this.mesPlan, ano: this.anioPlan });
    this.equiposPlanMetrologiaMes = await this.metrologiaService.getPlanActividadesMesAño({ mes: this.mesPlan, ano: this.anioPlan });

    this.tiposEquipo = await this.tiposEquipoServices.getAllTiposEquiposBiomedica();
    this.servicios = await this.serviciosServices.getAllServicios();

    // Load state
    const savedState = this.stateService.getState('calendario');
    this.first = savedState.first || 0;
    this.searchText = savedState.globalFilter || '';

    if (this.searchText) {
      setTimeout(() => {
        if (this.dt2) {
          this.dt2.filterGlobal(this.searchText, 'contains');
        }
      }, 0);
    }
  }

  setPanel(panel: 'mantenimientos' | 'metrologia' | 'mensuales') {
    this.panelActivo = panel;
  }

  async setDate() {
    if (this.date) {
      this.mesPlan = this.date.getMonth() + 1;
      this.anioPlan = this.date.getFullYear();

      this.equiposPlanPreventivoMes = await this.mantenimientoServices.getPlanMantenimientoMes({ mes: this.mesPlan, ano: this.anioPlan });
      this.equiposPlanMetrologiaMes = await this.metrologiaService.getPlanActividadesMesAño({ mes: this.mesPlan, ano: this.anioPlan });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Debe seleccionar un mes para continuar',
        text: 'Datos no encontrados.'
      })
    }
  }

  async setTipoEquipo() {
    if (this.selectedTipoEquipo) {
      const mantenimientoData = await this.mantenimientoServices.getPlanMantenimientoTipoEquipo(this.selectedTipoEquipo.id);
      this.equiposPlanMantenimientoTipoEquipo = this.agruparPorEquipo(mantenimientoData);

      const metrologiaData = await this.metrologiaService.getPlanAMetrologicasTipoEquipo(this.selectedTipoEquipo.id);
      this.equiposPlanAMetrologicasTipoEquipo = this.agruparPorEquipo(metrologiaData);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Debe seleccionar un tipo de equipo para continuar',
        text: 'Datos no encontrados.'
      })
      return;
    }
  }

  async setServicio() {
    if (this.selectedServicio) {
      const mantenimientoData = await this.mantenimientoServices.getPlanMantenimientoServicio(this.selectedServicio.id);
      this.equiposPlanMantenimientoServicio = this.agruparPorEquipo(mantenimientoData);

      const metrologiaData = await this.metrologiaService.getPlanAMetrologicasServicio(this.selectedServicio.id);
      this.equiposPlanAMetrologicasServicio = this.agruparPorEquipo(metrologiaData);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Debe seleccionar un servicio para continuar',
        text: 'Datos no encontrados.'
      })
      return;
    }
  }

  agruparPorEquipo(data: any[]): any[] {
    const grupos = new Map<number, any>();

    data.forEach(item => {
      const id = item.equipo.id;

      let key = id;
      if (item.tipoActividad) {
        // Group by ID and Activity for Metrology to preserve activity info
        key = `${id}-${item.tipoActividad}`;
      }

      if (!grupos.has(key)) {
        grupos.set(key, { ...item, meses: [item.mes] });
      } else {
        const existente = grupos.get(key);
        if (!existente.meses.includes(item.mes)) {
          existente.meses.push(item.mes);
        }
      }
    });

    const resultado = Array.from(grupos.values());

    resultado.forEach(item => {
      item.meses.sort((a: number, b: number) => a - b);
      item.mesesStr = item.meses.map((m: number) => this.getNombreMes(m)).join(', ');
    });

    return resultado;
  }

  fechaSeleccionada() {
    return { mes: this.mesPlan, anio: this.anioPlan };
  }

  async programarMantenimiento() {
    Swal.fire({
      title: "Programar mantenimientos preventivos?",
      text: "¿Desea programar los mantenimientos preventivos planeados para el mes de " + this.getNombreMes(this.mesPlan) + " del año " + this.anioPlan + "?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Programar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const user = getDecodedAccessToken();
          const data = { ...this.fechaSeleccionada(), usuarioId: user?.id };
          const programados = await this.mantenimientoServices.programacionMantenimientoResponsable(data);
          Swal.fire({
            title: "¡Mantenimientos programados!",
            text: "Mantenimientos del mes de " + this.getNombreMes(this.mesPlan) + " del año " + this.anioPlan + " Programados",
            icon: "success"
          });

        } catch (error: any) {
          const errorMessage = error?.error?.error || " los mantenimientos del mes de " + this.getNombreMes(this.mesPlan) + " del año " + this.anioPlan + " se programaron anteriormente.";
          Swal.fire({
            title: "¡No se programaron los mantenimientos!",
            text: errorMessage,
            icon: "warning"
          });
        }
      }
    });
  }


  async programarActividadesMetrologicas() {
    Swal.fire({
      title: "Programar actividades metrologicas?",
      text: "¿Desea programar las actividades metrologicas planeadas para el mes de " + this.getNombreMes(this.mesPlan) + " del año " + this.anioPlan + "?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Programar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const programados = await this.metrologiaService.programarActividadesMetrologicasMes(this.fechaSeleccionada());
          Swal.fire({
            title: "¡Actividades metrologicas programados!",
            text: "Actividades metrologicas del mes de " + this.getNombreMes(this.mesPlan) + " del año " + this.anioPlan + " Programados",
            icon: "success"
          });
        } catch (error: any) {
          const errorMessage = error?.error?.error || " las actividades metrologicas del mes de " + this.getNombreMes(this.mesPlan) + " del año " + this.anioPlan + " se programaron anteriormente.";
          Swal.fire({
            title: "¡No se programaron las Actividades Metrologicas!",
            text: errorMessage,
            icon: "warning"
          });
        }

      }
    });
  }

  viewPanelTipoEquipo() {
    this.viewPlanTipoEquipo = true;
    this.viewPlanServicio = false;
    this.viewPlanMes = false;
  }
  viewPanelServicio() {
    this.viewPlanTipoEquipo = false;
    this.viewPlanServicio = true;
    this.viewPlanMes = false;
  }
  viewPanelMes() {
    this.viewPlanTipoEquipo = false;
    this.viewPlanServicio = false;
    this.viewPlanMes = true;
  }

  viewPanelTipoEquipoMantenimiento() {
    this.viewPlanTipoEquipoMantenimiento = true;
    this.viewPlanTipoEquipoMetrologia = false;
  }

  viewPanelTipoEquipoMetrologia() {
    this.viewPlanTipoEquipoMantenimiento = false;
    this.viewPlanTipoEquipoMetrologia = true;
  }

  viewPanelServicioMantenimiento() {
    this.viewPlanServicioMantenimiento = true;
    this.viewPlanServicioMetrologia = false;
  }

  viewPanelServicioMetrologia() {
    this.viewPlanServicioMantenimiento = false;
    this.viewPlanServicioMetrologia = true;
  }

  viewPanelMesMantenimiento() {
    this.viewPlanMesMantenimiento = true;
    this.viewPlanMesMetrologia = false;
  }

  viewPanelMesMetrologia() {
    this.viewPlanMesMantenimiento = false;
    this.viewPlanMesMetrologia = true;
  }

  onGlobalFilter(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (target) {
      this.searchText = target.value;
      this.dt2.filterGlobal(this.searchText, 'contains');
      this.stateService.setState('calendario', { globalFilter: this.searchText });
    }
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.stateService.setState('calendario', { first: this.first });
  }

  nombreMes() {
    if (this.mesPlan && this.anioPlan) {
      return obtenerNombreMes(this.mesPlan) + ' ' + this.anioPlan;
    } else {
      return '';
    }
  }

  getNombreMes(mes: number) {
    return obtenerNombreMes(mes);
  }
}
