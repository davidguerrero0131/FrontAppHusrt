import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { EquiposIndustrialesService } from '../../../../../Services/appServices/industrialesServices/equipos/equiposIndustriales.service';
import { TipoEquipoService } from '../../../../../Services/appServices/general/tipoEquipo/tipo-equipo.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule, Table } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-equipos-por-tipo-industrial',
    standalone: true,
    imports: [FormsModule, CommonModule, TableModule,
        IconFieldModule, InputIconModule, InputTextModule, ButtonModule, TagModule],
    templateUrl: './equipos-por-tipo-industrial.component.html',
    styleUrl: './equipos-por-tipo-industrial.component.css'
})
export class EquiposPorTipoIndustrialComponent implements OnInit {

    @ViewChild('dt2') dt2!: Table;
    equipos!: any[];
    tipoEquipo!: any;
    equipoServices = inject(EquiposIndustrialesService);
    tipoEquipoServices = inject(TipoEquipoService);

    loading: boolean = false;

    constructor(
        private router: Router
    ) { }

    async ngOnInit() {
        const idTipo = sessionStorage.getItem('idTipoEquipoIndustrial');
        if (idTipo) {
            this.loading = true;
            try {
                this.equipos = await this.equipoServices.getEquiposByTipo(Number(idTipo));
                this.tipoEquipo = await this.tipoEquipoServices.getTipoEquipo(idTipo);
            } catch (error) {
                console.error("Error cargando equipos del tipo", error);
            } finally {
                this.loading = false;
            }
        }
    }

    onGlobalFilter(event: Event): void {
        const target = event.target as HTMLInputElement | null;
        if (target) {
            this.dt2.filterGlobal(target.value, 'contains');
        }
    }

    verHojaVida(id: number) {
        this.router.navigate(['industriales/ver-hoja-de-vida/', id]);
    }

    editarEquipo(id: number) {
        this.router.navigate(['editar-equipo-industrial/', id]);
    }

    regresar() {
        this.router.navigate(['industriales/tiposequipo']);
    }
}
