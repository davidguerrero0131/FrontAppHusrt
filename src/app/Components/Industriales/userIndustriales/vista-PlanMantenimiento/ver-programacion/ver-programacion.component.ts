import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';

import { IndustrialesNavbarComponent } from '../../../../navbars/IndustrialesNavbar/industrialesnavbar.component';
import { PlanMantenimientoIndustrialesService } from '../../../../../Services/appServices/industrialesServices/planMantenimiento/planMantenimientoIndustriales.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-ver-programacion',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        IndustrialesNavbarComponent,
        ButtonModule,
        DropdownModule,
        OverlayPanelModule,
        TableModule
    ],
    templateUrl: './ver-programacion.component.html',
    styleUrl: './ver-programacion.component.css'
})
export class VerProgramacionComponent {
    private planService = inject(PlanMantenimientoIndustrialesService);
    private router = inject(Router);

    loading: boolean = false;

    // Variables para Selección
    selectedMes: any = null;
    selectedAnio: number = new Date().getFullYear();

    // Resultados
    planesProgramados: any[] = [];

    // Datos para Dropdowns
    meses: any[] = [
        { name: 'Enero', code: 1 },
        { name: 'Febrero', code: 2 },
        { name: 'Marzo', code: 3 },
        { name: 'Abril', code: 4 },
        { name: 'Mayo', code: 5 },
        { name: 'Junio', code: 6 },
        { name: 'Julio', code: 7 },
        { name: 'Agosto', code: 8 },
        { name: 'Septiembre', code: 9 },
        { name: 'Octubre', code: 10 },
        { name: 'Noviembre', code: 11 },
        { name: 'Diciembre', code: 12 }
    ];

    anios: any[] = [];

    constructor() {
        const currentYear = new Date().getFullYear();
        this.anios = [
            { label: (currentYear - 1).toString(), value: currentYear - 1 },
            { label: currentYear.toString(), value: currentYear },
            { label: (currentYear + 1).toString(), value: currentYear + 1 }
        ];
    }

    async cargarPlanesProgramados() {
        if (!this.selectedMes || !this.selectedAnio) return;

        this.loading = true;
        try {
            this.planesProgramados = await this.planService.getPlanesProgramados(this.selectedAnio, this.selectedMes.code);
            this.loading = false;
        } catch (error) {
            this.loading = false;
            console.error(error);
            Swal.fire('Error', 'No se pudieron cargar los planes', 'error');
        }
    }

    goBack() {
        this.router.navigate(['/adminindustriales']);
    }
}
