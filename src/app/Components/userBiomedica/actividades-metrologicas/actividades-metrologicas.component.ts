import { MetrologiaService } from './../../../Services/appServices/biomedicaServices/metrologia/metrologia.service';
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


@Component({
  selector: 'app-actividades-metrologicas',
  standalone: true,
  imports: [CommonModule, TabsModule, BiomedicausernavbarComponent, DatePicker, FormsModule,
    TableModule, IconFieldModule, InputIconModule, InputTextModule, CalendarModule],
  templateUrl: './actividades-metrologicas.component.html',
  styleUrl: './actividades-metrologicas.component.css'
})
export class ActividadesMetrologicasComponent implements OnInit {

  @ViewChild('dt2') dt2!: Table;
  date: Date | undefined;
  metrologiaServices = inject(MetrologiaService);
  loading: boolean = false;
  fechaActual = new Date();
  mes = this.fechaActual.getMonth() + 1;
  anio = this.fechaActual.getFullYear();

  actividadesMetrologicas: any[] = [];

  panelActividadesMetrologicas: boolean = true;
  panelMetas: boolean = false;

  panelRealizados: boolean = true;
  panelPendientes: boolean = false;

  constructor(private location: Location) { }

  async ngOnInit() {
    try {
      this.actividadesMetrologicas = await this.metrologiaServices.getReportesActividadesMesAño({ mes: this.mes, anio: this.anio });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'No es posible cargar la informacion de los reportes de actividades metrológicas',
        text: 'Error al cargar los reportes de actividades metrológicas, intente más tarde.'
      })
    }
  }


  async setDate() {
    if (this.date) {
      this.mes = this.date.getMonth() + 1;
      this.anio = this.date.getFullYear();
      try {
        this.actividadesMetrologicas = await this.metrologiaServices.getReportesActividadesMesAño({ mes: this.mes, anio: this.anio })

      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'No es posible cargar la informacion de los reportes de actividades metrológicas',
          text: 'Error al cargar los reportes de actividades metrológicas, intente más tarde.'
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

  onGlobalFilter(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (target) {
      this.dt2.filterGlobal(target.value, 'contains');
    }
  }

  viewActividadesMetrologicas() {
    this.panelActividadesMetrologicas = true;
    this.panelMetas = false;
  }

  viewMetas() {
    this.panelActividadesMetrologicas = false;
    this.panelMetas = true;
  }

  panelRealizadosView() {
    this.panelRealizados = true;
    this.panelPendientes = false;
  }

  panelPendientesView() {
    this.panelRealizados = false;
    this.panelPendientes = true;
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
