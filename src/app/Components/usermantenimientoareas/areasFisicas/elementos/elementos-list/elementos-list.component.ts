import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ElementosService } from '../../../../../Services/appServices/areasFisicas/elementos.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { getDecodedAccessToken } from '../../../../../utilidades';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-elementos-list',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, IconFieldModule, InputIconModule, InputTextModule, TooltipModule, ToolbarModule, TagModule],
    templateUrl: './elementos-list.component.html',
    styleUrls: ['./elementos-list.component.css']
})
export class ElementosListComponent implements OnInit {

    @ViewChild('dt1') dt1!: Table;
    elementos: any[] = [];
    loading: boolean = true;
    elementosService = inject(ElementosService);
    isAdmin: boolean = false;

    constructor(private router: Router) { }

    async ngOnInit() {
        this.checkRole();
        await this.loadElementos();
    }

    checkRole() {
        const tokenData = getDecodedAccessToken();
        this.isAdmin = tokenData.rol === 'ADMINMANTENIMIENTO' || tokenData.rol === 'BIOMEDICAADMIN' || tokenData.rol === 'SUPERADMIN';
    }

    async loadElementos() {
        this.loading = true;
        try {
            this.elementos = await this.elementosService.getAllElementos();
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudieron cargar los elementos', 'error');
        } finally {
            this.loading = false;
        }
    }

    onGlobalFilter(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.dt1.filterGlobal(target.value, 'contains');
    }

    crearElemento() {
        this.router.navigate(['/elementos/crear']);
    }

    editarElemento(id: number) {
        this.router.navigate(['/elementos/editar', id]);
    }

    volver() {
        this.router.navigate(['/adminmantenimiento/inventario']);
    }

    async eliminarElemento(id: number) {
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
                    await this.elementosService.deleteElemento(id);
                    Swal.fire('Eliminado!', 'El elemento ha sido eliminado.', 'success');
                    this.loadElementos();
                } catch (error) {
                    Swal.fire('Error!', 'No se pudo eliminar el elemento.', 'error');
                }
            }
        })
    }

}
