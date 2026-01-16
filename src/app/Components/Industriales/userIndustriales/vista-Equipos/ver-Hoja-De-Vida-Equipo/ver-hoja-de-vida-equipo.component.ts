
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HojaDeVidaIndustrialService } from '../../../../../Services/appServices/industrialesServices/HojaDeVida/HojaDeVidaIndustrial.service';
import { EquiposIndustrialesService } from '../../../../../Services/appServices/industrialesServices/equipos/equiposIndustriales.service';
import Swal from 'sweetalert2';
import { IndustrialesNavbarComponent } from '../../../../navbars/IndustrialesNavbar/industrialesnavbar.component';

@Component({
    selector: 'app-ver-hoja-de-vida-equipo',
    standalone: true,
    imports: [CommonModule, IndustrialesNavbarComponent],
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

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private hojaVidaService = inject(HojaDeVidaIndustrialService);
    private equipoService = inject(EquiposIndustrialesService);

    async ngOnInit() {
        this.idEquipo = this.route.snapshot.paramMap.get('id');
        if (this.idEquipo) {
            await this.cargarDatos();
            await this.cargarDocumentos();
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

    regresar() {
        this.router.navigate(['/adminequipos']);
    }
}
