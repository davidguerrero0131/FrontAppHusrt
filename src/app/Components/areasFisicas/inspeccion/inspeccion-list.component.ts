import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { InspeccionService } from '../../../Services/appServices/areasFisicas/inspeccion.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-inspeccion-list',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TooltipModule, TagModule, RippleModule, ToolbarModule],
    templateUrl: './inspeccion-list.component.html',
    styleUrls: ['./inspeccion-list.component.css']
})
export class InspeccionListComponent implements OnInit {

    inspecciones: any[] = [];
    loading: boolean = true;

    inspeccionService = inject(InspeccionService);
    router = inject(Router);
    route = inject(ActivatedRoute);

    async ngOnInit() {
        await this.loadInspecciones();
    }

    async loadInspecciones() {
        this.loading = true;
        try {
            const data = await this.inspeccionService.getAllInspecciones();

            // Agrupar inspecciones por Fecha + Area + Usuario
            // Clave: fecha_areaId_usuarioId
            const grupos: any = {};

            // Leer filtro de área desde URL
            const params = await new Promise<any>(resolve => {
                this.route.queryParams.subscribe(p => resolve(p));
            });
            const filterAreaId = params['areaId'];

            data.forEach((ins: any) => {
                const fecha = ins.fecha ? new Date(ins.fecha).toISOString().split('T')[0] : 'Sin Fecha';
                const areaId = ins.areaElemento?.areas?.id || '0';

                // Si hay filtro y no coincide, saltar
                if (filterAreaId && areaId != filterAreaId) return;

                const usuarioId = ins.usuario?.id || '0';
                const planId = ins.planMantenimientoId || null;

                const key = `${fecha}_${areaId}_${usuarioId}`;

                if (!grupos[key]) {
                    grupos[key] = {
                        key: key,
                        fecha: fecha, // Mantener fecha original o string
                        areaId: areaId, // Guardar areaId para navegación
                        planMantenimientoId: planId, // Guardar planId para navegación
                        areaNombre: ins.areaElemento?.areas?.nombre || 'Sin Área',
                        usuarioNombre: `${ins.usuario?.nombres || ''} ${ins.usuario?.apellidos || ''}`.trim(),
                        totalElementos: 0,
                        detalles: []
                    };
                }

                grupos[key].totalElementos++;
                grupos[key].detalles.push(ins);
            });

            // Convertir objeto grupos a array
            this.inspecciones = Object.values(grupos);
            // Ordenar por fecha descendente
            this.inspecciones.sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudieron cargar las inspecciones', 'error');
        } finally {
            this.loading = false;
        }
    }

    crearInspeccion() {
        // En este flujo, la creación debería ser desde Planes, pero dejamos la opción por si acaso
        // O redirigimos a planes si se requiere area
        this.router.navigate(['/areas/planes/listado']);
    }

    editarInspeccion(id: number) {
        this.router.navigate(['/areas/inspecciones/editar', id]);
    }

    verDetalle(grupo: any) {
        // Navegar a manage-inspeccion en modo view
        // Se requiere planMantenimientoId o areaId (si no tiene plan)
        if (grupo.planMantenimientoId) {
            this.router.navigate(['/areas/inspecciones/crear'], {
                queryParams: {
                    planMantenimientoId: grupo.planMantenimientoId,
                    areaId: grupo.areaId,
                    mode: 'view'
                }
            });
        } else {
            // Si es una inspección antigua sin plan, intentar cargar por fecha/area (Backend pendiente para esto)
            // Por ahora solo soportamos ver detalle si tiene plan vinculado
            Swal.fire('Información', 'Esta inspección no está vinculada a un plan, no se puede ver el detalle completo.', 'info');
        }
    }

    async eliminarInspeccion(id: number) {
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
                await this.inspeccionService.deleteInspeccion(id);
                Swal.fire('Eliminado', 'La inspección ha sido eliminada.', 'success');
                await this.loadInspecciones();
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'No se pudo eliminar la inspección', 'error');
            }
        }
    }

    getEstadoLabel(estado: number): string {
        switch (estado) {
            case 1: return 'Bueno';
            case 2: return 'Malo';
            case 3: return 'Regular'; // Ejemplo
            default: return 'Desconocido';
        }
    }

    getEstadoSeverity(estado: number): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
        switch (estado) {
            case 1: return 'success';
            case 2: return 'danger';
            case 3: return 'warn';
            default: return undefined;
        }
    }
}
