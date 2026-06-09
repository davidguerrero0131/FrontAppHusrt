import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { Table } from 'primeng/table';
import { EquiposService } from '../../../../Services/appServices/biomedicaServices/equipos/equipos.service';
import { UppercaseDirective } from '../../../../Directives/uppercase.directive';
import { PermissionsService } from '../../../../Services/auth/permissions.service';
import { PdfGeneratorService } from '../../../../Services/appServices/biomedicaServices/pdf-generator/pdf-generator.service';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ReportesService } from '../../../../Services/appServices/biomedicaServices/reportes/reportes.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-equipos-baja',
    standalone: true,
    imports: [
        CommonModule, 
        RouterModule, 
        TableModule, 
        TableModule, 
        ButtonModule, 
        InputTextModule, 
        IconFieldModule, 
        InputIconModule, 
        TooltipModule, 
        TagModule, 
        UppercaseDirective,
        DialogModule,
        ToastModule
    ],
    providers: [MessageService],
    templateUrl: './equipos-baja.component.html',
    styleUrl: './equipos-baja.component.css'
})
export class EquiposBajaComponent implements OnInit {
    @ViewChild('dt') dt!: Table;
    
    equipos: any[] = [];
    unauthorizedReports: any[] = [];
    showAuthModal: boolean = false;
    loading: boolean = false;
    loadingAuth: boolean = false;
    searchText: string = '';
    
    private equipoService = inject(EquiposService);
    private router = inject(Router);
    private permissionsService = inject(PermissionsService);
    private pdfService = inject(PdfGeneratorService);
    private messageService = inject(MessageService);
    private reportesService = inject(ReportesService);

    constructor() { }

    ngOnInit(): void {
        this.cargarEquiposBaja();
    }

    async cargarEquiposBaja() {
        this.loading = true;
        try {
            this.equipos = await this.equipoService.getAllEquiposBajas();
        } catch (error) {
            console.error('Error al cargar equipos de baja:', error);
        } finally {
            this.loading = false;
        }
    }

    onGlobalFilter(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (target && this.dt) {
            this.dt.filterGlobal(target.value, 'contains');
        }
    }

    verHojaVida(id: number) {
        this.router.navigate(['biomedica/hojavidaequipo', id]);
    }

    verReportes(id: number) {
        this.router.navigate(['biomedica/reportesequipo/', id]);
    }

    canAuthorize(): boolean {
        const role = this.permissionsService.getUserRole();
        const cargoId = this.permissionsService.getUserCargoId();
        return (role === 'BIOMEDICAADMIN' && cargoId === 4) || role === 'SUPERADMIN';
    }

    async abrirModalAutorizacion() {
        this.loadingAuth = true;
        this.showAuthModal = true;
        try {
            this.unauthorizedReports = await this.equipoService.getUnauthorizedBajas();
        } catch (error) {
            console.error('Error al cargar bajas no autorizadas:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las bajas pendientes' });
        } finally {
            this.loadingAuth = false;
        }
    }

    async confirmarBaja(reporteId: number) {
        try {
            const res = await Swal.fire({
                title: '¿Confirmar autorización?',
                text: "Esta acción autorizará la baja definitiva del equipo.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, autorizar',
                cancelButtonText: 'Cancelar'
            });

            if (res.isConfirmed) {
                await this.equipoService.authorizeBaja(reporteId);
                this.messageService.add({ severity: 'success', summary: 'Autorizado', detail: 'La baja ha sido autorizada correctamente' });
                this.unauthorizedReports = this.unauthorizedReports.filter(r => r.id !== reporteId);
                this.cargarEquiposBaja();
                if (this.unauthorizedReports.length === 0) {
                    this.showAuthModal = false;
                }
            }
        } catch (error) {
            console.error('Error al autorizar baja:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo autorizar la baja' });
        }
    }

    async descargarPdf(equipoId: number) {
        try {
            const reporte = await this.equipoService.getReporteBajaByEquipo(equipoId);
            if (reporte) {
                // Fetch maintenance history for Section 2 of PDF
                const historial = await this.reportesService.getReportesEquipo(equipoId);
                reporte.historialMantenimiento = historial || [];
                
                await this.pdfService.generateReporteBaja(reporte);
            } else {
                this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: 'No se encontró el reporte de baja para este equipo' });
            }
        } catch (error) {
            console.error('Error al descargar PDF:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo generar el PDF' });
        }
    }
}
