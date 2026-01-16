import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CardModule } from 'primeng/card';

import { IndustrialesNavbarComponent } from '../../../../navbars/IndustrialesNavbar/industrialesnavbar.component';
import { PlanMantenimientoIndustrialesService } from '../../../../../Services/appServices/industrialesServices/planMantenimiento/planMantenimientoIndustriales.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-programar-mantenimiento',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        IndustrialesNavbarComponent,
        ButtonModule,
        DropdownModule,
        OverlayPanelModule,
        CardModule
    ],
    templateUrl: './programar-mantenimiento.component.html',
    styleUrl: './programar-mantenimiento.component.css'
})
export class ProgramarMantenimientoComponent {
    private planService = inject(PlanMantenimientoIndustrialesService);
    private router = inject(Router);

    loading: boolean = false;

    // Variables para Selección
    selectedMes: any = null;
    selectedAnio: number = new Date().getFullYear();

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

    async programarMantenimientos() {
        if (!this.selectedMes || !this.selectedAnio) {
            Swal.fire('Atención', 'Seleccione mes y año', 'warning');
            return;
        }

        this.loading = true;
        try {
            const res = await this.planService.programarPlanes(this.selectedAnio, this.selectedMes.code);
            this.loading = false;

            Swal.fire({
                title: 'Programación Exitosa',
                text: `Se han programado ${res.registrosActualizados} planes para ${this.selectedMes.name} ${this.selectedAnio}`,
                icon: 'success'
            }).then(() => {
                // Redirigir al dashboard o limpiar? Mejor nos quedamos aquí por si quiere programar otro mes
                this.selectedMes = null;
            });
        } catch (error) {
            this.loading = false;
            console.error(error);
            Swal.fire('Error', 'No se pudo programar los mantenimientos', 'error');
        }
    }

    goBack() {
        this.router.navigate(['/adminindustriales']);
    }
}
