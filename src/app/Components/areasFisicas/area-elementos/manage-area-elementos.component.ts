import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { AreasService } from '../../../Services/appServices/areasFisicas/areas.service';
import { ElementosService } from '../../../Services/appServices/areasFisicas/elementos.service';
import { AreaElementoService } from '../../../Services/appServices/areasFisicas/area-elemento.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-manage-area-elementos',
    standalone: true,
    imports: [CommonModule, FormsModule, DropdownModule, CheckboxModule, ButtonModule, TooltipModule, CardModule],
    templateUrl: './manage-area-elementos.component.html',
    styleUrls: ['./manage-area-elementos.component.css']
})
export class ManageAreaElementosComponent implements OnInit {

    areas: any[] = [];
    selectedArea: any | null = null;

    allElementos: any[] = [];
    selectedElementos: any[] = []; // Array para los elementos seleccionados (ngModel del checkbox group)

    areasService = inject(AreasService);
    elementosService = inject(ElementosService);
    areaElementoService = inject(AreaElementoService);
    router = inject(Router);

    route = inject(ActivatedRoute);

    async ngOnInit() {
        await this.loadInitialData();

        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                const areaId = +id;
                const area = this.areas.find(a => a.id === areaId);
                if (area) {
                    this.selectedArea = area;
                    this.onAreaChange();
                }
            }
        });
    }

    async loadInitialData() {
        try {
            this.areas = await this.areasService.getAllAreas();
            this.areas.sort((a, b) => a.nombre.localeCompare(b.nombre));

            this.allElementos = await this.elementosService.getAllElementos();
            this.allElementos = this.allElementos.filter(e => e.estado === true);
        } catch (error) {
            console.error('Error cargando datos iniciales', error);
            Swal.fire('Error', 'No se pudieron cargar los datos necesarios', 'error');
        }
    }

    async onAreaChange() {
        if (!this.selectedArea) {
            this.selectedElementos = [];
            return;
        }

        try {
            // Obtener elementos asignados a esta área
            const asignaciones = await this.areaElementoService.getElementosByArea(this.selectedArea.id);

            // Los checkboxes comparan por referencia/valor. 
            // Necesitamos encontrar los objetos en 'allElementos' que coincidan con los IDs asignados
            const assignedIds = new Set(asignaciones.map((a: any) => a.elementoIdFk));

            this.selectedElementos = this.allElementos.filter(e => assignedIds.has(e.id));

        } catch (error) {
            console.error('Error cargando asignaciones', error);
            Swal.fire('Error', 'No se pudieron cargar las asignaciones del área', 'error');
        }
    }

    async guardar() {
        if (!this.selectedArea) {
            Swal.fire('Atención', 'Seleccione un área primero', 'warning');
            return;
        }

        try {
            // Smart Sync: El backend se encarga de desactivar/eliminar las asignaciones previas
            // Solo enviamos los elementos seleccionados (aunque esté vacío)

            const ids = this.selectedElementos.map(e => e.id);
            await this.areaElementoService.crearAsignacionBulk({
                areaIdFk: this.selectedArea.id,
                elementosIds: ids
            });

            Swal.fire('Éxito', 'Asignaciones guardadas correctamente', 'success');

        } catch (error) {
            console.error('Error guardando asignaciones', error);
            Swal.fire('Error', 'Ocurrió un error al guardar', 'error');
        }
    }

    volver() {
        this.router.navigate(['/areas/asignar-elementos']);
    }

}
