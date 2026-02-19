import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { MantenimientoadminnavbarComponent } from '../../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import { ReporteMantenimientoService } from '../../../../Services/appServices/areasFisicas/reporte-mantenimiento.service';
import { AreasService } from '../../../../Services/appServices/areasFisicas/areas.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-reportes-area-list',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, TooltipModule, TagModule, MantenimientoadminnavbarComponent],
    templateUrl: './reportes-area-list.component.html',
    styleUrl: './reportes-area-list.component.css' // Assuming CSS exists or is empty, creating dummy if needed
})
export class ReportesAreaListComponent implements OnInit {

    router = inject(Router);
    route = inject(ActivatedRoute);
    reporteService = inject(ReporteMantenimientoService);
    areasService = inject(AreasService);

    areaId: number = 0;
    nombreArea: string = '';
    reportes: any[] = [];
    loading: boolean = true;
    servicioId: number = 0;

    async ngOnInit() {
        this.route.params.subscribe(async params => {
            this.areaId = +params['id'];
            if (this.areaId) {
                await this.loadInfoArea();
                await this.loadReportes();
            }
        });
    }

    async loadInfoArea() {
        try {
            const area = await this.areasService.getAreaById(this.areaId);
            if (area) {
                this.nombreArea = area.nombre;
                this.servicioId = area.servicioIdFk;
            }
        } catch (error) {
            console.error('Error cargando info area', error);
        }
    }

    async loadReportes() {
        this.loading = true;
        try {
            // Como no hay endpoint por area, traemos todos y filtramos
            // Esto no es óptimo, pero es lo que hay disponible.
            // Filtramos por areaElemento.areaIdFk o inspeccion.plan.areaId... es complejo.
            // Revisando ManageReporteMantenimiento, guarda areaElementoId.
            // Necesitamos saber si el elemento pertenece a esta área.

            const allReportes: any = await this.reporteService.getAllReportes();

            if (Array.isArray(allReportes)) {
                // Filtrar reportes que pertenezcan a esta área.
                // Reporte tiene 'areaElementoIdFk'. AreaElemento tiene 'areaIdFk'.
                // Si el reporte viene populado con AreaElemento -> Area, podemos filtrar.
                // Si no, la carga será pesada al tener que validar cada uno, o confiar en que el backend traiga la relación.

                // Asumiendo que el backend trae la relacion 'areaElemento' -> 'areas'.
                this.reportes = allReportes.filter((r: any) => {
                    // Caso 1: Reporte directo a un elemento del área
                    const areaDelElemento = r.areaElemento?.areas?.id || r.areaElemento?.areaIdFk;
                    if (areaDelElemento == this.areaId) return true;

                    // Caso 2: Reporte vinculado a una inspección de esta área
                    // r.inspeccion?.planMantenimiento?.areaIdFk o r.inspeccion?.areaElemento...
                    return false;
                });

                // Ordenar por fecha descendente
                this.reportes.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

            }
        } catch (error) {
            console.error('Error cargando reportes', error);
            Swal.fire('Error', 'No se pudieron cargar los reportes', 'error');
        } finally {
            this.loading = false;
        }
    }

    verReporte(id: number) {
        // Redirigir a editar (modo lectura si se implementa, o editar por ahora)
        this.router.navigate(['/areas/reportes/mantenimiento/editar', id], {
            queryParams: { returnUrl: `/adminmantenimiento/reportes-area/${this.areaId}` }
        });
    }

    backToDashboard() {
        if (this.servicioId) {
            this.router.navigate(['/adminmantenimiento/areas-por-servicio', this.servicioId]);
        } else {
            this.router.navigate(['/adminmantenimiento/servicios']);
        }
    }
}
