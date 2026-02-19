import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { AreasService } from '../../../../Services/appServices/areasFisicas/areas.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { getDecodedAccessToken } from '../../../../utilidades';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-areas-list',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, IconFieldModule, InputIconModule, InputTextModule, TooltipModule, ToolbarModule, TagModule, MenuModule],
    templateUrl: './areas-list.component.html',
    styleUrls: ['./areas-list.component.css']
})
export class AreasListComponent implements OnInit {

    @ViewChild('dt1') dt1!: Table;
    areas: any[] = [];
    loading: boolean = true;
    areasService = inject(AreasService);
    isAdmin: boolean = false;
    items: MenuItem[] | undefined;
    selectedArea: any;

    constructor(private router: Router) { }

    async ngOnInit() {
        this.checkRole();
        await this.loadAreas();
    }

    checkRole() {
        const tokenData = getDecodedAccessToken();
        this.isAdmin = tokenData.rol === 'ADMINMANTENIMIENTO' || tokenData.rol === 'BIOMEDICAADMIN' || tokenData.rol === 'SUPERADMIN';
    }

    async loadAreas() {
        this.loading = true;
        try {
            this.areas = await this.areasService.getAllAreas();
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudieron cargar las áreas', 'error');
        } finally {
            this.loading = false;
        }
    }

    onGlobalFilter(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.dt1.filterGlobal(target.value, 'contains');
    }

    crearArea() {
        this.router.navigate(['/areas/crear']);
    }

    setMenuArea(area: any) {
        this.selectedArea = area;
        this.items = [
            {
                label: 'Opciones',
                items: [
                    {
                        label: 'Editar',
                        icon: 'pi pi-pencil',
                        command: () => this.editarArea(area.id),
                        visible: this.isAdmin
                    },
                    {
                        label: 'Gestionar Planes',
                        icon: 'pi pi-calendar',
                        command: () => this.verPlanes(area.id)
                    },
                    {
                        label: 'Ver Inspecciones',
                        icon: 'pi pi-check-square',
                        command: () => this.verInspecciones(area.id)
                    },
                    {
                        label: 'Gestionar Elementos',
                        icon: 'pi pi-box',
                        command: () => this.verElementos(area.id)
                    },
                    {
                        label: 'Ver Detalle',
                        icon: 'pi pi-eye',
                        command: () => this.verDetalle(area.id)
                    },
                    {
                        separator: true
                    },
                    {
                        label: 'Reportes',
                        icon: 'pi pi-file',
                        command: () => { }
                    },
                    {
                        separator: true
                    },
                    {
                        label: 'Eliminar',
                        icon: 'pi pi-trash',
                        command: () => this.eliminarArea(area.id),
                        visible: this.isAdmin,
                        styleClass: 'text-danger'
                    }
                ]
            }
        ];
    }

    verPlanes(areaId: number) {
        this.router.navigate(['/adminmantenimiento/mantenimientos-area', areaId]);
    }

    verInspecciones(areaId: number) {
        this.router.navigate(['/adminmantenimiento/inspecciones-area', areaId]);
    }

    verElementos(areaId: number) {
        this.router.navigate(['/adminmantenimiento/elementos-area', areaId]);
    }

    verDetalle(areaId: number) {
        this.router.navigate(['/adminmantenimiento/detalle-area', areaId]);
    }

    editarArea(id: number) {
        this.router.navigate(['/areas/editar', id]);
    }

    volver() {
        this.router.navigate(['/adminmantenimiento']);
    }

    async eliminarArea(id: number) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await this.areasService.deleteArea(id);
                    Swal.fire('Eliminado!', 'El área ha sido eliminada.', 'success');
                    this.loadAreas();
                } catch (error) {
                    Swal.fire('Error!', 'No se pudo eliminar el área.', 'error');
                }
            }
        })
    }
}
