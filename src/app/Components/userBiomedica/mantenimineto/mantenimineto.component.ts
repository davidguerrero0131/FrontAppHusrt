import { ReportesService } from './../../../Services/appServices/biomedicaServices/reportes/reportes.service';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { CommonModule } from '@angular/common';
import { BiomedicausernavbarComponent } from "../../navbars/biomedicausernavbar/biomedicausernavbar.component";
import Swal from 'sweetalert2';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Table } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { DatePicker } from 'primeng/datepicker'
import { Location } from '@angular/common';
import { Console } from 'node:console';

@Component({
  selector: 'app-mantenimineto',
  standalone: true,
  imports: [CommonModule, TabsModule, BiomedicausernavbarComponent, DatePicker, FormsModule,
    TableModule, IconFieldModule, InputIconModule, InputTextModule, CalendarModule],
  templateUrl: './mantenimineto.component.html',
  styleUrl: './mantenimineto.component.css'
})
export class ManteniminetoComponent implements OnInit {

  @ViewChild('dt2') dt2!: Table;
  date: Date | undefined;
  reportesService = inject(ReportesService);
  loading: boolean = false;
  fechaActual = new Date();
  mes = this.fechaActual.getMonth() + 1;
  anio = this.fechaActual.getFullYear();

  preventivos: any[] = [];
  correctivos: any[] = [];

  panelPreventivos: boolean = true;
  panelCorrectivos: boolean = false;
  panelMetas: boolean = false;

  panelRealizados: boolean = true;
  panelPendientes: boolean = false;

  constructor(private location: Location) { }

  async ngOnInit() {

    try {
      this.preventivos = await this.reportesService.getReportesPreventivosMesAño({ mes: this.mes, anio: this.anio });
      this.correctivos = await this.reportesService.getReportesCorrectivosMesAño({ mes: this.mes, anio: this.anio });
      console.log("Preventivos:", this.preventivos.length);
      console.log("Correctivos:", this.correctivos.length);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'No es posible cargar la informacion de los reportes',
        text: 'Error al cargar los reportes, intente más tarde.'
      })
    }

  }

  async setDate() {
    if (this.date) {
      this.mes = this.date.getMonth() + 1;
      this.anio = this.date.getFullYear();
      console.log("Mes:", this.mes);
      console.log("Año:", this.anio);
      try {
        this.preventivos = await this.reportesService.getReportesPreventivosMesAño({ mes: this.mes, anio: this.anio });
        this.correctivos = await this.reportesService.getReportesCorrectivosMesAño({ mes: this.mes, anio: this.anio });
        console.log("Preventivos:", this.preventivos.length);
        console.log("Correctivos:", this.correctivos.length);
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'No es posible cargar la informacion de los reportes',
          text: 'Error al cargar los reportes, intente más tarde.'
        })
      }

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Debe seleccionar un mes para continuar',
        text: 'Datos no encontrados.'
      })
    }
  }

  viewPreventivos() {
    console.log("Preventivos");
    this.panelPreventivos = true;
    this.panelCorrectivos = false;
    this.panelMetas = false;
  }
  viewCorrectivos() {
    console.log("Correctivos");
    this.panelPreventivos = false;
    this.panelCorrectivos = true;
    this.panelMetas = false;
  }
  viewMetas() {
    console.log("Metas");
    this.panelPreventivos = false;
    this.panelCorrectivos = false;
    this.panelMetas = true;
  }

  panelRealizadosView() {
    this.panelRealizados = true;
    this.panelPendientes = false;
    console.log("Realizados");
  }

  panelPendientesView() {
    this.panelRealizados = false;
    this.panelPendientes = true;
    console.log("Pendientes");
  }

  onGlobalFilter(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (target) {
      this.dt2.filterGlobal(target.value, 'contains');
    }
  }

  obtenerNombreMes(numeroMes: number): string {
    const meses: string[] = [
      "Enero", "Febrero", "Marzo", "Abril",
      "Mayo", "Junio", "Julio", "Agosto",
      "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    if (numeroMes < 1 || numeroMes > 12) {
      throw new Error("El número debe estar entre 1 y 12.");
    }
    return meses[numeroMes - 1];
  }

  goBack(): void {
    this.location.back();
  }
}
