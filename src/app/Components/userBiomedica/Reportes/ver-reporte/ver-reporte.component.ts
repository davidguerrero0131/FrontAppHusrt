import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportesService } from '../../../../Services/appServices/biomedicaServices/reportes/reportes.service';
import { EquiposService } from '../../../../Services/appServices/biomedicaServices/equipos/equipos.service';
import { ProtocolosService } from '../../../../Services/appServices/biomedicaServices/protocolos/protocolos.service';
import { BiomedicausernavbarComponent } from '../../../navbars/biomedicausernavbar/biomedicausernavbar.component';
import { Table } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Dialog } from "primeng/dialog";
import { CardModule } from "primeng/card";
import { ArchivosService } from '../../../../Services/appServices/general/archivos/archivos.service'
import { Router } from '@angular/router';
@Component({
  selector: 'app-ver-reporte',
  standalone: true,
  imports: [BiomedicausernavbarComponent, TableModule, IconFieldModule, InputIconModule, InputTextModule, SplitButtonModule, ButtonModule, CommonModule, Dialog, CardModule],
  templateUrl: './ver-reporte.component.html',
  styleUrl: './ver-reporte.component.css'
})
export class VerReporteComponent implements OnInit {
  @ViewChild('dt2') dt2!: Table;
  idEquipo: string | null = null;
  reportes!: any[];
  rutina!: any[];
  equipo!: any;
  reporteServices = inject(ReportesService);
  equipoService = inject(EquiposService);
  archivosServices = inject(ArchivosService);
  protocolosServices = inject(ProtocolosService);
  router = inject(Router);
  loading: boolean = false;
  modalReport: boolean = false;
  reportSelected: any = null;

  constructor(private route: ActivatedRoute) { }

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

  async ngOnInit() {
    this.idEquipo = this.route.snapshot.paramMap.get('id');

    try {
      this.equipo = await this.equipoService.getEquipoById(this.idEquipo);
      this.reportes = await this.reporteServices.getReportesEquipo(this.idEquipo);
    } catch (error) {

    }
  }

  async viewModalReport(reporte: any) {
    this.modalReport = true;
    this.reportSelected = reporte;
    this.rutina = await this.protocolosServices.getCumplimientoProtocoloReporte(this.reportSelected.id);
  }

  onGlobalFilter(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (target) {
      this.dt2.filterGlobal(target.value, 'contains');
    }
  }

  editarReporte(idReporte: any, idEquipo: any){
    sessionStorage.setItem('TipoMantenimiento', 'P');
    sessionStorage.setItem('idReporte', idReporte.toString());
    this.router.navigate(['biomedica/nuevoreporte/', idEquipo]);
  }

}
