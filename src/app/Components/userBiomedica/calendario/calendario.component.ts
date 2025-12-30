import { LoginComponent } from './../../login/login.component';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
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

import { MantenimientosService } from '../../../Services/appServices/biomedicaServices/mantenimientos/mantenimientos.service';
import { MetrologiaService } from '../../../Services/appServices/biomedicaServices/metrologia/metrologia.service';
import { ServicioService } from '../../../Services/appServices/general/servicio/servicio.service';
import { TipoEquipoService } from '../../../Services/appServices/general/tipoEquipo/tipo-equipo.service';

import { obtenerNombreMes } from '../../../utilidades';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarModule,
    DatePicker, Select, TableModule, IconFieldModule, InputIconModule, InputTextModule],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css'
})

export class CalendarioComponent implements OnInit {

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
  panelActivo: 'seguimiento' | 'mantenimientos' | 'metrologia' | 'mensuales' = 'seguimiento';

  mantenimientoServices = inject(MantenimientosService);
  metrologiaService = inject(MetrologiaService);
  serviciosServices = inject(ServicioService);
  tiposEquipoServices = inject(TipoEquipoService);

  async ngOnInit() {
    this.equiposPlanPreventivoMes = await this.mantenimientoServices.getPlanMantenimientoMes({ mes: this.mesPlan + 1, ano: this.anioPlan });
    this.equiposPlanMetrologiaMes = await this.metrologiaService.getPlanActividadesMesAño({ mes: this.mesPlan + 1, ano: this.anioPlan });

    this.tiposEquipo = await this.tiposEquipoServices.getAllTiposEquiposBiomedica();
    this.servicios = await this.serviciosServices.getAllServicios();

  }

  setPanel(panel: 'seguimiento' | 'mantenimientos' | 'metrologia' | 'mensuales') {
    this.panelActivo = panel;
  }

  async setDate() {
    if (this.date) {
      this.mesPlan = this.date.getMonth() + 1;
      this.anioPlan = this.date.getFullYear();

      this.equiposPlanPreventivoMes = await this.mantenimientoServices.getPlanMantenimientoMes({ mes: this.mesPlan + 1, ano: this.anioPlan });
      this.equiposPlanMetrologiaMes = await this.metrologiaService.getPlanActividadesMesAño({ mes: this.mesPlan + 1, ano: this.anioPlan });
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
      this.equiposPlanMantenimientoTipoEquipo = await this.mantenimientoServices.getPlanMantenimientoTipoEquipo(this.selectedTipoEquipo.id);
      this.equiposPlanAMetrologicasTipoEquipo = await this.metrologiaService.getPlanAMetrologicasTipoEquipo(this.selectedTipoEquipo.id);
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
      this.equiposPlanMantenimientoServicio = await this.mantenimientoServices.getPlanMantenimientoServicio(this.selectedServicio.id);
      this.equiposPlanAMetrologicasServicio = await this.metrologiaService.getPlanAMetrologicasServicio(this.selectedServicio.id);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Debe seleccionar un servicio para continuar',
        text: 'Datos no encontrados.'
      })
      return;
    }
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
          const programados = await this.mantenimientoServices.programacionMantenimientoResponsable(this.fechaSeleccionada());
          Swal.fire({
            title: "¡Mantenimientos programados!",
            text: "Mantenimientos del mes de " + this.getNombreMes(this.mesPlan) + " del año " + this.anioPlan + " Programados",
            icon: "success"
          });

        } catch {
          Swal.fire({
            title: "¡No se programaron los mantenimientos!",
            text: " los mantenimientos del mes de " + this.getNombreMes(this.mesPlan) + " del año " + this.anioPlan + " se programaron anteriormente.",
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
        } catch {
          Swal.fire({
            title: "¡No se programaron las Actividades Metrologicas!",
            text: " las actividades metrologicas del mes de " + this.getNombreMes(this.mesPlan) + " del año " + this.anioPlan + " se programaron anteriormente.",
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
      this.dt2.filterGlobal(target.value, 'contains');
    }
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
