import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule, Table } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select'; 
import { DialogModule } from 'primeng/dialog'; 
import { ButtonModule } from 'primeng/button'; 
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { IndustrialesNavbarComponent } from '../../../../navbars/IndustrialesNavbar/industrialesnavbar.component';
import { MantenimientoadminnavbarComponent } from '../../../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import { PlanMantenimientoIndustrialesService } from '../../../../../Services/appServices/industrialesServices/planMantenimiento/planMantenimientoIndustriales.service';
import { ReporteIndustrialService } from '../../../../../Services/appServices/industrialesServices/reportes/reporte-industrial.service';
import { ProtocoloIndustrialService } from '../../../../../Services/appServices/industrialesServices/protocolo/protocolo-industrial.service';
import { PdfGeneratorService } from '../../../../../Services/appServices/biomedicaServices/pdf-generator/pdf-generator.service';
import { API_URL } from '../../../../../constantes';
// import { generarReporteMantenimientoPDF } from './pdf-reporte.util';


@Component({
  selector: 'app-gestion-plan-mantenimiento',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    SelectModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    TagModule,
    TooltipModule,
    MantenimientoadminnavbarComponent
  ],
  templateUrl: './gestion-plan-mantenimiento.component.html',
  styleUrls: ['./gestion-plan-mantenimiento.component.css']
})
export class GestionPlanMantenimientoComponent implements OnInit {

  protected readonly API_URL = API_URL;

  @ViewChild('dt') dt!: Table;
  @ViewChild('dtMetas') dtMetas!: Table;
  @ViewChild('inputPdfFirmado') inputPdfFirmado!: ElementRef<HTMLInputElement>;

  planes: any[] = [];
  preventivos: any[] = []; // Alias for planes to match Bio structure
  correctivos: any[] = []; // Placeholder
  metas: any[] = []; // Placeholder

  loading: boolean = true;
  userRole: string = '';

  // Date Filters
  fechaActual = new Date();
  anio: number = this.fechaActual.getFullYear();
  mesInicio: number = this.fechaActual.getMonth() + 1;
  mesFin: number = this.fechaActual.getMonth() + 1;

  // Panel States
  panelPreventivos: boolean = true;
  panelMetas: boolean = false;
  panelCorrectivos: boolean = false;

  // Sub-Panel States for Metas
  panelRealizados: boolean = true;
  panelPendientes: boolean = false;

  meses = [
    { label: 'Enero', value: 1 },
    { label: 'Febrero', value: 2 },
    { label: 'Marzo', value: 3 },
    { label: 'Abril', value: 4 },
    { label: 'Mayo', value: 5 },
    { label: 'Junio', value: 6 },
    { label: 'Julio', value: 7 },
    { label: 'Agosto', value: 8 },
    { label: 'Septiembre', value: 9 },
    { label: 'Octubre', value: 10 },
    { label: 'Noviembre', value: 11 },
    { label: 'Diciembre', value: 12 }
  ];

  planMantenimientoService = inject(PlanMantenimientoIndustrialesService);
  reporteService = inject(ReporteIndustrialService);
  protocoloService = inject(ProtocoloIndustrialService);
  pdfGeneratorService = inject(PdfGeneratorService);
  private router = inject(Router);

  // Modal Properties
  displayReporteDialog: boolean = false;
  reporteSeleccionado: any = null;
  planSeleccionado: any = null;
  equipoReporteSeleccionado: any = null;
  rutina: any[] = [];

  myId: number | null = null;

  async ngOnInit() {
    this.loadUserRole();
    // Auto-mark overdue plans as Pendiente
    try {
      await this.planMantenimientoService.actualizarPendientes();
    } catch (e) {
      console.warn('No se pudieron actualizar planes pendientes', e);
    }
    await this.setDate();
  }

  loadUserRole() {
    const token = sessionStorage.getItem('utoken');
    if (token) {
      const decoded: any = this.getDecodedAccessToken(token);
      if (decoded) {
        const rol = decoded.rol;
        this.myId = decoded.id || decoded.usuarioId || decoded.uid;
        
        const adminRoles = ['8', 'ADMINMANTENIMIENTO', 'USERMANTENIMIENTO', '1', 'SUPERADMIN', '2', 'SYSTEMADMIN', 'ADMINMANTENIMIENTO'];
        
        if (adminRoles.includes(rol)) {
          this.userRole = 'Administrador';
        } else if (rol === 'TECNICOMANTENIMIENTO' || rol === 'TECNICOMANTENIMIENTO') {
          this.userRole = 'Técnico';
        } else if (rol === 'USERMANTENIMIENTO') {
          this.userRole = 'Usuario';
        } else {
          this.userRole = rol;
        }
      }
    }
  }

