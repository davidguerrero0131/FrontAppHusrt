import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { MantenimientoadminnavbarComponent } from '../../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import { ReporteMantenimientoService } from '../../../../Services/appServices/areasFisicas/reporte-mantenimiento.service';
import { AreasService } from '../../../../Services/appServices/areasFisicas/areas.service';
import { ElementosService } from '../../../../Services/appServices/areasFisicas/elementos.service';
import { ServicioService } from '../../../../Services/appServices/general/servicio/servicio.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-all-reportes-list',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, TooltipModule, TagModule, MantenimientoadminnavbarComponent, DropdownModule, FormsModule],
    templateUrl: './all-reportes-list.component.html',
    styleUrl: './all-reportes-list.component.css'
})
export class AllReportesListComponent implements OnInit {

    router = inject(Router);
    reporteService = inject(ReporteMantenimientoService);
    areasService = inject(AreasService);
    elementosService = inject(ElementosService);
    servicioService = inject(ServicioService);

    reportes: any[] = [];
    filteredReportes: any[] = [];
    loading: boolean = true;

    // Filtros
    servicios: any[] = [];
    selectedServicio: any = null;

    allAreas: any[] = []; // Store all to filter locally
    areas: any[] = [];
    selectedArea: any = null;

    elementos: any[] = [];
    selectedElemento: any = null;

    async ngOnInit() {
        await this.loadInitialData();
        await this.loadReportes();
    }

    async loadInitialData() {
        try {
            this.servicios = await this.servicioService.getAllServicios();
            this.allAreas = await this.areasService.getAllAreas();
            this.areas = [...this.allAreas]; // Initially all areas
            this.elementos = await this.elementosService.getAllElementos();
        } catch (error) {
            console.error('Error cargando filtros', error);
        }
    }

    async loadReportes() {
        this.loading = true;
        try {
            const data: any = await this.reporteService.getAllReportes();
            if (Array.isArray(data)) {
                this.reportes = data;
                this.applyFilters();
            }
        } catch (error) {
            console.error('Error cargando reportes', error);
            Swal.fire('Error', 'No se pudieron cargar los reportes', 'error');
        } finally {
            this.loading = false;
        }
    }

    onServicioChange() {
        this.selectedArea = null; // Clear area selection
        if (this.selectedServicio) {
            // Filter areas by service
            this.areas = this.allAreas.filter(a => a.servicioIdFk === this.selectedServicio.id);
        } else {
            // Reset areas
            this.areas = [...this.allAreas];
        }
        this.applyFilters();
    }

    applyFilters() {
        this.filteredReportes = this.reportes.filter(reporte => {
            let matchServicio = true;
            let matchArea = true;
            let matchElemento = true;

            // Filter by Service
            if (this.selectedServicio) {
                // If report has area info
                const area = reporte.areaElemento?.areas;
                if (area && area.servicioIdFk) {
                    matchServicio = area.servicioIdFk === this.selectedServicio.id;
                } else {
                    // Fallback or loose check? For now strict
                    matchServicio = false;
                }
            }

            // Filter by Area (Overrides Service filter specificity if both present, but must match both logically)
            if (this.selectedArea) {
                const areaId = reporte.areaElemento?.areas?.id || reporte.areaElemento?.areaIdFk;
                matchArea = areaId === this.selectedArea.id;
            }

            // Filter by Elemento
            if (this.selectedElemento) {
                const elementoId = reporte.areaElemento?.elemento?.id || reporte.areaElemento?.elementoIdFk;
                matchElemento = elementoId === this.selectedElemento.id;
            }

            return matchServicio && matchArea && matchElemento;
        });

        // Sort
        this.filteredReportes.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    }

    verReporte(id: number) {
        this.router.navigate(['/areas/reportes/mantenimiento/editar', id], {
            queryParams: { returnUrl: '/adminmantenimiento/reportes-general' }
        });
    }

    backToDashboard() {
        this.router.navigate(['/adminmantenimiento/gestion-operativa']);
    }
}
