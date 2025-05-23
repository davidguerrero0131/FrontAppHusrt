import { Component, inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-equipos-tipo',
  standalone: true,
  imports: [FormsModule, CommonModule, TableModule, BiomedicausernavbarComponent, SplitButtonModule, SpeedDialModule],
  templateUrl: './equipos-tipo.component.html',
  styleUrl: './equipos-tipo.component.css'
})
export class EquiposTipoComponent implements OnInit {

  equipos!: any[];
  tipoEquipo!: any;
  equipoServices = inject(EquiposService);
  tipoEquipoServices = inject(TipoEquipoService);
  items: MenuItem[] | undefined;
  searchText: string = '';

  loading: boolean = false;


  constructor(
    private messageService: MessageService,
    private router: Router,
  ) { }

  async ngOnInit() {

     this.items = [
            {
                label: 'Editar',
                icon: 'pi pi-pencil',
                command: () => {
                    this.messageService.add({ severity: 'info', summary: 'Add', detail: 'Data Added' });
                },
            },
            {
                label: 'Nuevo reporte',
                icon: 'pi pi-upload',
                command: () => {
                    this.router.navigate(['/fileupload']);
                },
            },
            {
                label: 'Reportes',
                icon: 'pi pi-external-link',
                command: () => {
                    window.open('https://angular.io/', '_blank');
                },
            },
        ];

    this.equipos = await this.equipoServices.getAllEquiposTipo(localStorage.getItem('idTipoEquipo'));
    this.tipoEquipo = await this.tipoEquipoServices.getTipoEquipo(localStorage.getItem('idTipoEquipo'));
  }


  filteredTiposEquipos() {
    return this.equipos.filter(equipo => {
      const search = this.searchText.toLowerCase();
      return (
        equipo.nombres.toLowerCase().includes(search) ||
        equipo.marca.toLowerCase().includes(search) ||
        equipo.modelo.toLowerCase().includes(search) ||
        equipo.serie.toLowerCase().includes(search)
      );
    });
  }
}
