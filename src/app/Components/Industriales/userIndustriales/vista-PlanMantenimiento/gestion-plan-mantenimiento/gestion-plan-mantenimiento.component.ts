import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule, Table } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown'; // Added DropdownModule
import { DialogModule } from 'primeng/dialog'; // Added DialogModule
import { ButtonModule } from 'primeng/button'; // Added ButtonModule
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { IndustrialesNavbarComponent } from '../../../../navbars/IndustrialesNavbar/industrialesnavbar.component';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import { PlanMantenimientoIndustrialesService } from '../../../../../Services/appServices/industrialesServices/planMantenimiento/planMantenimientoIndustriales.service';
import { ReporteIndustrialService } from '../../../../../Services/appServices/industrialesServices/reportes/reporte-industrial.service';
import { ProtocoloIndustrialService } from '../../../../../Services/appServices/industrialesServices/protocolo/protocolo-industrial.service';
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
    InputTextModule,
    InputTextModule,
    InputTextModule,
    DropdownModule,
    DialogModule,
    ButtonModule,
    TagModule,
    TooltipModule
  ],
  templateUrl: './gestion-plan-mantenimiento.component.html',
  styleUrls: ['./gestion-plan-mantenimiento.component.css']
})
export class GestionPlanMantenimientoComponent implements OnInit {

  protected readonly API_URL = API_URL;

  @ViewChild('dt') dt!: Table;
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
  private router = inject(Router);

  // Modal Properties
  displayReporteDialog: boolean = false;
  reporteSeleccionado: any = null;
  planSeleccionado: any = null;
  equipoReporteSeleccionado: any = null;
  rutina: any[] = [];

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

  async setDate() {
    try {
      this.loading = true;
      // Fetch planes for the range (or just start month if API doesn't support range yet)
      // Assuming existing service supports searching by year/month. 
      // If we need range, we might need to fetch multiple times or update service.
      // For now, let's query by the start month/year or fetch all if feasible.

      // Attempt to filtered fetch or fallback
      // Since original code used getPlanesByPeriodo(anio, mes), let's use mesInicio
      // Use range query
      if (this.mesInicio === this.mesFin) {
        this.planes = await this.planMantenimientoService.getPlanesByPeriodo(this.anio, this.mesInicio);
      } else {
        this.planes = await this.planMantenimientoService.getPlanesByRango(this.anio, this.mesInicio, this.mesFin);
      }

      // Show ALL plans including estado=0 (No Programado)

      // Try to fetch Correctivos
      try {
        if (this.mesInicio === this.mesFin) {
          this.correctivos = await this.reporteService.getReportesCorrectivosMesAño({ anio: this.anio, mes: this.mesInicio });
        } else {
          this.correctivos = await this.reporteService.getReportesCorrectivosRango({ anio: this.anio, mesInicio: this.mesInicio, mesFin: this.mesFin });
        }
        console.log("Correctivos loaded:", this.correctivos);
      } catch (err) {
        console.warn('No correctives found or error:', err);
        this.correctivos = [];
      }

      this.preventivos = [...this.planes]; // Assign to preventivos

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
    // Filter logic if needed
  }

  panelPendientesView() {
    this.panelRealizados = false;
    this.panelPendientes = true;
    // Filter logic if needed
  }

  // Actions
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
    if (this.userRole === 'INDUSTRIALESUSER') {
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

  regresar() {
    this.router.navigate(['/adminindustriales']);
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

      const blob: any = await this.reporteService.descargarReportePDF(this.reporteSeleccionado.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Reporte_Mantenimiento_${this.reporteSeleccionado.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      Swal.close();
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      Swal.fire('Error', 'No se pudo descargar el PDF del reporte.', 'error');
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