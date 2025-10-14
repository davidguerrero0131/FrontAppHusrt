import { ReportesService } from './../../../Services/appServices/biomedicaServices/reportes/reportes.service';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { CommonModule } from '@angular/common';
import { BiomedicausernavbarComponent } from "../../navbars/biomedicausernavbar/biomedicausernavbar.component";
import { ArchivosService } from '../../../Services/appServices/general/archivos/archivos.service'
import Swal from 'sweetalert2';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Table } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from "primeng/card";
import { DatePicker } from 'primeng/datepicker'
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Dialog } from "primeng/dialog";
import { ProtocolosService } from '../../../Services/appServices/biomedicaServices/protocolos/protocolos.service';

@Component({
  selector: 'app-mantenimineto',
  standalone: true,
  imports: [CommonModule, TabsModule, BiomedicausernavbarComponent, DatePicker, FormsModule,
    TableModule, IconFieldModule, InputIconModule, InputTextModule, CalendarModule, CardModule, Dialog],
  templateUrl: './mantenimineto.component.html',
  styleUrl: './mantenimineto.component.css'
})
export class ManteniminetoComponent implements OnInit {

  @ViewChild('dt2') dt2!: Table;
  date: Date | undefined;
  reportesService = inject(ReportesService);
  router = inject(Router);
  archivosServices = inject(ArchivosService);
  protocolosServices = inject(ProtocolosService);
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

  reportSelected!: any;
  rutina!: any[];
  modalReport: boolean = false;


  constructor(private location: Location) { }

  async ngOnInit() {

    try {
      this.preventivos = await this.reportesService.getReportesPreventivosMesAño({ mes: this.mes, anio: this.anio });
      this.correctivos = await this.reportesService.getReportesCorrectivosMesAño({ mes: this.mes, anio: this.anio });
    } catch (error) {
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
      try {
        this.preventivos = await this.reportesService.getReportesPreventivosMesAño({ mes: this.mes, anio: this.anio });
        this.correctivos = await this.reportesService.getReportesCorrectivosMesAño({ mes: this.mes, anio: this.anio });
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
    this.panelPreventivos = true;
    this.panelCorrectivos = false;
    this.panelMetas = false;
  }
  viewCorrectivos() {
    this.panelPreventivos = false;
    this.panelCorrectivos = true;
    this.panelMetas = false;
  }
  viewMetas() {
    this.panelPreventivos = false;
    this.panelCorrectivos = false;
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

  onGlobalFilter(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (target) {
      this.dt2.filterGlobal(target.value, 'contains');
    }
  }

  nuevoReporte(idEquipo: number, idReporte: number) {
    sessionStorage.setItem('TipoMantenimiento', 'P');
    sessionStorage.setItem('idReporte', idReporte.toString());
    this.router.navigate(['biomedica/nuevoreporte/', idEquipo]);
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

  verReportesEquipo(id: number) {
    console.log("Ver Reportes Equipo: " + id);
    this.router.navigate(['/biomedica/reportesequipo/', id]);
  }

  verificarVencimiento(mes: any, anio: any): boolean {
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1;
    const anioActual = fechaActual.getFullYear();

    if (anioActual < anio) return true;

    if (anioActual === anio && mesActual <= mes) return true;

    return false;
  }

  async viewModalReport(reporte: any) {
    this.modalReport = true;
    this.reportSelected = await this.reportesService.getReporteById(reporte);
    this.rutina = await this.protocolosServices.getCumplimientoProtocoloReporte(this.reportSelected.id);
    console.log(this.reportSelected);
  }

  async viewPdf(ruta: string) {
    try {
      const blob = await this.archivosServices.getArchivo(ruta);
      if (blob.type === 'application/pdf') {
        const objectUrl = URL.createObjectURL(blob);
        window.open(objectUrl, '_blank'); // Abre el PDF en nueva pestaña
      } else {
        const errorText = await blob.text();
        console.error('No se recibió un PDF:', errorText);
      }
    } catch (error) {
      console.error('Error al obtener el PDF:', error);
    }
  }
}
