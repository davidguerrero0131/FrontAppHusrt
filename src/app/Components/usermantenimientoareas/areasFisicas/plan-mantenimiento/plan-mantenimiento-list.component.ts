import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TableModule, Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { CalendarModule } from 'primeng/calendar';
import { ToolbarModule } from 'primeng/toolbar';
import { TabViewModule } from 'primeng/tabview';
import { FilterService, FilterMatchMode } from 'primeng/api';
import { PlanMantenimientoService } from '../../../../Services/appServices/areasFisicas/plan-mantenimiento.service';
import { MantenimientoadminnavbarComponent } from '../../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import { ProgramacionMantenimientoComponent } from '../../gestion-operativa/programacion-mantenimiento/programacion-mantenimiento.component';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-plan-mantenimiento-list',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TooltipModule, SelectModule, TagModule, CalendarModule, ToolbarModule, TabViewModule, MantenimientoadminnavbarComponent, ProgramacionMantenimientoComponent],
    templateUrl: './plan-mantenimiento-list.component.html',
    styleUrls: ['./plan-mantenimiento-list.component.css']
})
export class PlanMantenimientoListComponent implements OnInit {

    planes: any[] = [];
    loading: boolean = true;

    planService = inject(PlanMantenimientoService);
    router = inject(Router);
    route = inject(ActivatedRoute);
    filterService = inject(FilterService);

    @ViewChild('dt') dt!: Table;

    estadoOptions = [
        { label: 'Cancelado', value: 0 },
        { label: 'Pendiente', value: 1 },
        { label: 'En Proceso', value: 2 },
        { label: 'Completado', value: 3 }
    ];

    meses = [
        { label: 'Enero', value: 1 }, { label: 'Febrero', value: 2 },
        { label: 'Marzo', value: 3 }, { label: 'Abril', value: 4 },
        { label: 'Mayo', value: 5 }, { label: 'Junio', value: 6 },
        { label: 'Julio', value: 7 }, { label: 'Agosto', value: 8 },
        { label: 'Septiembre', value: 9 }, { label: 'Octubre', value: 10 },
        { label: 'Noviembre', value: 11 }, { label: 'Diciembre', value: 12 }
    ];

    nombreReferencia: string = ''; // Nombre del Área o Servicio actual
    currentAreaId?: number;

    async ngOnInit() {
        this.registerCustomFilters();
        await this.loadPlanes();
    }

    registerCustomFilters() {
        // ... mismo código de filtros ...
    }

    /**
     * Carga los planes de mantenimiento y aplica filtros según el contexto (Área o Servicio)
     * detectado en la URL o parámetros de consulta.
     */
    async loadPlanes() {
        this.loading = true;
        try {
            const data = await this.planService.getAllPlanes();
            const processedPlanes = data.filter((p: any) => Number(p.estado) !== 4).map((p: any) => ({
                ...p,
                fecha: new Date(p.anio, p.mesInicio ? p.mesInicio - 1 : 0, 1)
            }));

            // Detección automática de contexto por URL
            const pathId = this.route.snapshot.params['id'];
            const isServicePath = this.router.url.includes('mantenimientos-servicio');
            const isAreaPath = this.router.url.includes('mantenimientos-area');

            this.route.queryParams.subscribe(params => {
                const areaId = params['areaId'] || (isAreaPath ? pathId : null);
                const serviceId = params['serviceId'] || (isServicePath ? pathId : null);

                if (areaId) {
                    this.currentAreaId = Number(areaId);
                    this.planes = processedPlanes.filter((p: any) => (p.areaId == areaId || p.area?.id == areaId));
                    if (this.planes.length > 0) {
                        this.nombreReferencia = this.planes[0].area?.nombre || 'Área';
                    }
                } else if (serviceId) {
                    this.planes = processedPlanes.filter((p: any) => (p.area?.servicioId == serviceId || p.area?.servicioIdFk == serviceId));
                    if (this.planes.length > 0) {
                        this.nombreReferencia = this.planes[0].area?.servicio?.nombre || 'Servicio';
                    }
                } else {
                    this.planes = processedPlanes;
                    this.nombreReferencia = 'Global';
                }
            });
        } catch (error) {
            console.error('Error cargando planes:', error);
            Swal.fire('Error', 'No se pudieron cargar los planes', 'error');
        } finally {
            this.loading = false;
        }
    }

    crearPlan() {
        this.router.navigate(['/areas/planes/crear']);
    }

    editarPlan(id: number) {
        this.router.navigate(['/areas/planes/editar', id]);
    }

    async eliminarPlan(id: number) {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás revertir esto',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await this.planService.deletePlan(id);
                Swal.fire('Eliminado', 'El plan ha sido eliminado.', 'success');
                await this.loadPlanes();
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'No se pudo eliminar el plan', 'error');
            }
        }
    }

    getEstadoLabel(estado: number): string {
        switch (estado) {
            case 0: return 'Cancelado';
            case 1: return 'Pendiente';
            case 2: return 'En Proceso';
            case 3: return 'Completado';
            default: return 'Desconocido';
        }
    }

    getEstadoSeverity(estado: number): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
        switch (estado) {
            case 0: return 'danger';
            case 1: return 'warn';
            case 2: return 'info';
            case 3: return 'success';
            default: return undefined;
        }
    }

    getMesLabel(mes: number): string {
        const found = this.meses.find(m => m.value === mes);
        return found ? found.label : mes.toString();
    }

    isInspectionAvailable(plan: any): boolean {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1; // getMonth() es 0-indexado
        const currentDay = today.getDate();

        const pAnio = Number(plan.anio);
        const pMes = Number(plan.mesInicio);
        const pDiaInicio = Number(plan.diaRangoInicio);

        // Si es en el futuro, no se puede
        if (pAnio > currentYear) return false;
        if (pAnio === currentYear && pMes > currentMonth) return false;
        if (pAnio === currentYear && pMes === currentMonth && pDiaInicio > currentDay) {
            return false;
        }

        // Pasado o presente -> Sí se puede
        return true;
    }

    realizarInspeccion(plan: any) {
        // Redirigir a crear inspección
        this.router.navigate(['/areas/inspecciones/crear'], { queryParams: { planMantenimientoId: plan.id, areaId: plan.areaId } });
    }

    verDetalle(plan: any) {
        // Redirigir a crear inspección en modo VISTA
        this.router.navigate(['/areas/inspecciones/crear'], { queryParams: { planMantenimientoId: plan.id, areaId: plan.areaId, mode: 'view' } });
    }

    location = inject(Location);

    backToDashboard() {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        if (returnUrl) {
            this.router.navigateByUrl(returnUrl);
        } else {
            this.router.navigate(['/adminmantenimiento/gestion-operativa']);
        }
    }
}
