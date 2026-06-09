import { Component, inject, OnInit, ViewChild, PLATFORM_ID, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { PdfGeneratorService } from '../../../Services/appServices/biomedicaServices/pdf-generator/pdf-generator.service';
import { CommonModule, Location, isPlatformBrowser } from '@angular/common';
import { BiomedicausernavbarComponent } from "../../navbars/biomedicausernavbar/biomedicausernavbar.component";
import { ArchivosService } from '../../../Services/appServices/general/archivos/archivos.service'
import Swal from 'sweetalert2';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule, Table } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from "primeng/card";
import { Router } from '@angular/router';
import { DialogModule } from "primeng/dialog";
import { ProtocolosService } from '../../../Services/appServices/biomedicaServices/protocolos/protocolos.service';
import { UserService } from './../../../Services/appServices/userServices/user.service';
import { ReportesService } from './../../../Services/appServices/biomedicaServices/reportes/reportes.service';
import { getDecodedAccessToken } from '../../../utilidades';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { MantenimientoStateService } from '../../../Services/appServices/biomedicaServices/mantenimiento-state.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { UppercaseDirective } from '../../../Directives/uppercase.directive';

import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-mantenimineto',
  standalone: true,
  imports: [CommonModule, TabsModule, FormsModule, ReactiveFormsModule,
    TableModule, IconFieldModule, InputIconModule, InputTextModule, CalendarModule, CardModule, SelectModule, ButtonModule, DialogModule, RouterModule, UppercaseDirective, TagModule, TooltipModule],
  templateUrl: './mantenimineto.component.html',
  styleUrl: './mantenimineto.component.css'
})
export class ManteniminetoComponent implements OnInit {

  @ViewChild('dt2') dt2!: Table;
  @ViewChild('signatureCanvas') signatureCanvas!: ElementRef;

  modalFirma: boolean = false;
  nombreFirma: string = '';
  cedulaFirma: string = '';
  signaturePad!: SignaturePad;

  pdfGeneratorService = inject(PdfGeneratorService);
  date: Date | undefined;
  reportesService = inject(ReportesService);
  userService = inject(UserService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  archivosServices = inject(ArchivosService);
  protocolosServices = inject(ProtocolosService);
  stateService = inject(MantenimientoStateService);
  platformId = inject(PLATFORM_ID);
  isBrowser: boolean = false;
  loading: boolean = false;
  fechaActual = new Date();
  mesInicio: number = 0;
  mesFin: number = 0;
  anio: number = 0;
  first: number = 0;

  preventivos: any[] = [];
  preventivosRealizados: any[] = [];
  preventivosPendientes: any[] = [];
  correctivos: any[] = [];

  panelPreventivos: boolean = true;
  panelCorrectivos: boolean = false;
  panelMetas: boolean = false;

  panelRealizados: boolean = true;
  panelPendientes: boolean = false;

  reportSelected!: any;
  rutina!: any[];
  modalReport: boolean = false;
  selectedFile: File | null = null;



  // Admin Variables
  isAdmin: boolean = false;
  showAdminModal: boolean = false;
  adminForm: FormGroup;
  users: any[] = [];
  reporteAdminSelected: any;

  meses = [
    { label: 'Enero', value: 1 }, { label: 'Febrero', value: 2 }, { label: 'Marzo', value: 3 },
    { label: 'Abril', value: 4 }, { label: 'Mayo', value: 5 }, { label: 'Junio', value: 6 },
    { label: 'Julio', value: 7 }, { label: 'Agosto', value: 8 }, { label: 'Septiembre', value: 9 },
    { label: 'Octubre', value: 10 }, { label: 'Noviembre', value: 11 }, { label: 'Diciembre', value: 12 }
  ];

  constructor(private location: Location) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.adminForm = this.formBuilder.group({
      usuarioIdFk: ['', Validators.required],
      mesProgramado: ['', Validators.required],
      añoProgramado: ['', Validators.required]
    });
  }

