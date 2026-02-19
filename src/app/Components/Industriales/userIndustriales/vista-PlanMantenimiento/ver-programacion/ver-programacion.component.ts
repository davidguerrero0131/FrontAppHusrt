import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule, Table } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';
import { TagModule } from 'primeng/tag';

import { IndustrialesNavbarComponent } from '../../../../navbars/IndustrialesNavbar/industrialesnavbar.component';
import { PlanMantenimientoIndustrialesService } from '../../../../../Services/appServices/industrialesServices/planMantenimiento/planMantenimientoIndustriales.service';
import { TipoEquipoService } from '../../../../../Services/appServices/general/tipoEquipo/tipo-equipo.service';
import { ServicioService } from '../../../../../Services/appServices/general/servicio/servicio.service';
import Swal from 'sweetalert2';

import { jwtDecode } from 'jwt-decode';

@Component({
    selector: 'app-ver-programacion',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        DropdownModule,
        TableModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        InputTextModule,
        DatePicker,
        DatePicker,
        TagModule
    ],
    templateUrl: './ver-programacion.component.html',
    styleUrl: './ver-programacion.component.css'
})
export class VerProgramacionComponent implements OnInit {

    @ViewChild('dt') dt!: Table;

    private planService = inject(PlanMantenimientoIndustrialesService);
    private tipoEquipoService = inject(TipoEquipoService);
    private servicioService = inject(ServicioService);
    private router = inject(Router);

    loading: boolean = false;

    // Panel State
    panelActivo: string = 'mantenimientos';
    activeSection: string = 'industrial'; // 'industrial' or 'fisica'

    // Sub-panels (Plan de Actividades)
    viewPlanMes: boolean = true;
    viewPlanTipoEquipo: boolean = false;
    viewPlanServicio: boolean = false;

    // Filters & Selection
    date: Date = new Date();
    mes: number = this.date.getMonth() + 1;
    anio: number = this.date.getFullYear();

    tiposEquipo: any[] = [];
    servicios: any[] = [];
    selectedTipoEquipo: any = null;
    selectedServicio: any = null;

    // Data Results
    equiposPlanPreventivoMes: any[] = [];
    equiposPlanMantenimientoTipoEquipo: any[] = [];
    equiposPlanMantenimientoServicio: any[] = [];

    // Cache
    allPlanesAnio: any[] = [];

    canProgram: boolean = true;
    userRole: string = '';

    constructor() { }

    async ngOnInit() {
        this.loadUserRole();
        await this.loadInitialData();
        // Auto-mark overdue plans as Pendiente
        try {
            await this.planService.actualizarPendientes();
        } catch (e) {
            console.warn('No se pudieron actualizar planes pendientes', e);
        }
        await this.setDate();
    }

    loadUserRole() {
        const token = sessionStorage.getItem('utoken');
        if (token) {
            const decoded: any = this.getDecodedAccessToken(token);
            this.userRole = decoded ? decoded.rol : '';

            // Normalization for Role IDs and Names
            const rawRole = String(this.userRole);

            if (rawRole === '8' || rawRole === 'INDUSTRIALESADMIN' || rawRole === '1' || rawRole === 'SUPERADMIN' || rawRole === '2' || rawRole === 'SYSTEMADMIN') {
                this.userRole = 'INDUSTRIALESADMIN';
            } else if (rawRole === '9' || rawRole === 'INDUSTRIALESTECNICO' || rawRole === '7' || rawRole === 'BIOMEDICATECNICO') {
                this.userRole = 'INDUSTRIALESTECNICO';
            } else if (rawRole === '10' || rawRole === 'INDUSTRIALESUSER' || rawRole === '5' || rawRole === 'SYSTEMUSER' || rawRole === '6' || rawRole === 'BIOMEDICAUSER') {
                this.userRole = 'INDUSTRIALESUSER';
            } else {
                this.userRole = rawRole;
            }
        }
    }

    getDecodedAccessToken(token: string): any {
        try {
            return jwtDecode(token);
        } catch (Error) {
            return null;
        }
    }

    async loadInitialData() {
        try {
            // Using await as these return Promises
            this.tiposEquipo = await this.tipoEquipoService.getAllTiposEquipos();
            this.servicios = await this.servicioService.getAllServicios();

            // Pre-load all plans for the year
            this.allPlanesAnio = await this.planService.getPlanesByAno(this.anio);
        } catch (error) {
            console.error('Error loading initial data', error);
        }
    }

    // --- Navigation Logic ---
    setPanel(panel: string) {
        this.panelActivo = panel;
    }

    setActiveSection(section: string) {
        if (section === 'fisica') {
            Swal.fire('Próximamente', 'Mantenimientos de Áreas Físicas estará disponible pronto.', 'info');
            return;
        }
        this.activeSection = section;
    }

    viewPanelMes() {
        this.viewPlanMes = true;
        this.viewPlanTipoEquipo = false;
        this.viewPlanServicio = false;
    }

