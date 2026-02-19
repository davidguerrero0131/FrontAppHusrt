import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';


import { IndustrialesNavbarComponent } from '../../../../navbars/IndustrialesNavbar/industrialesnavbar.component';
import { PlanMantenimientoIndustrialesService } from '../../../../../Services/appServices/industrialesServices/planMantenimiento/planMantenimientoIndustriales.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-programar-mantenimiento',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        DropdownModule,
        OverlayPanelModule,
        CardModule,
        TableModule,
        TableModule,
        TagModule
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

    // Data Preview
    planesPreview: any[] = [];
    loadingPreview: boolean = false;

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

    // Método para disparar la carga cuando cambia el año
    onYearChange() {
        if (this.selectedMes) {
            this.cargarPreview();
        }
    }

    // Método para seleccionar mes y cargar preview
    selectMes(mes: any, overlay: any) {
        this.selectedMes = mes;
        overlay.hide();
        this.cargarPreview();
    }

    async cargarPreview() {
        if (!this.selectedMes || !this.selectedAnio) return;

        this.loadingPreview = true;
        try {
            // Reutilizamos el servicio que obtiene planes por periodo (mostrando todos: activos e inactivos)
            this.planesPreview = await this.planService.getPlanesByPeriodo(this.selectedAnio, this.selectedMes.code);
            this.loadingPreview = false;
        } catch (error) {
            console.error(error);
            this.loadingPreview = false;
        }
    }

    async programarMantenimientos() {
        if (!this.selectedMes || !this.selectedAnio) {
            Swal.fire('Atención', 'Seleccione mes y año', 'warning');
            return;
        }

        if (this.planesPreview.length === 0) {
            Swal.fire('Información', 'No hay planes para programar en este periodo.', 'info');
            return;
        }

        this.loading = true;
        try {
            // La función programarPlanes actualiza el estado a true de todos los planes del periodo
            const res = await this.planService.programarPlanes(this.selectedAnio, this.selectedMes.code);
            this.loading = false;

            Swal.fire({
                title: 'Programación Exitosa',
                text: `Se han activado los planes para ${this.selectedMes.name} ${this.selectedAnio}`,
                icon: 'success'
            }).then(() => {
                // Recargamos el preview para que se vean como activos
                this.cargarPreview();
            });
        } catch (error) {
            this.loading = false;
            console.error(error);
            Swal.fire('Error', 'No se pudo programar los mantenimientos', 'error');
        }
    }

    goBack() {
        this.router.navigate(['/industriales/ver-programacion']);
    }
}
