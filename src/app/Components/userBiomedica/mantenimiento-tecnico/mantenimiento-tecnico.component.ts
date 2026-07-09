import { Component, inject, OnInit, ViewChild, PLATFORM_ID, ElementRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { PdfGeneratorService } from '../../../Services/appServices/biomedicaServices/pdf-generator/pdf-generator.service';
import { BiomedicausernavbarComponent } from "../../navbars/biomedicausernavbar/biomedicausernavbar.component";
import { TableModule } from 'primeng/table';
import { Table } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from "primeng/card";
import { DialogModule } from 'primeng/dialog';
import { ReportesService } from '../../../Services/appServices/biomedicaServices/reportes/reportes.service';
import { ArchivosService } from '../../../Services/appServices/general/archivos/archivos.service';
import { ProtocolosService } from '../../../Services/appServices/biomedicaServices/protocolos/protocolos.service';
import { Router, RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { TagModule } from 'primeng/tag';
import SignaturePad from 'signature_pad';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';

import { UppercaseDirective } from '../../../Directives/uppercase.directive';

@Component({
    selector: 'app-mantenimiento-tecnico',
    standalone: true,
    imports: [CommonModule, TabsModule, TableModule, IconFieldModule, InputIconModule, InputTextModule, CardModule, DialogModule, ButtonModule, TooltipModule, DatePickerModule, FormsModule, TagModule, RouterModule, UppercaseDirective],
    templateUrl: './mantenimiento-tecnico.component.html',
    styleUrl: './mantenimiento-tecnico.component.css'
})
export class MantenimientoTecnicoComponent implements OnInit {

    @ViewChild('dtPendientes') dtPendientes!: Table;
    @ViewChild('dtEjecutados') dtEjecutados!: Table;
    @ViewChild('signatureCanvas') signatureCanvas!: ElementRef;

    modalFirma: boolean = false;
    nombreFirma: string = '';
    cedulaFirma: string = '';
    signaturePad!: SignaturePad;

    reportesService = inject(ReportesService);
    archivosServices = inject(ArchivosService);
    protocolosServices = inject(ProtocolosService);
    pdfGeneratorService = inject(PdfGeneratorService);
    router = inject(Router);
    platformId = inject(PLATFORM_ID);
    isBrowser: boolean = false;

    // Listas para la vista
    preventivosPendientes: any[] = [];
    preventivosEjecutados: any[] = [];
    correctivos: any[] = [];

    // Listas con todos los datos
    allPreventivos: any[] = [];
    allCorrectivos: any[] = [];

    // Control de tabs principales
    panelPreventivos: boolean = true;
    panelCorrectivos: boolean = false;

    // Control de sub-tabs Preventivos
    panelPendientes: boolean = true;
    panelEjecutados: boolean = false;

    loading: boolean = false;

    reportSelected!: any;
    rutina!: any[];
    modalReport: boolean = false;
    selectedFile: File | null = null;

    // Dates for each panel
    datePreventivo: Date | undefined;
    dateCorrectivo: Date | undefined;

    constructor() {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    async ngOnInit() {
        this.datePreventivo = new Date();
        this.dateCorrectivo = new Date();
        await this.cargarReportes();
    }

    getDecodedAccessToken(token: string): any {
        try {
            return jwtDecode(token);
        } catch (Error) {
            return null;
        }
    }

    async cargarReportes() {
        this.loading = true;
        try {
            const token = sessionStorage.getItem('utoken');
            if (token) {
                const decoded = this.getDecodedAccessToken(token);
                if (decoded && decoded.id) {
                    const reportes = await this.reportesService.getReportesUsuario(decoded.id);

                    if (reportes) {
                        this.allPreventivos = reportes.filter((r: any) => r.tipoMantenimiento === 'Preventivo');
                        this.allCorrectivos = reportes.filter((r: any) => r.tipoMantenimiento === 'Correctivo');

                        this.filtrarPreventivos();
                        this.filtrarCorrectivos();
                    }
                }
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error al cargar reportes',
                text: 'No se pudieron cargar sus reportes asignados.'
            });
        } finally {
            this.loading = false;
        }
    }

    filtrarPreventivos() {
        let filtered = [...this.allPreventivos];

        if (this.datePreventivo) {
            const mesFilter = this.datePreventivo.getMonth(); // 0-11
            const anioFilter = this.datePreventivo.getFullYear();

            filtered = filtered.filter((r: any) => {
                if (!r.mesProgramado || !r.añoProgramado) return false;
                // mesProgramado is 1-12, mesFilter is 0-11
                return r.mesProgramado === (mesFilter + 1) && r.añoProgramado === anioFilter;
            });
        }

        this.preventivosPendientes = filtered.filter(r => !r.realizado);
        this.preventivosEjecutados = filtered.filter(r => r.realizado);
    }

    filtrarCorrectivos() {
        if (!this.dateCorrectivo) {
            this.correctivos = [...this.allCorrectivos];
            return;
        }

        const mesFilter = this.dateCorrectivo.getMonth(); // 0-11
        const anioFilter = this.dateCorrectivo.getFullYear();

        this.correctivos = this.allCorrectivos.filter((r: any) => {
            if (!r.fechaRealizado) return false;

            // fechaRealizado expected as 'YYYY-MM-DD'
            // Using string split is safer than Date() to avoid timezone shifts
            const parts = r.fechaRealizado.split('-');
            if (parts.length !== 3) return false;

            const anio = parseInt(parts[0], 10);
            const mes = parseInt(parts[1], 10) - 1; // 0-11

            return mes === mesFilter && anio === anioFilter;
        });
    }

    viewPreventivos() {
        this.panelPreventivos = true;
        this.panelCorrectivos = false;
    }

    viewCorrectivos() {
        this.panelPreventivos = false;
        this.panelCorrectivos = true;
    }

    viewPendientes() {
        this.panelPendientes = true;
        this.panelEjecutados = false;
    }

    viewEjecutados() {
        this.panelPendientes = false;
        this.panelEjecutados = true;
    }

    // Same logic as ManteniminetoComponent for viewing details
    async viewModalReport(reporte: any) {
        this.modalReport = true;
        try {
            this.reportSelected = await this.reportesService.getReporteById(reporte.id); // Assuming passing object or ID
            // Note: ManteniminetoComponent passed 'reporte' which seemed to be an ID in some contexts or object in others.
            // Let's assume it's the ID if getReporteById expects an ID.
            // Actually ManteniminetoComponent passed 'reporte' directly to getReporteById. 
            // If 'reporte' is the object from the table, we should use 'reporte.id'.
            this.rutina = await this.protocolosServices.getCumplimientoProtocoloReporte(this.reportSelected.id);
            if (!this.reportSelected.cumplimientoProtocolo || this.reportSelected.cumplimientoProtocolo.length === 0) {
                this.reportSelected.cumplimientoProtocolo = this.rutina;
            }
        } catch (e) {
            console.error(e);
        }
    }

    async viewPdf(ruta: string) {
        try {
            const blob = await this.archivosServices.getArchivo(ruta);
            if (blob.type === 'application/pdf') {
                const objectUrl = URL.createObjectURL(blob);
                window.open(objectUrl, '_blank');
            } else {
                const errorText = await blob.text();
                console.error('No se recibió un PDF:', errorText);
            }
        } catch (error) {
            console.error('Error al obtener el PDF:', error);
        }
    }

    onGlobalFilter(event: Event, table: Table): void {
        const target = event.target as HTMLInputElement | null;
        if (target) {
            table.filterGlobal(target.value, 'contains');
        }
    }

    realizarReporte(idEquipo: number, idReporte: number) {
        localStorage.setItem('TipoMantenimiento', 'P'); // Assuming Preventive for assigned tasks? Or could be Corrective
        if (idReporte && idReporte > 0) {
            localStorage.setItem('idReporte', idReporte.toString());
        } else {
            localStorage.removeItem('idReporte');
        }
        this.router.navigate(['biomedica/nuevoreporte/', idEquipo]);
    }

    onFileSelected(event: any) {
        this.selectedFile = event.target.files[0];
    }

    async subirPdf() {
        if (!this.selectedFile || !this.reportSelected) return;

        try {
            const res = await this.reportesService.uploadReportePdf(this.reportSelected.id, this.selectedFile);
            Swal.fire('Éxito', 'Reporte PDF subido correctamente', 'success');
            this.reportSelected.rutaPdf = res.rutaPdf;
            this.selectedFile = null;
            await this.cargarReportes(); // Actualizar la tabla para que cambie el botón
        } catch (error) {
            console.error('Error al subir PDF:', error);
            Swal.fire('Error', 'No se pudo subir el archivo PDF', 'error');
        }
    }

    descargarFormato() {
        if (this.reportSelected) {
            if (this.reportSelected.tipoMantenimiento === 'Preventivo') {
                this.pdfGeneratorService.generateReportePreventivo(this.reportSelected);
            } else {
                this.pdfGeneratorService.generateReporteCorrectivo(this.reportSelected);
            }
        }
    }

    editarReporte() {
        if (!this.reportSelected) return;

        let tipo = (this.reportSelected.tipoMantenimiento === 'Preventivo' || this.reportSelected.tipoMantenimiento === 'Preventivo Programado') ? 'P' : 'C';

        localStorage.setItem('TipoMantenimiento', tipo);
        if (this.reportSelected && this.reportSelected.id) {
            localStorage.setItem('idReporte', this.reportSelected.id.toString());
        } else {
            localStorage.removeItem('idReporte');
        }

        this.modalReport = false;
        this.router.navigate(['biomedica/nuevoreporte/', this.reportSelected.equipo.id]);
    }

    abrirModalFirma() {
        this.modalFirma = true;
        this.nombreFirma = this.reportSelected?.nombreRecibio || '';
        this.cedulaFirma = this.reportSelected?.cedulaRecibio || '';
        
        // Inicializar signature pad tras renderizar el modal
        setTimeout(() => {
            if (this.signatureCanvas) {
                const canvas = this.signatureCanvas.nativeElement;
                
                const ratio =  Math.max(window.devicePixelRatio || 1, 1);
                canvas.width = canvas.offsetWidth * ratio;
                canvas.height = canvas.offsetHeight * ratio;
                canvas.getContext("2d").scale(ratio, ratio);

                this.signaturePad = new SignaturePad(canvas, {
                    backgroundColor: 'rgb(255, 255, 255)' 
                });
            }
        }, 200);
    }

    limpiarFirma() {
        if (this.signaturePad) {
            this.signaturePad.clear();
        }
    }

    async guardarFirmaYGenerar() {
        if (this.signaturePad.isEmpty()) {
            Swal.fire('Atención', 'Debe proporcionar una firma en el recuadro', 'warning');
            return;
        }

        if (!this.nombreFirma) {
            Swal.fire('Atención', 'Debe proporcionar el nombre de quien recibe', 'warning');
            return;
        }

        try {
            Swal.fire({
                title: 'Generando documento...',
                text: 'Por favor espere mientras se firma y guarda el reporte.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const firmaReceptorBase64 = this.signaturePad.toDataURL('image/png');
            this.reportSelected.nombreRecibio = this.nombreFirma;
            this.reportSelected.cedulaRecibio = this.cedulaFirma;
            
            let blob: Blob | void;
            if (this.reportSelected.tipoMantenimiento === 'Preventivo') {
                blob = await this.pdfGeneratorService.generateReportePreventivo(this.reportSelected, firmaReceptorBase64, true);
            } else {
                blob = await this.pdfGeneratorService.generateReporteCorrectivo(this.reportSelected, firmaReceptorBase64, true);
            }

            if (blob) {
                const file = new File([blob], `Reporte_${this.reportSelected.id}.pdf`, { type: 'application/pdf' });
                const res = await this.reportesService.uploadReportePdf(this.reportSelected.id, file);
                
                this.reportSelected.rutaPdf = res.rutaPdf;
                this.modalFirma = false;
                await this.cargarReportes();
                Swal.fire('Éxito', 'El reporte fue firmado y guardado correctamente.', 'success');
            } else {
                Swal.fire('Error', 'No se pudo generar el documento PDF.', 'error');
            }

        } catch (error) {
            console.error('Error guardando firma:', error);
            Swal.fire('Error', 'Hubo un problema al procesar la firma o subir el archivo.', 'error');
        }
    }
}
