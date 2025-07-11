import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { EquiposService } from '../../../../Services/appServices/biomedicaServices/equipos/equipos.service';
import { ResponsableService } from '../../../../Services/appServices/biomedicaServices/responsable/responsable.service';
import { BiomedicausernavbarComponent } from '../../../navbars/biomedicausernavbar/biomedicausernavbar.component';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { MenuItem, MessageService } from 'primeng/api';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SpeedDialModule } from 'primeng/speeddial';
import { Table } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { getDecodedAccessToken, obtenerNombreMes } from '../../../../utilidades';
import { Router } from '@angular/router';

@Component({
  selector: 'app-equipos-comodatos',
  standalone: true,
  imports: [BiomedicausernavbarComponent, CommonModule, TableModule,
    IconFieldModule, InputIconModule, InputTextModule, SpeedDialModule, SplitButtonModule
  ],
  templateUrl: './equipos-comodatos.component.html',
  styleUrl: './equipos-comodatos.component.css'
})
export class EquiposComodatosComponent implements OnInit {

  @ViewChild('dt2') dt2!: Table;
  equipos!: any[];
  items: MenuItem[] | undefined;
  responsable!: any;
  equiposServices = inject(EquiposService);
  responsableServices = inject(ResponsableService);
  loading: boolean = false;

  constructor(
    private messageService: MessageService,
    private router: Router,
  ) { }

  async ngOnInit() {
    const equiposdatos = await this.equiposServices.getAllEquiposComodatos(localStorage.getItem("idResponsable"));
    this.responsable = await this.responsableServices.getResponsableComodatos(localStorage.getItem("idResponsable"));

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
    this.router.navigate(['biomedica/nuevoreporte/', id]);
  }

  verReportes(id: number) {
    console.log('Ver reportes del equipo: ', id);
    this.router.navigate(['biomedica/reportesequipos/', id]);
  }
}
