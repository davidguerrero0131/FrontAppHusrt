import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TableModule, Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { CalendarModule } from 'primeng/calendar';
import { ToolbarModule } from 'primeng/toolbar';
import { FilterService, FilterMatchMode } from 'primeng/api';
import { PlanMantenimientoService } from '../../../../Services/appServices/areasFisicas/plan-mantenimiento.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-plan-mantenimiento-list',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TooltipModule, DropdownModule, TagModule, CalendarModule, ToolbarModule],
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

    async ngOnInit() {
        this.registerCustomFilters();
        await this.loadPlanes();
    }

    registerCustomFilters() {
        this.filterService.register('dateRange', (value: any, filter: any): boolean => {
            // value = valor de la celda (Date), filter = [start, end] (Dates)
            if (this.filterService.filters['is'](value, filter)) return true; // Si es null ambos
            if (filter === undefined || filter === null || (filter.length === 0)) return true;

            const [start, end] = filter;
            if (!start && !end) return true;
            if (!value) return false;

            const valueDate = new Date(value);
            valueDate.setHours(0, 0, 0, 0);

            if (start && !end) {
                return valueDate >= start;
            }
            if (!start && end) {
                return valueDate <= end;
            }
            if (start && end) {
                return valueDate >= start && valueDate <= end;
            }
            return true;
        });
    }

    async loadPlanes() {
        this.loading = true;
        try {
            const data = await this.planService.getAllPlanes();
            this.planes = data.map((p: any) => ({
                ...p,
                fecha: new Date(p.anio, p.mes - 1, 1) // Fecha para el filtro (día 1 del mes)
            }));

            // Aplicar filtro si viene de params
            this.route.queryParams.subscribe(params => {
                const areaId = params['areaId'];
                if (areaId && this.planes.length > 0) {
                    // Buscar nombre de area si es posible para mostrar en filtro visual (opcional)
                    // O simplemente filtrar globalmente o por columna
                    // Como el filtro de tabla es por 'area.nombre', necesitamos el nombre, no el ID.
                    // Pero podemos filtrar manualmente la lista 'planes' antes de asignarla?
                    // Mejor: Filtramos la lista 'planes' directamente aquí.
                    this.planes = this.planes.filter(p => p.areaId == areaId);
                }
            });
        } catch (error) {
            console.error(error);
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

        if (plan.anio !== currentYear) return false;
        if (plan.mes !== currentMonth) return false;

        return currentDay >= plan.diaRangoInicio && currentDay <= plan.diaRangoFin;
    }

    realizarInspeccion(plan: any) {
        // Redirigir a crear inspección
        this.router.navigate(['/areas/inspecciones/crear'], { queryParams: { planMantenimientoId: plan.id, areaId: plan.areaId } });
    }

    verDetalle(plan: any) {
        // Redirigir a crear inspección en modo VISTA
        this.router.navigate(['/areas/inspecciones/crear'], { queryParams: { planMantenimientoId: plan.id, areaId: plan.areaId, mode: 'view' } });
    }
}