    viewPanelTipoEquipo() {
        this.viewPlanMes = false;
        this.viewPlanTipoEquipo = true;
        this.viewPlanServicio = false;
    }

    viewPanelServicio() {
        this.viewPlanMes = false;
        this.viewPlanTipoEquipo = false;
        this.viewPlanServicio = true;
    }

    // --- Data Fetching ---

    async setDate() {
        if (this.date) {
            this.mes = this.date.getMonth() + 1;
            this.anio = this.date.getFullYear();

            this.loading = true;
            try {
                // Fetch ALL plans (active and inactive) to show what is scheduled vs pending
                const allPlans = await this.planService.getPlanesByPeriodo(this.anio, this.mes);
                // Filter to show ALL plans (Programmed, Not Programmed, Completed)
                this.equiposPlanPreventivoMes = allPlans;
                this.loading = false;
            } catch (error) {
                this.loading = false;
                console.error(error);
                Swal.fire('Error', 'No se pudieron cargar los planes', 'error');
            }
        }
    }

    async setTipoEquipo() {
        if (!this.selectedTipoEquipo) return;
        this.loading = true;

        if (!this.allPlanesAnio || this.allPlanesAnio.length === 0) {
            this.allPlanesAnio = await this.planService.getPlanesByAno(this.anio);
        }

        this.equiposPlanMantenimientoTipoEquipo = this.allPlanesAnio.filter((plan: any) =>
            plan.equipo && plan.equipo.tipoEquipoIdFk === this.selectedTipoEquipo.id && !plan.estado
        );
        this.loading = false;
    }

    async setServicio() {
        if (!this.selectedServicio) return;
        this.loading = true;

        if (!this.allPlanesAnio || this.allPlanesAnio.length === 0) {
            this.allPlanesAnio = await this.planService.getPlanesByAno(this.anio);
        }

        this.equiposPlanMantenimientoServicio = this.allPlanesAnio.filter((plan: any) =>
            plan.equipo && plan.equipo.servicioIdFk === this.selectedServicio.id && !plan.estado
        );
        this.loading = false;
    }

    async programarMantenimiento() {
        if (!this.mes || !this.anio) {
            Swal.fire('Atención', 'Seleccione mes y año', 'warning');
            return;
        }

        const confirmacion = await Swal.fire({
            title: '¿Está seguro?',
            text: `Se activarán los planes de mantenimiento para ${this.nombreMes()} ${this.anio}.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, programar',
            cancelButtonText: 'Cancelar'
        });

        if (confirmacion.isConfirmed) {
            this.loading = true;
            try {
                const res = await this.planService.programarPlanes(this.anio, this.mes);
                this.loading = false;

                Swal.fire({
                    title: 'Programación Exitosa',
                    text: `Se han activado ${res.registrosActualizados} planes para ${this.nombreMes()} ${this.anio}`,
                    icon: 'success'
                });

                // Refresh the list to show newly activated plans
                await this.setDate();

            } catch (error) {
                this.loading = false;
                console.error(error);
                Swal.fire('Error', 'No se pudo programar los mantenimientos', 'error');
            }
        }
    }

    nombreMes(): string {
        const meses = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];
        return meses[this.mes - 1] || '';
    }

    getNombreMes(mes: number): string {
        const meses = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];
        return meses[mes - 1] || '';
    }

    onGlobalFilter(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (target && this.dt) {
            this.dt.filterGlobal(target.value, 'contains');
        }
    }

    // --- Status Helpers ---
    getEstadoLabel(estado: number): string {
        const labels: { [key: number]: string } = {
            0: 'No Programado',
            1: 'Programado',
            2: 'Realizado',
            3: 'Completado',
            4: 'Pendiente'
        };
        return labels[estado] ?? 'Desconocido';
    }

    getEstadoSeverity(estado: number): string {
        const severities: { [key: number]: string } = {
            0: 'warn',
            1: 'info',
            2: 'success',
            3: 'success',
            4: 'danger'
        };
        return severities[estado] ?? 'secondary';
    }

    goBack() {
        this.router.navigate(['/adminindustriales']);
    }

    realizarReporte(plan: any) {
        console.log('DEBUG: realizarReporte for plan:', plan);
        if (!plan.equipo) {
            console.error('DEBUG: Plan has no equipo:', plan);
            Swal.fire('Error', 'El plan no tiene equipo asociado', 'error');
            return;
        }

        if (!plan.id) {
            console.error('DEBUG: Plan has no ID:', plan);
            Swal.fire('Error', 'El plan no tiene ID válido', 'error');
            return;
        }

        // Save data to session for the Create Report component
        sessionStorage.setItem('idEquipoIndustrial', plan.equipo.id);
        sessionStorage.setItem('idPlanMantenimientoIndustrial', String(plan.id));

        console.log('DEBUG: Saved to session - idPlan:', plan.id);

        // Navigate
        this.router.navigate(['/industriales/crear-reporte', plan.equipo.id]);
    }
}
