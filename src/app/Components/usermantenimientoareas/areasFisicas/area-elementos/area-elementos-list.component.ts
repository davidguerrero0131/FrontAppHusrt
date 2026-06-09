import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { AreasService } from '../../../../Services/appServices/areasFisicas/areas.service';
import { AreaElementoService } from '../../../../Services/appServices/areasFisicas/area-elemento.service';
import { MantenimientoadminnavbarComponent } from '../../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import Swal from 'sweetalert2';
import { getDecodedAccessToken } from '../../../../utilidades';

@Component({
    selector: 'app-area-elementos-list',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TooltipModule, TagModule, BadgeModule, MantenimientoadminnavbarComponent],
    templateUrl: './area-elementos-list.component.html',
    styleUrls: ['./area-elementos-list.component.css']
})
export class AreaElementosListComponent implements OnInit {

    areas: any[] = [];
    loading: boolean = true;

    areasService = inject(AreasService);
    areaElementoService = inject(AreaElementoService);
    router = inject(Router);
    route = inject(ActivatedRoute);

    async ngOnInit() {
        await this.loadData();
    }

    async loadData() {
        this.loading = true;
        try {
            // 1. Obtener todas las áreas
            const areasData = await this.areasService.getAllAreas();

            // 2. Obtener todas las asignaciones
            const asignacionesData = await this.areaElementoService.getAllAsignaciones();

            // 3. Agrupar elementos por área
            const elementsMap: { [key: number]: string[] } = {};

            if (Array.isArray(asignacionesData)) {
                asignacionesData.forEach((asig: any) => {
                    if (asig && asig.areaIdFk) {
                        if (!elementsMap[asig.areaIdFk]) {
                            elementsMap[asig.areaIdFk] = [];
                        }
                        if (asig.elemento && asig.elemento.nombre) {
                            elementsMap[asig.areaIdFk].push(asig.elemento.nombre);
                        }
                    }
                });
            }

            // 4. Mapear áreas con conteo y lista de elementos
            this.areas = areasData.map((area: any) => ({
                ...area,
                elementosAsignados: elementsMap[area.id] || [],
                cantidadElementos: (elementsMap[area.id] || []).length
            }));

        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudieron cargar los datos', 'error');
        } finally {
            this.loading = false;
        }
    }

    gestionar(id: number) {
        this.router.navigate(['/areas/asignar-elementos/gestionar', id], { queryParams: { returnUrl: this.route.snapshot.queryParams['returnUrl'] } });
    }

    async eliminarAsignaciones(id: number) {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esto eliminará TODAS las asignaciones de elementos para esta área.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, limpiar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await this.areaElementoService.eliminarPorArea(id);
                Swal.fire('Eliminado', 'Las asignaciones han sido eliminadas.', 'success');
                await this.loadData();
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'No se pudieron eliminar las asignaciones', 'error');
            }
        }
    }
    location = inject(Location);

    backToDashboard() {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        if (returnUrl) {
            this.router.navigateByUrl(returnUrl);
        } else {
            const tokenData = getDecodedAccessToken();
            if (tokenData.rol === 'ADMINMANTENIMIENTO' || tokenData.rol === 'USERMANTENIMIENTO' || tokenData.rol === 'SUPERADMIN') {
                this.router.navigate(['/adminmantenimiento']);
            } else {
                this.router.navigate(['/adminmantenimiento/gestion-operativa']);
            }
        }
    }
}
