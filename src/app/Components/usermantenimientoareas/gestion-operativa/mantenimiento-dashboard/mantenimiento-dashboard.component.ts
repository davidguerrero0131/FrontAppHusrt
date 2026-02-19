import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { MantenimientoadminnavbarComponent } from '../../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import { PlanMantenimientoService } from '../../../../Services/appServices/areasFisicas/plan-mantenimiento.service';
import { InspeccionService } from '../../../../Services/appServices/areasFisicas/inspeccion.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-mantenimiento-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, CalendarModule, MantenimientoadminnavbarComponent],
    templateUrl: './mantenimiento-dashboard.component.html',
    styleUrl: './mantenimiento-dashboard.component.css'
})
export class MantenimientoDashboardComponent implements OnInit {
    private router = inject(Router);
    private planService = inject(PlanMantenimientoService);
    private inspeccionService = inject(InspeccionService);

    date: Date = new Date();
    mes: number = this.date.getMonth() + 1;
    anio: number = this.date.getFullYear();
    loading: boolean = false;

    preventivos: any[] = [];
    correctivos: any[] = [];

    panelPreventivos: boolean = true;
    panelCorrectivos: boolean = false;
    panelMetas: boolean = false;

    panelRealizados: boolean = true;
    panelPendientes: boolean = false;

    constructor() { }

    async ngOnInit() {
        await this.loadData();
    }

    async loadData() {
        this.loading = true;
        try {
            // 1. Fetch Preventive Maintenance Plans
            const allPlanes: any = await this.planService.getAllPlanes();
            let planes: any[] = [];
            if (Array.isArray(allPlanes)) planes = allPlanes;
            else if (allPlanes && allPlanes.data) planes = allPlanes.data;

            this.preventivos = planes.filter((p: any) => p.mes === this.mes && p.anio === this.anio);

            // 2. Fetch Correctives (Inspecciones)
            const allInspecciones: any = await this.inspeccionService.getAllInspecciones();
            let inspecs: any[] = [];
            if (Array.isArray(allInspecciones)) inspecs = allInspecciones;
            else if (allInspecciones && allInspecciones.data) inspecs = allInspecciones.data;

            this.correctivos = inspecs.filter((i: any) => {
                const d = new Date(i.fecha || i.fechaRealizacion);
                return d.getMonth() + 1 === this.mes && d.getFullYear() === this.anio;
            });

        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudieron cargar los datos', 'error');
        } finally {
            this.loading = false;
        }
    }

    async setDate() {
        if (this.date) {
            this.mes = this.date.getMonth() + 1;
            this.anio = this.date.getFullYear();
            await this.loadData();
        }
    }

    viewPreventivos() {
        this.panelPreventivos = true;
        this.panelCorrectivos = false;
        this.panelMetas = false;
    }

    viewCorrectivos() {
        this.panelPreventivos = false;
        this.panelCorrectivos = true;
        this.panelMetas = false;
    }

    viewMetas() {
        this.panelPreventivos = false;
        this.panelCorrectivos = false;
        this.panelMetas = true;
    }

    panelRealizadosView() {
        this.panelRealizados = true;
        this.panelPendientes = false;
    }

    panelPendientesView() {
        this.panelRealizados = false;
        this.panelPendientes = true;
    }

    backToDashboard() {
        this.router.navigate(['/adminmantenimiento/gestion-operativa']);
    }

    agendarMantenimiento() {
        this.router.navigate(['/areas/planes/crear'], {
            queryParams: {
                returnUrl: '/adminmantenimiento/gestion-operativa/mantenimiento'
            }
        });
    }

    obtenerNombreMes(numeroMes: number): string {
        const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        return meses[numeroMes - 1] || '';
    }

    // Helper for status classes
    getEstadoLabel(estado: number) {
        switch (estado) {
            case 0: return 'Pendiente'; // Display as Pendiente (will be red by CSS)
            case 1: return 'Pendiente';
            case 2: return 'En Proceso';
            case 3: return 'Completado';
            default: return 'Desconocido';
        }
    }

    // Helper getters for Metas panel
    get preventivosRealizados() {
        return this.preventivos.filter(p => p.estado === 3);
    }

    get preventivosPendientes() {
        return this.preventivos.filter(p => p.estado === 1 || p.estado === 0);
    }

    // Logic for Execution Window
    canRealizarInspeccion(plan: any): boolean {

        // If plan is completed, false
        if (plan.estado === 3) return false;

        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;
        const currentDay = today.getDate();

        const pAnio = Number(plan.anio);
        const pMes = Number(plan.mes);
        const pDiaInicio = Number(plan.diaRangoInicio);

        // Check if plan is in the FUTURE
        // If year is greater -> Future
        if (pAnio > currentYear) return false;

        // If same year and month is greater -> Future
        if (pAnio === currentYear && pMes > currentMonth) return false;

        // If same year, same month, and Start Day hasn't arrived -> Future
        if (pAnio === currentYear && pMes === currentMonth && pDiaInicio > currentDay) {
            return false;
        }

        // Otherwise (Past or Present) -> True
        return true;
    }

    // Helper for badge class
    getStatusClass(plan: any): string {
        if (plan.estado === 3) return 'status-3'; // Completed
        if (plan.estado === 2) return 'status-2'; // In Progress
        if (plan.estado === 0) return 'status-0'; // Cancelled/Red

        // If Pending (1), check if overdue
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;
        const currentDay = today.getDate();

        // Plan is from past year OR (same year and past month) -> Overdue
        if (plan.anio < currentYear || (plan.anio === currentYear && plan.mes < currentMonth)) {
            return 'status-0'; // Red
        }

        // Plan is current month, check if day passed
        if (plan.anio === currentYear && plan.mes === currentMonth) {
            if (currentDay > plan.diaRangoFin) {
                return 'status-0'; // Red
            }
        }

        // Future or current valid -> Yellow
        return 'status-1';
    }

    isFueraDeRango(plan: any): boolean {
        // Only show message if it's NOT completed AND cannot be executed (which now implies Future)
        if (plan.estado === 3) return false;
        return !this.canRealizarInspeccion(plan);
    }

    realizarInspeccion(plan: any) {
        const areaId = plan.area?.id || plan.areaIdFk;
        if (!areaId) {
            Swal.fire('Error', 'No se encontró la información del área para este mantenimiento.', 'error');
            return;
        }
        // Navigate to the inspection sheet (ManageInspeccionComponent)
        // Pass 'planMantenimientoId' as expected by the component
        this.router.navigate(['/areas/inspecciones/crear'], {
            queryParams: {
                planMantenimientoId: plan.id,
                areaId: areaId,
                returnUrl: '/adminmantenimiento/gestion-operativa/mantenimiento'
            }
        });
    }

    verDetalleInspeccion(plan: any) {
        const areaId = plan.area?.id || plan.areaIdFk;
        if (!areaId) {
            Swal.fire('Error', 'No se encontró la información del área.', 'error');
            return;
        }

        // Reuse the same component in 'view' mode (read-only)
        this.router.navigate(['/areas/inspecciones/crear'], {
            queryParams: {
                planMantenimientoId: plan.id,
                areaId: areaId,
                mode: 'view',
                returnUrl: '/adminmantenimiento/gestion-operativa/mantenimiento'
            }
        });
    }
}
