import { Component, inject, OnInit, ViewChild, PLATFORM_ID, ElementRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import SignaturePad from 'signature_pad';
import Swal from 'sweetalert2'
import { ActivatedRoute } from '@angular/router';
import { PdfGeneratorService } from '../../../../Services/appServices/biomedicaServices/pdf-generator/pdf-generator.service';
import { ReportesService } from '../../../../Services/appServices/biomedicaServices/reportes/reportes.service';
import { EquiposService } from '../../../../Services/appServices/biomedicaServices/equipos/equipos.service';
import { ProtocolosService } from '../../../../Services/appServices/biomedicaServices/protocolos/protocolos.service';
import { MetrologiaService } from '../../../../Services/appServices/biomedicaServices/metrologia/metrologia.service';
import { TrasladosService } from '../../../../Services/appServices/biomedicaServices/traslados/traslados.service';
import { HojavidaService } from '../../../../Services/appServices/biomedicaServices/hojavida/hojavida.service';
import { Table } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Dialog } from "primeng/dialog";
import { CardModule } from "primeng/card";
import { ArchivosService } from '../../../../Services/appServices/general/archivos/archivos.service'
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ver-reporte',
  standalone: true,
  imports: [TableModule, IconFieldModule, InputIconModule, InputTextModule, SplitButtonModule, ButtonModule, CommonModule, Dialog, CardModule, PanelModule, TabViewModule, TagModule, TooltipModule, FormsModule],
  templateUrl: './ver-reporte.component.html',
  styleUrl: './ver-reporte.component.css'
})
export class VerReporteComponent implements OnInit {
  @ViewChild('dt2') dt2!: Table;
  @ViewChild('dt3') dt3!: Table;
  @ViewChild('dt4') dt4!: Table;
  @ViewChild('signatureCanvas') signatureCanvas!: ElementRef;
  @ViewChild('signatureCanvasEntregaTraslado') signatureCanvasEntregaTraslado!: ElementRef;
  @ViewChild('signatureCanvasRecibeTraslado') signatureCanvasRecibeTraslado!: ElementRef;
  
  modalFirma: boolean = false;
  modalFirmaTraslado: boolean = false;
  nombreFirma: string = '';
  cedulaFirma: string = '';
  signaturePad!: SignaturePad;
  signaturePadEntregaTraslado!: SignaturePad;
  signaturePadRecibeTraslado!: SignaturePad;
  pdfGeneratorService = inject(PdfGeneratorService);
  idEquipo: string | null = null;
  reportes!: any[];
  rutina!: any[];
  equipo!: any;
  metrologiaService = inject(MetrologiaService);
  metrologiaReportes: any[] = [];
  trasladosService = inject(TrasladosService);
  traslados: any[] = [];

  reporteServices = inject(ReportesService);
  equipoService = inject(EquiposService);
  archivosServices = inject(ArchivosService);
  protocolosServices = inject(ProtocolosService);
  hojaVidaService = inject(HojavidaService);
  hojaVida: any = null;
  router = inject(Router);
  platformId = inject(PLATFORM_ID);
  isBrowser: boolean = false;
  loading: boolean = false;
  modalReport: boolean = false;
  modalTraslado: boolean = false;
  reportSelected: any = null;
  trasladoSelected: any = null;
  selectedFile: File | null = null;
  modalMetrologia: boolean = false;
  metrologiaSelected: any = null;
  selectedFileMetrologiaReporte: File | null = null;
  selectedFileMetrologiaConfirmacion: File | null = null;
  userRole: string = '';
  isTecnico: boolean = false;

  constructor(private route: ActivatedRoute) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async viewPdf(ruta: string) {
    try {
      const blob = await this.archivosServices.getArchivo(ruta);
      if (blob.type === 'application/pdf') {
        const objectUrl = URL.createObjectURL(blob);
        window.open(objectUrl, '_blank'); // Abre el PDF en nueva pestaña
      } else {
        const errorText = await blob.text();
        console.error('No se recibió un PDF:', errorText);
      }
    } catch (error) {
      console.error('Error al obtener el PDF:', error);
    }
  }

  userId: any = null;

