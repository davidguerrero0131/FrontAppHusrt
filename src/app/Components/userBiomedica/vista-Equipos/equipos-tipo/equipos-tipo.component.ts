import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { EquiposService } from '../../../../Services/appServices/biomedicaServices/equipos/equipos.service';
import { TipoEquipoService } from '../../../../Services/appServices/general/tipoEquipo/tipo-equipo.service';
import { MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { BiomedicausernavbarComponent } from '../../../navbars/biomedicausernavbar/biomedicausernavbar.component';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SpeedDialModule } from 'primeng/speeddial';
import { Table } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { getDecodedAccessToken, obtenerNombreMes } from '../../../../utilidades';
import { Console } from 'console';

@Component({
  selector: 'app-equipos-tipo',
  standalone: true,
  imports: [FormsModule, CommonModule, TableModule, BiomedicausernavbarComponent,
    SplitButtonModule, SpeedDialModule, IconFieldModule, InputIconModule, InputTextModule],
  templateUrl: './equipos-tipo.component.html',
  styleUrl: './equipos-tipo.component.css'
})
export class EquiposTipoComponent implements OnInit {

  @ViewChild('dt2') dt2!: Table;
  equipos!: any[];
  tipoEquipo!: any;
  equipoServices = inject(EquiposService);
  tipoEquipoServices = inject(TipoEquipoService);
  searchText: string = '';

  loading: boolean = false;

  constructor(
    private messageService: MessageService,
    private router: Router,
  ) { }

  async ngOnInit() {
    const idTipo = localStorage.getItem('idTipoEquipo');
    const equiposData = await this.equipoServices.getAllEquiposTipo(idTipo);

    this.equipos = equiposData.map((equipo: any) => ({
      ...equipo,
      opcionesHV: [
        {
          label: 'Editar',
          icon: 'pi pi-pencil',
          command: () => this.editarEquipo(equipo.id),
          visible:  getDecodedAccessToken().rol === 'BIOMEDICAADMIN'
        },
        {
          label: 'Ver Hoja de Vida',
          icon: 'pi pi-eye',
          command: () => this.verHojaVida(equipo.id)
        },
        {
          label: 'Reportes',
          icon: 'pi pi-external-link',
          command: () => this.verReportes(equipo.id)
        },
        {
          label: 'Nuevo reporte',
          icon: 'pi pi-upload',
          command: () => this.nuevoReporte(equipo.id)
        }
      ]
    }));

    this.tipoEquipo = await this.tipoEquipoServices.getTipoEquipo(idTipo);
  }


  onGlobalFilter(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (target) {
      this.dt2.filterGlobal(target.value, 'contains');
    }
  }

  verHojaVida(id: number) {
    console.log('Ver Hoja de Vida', id);
    this.router.navigate(['biomedica/hojavidaequipo/', id]);
  }

  editarEquipo(id: number) {
    //this.router.navigate(['/hojasvida', id, 'editar']);
    console.log('Editar Equipo', id);
    console.log( getDecodedAccessToken());
  }

  nuevoReporte(id: number) {
    console.log('Nuevo reporte del eqiuipo: ', id);
    sessionStorage.setItem('TipoMantenimiento', 'C');
    this.router.navigate(['biomedica/nuevoreporte/', id]);
  }

  verReportes(id: number) {
    console.log('Ver reportes del equipo: ', id);
    this.router.navigate(['biomedica/reportesequipo/', id]);
  }

}
