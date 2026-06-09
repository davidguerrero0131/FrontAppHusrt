import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { AreasService } from '../../../../Services/appServices/areasFisicas/areas.service';
import { CommonModule, Location } from '@angular/common';
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
import { Router, ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { getDecodedAccessToken } from '../../../../utilidades';
import { MantenimientoadminnavbarComponent } from '../../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import Swal from 'sweetalert2';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-areas-list',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, IconFieldModule, InputIconModule, InputTextModule, TooltipModule, ToolbarModule, TagModule, MenuModule, MantenimientoadminnavbarComponent],
    templateUrl: './areas-list.component.html',
    styleUrls: ['./areas-list.component.css']
})
export class AreasListComponent implements OnInit {

    @ViewChild('dt1') dt1!: Table;
    areas: any[] = [];
    loading: boolean = true;
    areasService = inject(AreasService);
    route = inject(ActivatedRoute);
    router = inject(Router);
    isAdmin: boolean = false;
    isUsuario: boolean = false;
    items: MenuItem[] | undefined;
    selectedArea: any;

    async ngOnInit() {
        this.checkRole();
        await this.loadAreas();
    }

    checkRole() {
        const tokenData = getDecodedAccessToken();
        this.isAdmin = tokenData.rol === 'ADMINMANTENIMIENTO' || tokenData.rol === 'USERMANTENIMIENTO' || tokenData.rol === 'BIOMEDICAADMIN' || tokenData.rol === 'SUPERADMIN';
        this.isUsuario = false; // USERMANTENIMIENTO ahora tiene permisos de admin;
    }

    async loadAreas() {
        this.loading = true;
        try {
            const data = await this.areasService.getAllAreas();
            const serviceId = this.route.snapshot.params['id'];

            if (serviceId) {
                this.areas = data.filter((a: any) => a.servicioIdFk == serviceId || a.servicioId == serviceId);
            } else {
                this.areas = data;
            }
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
        const serviceId = this.route.snapshot.params['id'];
        const queryParams: any = { returnUrl: this.router.url };
        if (serviceId) {
            queryParams['servicioId'] = serviceId;
        }
        this.router.navigate(['/areas/crear'], { queryParams });
    }

    verEquiposIndustriales() {
        const serviceId = this.route.snapshot.params['id'];
        const queryParams: any = { returnUrl: this.router.url };
        if (serviceId) {
            queryParams['servicioId'] = serviceId;
        }
        this.router.navigate(['/industriales/equipos'], { queryParams });
    }

    setMenuArea(area: any) {
        this.selectedArea = area;
        const isActive = area.estado === 1 || area.estado === true || area.estado == '1';
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
                        label: 'Gestionar plan',
                        icon: 'pi pi-calendar',
                        command: () => this.verPlanes(area.id),
                        visible: !this.isUsuario
                    },
                    {
                        label: 'Gestionar Elementos',
                        icon: 'pi pi-box',
                        command: () => this.verElementos(area.id),
                        visible: !this.isUsuario
                    },
                    {
                        label: 'Ver Detalle',
                        icon: 'pi pi-eye',
                        command: () => this.verDetalle(area.id)
                    },
                    {
                        separator: true,
                        visible: !this.isUsuario
                    },
                    {
                        label: 'Reportes',
                        icon: 'pi pi-file',
                        command: () => this.verReportes(area.id),
                        visible: !this.isUsuario
                    },
                    {
                        separator: true,
                        visible: this.isAdmin
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
        this.router.navigate(['/adminmantenimiento/mantenimientos-area', areaId], { queryParams: { returnUrl: this.router.url } });
    }

    verElementos(areaId: number) {
        this.router.navigate(['/areas/asignar-elementos/gestionar', areaId], { queryParams: { returnUrl: this.router.url } });
    }

    verDetalle(areaId: number) {
        this.router.navigate(['/areas/detalle', areaId], { queryParams: { returnUrl: this.router.url } });
    }

    verReportes(areaId: number) {
        this.router.navigate(['/adminmantenimiento/reportes-area', areaId], { queryParams: { returnUrl: this.router.url } });
    }

    editarArea(id: number) {
        this.router.navigate(['/areas/editar', id], { queryParams: { returnUrl: this.router.url } });
    }

    location = inject(Location);

    volver() {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        if (returnUrl) {
            this.router.navigateByUrl(returnUrl);
        } else {
            const serviceId = this.route.snapshot.params['id'];
            if (serviceId) {
                this.router.navigate(['/adminmantenimiento/servicios']);
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
