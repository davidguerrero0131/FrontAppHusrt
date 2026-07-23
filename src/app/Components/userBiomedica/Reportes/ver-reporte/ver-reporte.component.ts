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
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { API_URL } from '../../../../constantes';
import { ServicioService } from '../../../../Services/appServices/general/servicio/servicio.service';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { ReporteBajaModalComponent } from '../../vista-Equipos/reporte-baja-modal/reporte-baja-modal.component';
import { obtenerNombreMes, getDecodedAccessToken } from '../../../../utilidades';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { InputTextarea } from 'primeng/inputtextarea';

@Component({
  selector: 'app-ver-reporte',
  standalone: true,
  imports: [TableModule, IconFieldModule, InputIconModule, InputTextModule, SplitButtonModule, ButtonModule, CommonModule, Dialog, CardModule, PanelModule, TabViewModule, TagModule, TooltipModule, FormsModule, DropdownModule, CalendarModule, DatePickerModule, CheckboxModule, SelectModule, InputTextarea],
  providers: [DialogService, MessageService],
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

  servicioService = inject(ServicioService);
  servicios: any[] = [];
  isEditingTraslado: boolean = false;
  trasladoEdit: any = {};

  isEditingMetrologia: boolean = false;
  metrologiaEdit: any = {};

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

  async cargarServicios() {
    try {
      this.servicios = await this.servicioService.getAllServiciosActivos();
    } catch (error) {
      console.error('Error al cargar servicios', error);
    }
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
      this.initOpcionesHV();

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

      this.cargarServicios();

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
    this.isEditingTraslado = false;
  }

  toggleEditTraslado() {
    this.isEditingTraslado = true;
    this.trasladoEdit = { ...this.trasladoSelected };
  }

  cancelarEdicionTraslado() {
    this.isEditingTraslado = false;
    this.trasladoEdit = {};
  }

  async guardarEdicionTraslado() {
    try {
      Swal.fire({ title: 'Guardando...', allowOutsideClick: false });
      Swal.showLoading();

      const res = await this.trasladosService.updateTraslado(this.trasladoSelected.id, this.trasladoEdit);
      
      // Update local array and selected
      this.trasladoSelected = { ...this.trasladoSelected, ...this.trasladoEdit };
      // Refresh the specific fields that are populated via relationships if possible, 
      // but a quick way is to just refetch the list
      const resTraslados = await this.trasladosService.getHistorialTraslados(this.equipo.id);
      if (resTraslados) {
        this.traslados = resTraslados;
        // Also update the selected item from the fresh list
        const updatedTraslado = this.traslados.find(t => t.id === this.trasladoSelected.id);
        if (updatedTraslado) this.trasladoSelected = updatedTraslado;
      }

      this.isEditingTraslado = false;

      Swal.fire('¡Éxito!', 'Traslado actualizado correctamente', 'success');
    } catch (error: any) {
      console.error(error);
      Swal.fire('Error', error.error?.error || 'No se pudo actualizar el traslado', 'error');
    }
  }

  viewModalMetrologia(metrologia: any) {
    this.metrologiaSelected = metrologia;
    this.modalMetrologia = true;
    this.isEditingMetrologia = false;
  }

  toggleEditMetrologia() {
    this.isEditingMetrologia = true;
    this.metrologiaEdit = { ...this.metrologiaSelected };
    // Convertir la fecha al formato correcto (Date object o string compatible)
    if (this.metrologiaEdit.fechaRealizado) {
        this.metrologiaEdit.fechaRealizado = new Date(this.metrologiaEdit.fechaRealizado);
    }
  }

  cancelarEdicionMetrologia() {
    this.isEditingMetrologia = false;
    this.metrologiaEdit = {};
  }

  async guardarEdicionMetrologia() {
    try {
      const formData = new FormData();
      formData.append('tipoActividad', this.metrologiaEdit.tipoActividad);
      formData.append('empresa', this.metrologiaEdit.empresa);
      
      let fechaToSave = this.metrologiaEdit.fechaRealizado;
      if (fechaToSave instanceof Date) {
          fechaToSave = fechaToSave.toISOString();
      }
      formData.append('fechaRealizado', fechaToSave);
      formData.append('resultado', this.metrologiaEdit.resultado);
      formData.append('errorMaximoIdentificado', this.metrologiaEdit.errorMaximoIdentificado);
      formData.append('unidadMedicion', this.metrologiaEdit.unidadMedicion || '');
      formData.append('observaciones', this.metrologiaEdit.observaciones || '');

      const res = await this.metrologiaService.updateActividadMetrologica(this.metrologiaSelected.id, formData);
      
      this.metrologiaSelected = { ...this.metrologiaSelected, ...res };
      
      if (this.equipo && this.equipo.actividadesMetrologicas) {
        const idx = this.equipo.actividadesMetrologicas.findIndex((m: any) => m.id === this.metrologiaSelected.id);
        if (idx !== -1) {
          this.equipo.actividadesMetrologicas[idx] = { ...this.equipo.actividadesMetrologicas[idx], ...res };
        }
      }

      this.isEditingMetrologia = false;
      Swal.fire('¡Éxito!', 'Actividad metrológica actualizada correctamente', 'success');
    } catch (error: any) {
      console.error(error);
      Swal.fire('Error', error.error?.error || 'No se pudo actualizar la actividad', 'error');
    }
  }

  onFileMetrologiaReporteSelected(event: any) {
    this.selectedFileMetrologiaReporte = event.target.files[0];
  }

  onFileMetrologiaConfirmacionSelected(event: any) {
    this.selectedFileMetrologiaConfirmacion = event.target.files[0];
  }

  async uploadMetrologiaFile(tipo: 'reporte' | 'confirmacion') {
    if (!this.metrologiaSelected) return;

    const formData = new FormData();

    if (tipo === 'reporte' && this.selectedFileMetrologiaReporte) {
      formData.append('rutaReporte', this.selectedFileMetrologiaReporte);
    } else if (tipo === 'confirmacion' && this.selectedFileMetrologiaConfirmacion) {
      formData.append('confirmacionMetrologica', this.selectedFileMetrologiaConfirmacion);
    } else {
      Swal.fire('Atención', 'Seleccione un archivo', 'warning');
      return;
    }

    try {
      const res = await this.metrologiaService.updateActividadMetrologica(this.metrologiaSelected.id, formData);
      Swal.fire('Éxito', 'Archivo subido correctamente', 'success');

      if (res.rutaReporte) this.metrologiaSelected.rutaReporte = res.rutaReporte;
      if (res.confirmacionMetrologica) this.metrologiaSelected.confirmacionMetrologica = res.confirmacionMetrologica;

      if (tipo === 'reporte') this.selectedFileMetrologiaReporte = null;
      if (tipo === 'confirmacion') this.selectedFileMetrologiaConfirmacion = null;
    } catch (error) {
      console.error('Error al subir archivo:', error);
      Swal.fire('Error', 'No se pudo subir el archivo', 'error');
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

  getMesEnLetras(mes: number | undefined): string {
    if (mes === undefined || mes === null) return '';
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[mes - 1] || mes.toString();
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

  // --- Variables para Opciones ---
  opcionesHV: any[] = [];
  ref: DynamicDialogRef | undefined;
  dialogService = inject(DialogService);
  messageService = inject(MessageService);

  // Variables Plan Mantenimiento
  displayPlanDialog: boolean = false;
  currentEquipo: any = null;
  selectedMonths: any[] = [];
  selectedPlans: any[] = [];
  intervencionesAnuales: number = 1;
  mesInicio: number = 1;
  anioInicio: number = new Date().getFullYear();
  calculatedMonthsText: string = '';
  libreMantenimiento: boolean = false;

  intervencionOptions = [
    { name: '1 vez al año (Anual)', value: 1 },
    { name: '2 veces al año (Semestral)', value: 2 },
    { name: '3 veces al año (Cuatrimestral)', value: 3 },
    { name: '4 veces al año (Trimestral)', value: 4 }
  ];
  anioOptions = Array.from({ length: 11 }, (_, i) => ({ name: (new Date().getFullYear() + i).toString(), value: new Date().getFullYear() + i }));

  // Variables Traslados
  displayTrasladoDialog: boolean = false;
  displayHistorialTrasladosDialog: boolean = false;
  historialUnificado: any[] = [];
  selectedEquipoTraslado: any = null;
  servicioDestinoId: number | null = null;
  ubicacionDestino: string = '';
  ubicacionEspecificaDestino: string = '';
  nombreReceptor: string = '';
  cargoReceptor: string = '';
  entregadoPor: string = '';
  cedulaEntrega: string = '';
  cargoEntrega: string = '';
  cedulaRecibe: string = '';
  observacionesTransferencia: string = '';
  serviciosList: any[] = [];

  monthOptions: any[] = [
    { name: 'Enero', value: 1 }, { name: 'Febrero', value: 2 }, { name: 'Marzo', value: 3 },
    { name: 'Abril', value: 4 }, { name: 'Mayo', value: 5 }, { name: 'Junio', value: 6 },
    { name: 'Julio', value: 7 }, { name: 'Agosto', value: 8 }, { name: 'Septiembre', value: 9 },
    { name: 'Octubre', value: 10 }, { name: 'Noviembre', value: 11 }, { name: 'Diciembre', value: 12 }
  ];

  // Variables Metrologia Plan
  displayPlanMetrologiaDialog: boolean = false;
  libreActividadesMetrologicas: boolean = false;
  intervencionesAnualesMetrologia: number = 1;
  mesInicioMetrologia: number = 1;
  anioInicioMetrologia: number = new Date().getFullYear();
  selectedPlansMetrologia: any[] = [];
  calculatedMonthsTextMetrologia: string = '';
  tipoActividadGlobal: string = 'Calibración';

  opcionesTipoActividad: any[] = [
    { label: 'Calibración', value: 'Calibración' },
    { label: 'Calificación', value: 'Calificación' },
    { label: 'Mantenimiento Correctivo', value: 'Mantenimiento Correctivo' },
    { label: 'Inspección', value: 'Inspección' }
  ];

  // Variables Metrologia Actividad
  modalAddActividadMetrologica: boolean = false;
  tipoActividad: string = '';
  empresa: string = '';
  fechaRealizadoActividad: Date | undefined;
  resultado: string = '';
  errorMaximoIdentificado: number | null = null;
  observacionesMetrologia: string = '';
  unidadMedicion: string = '';

  selectedFileConfirmacion: File | null = null;
  opcionesResultado: any[] = [
    { label: 'Cumple', value: 'Cumple' }, { label: 'No Cumple', value: 'No Cumple' }, { label: 'No Aplica', value: 'No Aplica' }
  ];

  // Métodos
  initOpcionesHV() {
    this.opcionesHV = [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => this.editarEquipo(this.equipo.id),
        visible: ['BIOMEDICAADMIN', 'SUPERADMIN', 'BIOMEDICAUSER'].includes(getDecodedAccessToken().rol)
      },
      {
        label: 'Editar Plan Mantenimiento',
        icon: 'pi pi-calendar',
        command: () => this.openPlanDialog(this.equipo),
        visible: ['BIOMEDICAADMIN', 'SUPERADMIN'].includes(getDecodedAccessToken().rol)
      },
      {
        label: 'Editar Plan Metrología',
        icon: 'pi pi-cog',
        command: () => this.openPlanMetrologiaDialog(this.equipo),
        visible: ['BIOMEDICAADMIN', 'SUPERADMIN'].includes(getDecodedAccessToken().rol) && this.equipo?.tipoEquipos?.requiereMetrologia
      },
      {
        label: 'Registrar Actividad Metrológica',
        icon: 'pi pi-file-excel',
        command: () => this.abrirModalRegistroMetrologia(this.equipo),
        visible: ['BIOMEDICAADMIN', 'SUPERADMIN', 'BIOMEDICAUSER'].includes(getDecodedAccessToken().rol)
      },
      {
        label: 'Dar de Baja',
        icon: 'pi pi-trash',
        command: () => this.darDeBaja(this.equipo),
        visible: ['BIOMEDICAADMIN', 'BIOMEDICAUSER', 'SUPERADMIN'].includes(getDecodedAccessToken().rol)
      },
      {
        label: 'Registrar Traslado',
        icon: 'pi pi-send',
        command: () => this.abrirModalTraslado(this.equipo),
        visible: ['BIOMEDICAADMIN', 'BIOMEDICAUSER', 'SUPERADMIN', 'BIOMEDICATECNICO'].includes(getDecodedAccessToken().rol)
      },
      {
        label: 'Historial Movimientos',
        icon: 'pi pi-history',
        command: () => this.verHistorialTraslados(this.equipo),
        visible: ['BIOMEDICAADMIN', 'BIOMEDICAUSER', 'SUPERADMIN'].includes(getDecodedAccessToken().rol)
      },
      {
        label: 'Ver Hoja de Vida',
        icon: 'pi pi-eye',
        command: () => this.verHojaVida()
      },
      {
        label: 'Nuevo reporte',
        icon: 'pi pi-upload',
        command: () => this.nuevoReporte(this.equipo.id),
        visible: ['BIOMEDICAADMIN', 'BIOMEDICAUSER', 'SUPERADMIN', 'BIOMEDICATECNICO'].includes(getDecodedAccessToken().rol)
      }
    ];
  }

  editarEquipo(id: number) { this.router.navigate(['biomedica/adminequipos/edit/', id]); }
  nuevoReporte(id: number) { 
    if (typeof localStorage !== 'undefined') localStorage.setItem('TipoMantenimiento', 'C');
    this.router.navigate(['biomedica/nuevoreporte/', id]); 
  }
  
  darDeBaja(equipo: any) {
    this.ref = this.dialogService.open(ReporteBajaModalComponent, {
      header: 'Reporte de Baja - ' + equipo.nombres + ' (' + equipo.serie + ')',
      width: '50vw',
      breakpoints: { '960px': '75vw', '640px': '90vw' },
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      data: { equipoId: equipo.id },
      closable: true
    });
    this.ref.onClose.subscribe((result: any) => { if (result) { window.location.reload(); } });
  }

  openPlanDialog(equipo: any) {
    this.currentEquipo = equipo;
    this.displayPlanDialog = true;
    this.libreMantenimiento = equipo.periodicidadM === 0;
    if (equipo.planesMantenimiento && equipo.planesMantenimiento.length > 0) {
      const firstPlan = equipo.planesMantenimiento[0];
      this.mesInicio = firstPlan.mes || 1;
      this.anioInicio = firstPlan.ano || new Date().getFullYear();
      this.intervencionesAnuales = equipo.periodicidadM || 1;
      this.selectedPlans = equipo.planesMantenimiento;
    } else {
      this.mesInicio = new Date().getMonth() + 1;
      this.anioInicio = new Date().getFullYear();
      this.intervencionesAnuales = 1;
      this.selectedPlans = [];
    }
    this.calcularFechas();
  }

  calcularFechas() {
    if (this.libreMantenimiento) {
      this.selectedPlans = [];
      this.updateCalculatedText();
      return;
    }
    if (this.intervencionesAnuales <= 0) {
      this.selectedPlans = [];
      this.updateCalculatedText();
      return;
    }
    this.selectedPlans = [];
    const interval = Math.floor(12 / this.intervencionesAnuales);
    for (let i = 0; i < this.intervencionesAnuales; i++) {
      let calcMes = this.mesInicio + (i * interval);
      let calcAno = this.anioInicio;
      if (calcMes > 12) {
        calcMes -= 12;
        calcAno += 1;
      }
      this.selectedPlans.push({ mes: calcMes, ano: calcAno, tipoActividad: 'Mantenimiento Preventivo' });
    }
    this.updateCalculatedText();
  }

  updateCalculatedText() {
    if (this.libreMantenimiento) {
      this.calculatedMonthsText = 'El equipo no requiere mantenimientos programados.';
      return;
    }
    if (this.selectedPlans.length === 0) {
      this.calculatedMonthsText = 'Seleccione intervenciones válidas.';
      return;
    }
    const parts = this.selectedPlans.map(p => obtenerNombreMes(p.mes) + ' ' + p.ano);
    this.calculatedMonthsText = parts.join(' - ');
  }

  async savePlan() {
    if (!this.currentEquipo) return;
    try {
      let finalPlans = this.selectedPlans;
      if (this.libreMantenimiento) {
        finalPlans = [];
        this.intervencionesAnuales = 0;
      }
      const equipoUpdate = {
        ...this.currentEquipo,
        periodicidadM: this.intervencionesAnuales,
        planesMantenimiento: finalPlans
      };
      await this.equipoService.updateEquipo(this.currentEquipo.id, equipoUpdate);
      Swal.fire('Éxito', 'Plan de mantenimiento actualizado.', 'success');
      this.displayPlanDialog = false;
      window.location.reload();
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al actualizar el plan.', 'error');
    }
  }

  openPlanMetrologiaDialog(equipo: any) {
    this.currentEquipo = equipo;
    this.displayPlanMetrologiaDialog = true;
    this.libreActividadesMetrologicas = equipo.periodicidadC === 0;
    if (equipo.planesActividadMetrologica && equipo.planesActividadMetrologica.length > 0) {
      const firstPlan = equipo.planesActividadMetrologica[0];
      this.mesInicioMetrologia = firstPlan.mes || 1;
      this.anioInicioMetrologia = firstPlan.ano || new Date().getFullYear();
      this.intervencionesAnualesMetrologia = equipo.periodicidadC || 1;
      this.tipoActividadGlobal = firstPlan.tipoActividad || 'Calibración';
      this.selectedPlansMetrologia = equipo.planesActividadMetrologica;
    } else {
      this.mesInicioMetrologia = new Date().getMonth() + 1;
      this.anioInicioMetrologia = new Date().getFullYear();
      this.intervencionesAnualesMetrologia = 1;
      this.tipoActividadGlobal = 'Calibración';
      this.selectedPlansMetrologia = [];
    }
    this.calcularFechasMetrologia();
  }

  calcularFechasMetrologia() {
    if (this.libreActividadesMetrologicas) {
      this.selectedPlansMetrologia = [];
      this.updateCalculatedTextMetrologia();
      return;
    }
    if (this.intervencionesAnualesMetrologia <= 0) {
      this.selectedPlansMetrologia = [];
      this.updateCalculatedTextMetrologia();
      return;
    }
    this.selectedPlansMetrologia = [];
    const interval = Math.floor(12 / this.intervencionesAnualesMetrologia);
    for (let i = 0; i < this.intervencionesAnualesMetrologia; i++) {
      let calcMes = this.mesInicioMetrologia + (i * interval);
      let calcAno = this.anioInicioMetrologia;
      if (calcMes > 12) {
        calcMes -= 12;
        calcAno += 1;
      }
      this.selectedPlansMetrologia.push({ mes: calcMes, ano: calcAno, tipoActividad: this.tipoActividadGlobal });
    }
    this.updateCalculatedTextMetrologia();
  }

  updateCalculatedTextMetrologia() {
    if (this.libreActividadesMetrologicas) {
      this.calculatedMonthsTextMetrologia = 'El equipo no requiere actividades metrológicas programadas.';
      return;
    }
    if (this.selectedPlansMetrologia.length === 0) {
      this.calculatedMonthsTextMetrologia = 'Seleccione intervenciones válidas.';
      return;
    }
    const parts = this.selectedPlansMetrologia.map(p => obtenerNombreMes(p.mes) + ' ' + p.ano + ' (' + p.tipoActividad + ')');
    this.calculatedMonthsTextMetrologia = parts.join(' - ');
  }

  async savePlanMetrologia() {
    if (!this.currentEquipo) return;
    try {
      let finalPlans = this.selectedPlansMetrologia;
      if (this.libreActividadesMetrologicas) {
        finalPlans = [];
        this.intervencionesAnualesMetrologia = 0;
      }
      const planesActividadMetrologica = finalPlans.map(p => ({
        mes: p.mes,
        ano: p.ano,
        tipoActividad: this.tipoActividadGlobal
      }));
      const equipoUpdate = {
        ...this.currentEquipo,
        periodicidadC: this.intervencionesAnualesMetrologia,
        planesActividadMetrologica: planesActividadMetrologica
      };
      await this.equipoService.updateEquipo(this.currentEquipo.id, equipoUpdate);
      Swal.fire('Éxito', 'Plan de metrología actualizado.', 'success');
      this.displayPlanMetrologiaDialog = false;
      window.location.reload();
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al actualizar el plan.', 'error');
    }
  }

  abrirModalRegistroMetrologia(equipo: any) {
    this.currentEquipo = equipo;
    this.modalAddActividadMetrologica = true;
    this.tipoActividad = '';
    this.empresa = '';
    this.fechaRealizadoActividad = undefined;
    this.resultado = '';
    this.errorMaximoIdentificado = null;
    this.observacionesMetrologia = '';
    this.selectedFile = null;
    this.selectedFileConfirmacion = null;
    this.unidadMedicion = '';
  }
  onFileSelectedConfirmacion(event: any) { this.selectedFileConfirmacion = event.target.files[0]; }
  
  async registrarMetrologia() {
    if (!this.tipoActividad || !this.empresa || !this.fechaRealizadoActividad || !this.resultado) {
      Swal.fire('Faltan datos', 'Por favor diligencie todos los campos requeridos', 'warning');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('equipoIdFk', this.currentEquipo.id.toString());
      formData.append('tipoActividad', this.tipoActividad);
      formData.append('empresa', this.empresa);
      formData.append('fechaRealizado', this.fechaRealizadoActividad.toISOString());
      formData.append('resultado', this.resultado);
      formData.append('errorMaximoIdentificado', this.errorMaximoIdentificado ? this.errorMaximoIdentificado.toString() : '');
      formData.append('unidadMedicion', this.unidadMedicion);
      formData.append('observaciones', this.observacionesMetrologia);
      formData.append('usuarioIdFk', getDecodedAccessToken().id.toString());
      
      if (this.selectedFile) {
        formData.append('rutaReporte', this.selectedFile);
      }
      if (this.selectedFileConfirmacion) {
        formData.append('confirmacionMetrologica', this.selectedFileConfirmacion);
      }

      await this.metrologiaService.registrarActividadConArchivo(formData);
      Swal.fire('Éxito', 'Actividad metrológica registrada exitosamente', 'success');
      this.modalAddActividadMetrologica = false;
      window.location.reload();
    } catch (error) {
      Swal.fire('Error', 'Error al registrar actividad', 'error');
    }
  }

  async abrirModalTraslado(equipo: any) {
    this.selectedEquipoTraslado = equipo;
    this.displayTrasladoDialog = true;
    this.servicioDestinoId = null;
    this.ubicacionDestino = '';
    this.ubicacionEspecificaDestino = '';
    this.nombreReceptor = '';
    this.cargoReceptor = '';
    this.entregadoPor = '';
    this.cedulaEntrega = '';
    this.cargoEntrega = '';
    this.cedulaRecibe = '';
    this.observacionesTransferencia = '';
    if (this.serviciosList.length === 0) {
      this.serviciosList = await this.servicioService.getAllServicios();
    }
  }

  async confirmarTraslado() {
    if (!this.servicioDestinoId || !this.nombreReceptor || !this.cargoReceptor || !this.entregadoPor || !this.cedulaEntrega || !this.cargoEntrega || !this.cedulaRecibe) {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor complete todos los campos requeridos.' });
      return;
    }
    try {
      const token = getDecodedAccessToken();
      const data = {
        equipoId: this.selectedEquipoTraslado.id,
        servicioDestinoId: this.servicioDestinoId,
        ubicacionDestino: this.ubicacionDestino,
        ubicacionEspecificaDestino: this.ubicacionEspecificaDestino,
        nombreReceptor: this.nombreReceptor,
        cargoReceptor: this.cargoReceptor,
        entregadoPor: this.entregadoPor,
        cedulaEntrega: this.cedulaEntrega,
        cargoEntrega: this.cargoEntrega,
        cedulaRecibe: this.cedulaRecibe,
        observaciones: this.observacionesTransferencia,
        usuarioId: token.id
      };
      await this.trasladosService.registrarTraslado(data);
      Swal.fire('Éxito', 'Traslado registrado exitosamente.', 'success');
      this.displayTrasladoDialog = false;
      window.location.reload();
    } catch (error) {
      Swal.fire('Error', 'Hubo un error al registrar el traslado', 'error');
    }
  }

  async verHistorialTraslados(equipo: any) {
    try {
      this.historialUnificado = await this.trasladosService.getHistorialCompleto(equipo.id);
      this.displayHistorialTrasladosDialog = true;
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el historial.' });
    }
  }
}

