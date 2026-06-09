import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { AreasService } from '../../../../Services/appServices/areasFisicas/areas.service';
import { ElementosService } from '../../../../Services/appServices/areasFisicas/elementos.service';
import { AreaElementoService } from '../../../../Services/appServices/areasFisicas/area-elemento.service';
import { MantenimientoadminnavbarComponent } from '../../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import Swal from 'sweetalert2';

import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-manage-area-elementos',
    standalone: true,
    imports: [CommonModule, FormsModule, SelectModule, CheckboxModule, ButtonModule, TooltipModule, CardModule, MantenimientoadminnavbarComponent, InputTextModule],
    templateUrl: './manage-area-elementos.component.html',
    styleUrls: ['./manage-area-elementos.component.css']
})
export class ManageAreaElementosComponent implements OnInit {

    selectedArea: any | null = null;
    allElementos: any[] = [];
    selectedElementos: any[] = [];
    searchTerm: string = '';

    areasService = inject(AreasService);
    elementosService = inject(ElementosService);
    areaElementoService = inject(AreaElementoService);
    router = inject(Router);
    route = inject(ActivatedRoute);

    filteredElementos() {
        if (!this.searchTerm) return this.allElementos;
        return this.allElementos.filter(e =>
            e.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
    }

    isSelected(elemento: any): boolean {
        if (!elemento || !this.selectedElementos) return false;
        return this.selectedElementos.some(e => Number(e.id) === Number(elemento.id));
    }

    toggleElement(elemento: any) {
        // Prevent toggling if the element is inactive
        if (elemento.estado === false || elemento.estado === 0 || elemento.estado === '0') {
            return;
        }

        const index = this.selectedElementos.findIndex(e => e.id === elemento.id);
        if (index > -1) {
            this.selectedElementos.splice(index, 1);
        } else {
            this.selectedElementos.push({ ...elemento, cantidad: 1 });
        }
    }

    getCantidad(elemento: any): number {
        const selected = this.selectedElementos.find(e => e.id === elemento.id);
        return selected ? selected.cantidad : 1;
    }

    setCantidad(elemento: any, cant: number) {
        const selected = this.selectedElementos.find(e => e.id === elemento.id);
        if (selected) {
            selected.cantidad = cant;
        }
    }

    async ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            await this.loadInitialData(+id);
        } else {
            // Si no hay ID, volvemos al listado ya que no se puede gestionar sin área
            this.backToDashboard();
        }
    }

    async loadInitialData(areaId: number) {
        try {
            // 1. Cargar el área específica
            const allAreas = await this.areasService.getAllAreas();
            this.selectedArea = allAreas.find((a: any) => a.id === areaId);

            if (!this.selectedArea) {
                Swal.fire('Error', 'El área especificada no existe', 'error');
                this.backToDashboard();
                return;
            }

            // 2. Cargar todos los elementos (incluyendo inactivos)
            this.allElementos = await this.elementosService.getAllElementos();
            this.allElementos.sort((a, b) => a.nombre.localeCompare(b.nombre));

            // 3. Cargar asignaciones actuales
            await this.loadAsignaciones();

        } catch (error) {
            console.error('Error cargando datos iniciales', error);
            Swal.fire('Error', 'No se pudieron cargar los datos necesarios', 'error');
        }
    }

    async loadAsignaciones() {
        if (!this.selectedArea) return;
        try {
            const asignaciones = await this.areaElementoService.getElementosByArea(this.selectedArea.id);
            const assignedMap = new Map();
            asignaciones.forEach((a: any) => {
                assignedMap.set(a.elementoIdFk, a.cantidad || 1);
            });
            this.selectedElementos = this.allElementos
                .filter(e => assignedMap.has(e.id))
                .map(e => ({ ...e, cantidad: assignedMap.get(e.id) }));
        } catch (error) {
            console.error('Error cargando asignaciones', error);
        }
    }

    async guardar() {
        if (!this.selectedArea) {
            Swal.fire('Atención', 'Seleccione un área primero', 'warning');
            return;
        }

        try {
            const elementosPayload = this.selectedElementos.map(e => ({
                id: e.id,
                cantidad: e.cantidad || 1
            }));
            await this.areaElementoService.crearAsignacionBulk({
                areaIdFk: this.selectedArea.id,
                elementos: elementosPayload
            });

            await Swal.fire('Éxito', 'Asignaciones guardadas correctamente', 'success');
            this.backToDashboard(); // REDIRECCIÓN SOLICITADA: Volver al listado tras crear/editar

        } catch (error) {
            console.error('Error guardando asignaciones', error);
            Swal.fire('Error', 'Ocurrió un error al guardar', 'error');
        }
    }

    location = inject(Location);

    backToDashboard() {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        if (returnUrl) {
            this.router.navigateByUrl(returnUrl);
        } else {
            this.location.back();
        }
    }
}