  async ngOnInit() {
    this.date = new Date();
    this.checkRole();
    if (this.isAdmin) {
      this.loadUsers();
    }

    // Load state
    const savedState = this.stateService.getState();
    this.anio = savedState.anio;
    this.mesInicio = savedState.mesInicio;
    this.mesFin = savedState.mesFin;
    this.panelPreventivos = savedState.activePanel === 'preventivos';
    this.panelCorrectivos = savedState.activePanel === 'correctivos';
    this.panelMetas = savedState.activePanel === 'metas';
    this.panelRealizados = savedState.metasSubPanel === 'realizados';
    this.panelPendientes = savedState.metasSubPanel === 'pendientes';
    this.first = savedState.tableFirst;

    // Initial Load
    await this.setDate();

    // Restore global filter if exists
    if (savedState.globalFilter) {
      setTimeout(() => {
        if (this.dt2) {
          this.dt2.filterGlobal(savedState.globalFilter, 'contains');
        }
      }, 0);
    }

    this.updateDisplayRecords();
  }

  checkRole() {
    const token = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('utoken') : null;
    if (token) {
      const decoded: any = getDecodedAccessToken();
      if (decoded && (decoded.rol === 'SUPERADMIN' || decoded.rol === 'BIOMEDICAADMIN')) {
        this.isAdmin = true;
      }
    }
  }

  async loadUsers() {
    try {
      const users = await this.userService.getAllUsers();
      this.users = users.filter((user: any) => user.rolId === 7 || user.rolId === 6);
    } catch (error) {
      console.error('Error loading users', error);
    }
  }

  openAdminEdit(reporte: any) {
    this.reporteAdminSelected = reporte;
    this.adminForm.patchValue({
      usuarioIdFk: reporte.usuarioIdFk,
      mesProgramado: reporte.mesProgramado,
      añoProgramado: reporte.añoProgramado || reporte.anioProgramado // handle potential naming diff
    });
    this.showAdminModal = true;
  }

  async saveAdminEdit() {
    if (this.adminForm.invalid) return;

    try {
      await this.reportesService.ActualizarPreventivoProgramado(this.reporteAdminSelected.id, this.adminForm.value);
      Swal.fire('Actualizado', 'Reporte actualizado correctamente', 'success');
      this.showAdminModal = false;
      this.setDate(); // Refresh data
    } catch (error) {
      Swal.fire('Error', 'No se pudo actualizar el reporte', 'error');
    }
  }

  stats = {
    total: 0,
    realizados: 0,
    pendientes: 0,
    vencidos: 0,
    correctivos: 0
  };

  displayRecords: any[] = [];

  async setDate() {
    if (this.anio && this.mesInicio && this.mesFin) {
      this.loading = true;
      
      this.stateService.setState({
        anio: this.anio,
        mesInicio: this.mesInicio,
        mesFin: this.mesFin
      });

      try {
        const fetchMethodPrev = this.mesInicio === this.mesFin 
          ? () => this.reportesService.getReportesPreventivosMesAño({ mes: this.mesInicio, anio: this.anio })
          : () => this.reportesService.getReportesPreventivosRango({ mesInicio: this.mesInicio, mesFin: this.mesFin, anio: this.anio });

        const fetchMethodCorr = this.mesInicio === this.mesFin 
          ? () => this.reportesService.getReportesCorrectivosMesAño({ mes: this.mesInicio, anio: this.anio })
          : () => this.reportesService.getReportesCorrectivosRango({ mesInicio: this.mesInicio, mesFin: this.mesFin, anio: this.anio });

        const [prev, corr] = await Promise.all([fetchMethodPrev(), fetchMethodCorr()]);

        this.preventivos = prev.map((r: any) => ({
          ...r,
          _status: this.getReportStatus(r),
          _mesNombre: this.obtenerNombreMes(r.mesProgramado)
        }));

        this.correctivos = corr.map((r: any) => ({
          ...r,
          _status: r.rutaPdf ? 'COMPLETADO' : 'REALIZADO',
          _mesNombre: r.fechaRealizado ? this.obtenerNombreMes(new Date(r.fechaRealizado).getMonth() + 1) : ''
        }));

        this.calculateStats();
        this.updateDisplayRecords();

      } catch (error) {
        console.error('Error loading reports', error);
        Swal.fire('Error', 'No se pudo cargar la información.', 'error');
      } finally {
        this.loading = false;
      }
    } else {
      Swal.fire('Faltan datos', 'Seleccione año, mes inicio y mes fin.', 'warning');
    }
  }