  async ngOnInit() {
    this.idEquipo = this.route.snapshot.paramMap.get('id');
    const token = sessionStorage.getItem('utoken');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.userId = decoded.id;
        this.userRole = decoded.rol;
        this.isTecnico = this.userRole === 'BIOMEDICATECNICO';
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

    try {
      this.equipo = await this.equipoService.getEquipoById(this.idEquipo);

      const resReportes = await this.reporteServices.getReportesEquipo(this.idEquipo);
      if (resReportes && Array.isArray(resReportes)) {
        this.reportes = resReportes.sort((a: any, b: any) => {
          const dateA = a.fechaRealizado ? new Date(a.fechaRealizado).getTime() : Infinity;
          const dateB = b.fechaRealizado ? new Date(b.fechaRealizado).getTime() : Infinity;
          return dateB - dateA;
        });
      }

      try {
        this.hojaVida = await this.hojaVidaService.getHojaVidaByIdEquipo(this.idEquipo);
      } catch (e) {
        console.warn('Hoja de vida no encontrada', e);
      }

      // Fetch Metrology Reports
      const resMetrologia = await this.metrologiaService.getReportesMetrologiaEquipo(this.idEquipo);
      if (resMetrologia && Array.isArray(resMetrologia)) {
        this.metrologiaReportes = resMetrologia.sort((a: any, b: any) => {
          const dateA = a.fechaRealizado ? new Date(a.fechaRealizado).getTime() : Infinity;
          const dateB = b.fechaRealizado ? new Date(b.fechaRealizado).getTime() : Infinity;
          return dateB - dateA;
        });
      }

      // Fetch Traslados
      try {
        const resTraslados = await this.trasladosService.getHistorialTraslados(Number(this.idEquipo));
        if (resTraslados && Array.isArray(resTraslados)) {
          this.traslados = resTraslados;
        }
      } catch (error) {
        console.error('Error fetching traslados:', error);
      }

      // Fetch Hoja de Vida para accesorios
      try {
        this.hojaVida = await this.hojaVidaService.getHojaVidaByIdEquipo(this.idEquipo);
      } catch (e) {
        console.warn('Hoja de vida no encontrada para accesorios', e);
      }

    } catch (error) {
      console.error(error);
    }
  }

  verHojaVida() {
    this.router.navigate(['biomedica/hojavidaequipo/', this.idEquipo]);
  }

  // ... existing code ...

  async viewModalReport(reporte: any) {
    this.modalReport = true;
    try {
      this.reportSelected = await this.reporteServices.getReporteById(reporte.id);
    } catch (error) {
      console.error('Error fetching report details:', error);
      this.reportSelected = reporte; // Fallback
    }
    this.rutina = await this.protocolosServices.getCumplimientoProtocoloReporte(this.reportSelected.id);
    if (!this.reportSelected.cumplimientoProtocolo || this.reportSelected.cumplimientoProtocolo.length === 0) {
      this.reportSelected.cumplimientoProtocolo = this.rutina;
    }
  }

  viewModalTraslado(traslado: any) {
    this.trasladoSelected = traslado;
    this.modalTraslado = true;
  }

  viewModalMetrologia(metrologia: any) {
    this.metrologiaSelected = metrologia;
    this.modalMetrologia = true;
  }

  onFileMetrologiaReporteSelected(event: any) {
    this.selectedFileMetrologiaReporte = event.target.files[0];
  }

  onFileMetrologiaConfirmacionSelected(event: any) {
    this.selectedFileMetrologiaConfirmacion = event.target.files[0];
  }

  async uploadMetrologiaFiles() {
    if (!this.metrologiaSelected) return;

    const formData = new FormData();

    if (this.selectedFileMetrologiaReporte) {
      formData.append('rutaReporte', this.selectedFileMetrologiaReporte);
    }

    if (this.selectedFileMetrologiaConfirmacion) {
      formData.append('confirmacionMetrologica', this.selectedFileMetrologiaConfirmacion);
    }

    if (!this.selectedFileMetrologiaReporte && !this.selectedFileMetrologiaConfirmacion) {
      Swal.fire('Atención', 'Seleccione al menos un archivo para subir', 'warning');
      return;
    }

    try {
      const res = await this.metrologiaService.updateActividadMetrologica(this.metrologiaSelected.id, formData);
      Swal.fire('Éxito', 'Archivos subidos correctamente', 'success');

      if (res.rutaReporte) this.metrologiaSelected.rutaReporte = res.rutaReporte;
      if (res.confirmacionMetrologica) this.metrologiaSelected.confirmacionMetrologica = res.confirmacionMetrologica;

      this.selectedFileMetrologiaReporte = null;
      this.selectedFileMetrologiaConfirmacion = null;
    } catch (error) {
      console.error('Error al subir archivos de metrología:', error);
      Swal.fire('Error', 'No se pudieron subir los archivos', 'error');
    }
  }

