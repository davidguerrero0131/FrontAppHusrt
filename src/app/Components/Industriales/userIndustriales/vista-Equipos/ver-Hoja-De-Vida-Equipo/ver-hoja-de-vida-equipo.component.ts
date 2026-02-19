
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HojaDeVidaIndustrialService } from '../../../../../Services/appServices/industrialesServices/HojaDeVida/HojaDeVidaIndustrial.service';
import { EquiposIndustrialesService } from '../../../../../Services/appServices/industrialesServices/equipos/equiposIndustriales.service';
import Swal from 'sweetalert2';
import { API_URL } from '../../../../../constantes';


import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { DividerModule } from 'primeng/divider';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { IndustrialesNavbarComponent } from '../../../../navbars/IndustrialesNavbar/industrialesnavbar.component';

import { jwtDecode } from 'jwt-decode';

@Component({
    selector: 'app-ver-hoja-de-vida-equipo',
    standalone: true,
    imports: [
        CommonModule,
        InputTextModule,
        CardModule,
        ButtonModule,
        ImageModule,
        DividerModule,
        AccordionModule,
        TableModule,
        TooltipModule,
        DialogModule,
        ConfirmDialogModule
    ],
    templateUrl: './ver-hoja-de-vida-equipo.component.html',
    styleUrls: ['./ver-hoja-de-vida-equipo.component.css']
})
export class VerHojaDeVidaEquipoComponent implements OnInit {

    idEquipo: any;
    equipoInfo: any;
    hojaVida: any;
    datosTecnicos: any;
    proveedor: any;
    registroApoyo: any;
    documentos: any[] = [];
    loading: boolean = true;
    uploading: boolean = false;
    userRole: string = '';

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private hojaVidaService = inject(HojaDeVidaIndustrialService);
    private equipoService = inject(EquiposIndustrialesService);

    async ngOnInit() {
        this.loadUserRole();
        this.idEquipo = this.route.snapshot.paramMap.get('id');
        if (this.idEquipo) {
            await this.cargarDatos();
            await this.cargarDocumentos();
        }
    }

    loadUserRole() {
        const token = sessionStorage.getItem('utoken');
        if (token) {
            const decoded: any = this.getDecodedAccessToken(token);
            this.userRole = decoded ? decoded.rol : '';

            // Normalization for Role IDs and Names
            const rawRole = String(this.userRole);

            if (rawRole === '8' || rawRole === 'INDUSTRIALESADMIN' || rawRole === '1' || rawRole === 'SUPERADMIN' || rawRole === '2' || rawRole === 'SYSTEMADMIN') {
                this.userRole = 'INDUSTRIALESADMIN';
            } else if (rawRole === '9' || rawRole === 'INDUSTRIALESTECNICO' || rawRole === '7' || rawRole === 'BIOMEDICATECNICO') {
                this.userRole = 'INDUSTRIALESTECNICO';
            } else if (rawRole === '10' || rawRole === 'INDUSTRIALESUSER' || rawRole === '5' || rawRole === 'SYSTEMUSER' || rawRole === '6' || rawRole === 'BIOMEDICAUSER') {
                this.userRole = 'INDUSTRIALESUSER';
            } else {
                this.userRole = rawRole;
            }
        }
    }

    getDecodedAccessToken(token: string): any {
        try {
            return jwtDecode(token);
        } catch (Error) {
            return null;
        }
    }

    async cargarDatos() {
        try {
            this.loading = true;

            // Cargar Info Equipo
            this.equipoInfo = await this.equipoService.getEquipoById(this.idEquipo);

            // Cargar Entidades Relacionadas con Hoja de Vida
            // Usamos Promise.allSettled para que si una falla no detenga las otras (aunque deberían existir si el botón estaba habilitado)
            const results = await Promise.allSettled([
                this.hojaVidaService.getHojaVidaByEquipo(this.idEquipo),
                this.hojaVidaService.getDatosTecnicosByEquipo(this.idEquipo),
                this.hojaVidaService.getProveedorByEquipo(this.idEquipo),
                this.hojaVidaService.getRegistroApoyoByEquipo(this.idEquipo)
            ]);

            if (results[0].status === 'fulfilled') this.hojaVida = results[0].value;
            if (results[1].status === 'fulfilled') this.datosTecnicos = results[1].value;
            if (results[2].status === 'fulfilled') this.proveedor = results[2].value;
            if (results[3].status === 'fulfilled') this.registroApoyo = results[3].value;

            this.loading = false;
        } catch (error) {
            this.loading = false;
            console.error('Error cargando datos:', error);
            Swal.fire('Error', 'No se pudo cargar toda la información', 'error');
        }
    }

    async cargarDocumentos() {
        try {
            this.documentos = await this.hojaVidaService.getDocumentsByEquipo(this.idEquipo);
        } catch (error) {
            console.error('Error cargando documentos:', error);
        }
    }

    async onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                Swal.fire('Error', 'El archivo supera el límite de 10MB', 'error');
                return;
            }

            try {
                this.uploading = true;
                await this.hojaVidaService.uploadDocument(this.idEquipo, file);
                Swal.fire('Éxito', 'Documento subido correctamente', 'success');
                await this.cargarDocumentos();
            } catch (error) {
                console.error('Error subiendo documento:', error);
                Swal.fire('Error', 'No se pudo subir el documento', 'error');
            } finally {
                this.uploading = false;
                // Limpiar input
                event.target.value = '';
            }
        }
    }

    async eliminarDocumento(id: number) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await this.hojaVidaService.deleteDocument(id);
                    Swal.fire('Eliminado', 'El documento ha sido eliminado.', 'success');
                    await this.cargarDocumentos();
                } catch (error) {
                    Swal.fire('Error', 'No se pudo eliminar el documento', 'error');
                }
            }
        })
    }

    descargarDocumento(id: number) {
        this.hojaVidaService.downloadDocument(id).subscribe({
            next: (blob: Blob) => {
                const url = window.URL.createObjectURL(blob);
                window.open(url);
            },
            error: (error: any) => {
                console.error('Error al descargar documento:', error);
                Swal.fire('Error', 'No se pudo descargar el documento', 'error');
            }
        });
    }

    visualizarDocumento(id: number) {
        // Construct the URL with the token query parameter for inline viewing
        const token = sessionStorage.getItem('utoken');
        const url = `${API_URL}/api/industriales/doc-ind/view/${id}?token=${token}`;
        window.open(url, '_blank');
    }

    regresar() {
        this.router.navigate(['/adminequipos']);
    }
}