  getReportStatus(reporte: any): string {
    if (reporte.realizado) return reporte.rutaPdf ? 'COMPLETADO' : 'REALIZADO';
    const isVencido = !this.verificarVencimiento(reporte.mesProgramado, reporte.añoProgramado || reporte.anioProgramado);
    return isVencido ? 'PENDIENTE' : 'PROGRAMADO';
  }

  calculateStats() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    this.stats.total = this.preventivos.length;
    this.stats.realizados = this.preventivos.filter(r => r.realizado).length;
    
    // Pendientes: Not realized and programmed for the current month or future
    this.stats.pendientes = this.preventivos.filter(r => !r.realizado && r._status === 'PROGRAMADO').length;
    
    // Vencidos: Same current year, previous months, and not realized
    this.stats.vencidos = this.preventivos.filter(r => {
      const rAnio = r.añoProgramado || r.anioProgramado;
      return !r.realizado && rAnio === currentYear && r.mesProgramado < currentMonth;
    }).length;
    
    this.stats.correctivos = this.correctivos.length;
  }

  updateDisplayRecords() {
    if (this.panelPreventivos) {
      this.displayRecords = this.preventivos;
    } else if (this.panelCorrectivos) {
      this.displayRecords = this.correctivos;
    } else if (this.panelMetas) {
      this.displayRecords = this.panelRealizados 
        ? this.preventivos.filter(r => r.realizado)
        : this.preventivos.filter(r => !r.realizado);
    }
  }

  viewPreventivos() {
    this.panelPreventivos = true;
    this.panelCorrectivos = false;
    this.panelMetas = false;
    this.stateService.setState({ activePanel: 'preventivos' });
    this.updateDisplayRecords();
  }
  viewCorrectivos() {
    this.panelPreventivos = false;
    this.panelCorrectivos = true;
    this.panelMetas = false;
    this.stateService.setState({ activePanel: 'correctivos' });
    this.updateDisplayRecords();
  }
  viewMetas() {
    this.panelPreventivos = false;
    this.panelCorrectivos = false;
    this.panelMetas = true;
    this.stateService.setState({ activePanel: 'metas' });
    this.updateDisplayRecords();
  }

  panelRealizadosView() {
    this.panelRealizados = true;
    this.panelPendientes = false;
    this.stateService.setState({ metasSubPanel: 'realizados' });
    this.updateDisplayRecords();
  }

  panelPendientesView() {
    this.panelRealizados = false;
    this.panelPendientes = true;
    this.stateService.setState({ metasSubPanel: 'pendientes' });
    this.updateDisplayRecords();
  }

  onGlobalFilter(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (target) {
      this.dt2.filterGlobal(target.value, 'contains');
      this.stateService.setState({ globalFilter: target.value });
    }
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.stateService.setState({ tableFirst: this.first });
  }

  nuevoReporte(idEquipo: number, idReporte: number) {
    localStorage.setItem('TipoMantenimiento', 'P');
    if (idReporte && idReporte > 0) {
      localStorage.setItem('idReporte', idReporte.toString());
    } else {
      localStorage.removeItem('idReporte');
    }
    this.router.navigate(['biomedica/nuevoreporte/', idEquipo]);
  }

  obtenerNombreMes(numeroMes: any): string {
    const meses: string[] = [
      "Enero", "Febrero", "Marzo", "Abril",
      "Mayo", "Junio", "Julio", "Agosto",
      "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    
    const num = Number(numeroMes);
    if (isNaN(num) || num < 1 || num > 12) {
      return "N/A";
    }
    return meses[num - 1];
  }

  goBack(): void {
    this.location.back();
  }

  verReportesEquipo(id: number) {

    this.router.navigate(['/biomedica/reportesequipo/', id]);
  }

  verificarVencimiento(mes: any, anio: any): boolean {
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1;
    const anioActual = fechaActual.getFullYear();

    if (anioActual < anio) return true;

    if (anioActual === anio && mesActual <= mes) return true;

    return false;
  }

  async viewModalReport(reporte: any) {
    this.loading = true;
    try {
      const id = (reporte && typeof reporte === 'object') ? reporte.id : reporte;
      this.reportSelected = await this.reportesService.getReporteById(id);
      this.rutina = await this.protocolosServices.getCumplimientoProtocoloReporte(id);
      this.modalReport = true;
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo cargar la información del reporte.', 'error');
    } finally {
      this.loading = false;
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

  editarReporte() {
    if (!this.reportSelected) return;

    let tipo = (this.reportSelected.tipoMantenimiento === 'Preventivo' || this.reportSelected.tipoMantenimiento === 'Preventivo Programado') ? 'P' : 'C';

    localStorage.setItem('TipoMantenimiento', tipo);
    if (this.reportSelected && this.reportSelected.id) {
       localStorage.setItem('idReporte', this.reportSelected.id.toString());
    } else {
       localStorage.removeItem('idReporte');
    }

    this.modalReport = false; // Cerrar modal
    this.router.navigate(['biomedica/nuevoreporte/', this.reportSelected.equipo.id]);
  }
  descargarFormato() {
    if (this.reportSelected) {
      if (this.reportSelected.tipoMantenimiento === 'Preventivo') {
        // Enforce alias consistency for PDF generator if needed, 
        // though backend now uses 'cumplimientoProtocolo'
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
      const res = await this.reportesService.uploadReportePdf(this.reportSelected.id, this.selectedFile);
      Swal.fire('Éxito', 'Reporte PDF subido correctamente', 'success');
      this.reportSelected.rutaPdf = res.rutaPdf;
      this.selectedFile = null;
      await this.setDate(); // Actualizar la tabla para que cambie el botón
    } catch (error) {
      console.error('Error al subir PDF:', error);
      Swal.fire('Error', 'No se pudo subir el archivo PDF', 'error');
    }
  }

  abrirModalFirma() {
      this.modalFirma = true;
      this.nombreFirma = this.reportSelected?.nombreRecibio || '';
      this.cedulaFirma = this.reportSelected?.cedulaRecibio || '';
      
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
              await this.setDate();
              Swal.fire('Éxito', 'El reporte fue firmado y guardado correctamente.', 'success');
          } else {
              Swal.fire('Error', 'No se pudo generar el documento PDF.', 'error');
          }

      } catch (error) {
          console.error('Error guardando firma:', error);
          Swal.fire('Error', 'Hubo un problema al procesar la firma o subir el archivo.', 'error');
      }
  }

  exportarExcel() {
    if (!this.preventivos || this.preventivos.length === 0) {
      Swal.fire('Sin datos', 'No hay reportes preventivos para exportar en este periodo.', 'info');
      return;
    }

    const dataToExport = this.preventivos.map(r => ({
      'Equipo': r.equipo.nombres,
      'Marca': r.equipo.marca,
      'Modelo': r.equipo.modelo,
      'Serie': r.equipo.serie,
      'Placa': r.equipo.placa,
      'Servicio': r.servicio.nombres,
      'Sede': r.servicio.sede?.nombres || 'N/A',
      'Técnico Asignado': r.usuario?.nombres || 'Sin Asignar',
      'Mes Programado': this.obtenerNombreMes(r.mesProgramado),
      'Año': r.añoProgramado || r.anioProgramado,
      'Estado': r._status,
      'Realizado': r.realizado ? 'SÍ' : 'NO',
      'Fecha Realizado': r.fechaRealizado || 'N/A'
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Mantenimientos Preventivos': worksheet },
      SheetNames: ['Mantenimientos Preventivos']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    
    const fileName = `Preventivos_${this.obtenerNombreMes(this.mesInicio)}_a_${this.obtenerNombreMes(this.mesFin)}_${this.anio}.xlsx`;
    saveAs(data, fileName);
  }
}
