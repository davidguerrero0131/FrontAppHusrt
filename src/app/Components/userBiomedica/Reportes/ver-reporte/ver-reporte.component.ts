import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportesService } from '../../../../Services/appServices/biomedicaServices/reportes/reportes.service';
import { EquiposService } from '../../../../Services/appServices/biomedicaServices/equipos/equipos.service';
import { BiomedicausernavbarComponent } from '../../../navbars/biomedicausernavbar/biomedicausernavbar.component';
import { Table } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-ver-reporte',
  imports: [BiomedicausernavbarComponent, TableModule, IconFieldModule, InputIconModule, InputTextModule, SplitButtonModule, ButtonModule, CommonModule],
  templateUrl: './ver-reporte.component.html',
  styleUrl: './ver-reporte.component.css'
})
export class VerReporteComponent implements OnInit {
  @ViewChild('dt2') dt2!: Table;
  idEquipo: string | null = null;
  reportes!: any[];
  equipo!: any;
  reporteServices = inject(ReportesService);
  equipoService = inject(EquiposService);
  loading: boolean = false;

  constructor(private route: ActivatedRoute) { }


  async ngOnInit(){
      this.idEquipo = this.route.snapshot.paramMap.get('id');

      try {
        this.equipo = await this.equipoService.getEquipoById(this.idEquipo);
        this.reportes = await this.reporteServices.getReportesEquipo(this.idEquipo);
        console.log(this.reportes);
      } catch (error) {

      }
  }

    onGlobalFilter(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (target) {
      this.dt2.filterGlobal(target.value, 'contains');
    }
  }

}