  descargarActaTraslado() {
    if (this.trasladoSelected && this.equipo) {
      let accesoriosStr = '';
      if (this.hojaVida && this.hojaVida.accesorios && this.hojaVida.accesorios.length > 0) {
        accesoriosStr = this.hojaVida.accesorios.map((acc: any) => `${acc.nombre} (x${acc.cantidad})`).join(', ');
      }
      this.pdfGeneratorService.generateActaTraslado(this.trasladoSelected, this.equipo, accesoriosStr);
    }
  }

  fileToUploadTraslado: File | null = null;

  onFileTrasladoSelected(event: any) {
    this.fileToUploadTraslado = event.target.files[0];
  }

  async uploadActaTraslado() {
    if (!this.fileToUploadTraslado || !this.trasladoSelected) return;

    try {
      const res = await this.trasladosService.uploadActaTraslado(this.trasladoSelected.id, this.fileToUploadTraslado);
      Swal.fire('Éxito', 'Acta subida correctamente', 'success');
      this.trasladoSelected.archivoActa = res.archivoActa;
      // Update in array
      const index = this.traslados.findIndex(t => t.id === this.trasladoSelected.id);
      if (index !== -1) {
        this.traslados[index].archivoActa = res.archivoActa;
      }
      this.fileToUploadTraslado = null;
    } catch (error) {
      console.error('Error al subir acta:', error);
      Swal.fire('Error', 'No se pudo subir el archivo', 'error');
    }
  }

