import { Component, inject, OnInit } from '@angular/core';
import { ResponsableService } from '../../../Services/appServices/biomedicaServices/responsable/responsable.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table'; // Added for TableModule
import { ButtonModule } from 'primeng/button'; // Added for ButtonModule

import { UppercaseDirective } from '../../../Directives/uppercase.directive';

@Component({
    selector: 'app-clasificacion-responsables',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, FormsModule, UppercaseDirective],
    templateUrl: './clasificacion-responsables.component.html',
    styleUrl: './clasificacion-responsables.component.css'
})
export class ClasificacionResponsablesComponent implements OnInit {

    responsables!: any[];
    cantidadesEquipos: { [id: number]: number } = {};
    responsableServices = inject(ResponsableService)
    searchText: string = '';

    constructor(private router: Router) {
    }

    async ngOnInit() {
        try {
            // Fetch all responsables, not just comodatos
            this.responsables = await this.responsableServices.getAllResponsables();

            for (let responsable of this.responsables) {
                this.obtenerCantidadEquipos(responsable.id);
            }
        } catch (error) {
            console.error('Error fetching responsables', error);
        }
    }

    async obtenerCantidadEquipos(idResponsable: number) {
        try {
            const cantidad = await this.responsableServices.getCantidadEquipos(idResponsable);
            this.cantidadesEquipos[idResponsable] = cantidad;
        } catch (error) {
            console.error(`Error al obtener la cantidad de equipos para el responsable ${idResponsable}`, error);
            this.cantidadesEquipos[idResponsable] = 0;
        }
    }


    filteredResponsable() {
        if (!this.responsables) return [];
        return this.responsables.filter(responsable =>
            responsable.nombres.toLowerCase().includes(this.searchText.toLowerCase())
        );
    }

    viewEquiposResponsable(idResponsable: any) {
        localStorage.setItem("idResponsable", idResponsable);
        this.router.navigate(['biomedica/equiposresponsable']);
    }
}
