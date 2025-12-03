import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { EquiposService } from '../../../../Services/appServices/biomedicaServices/equipos/equipos.service';
import { ServicioService } from '../../../../Services/appServices/general/servicio/servicio.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { BiomedicausernavbarComponent } from '../../../navbars/biomedicausernavbar/biomedicausernavbar.component';
import { SplitButtonModule } from 'primeng/splitbutton';
import { Table } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MenuItem, MessageService } from 'primeng/api';
import { getDecodedAccessToken, obtenerNombreMes } from '../../../../utilidades';
import { Router } from '@angular/router';
@Component({
  selector: 'app-equipos-servicio',
  standalone: true,
  imports: [TableModule, CommonModule, BiomedicausernavbarComponent, IconFieldModule,
    InputIconModule, InputTextModule, SplitButtonModule],
  templateUrl: './equipos-servicio.component.html',
  styleUrl: './equipos-servicio.component.css'
})
export class EquiposServicioComponent implements OnInit {

  @ViewChild('dt2') dt2!: Table;
  equipos!: any[];
  servicio!: any;
  equipoServices = inject(EquiposService);
  servicioServices = inject(ServicioService);
  loading: boolean = false;
  items: MenuItem[] | undefined;

  constructor(
    private messageService: MessageService,
    private router: Router,) {

  }

  async ngOnInit() {

    const equiposdatos = await this.equipoServices.getAllEquiposServicio(localStorage.getItem("idServicio"));
    this.servicio = await this.servicioServices.getServicio(localStorage.getItem("idServicio"));

    this.equipos = equiposdatos.map((equipo: any) => ({
      ...equipo,
      opcionesHV: [
        {
          label: 'Editar',
          icon: 'pi pi-pencil',
          command: () => this.editarEquipo(equipo.id),
          visible: getDecodedAccessToken().rol === 'BIOMEDICAADMIN'
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
    console.log(getDecodedAccessToken());
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