  async visualizarActaTraslado(ruta: string) {
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

  onGlobalFilter(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (target) {
      this.dt2.filterGlobal(target.value, 'contains');
    }
  }

  onGlobalFilterMetrologia(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (target) {
      this.dt3.filterGlobal(target.value, 'contains');
    }
  }

  onGlobalFilterTraslados(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (target) {
      this.dt4.filterGlobal(target.value, 'contains');
    }
  }

  editarReporte(reporte: any, idEquipo: any) {
    const idReporte = reporte.id || reporte;
    const tipo = (reporte.tipoMantenimiento === 'Preventivo' || reporte.tipoMantenimiento === 'Preventivo Programado') ? 'P' : 'C';
    
    localStorage.setItem('TipoMantenimiento', tipo);
    localStorage.setItem('idReporte', idReporte.toString());
    this.router.navigate(['biomedica/nuevoreporte/', idEquipo]);
  }

  isGuest(): boolean {
    const token = sessionStorage.getItem('utoken');
    if (!token) return true;
    try {
      const decoded: any = jwtDecode(token);
      return decoded?.rol === 'INVITADO';
    } catch {
      return true;
    }
  }

  descargarFormato() {
    if (this.reportSelected) {
      if (this.reportSelected.tipoMantenimiento === 'Preventivo') {
        // Now compliance is pre-loaded by backend in reportSelected.cumplimientoProtocolo
        // We ensure data structure consistency for the PDF generator
        this.pdfGeneratorService.generateReportePreventivo(this.reportSelected);
      } else {
        this.pdfGeneratorService.generateReporteCorrectivo(this.reportSelected);
      }
    }
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async subirPdf() {
    if (!this.selectedFile || !this.reportSelected) return;

    try {
      const res = await this.reporteServices.uploadReportePdf(this.reportSelected.id, this.selectedFile);
      Swal.fire('Éxito', 'Reporte PDF subido correctamente', 'success');
      this.reportSelected.rutaPdf = res.rutaPdf;
      const index = this.reportes.findIndex(r => r.id === this.reportSelected.id);
      if (index !== -1) {
        this.reportes[index].rutaPdf = res.rutaPdf;
      }
      this.selectedFile = null;
    } catch (error) {
      console.error('Error al subir PDF:', error);
      Swal.fire('Error', 'No se pudo subir el archivo PDF', 'error');
    }
  }

  abrirModalFirma() {
    this.modalFirma = true;
    this.nombreFirma = this.reportSelected?.nombreRecibio || '';
    this.cedulaFirma = this.reportSelected?.cedulaRecibio || '';
    
    // Inicializar signature pad tras renderizar el modal
    setTimeout(() => {
      if (this.signatureCanvas) {
        const canvas = this.signatureCanvas.nativeElement;
        
        // Ajustar resolución del canvas para dispositivos de alta densidad (retina displays)
        const ratio =  Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);

        this.signaturePad = new SignaturePad(canvas, {
          backgroundColor: 'rgb(255, 255, 255)' // Fondo blanco para el PNG
        });
      }
    }, 200);
  }

  limpiarFirma() {
    if (this.signaturePad) {
      this.signaturePad.clear();
    }
  }

  abrirModalFirmaTraslado(traslado: any) {
    this.trasladoSelected = traslado;
    this.modalFirmaTraslado = true;
    
    setTimeout(() => {
      if (this.signatureCanvasEntregaTraslado) {
        const canvasE = this.signatureCanvasEntregaTraslado.nativeElement;
        const ratioE = Math.max(window.devicePixelRatio || 1, 1);
        canvasE.width = canvasE.offsetWidth * ratioE;
        canvasE.height = canvasE.offsetHeight * ratioE;
        canvasE.getContext("2d").scale(ratioE, ratioE);
        this.signaturePadEntregaTraslado = new SignaturePad(canvasE, {
          backgroundColor: 'rgb(255, 255, 255)'
        });
      }

      if (this.signatureCanvasRecibeTraslado) {
        const canvasR = this.signatureCanvasRecibeTraslado.nativeElement;
        const ratioR = Math.max(window.devicePixelRatio || 1, 1);
        canvasR.width = canvasR.offsetWidth * ratioR;
        canvasR.height = canvasR.offsetHeight * ratioR;
        canvasR.getContext("2d").scale(ratioR, ratioR);
        this.signaturePadRecibeTraslado = new SignaturePad(canvasR, {
          backgroundColor: 'rgb(255, 255, 255)'
        });
      }
    }, 200);
  }

  limpiarFirmaEntregaTraslado() {
    if (this.signaturePadEntregaTraslado) this.signaturePadEntregaTraslado.clear();
  }

  limpiarFirmaRecibeTraslado() {
    if (this.signaturePadRecibeTraslado) this.signaturePadRecibeTraslado.clear();
  }

  cerrarModalFirmaTraslado() {
    this.modalFirmaTraslado = false;
  }

  async subirActaTraslado() {
    if (this.signaturePadEntregaTraslado.isEmpty() || this.signaturePadRecibeTraslado.isEmpty()) {
      Swal.fire('Atención', 'Ambas firmas son requeridas', 'warning');
      return;
    }

    const firmaEntregaBase64 = this.signaturePadEntregaTraslado.toDataURL('image/png');
    const firmaRecibeBase64 = this.signaturePadRecibeTraslado.toDataURL('image/png');

    try {
      const blob = await this.pdfGeneratorService.generateActaTraslado(this.trasladoSelected, this.equipo, '', firmaEntregaBase64, firmaRecibeBase64, true);
      
      if (blob) {
        const file = new File([blob as Blob], `Acta_Traslado_${this.trasladoSelected.id}.pdf`, { type: 'application/pdf' });
        
        const res = await this.trasladosService.uploadActaTraslado(this.trasladoSelected.id, file);
        
        Swal.fire('Éxito', 'Acta subida correctamente', 'success');
        this.modalFirmaTraslado = false;
        
        // Actualizar el objeto seleccionado para que el botón de visualizar aparezca inmediatamente
        if (res && res.archivoActa) {
          this.trasladoSelected.archivoActa = res.archivoActa;
        }

        // Recargar traslados en la tabla
        if (this.idEquipo) {
          const historial = await this.trasladosService.getHistorialTraslados(parseInt(this.idEquipo));
          this.traslados = historial;
          
          // Opcional: refrescar también la referencia del seleccionado si es necesario
          const actualizado = this.traslados.find(t => t.id === this.trasladoSelected.id);
          if (actualizado) {
             this.trasladoSelected = actualizado;
          }
        }
      }
    } catch (error) {
      console.error('Error al generar o subir acta de traslado:', error);
      Swal.fire('Error', 'No se pudo generar y subir el acta', 'error');
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
        // Enviar Blob como archivo al backend
        const file = new File([blob], `Reporte_${this.reportSelected.id}.pdf`, { type: 'application/pdf' });
        const res = await this.reporteServices.uploadReportePdf(this.reportSelected.id, file);
        
        this.reportSelected.rutaPdf = res.rutaPdf;
        const index = this.reportes.findIndex(r => r.id === this.reportSelected.id);
        if (index !== -1) {
          this.reportes[index].rutaPdf = res.rutaPdf;
        }
        this.modalFirma = false;
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