  canEditCorrective(): boolean {
    return this.userRole === 'Administrador' || this.userRole === 'Usuario' || this.userRole === 'Técnico';
  }

  canViewDetail(): boolean {
    return true; // Everyone can view detail
  }

  canEditPlan(): boolean {
    return this.userRole === 'Administrador';
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }

  async setDate() {
    try {
      this.loading = true;

      const tecId = this.userRole === 'Técnico' && this.myId ? this.myId : undefined;

      if (this.mesInicio === this.mesFin) {
        this.planes = await this.planMantenimientoService.getPlanesByPeriodo(this.anio, this.mesInicio, tecId);
      } else {
        this.planes = await this.planMantenimientoService.getPlanesByRango(this.anio, this.mesInicio, this.mesFin, tecId);
      }

      // Show ALL plans including estado=0 (No Programado)

      // Try to fetch Correctivos
      try {
        if (this.mesInicio === this.mesFin) {
          this.correctivos = await this.reporteService.getReportesCorrectivosMesAño({ anio: this.anio, mes: this.mesInicio, tecnicoId: tecId });
        } else {
          this.correctivos = await this.reporteService.getReportesCorrectivosRango({ anio: this.anio, mesInicio: this.mesInicio, mesFin: this.mesFin, tecnicoId: tecId });
        }
        console.log("Correctivos loaded:", this.correctivos);
      } catch (err) {
        console.warn('No correctives found or error:', err);
        this.correctivos = [];
      }

      this.preventivos = [...this.planes]; // Assign to preventivos
      this.actualizarMetas();

      this.loading = false;
    } catch (error) {
      console.error('Error al cargar planes:', error);
      this.loading = false;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No fue posible cargar los planes de mantenimiento'
      });
    }
  }

  // Navigation / Tabs
  viewPreventivos() {
    this.panelPreventivos = true;
    this.panelMetas = false;
    this.panelCorrectivos = false;
  }

  viewMetas() {
    this.panelPreventivos = false;
    this.panelMetas = true;
    this.panelCorrectivos = false;
    this.panelRealizadosView(); // Default sub-tab
  }

  viewCorrectivos() {
    this.panelPreventivos = false;
    this.panelMetas = false;
    this.panelCorrectivos = true;
  }

  panelRealizadosView() {
    this.panelRealizados = true;
    this.panelPendientes = false;
    this.actualizarMetas();
  }

  panelPendientesView() {
    this.panelRealizados = false;
    this.panelPendientes = true;
    this.actualizarMetas();
  }

  actualizarMetas() {
    let list: any[] = [];

    if (this.panelRealizados) {
      // Preventivos Realizados (2=Realizado, 3=Completado)
      const prevRealizados = this.preventivos
        .filter(p => p.estado === 2 || p.estado === 3)
        .map(p => ({
          equipo: p.equipo?.nombres || 'N/A',
          serie: p.equipo?.serie || 'N/A',
          placa: p.equipo?.placa || 'N/A',
          ubicacion: p.equipo?.ubicacionEspecifica || 'N/A',
          tipo: 'Preventivo',
          estado: this.getEstadoLabel(p.estado)
        }));

      // Correctivos Realizados (Corregido o Realizado)
      const corrRealizados = this.correctivos
        .filter(c => c.estado === 'Corregido' || c.estado === 'Realizado')
        .map(c => ({
          equipo: c.equipo?.nombres || 'N/A',
          serie: c.equipo?.serie || 'N/A',
          placa: c.equipo?.placa || 'N/A',
          ubicacion: c.equipo?.ubicacionEspecifica || 'N/A',
          tipo: 'Correctivo',
          estado: c.estado
        }));

      list = [...prevRealizados, ...corrRealizados];
    } else {
      // Preventivos Pendientes (1=Programado, 4=Pendiente)
      const prevPendientes = this.preventivos
        .filter(p => p.estado === 1 || p.estado === 4)
        .map(p => ({
          equipo: p.equipo?.nombres || 'N/A',
          serie: p.equipo?.serie || 'N/A',
          placa: p.equipo?.placa || 'N/A',
          ubicacion: p.equipo?.ubicacionEspecifica || 'N/A',
          tipo: 'Preventivo',
          estado: this.getEstadoLabel(p.estado)
        }));

      // Correctivos Pendientes (Corregir)
      const corrPendientes = this.correctivos
        .filter(c => c.estado === 'Corregir')
        .map(c => ({
          equipo: c.equipo?.nombres || 'N/A',
          serie: c.equipo?.serie || 'N/A',
          placa: c.equipo?.placa || 'N/A',
          ubicacion: c.equipo?.ubicacionEspecifica || 'N/A',
          tipo: 'Correctivo',
          estado: c.estado
        }));

      list = [...prevPendientes, ...corrPendientes];
    }

    this.metas = list;
  }



  crearPlan() {
    this.router.navigate(['/industriales/crear-mantenimiento']);
  }

  verDetalle(idPlan: number) {
    this.router.navigate(['/industriales/detalle-mantenimiento', idPlan]);
  }

  editarPlan(idPlan: number) {
    this.router.navigate(['/industriales/editar-mantenimiento', idPlan]);
  }

  irAReporte(plan: any) {
    // estado 2 = Realizado (sin informe firmado), 3 = Completado (con informe) → show report summary
    if (plan.estado === 2 || plan.estado === 3) {
      this.verResumenReporte(plan);
    } else if (plan.estado === 1 || plan.estado === 4) {
      // Access check for execution
      if (this.userRole === 'Usuario') {
        Swal.fire('Información', 'Como usuario no puede ejecutar el mantenimiento, solo visualizar los reportes ya realizados.', 'info');
        return;
      }
      // estado 1 = Programado, 4 = Pendiente → go to create report
      sessionStorage.setItem('idPlanMantenimientoIndustrial', plan.id.toString());
      sessionStorage.setItem('TipoMantenimientoIndustrial', 'Preventivo');
      if (plan.equipo && plan.equipo.id) {
        this.router.navigate(['/industriales/crear-reporte', plan.equipo.id]);
      } else {
        Swal.fire('Error', 'No se encontró información del equipo', 'error');
      }
    }
  }

  async verResumenReporte(plan: any) {
    if (!plan.equipo?.id || !plan.mes || !plan.ano) {
      Swal.fire('Error', 'Información del plan incompleta', 'error');
      return;
    }

    try {
      this.planSeleccionado = plan;
      this.reporteSeleccionado = await this.reporteService.getReporteByPlanDetails(plan.equipo.id, plan.mes, plan.ano, plan.id);
      this.equipoReporteSeleccionado = plan.equipo || null;

      if (this.reporteSeleccionado) {
        try {
          this.rutina = await this.protocoloService.getCumplimientoProtocoloReporte(this.reporteSeleccionado.id);
        } catch (e) {
          console.warn('No se pudo cargar la rutina de mantenimiento', e);
          this.rutina = [];
        }
      }

      this.displayReporteDialog = true;
    } catch (error) {
      console.error(error);
      Swal.fire('Información', 'No se encontró el reporte asociado o no ha sido sincronizado.', 'info');
    }
  }

  async verResumenCorrectivo(correctivo: any) {
    if (!correctivo.id) {
       Swal.fire('Error', 'ID de Correctivo inválido', 'error');
       return;
    }
    
    try {
        this.planSeleccionado = null; // los correctivos no tienen plan
        this.reporteSeleccionado = await this.reporteService.getReporteByCorrectivoId(correctivo.id);
        console.log('DEBUG: Datos del reporte correctivo recibidos:', this.reporteSeleccionado);
        this.equipoReporteSeleccionado = correctivo.equipo || null;
        this.rutina = []; 
        this.displayReporteDialog = true;
    } catch(error) {
        console.error(error);
        Swal.fire('Información', 'Aún no se ha generado un reporte para este mantenimiento correctivo.', 'info');
    }
  }

  /*
  async cambiarEstado(idPlan: number, estadoActual: boolean) {
     // ... (Previous logic commented out or removed as we reused the button)
     // If user wanted to KEEP toggle but ADD report, they would need 2 buttons.
     // User said "en el boton de estado... vamos a deshabilitar".
     // Implies the button action changes or is restricted.
  }
  */

  async cambiarEstadoCorrectivo(correctivo: any) {
    if (!this.canEditCorrective()) {
      Swal.fire('Acceso Denegado', 'No tienes permisos para modificar este estado', 'error');
      return;
    }

    if (correctivo.estado === 'Corregir') {
       // Ir al reporte
       sessionStorage.setItem('idMantenimientoCorrectivoIndustrial', correctivo.id.toString());
       sessionStorage.setItem('TipoMantenimientoIndustrial', 'C');
       if (correctivo.motivo) {
           sessionStorage.setItem('MotivoFalloIndustrial', correctivo.motivo);
       }
       if (correctivo.equipo && correctivo.equipo.id) {
         this.router.navigate(['/industriales/crear-reporte', correctivo.equipo.id]);
       } else {
         Swal.fire('Error', 'No se encontró información del equipo', 'error');
       }
       return;
    }

    if (correctivo.estado === 'Corregido' || correctivo.estado === 'Realizado') {
        this.verResumenCorrectivo(correctivo);
        return;
    }

    let nuevoEstado = '';
    
    // Cycle logic: Corregir -> Corregido -> Realizado
    if (correctivo.estado === 'Corregir') {
      nuevoEstado = 'Corregido';
    } else if (correctivo.estado === 'Corregido') {
      nuevoEstado = 'Realizado';
    } else {
      return; // Already Realizado, don't change or cycle back
    }

    try {
       // Obtener usuario del token
       const token = sessionStorage.getItem('utoken');
       let usuarioIdFk;
       if (token) {
           const decoded = this.getDecodedAccessToken(token);
           if (decoded && decoded.id) {
               usuarioIdFk = decoded.id;
           }
       }

      await this.reporteService.updateEstadoCorrectivo(correctivo.id, {
         estado: nuevoEstado,
         usuarioIdFk: usuarioIdFk
      });
      correctivo.estado = nuevoEstado;
      if (nuevoEstado === 'Realizado') {
        correctivo.fechaRealizado = new Date().toISOString().split('T')[0];
      }
      Swal.fire('Actualizado', `Estado cambiado a ${nuevoEstado}`, 'success');
    } catch (e) {
      console.error(e);
      Swal.fire('Error', 'No se pudo actualizar el estado', 'error');
    }
  }

  onGlobalFilter(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target && this.dt) {
      this.dt.filterGlobal(target.value, 'contains');
    }
  }

  onGlobalFilterMetas(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target && this.dtMetas) {
      this.dtMetas.filterGlobal(target.value, 'contains');
    }
  }

  // --- Status Helpers ---
  getEstadoLabel(estado: number): string {
    const labels: { [key: number]: string } = {
      0: 'No Programado',
      1: 'Programado',
      2: 'Realizado',
      3: 'Completado',
      4: 'Pendiente'
    };
    return labels[estado] ?? 'Desconocido';
  }

  getEstadoSeverity(estado: number): string {
    const severities: { [key: number]: string } = {
      0: 'warn',
      1: 'info',
      2: 'success',
      3: 'success',
      4: 'danger'
    };
    return severities[estado] ?? 'secondary';
  }

  obtenerNombreMes(numeroMes: number): string {
    const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return meses[numeroMes - 1] || '';
  }

  getImagenesReporte(rutaImagen: string): string[] {
    if (!rutaImagen) return [];
    try {
      const parsed = JSON.parse(rutaImagen);
      if (Array.isArray(parsed)) {
        return parsed; // It's a JSON array of filenames
      }
      return [rutaImagen]; // It's a single string (legacy)
    } catch (e) {
      return [rutaImagen]; // It's a plain string (legacy)
    }
  }

  private location = inject(Location);

  regresar() {
    window.history.back();
  }

  async imprimirReporte() {
    if (!this.reporteSeleccionado || !this.reporteSeleccionado.id) {
      Swal.fire('Info', 'No hay un reporte seleccionado para imprimir.', 'info');
      return;
    }

    try {
      Swal.fire({
        title: 'Generando PDF...',
        text: 'Por favor espere',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const reporteCompleto = { ...this.reporteSeleccionado };

      // Map equipo if not nested under equipo
      if (!reporteCompleto.equipo && this.planSeleccionado?.equipo) {
        reporteCompleto.equipo = this.planSeleccionado.equipo;
      }

      // Map servicio if not nested under servicio
      if (!reporteCompleto.servicio && this.planSeleccionado?.equipo?.servicioInd) {
        reporteCompleto.servicio = this.planSeleccionado.equipo.servicioInd;
      }

      // Fallback: If still no servicio names but have plan
      if (!reporteCompleto.servicio && this.planSeleccionado?.servicio) {
        reporteCompleto.servicio = this.planSeleccionado.servicio;
      }

      // Ensure properties for generateReporteIndustrialCorrectivo
      reporteCompleto.tipoMantenimiento = 'Preventivo';
      reporteCompleto.tipoReporte = 'INDUSTRIAL';

      // Fallback for fallasEncontradas/motivo
      reporteCompleto.fallasEncontradas = reporteCompleto.fallasEncontradas || reporteCompleto.motivo || 'Mantenimiento Preventivo Programado';

      // Fallback for trabajoRealizado/reporte
      reporteCompleto.trabajoRealizado = reporteCompleto.trabajoRealizado || reporteCompleto.reporte || 'Mantenimiento realizado según protocolos';

      // Fallback for usuarioRecibe
      reporteCompleto.usuarioRecibe = reporteCompleto.usuarioRecibe || reporteCompleto.nombreRecibio || 'Usuario Responsable';
      reporteCompleto.usuarioRecibeCargo = reporteCompleto.usuarioRecibeCargo || 'Usuario';

      // Format fechaRealizado if needed
      if (reporteCompleto.fechaFin || reporteCompleto.fechaRealizado) {
        const fechaAUsar = reporteCompleto.fechaFin || reporteCompleto.fechaRealizado;
        const d = new Date(fechaAUsar);
        reporteCompleto.fechaRealizado = isNaN(d.getTime()) ? fechaAUsar : d.toISOString().split('T')[0];
      }

      // Generate PDF client-side
      await this.pdfGeneratorService.generateReporteIndustrialCorrectivo(reporteCompleto, false, false);

      Swal.close();
    } catch (error) {
      console.error('Error al generar PDF:', error);
      Swal.fire('Error', 'No se pudo generar el PDF del reporte.', 'error');
    }
  }

  abrirSelectorPDF() {
    if (this.inputPdfFirmado?.nativeElement) {
      this.inputPdfFirmado.nativeElement.value = '';
      this.inputPdfFirmado.nativeElement.click();
    }
  }

  async onPdfFirmadoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];

    const result = await Swal.fire({
      title: '¿Subir informe firmado?',
      text: `Se subirá el archivo "${file.name}" como informe firmado de este reporte.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0d7377',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Subir',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      Swal.fire({
        title: 'Subiendo PDF...',
        text: 'Por favor espere',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      const respuesta = await this.reporteService.subirInformeFirmado(this.reporteSeleccionado.id, file);
      this.reporteSeleccionado.rutaInformeFirmado = respuesta.rutaInformeFirmado;

      // Actualizar el plan en memoria a estado 3 (Completado)
      if (this.planSeleccionado) {
        this.planSeleccionado.estado = 3;
        // También actualizar en la lista de planes
        const idx = this.planes.findIndex((p: any) => p.id === this.planSeleccionado.id);
        if (idx !== -1) this.planes[idx].estado = 3;
        const idx2 = this.preventivos.findIndex((p: any) => p.id === this.planSeleccionado.id);
        if (idx2 !== -1) this.preventivos[idx2].estado = 3;
      }

      Swal.fire({
        title: '¡Informe subido!',
        text: 'El informe firmado fue cargado. El plan cambió a estado Completado.',
        icon: 'success',
        timer: 2500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error subiendo informe firmado:', error);
      Swal.fire('Error', 'No se pudo subir el informe firmado.', 'error');
    }
  }

  async verInformeFirmado() {
    if (!this.reporteSeleccionado?.id) return;
    try {
      Swal.fire({
        title: 'Cargando informe...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });
      const blob: any = await this.reporteService.descargarInformeFirmado(this.reporteSeleccionado.id);
      const url = window.URL.createObjectURL(blob);
      Swal.close();
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error al ver informe firmado:', error);
      Swal.fire('Error', 'No se pudo cargar el informe firmado.', 'error');
    }
  }
}