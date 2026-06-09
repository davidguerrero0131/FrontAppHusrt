
import { Component, inject, OnInit } from '@angular/core';
import { SedeService } from '../../../Services/appServices/general/sede/sede.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { UppercaseDirective } from '../../../Directives/uppercase.directive';
import { TableModule } from 'primeng/table'; // Assuming this is where TableModule comes from
import { ButtonModule } from 'primeng/button'; // Assuming this is where ButtonModule comes from

@Component({
    selector: 'app-clasificacion-sedes',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, FormsModule, UppercaseDirective],
    templateUrl: './clasificacion-sedes.component.html',
    styleUrl: './clasificacion-sedes.component.css'
})
export class ClasificacionSedesComponent implements OnInit {

    sedes!: any[];
    sedeServices = inject(SedeService)
    searchText: string = '';

    constructor(private router: Router) {
    }

    async ngOnInit() {
        try {
            this.sedes = await this.sedeServices.getAllSedes();
        } catch {

        }
    }

    filteredSedes() {
        return this.sedes.filter(sede =>
            sede.nombres.toLowerCase().includes(this.searchText.toLowerCase())
        );
    }

    viewServiciosSede(idSede: any) {
        localStorage.setItem("idSede", idSede);
        this.router.navigate(['biomedica/serviciossede']);
    }
}
