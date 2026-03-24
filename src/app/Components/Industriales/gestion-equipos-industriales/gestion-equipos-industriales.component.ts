import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, HostListener } from '@angular/core';
import { TableModule } from 'primeng/table';
import { MessageService, MenuItem } from 'primeng/api';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import { MenuModule } from 'primeng/menu';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ImageModule } from 'primeng/image';
import { TooltipModule } from 'primeng/tooltip';

import { IndustrialesNavbarComponent } from '../../navbars/IndustrialesNavbar/industrialesnavbar.component';


import { EquiposIndustrialesService } from '../../../Services/appServices/industrialesServices/equipos/equiposIndustriales.service';
import { HojaDeVidaIndustrialService } from '../../../Services/appServices/industrialesServices/HojaDeVida/HojaDeVidaIndustrial.service';
import { TrasladosIndustrialesService } from '../../../Services/appServices/industrialesServices/traslados/trasladosIndustriales.service';
import { ReporteIndustrialService } from '../../../Services/appServices/industrialesServices/reportes/reporte-industrial.service';
import { ProtocoloIndustrialService } from '../../../Services/appServices/industrialesServices/protocolo/protocolo-industrial.service';
import { ServicioService } from '../../../Services/appServices/general/servicio/servicio.service';
import { API_URL } from '../../../constantes';

import { SedeService } from '../../../Services/appServices/general/sede/sede.service';
import { TipoEquipoService } from '../../../Services/appServices/general/tipoEquipo/tipo-equipo.service';
import { ResponsableService } from '../../../Services/appServices/industrialesServices/responsable/responsable.service';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-gestion-equipos-industriales',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    DialogModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    MenuModule,
    SelectModule,
    AccordionModule,
    CardModule,
    DividerModule,
    ImageModule,
    TooltipModule
  ],
  providers: [MessageService],
  templateUrl: './gestion-equipos-industriales.component.html',
  styleUrls: ['./gestion-equipos-industriales.component.css']
})
export class GestionEquiposIndustrialesComponent implements OnInit {

  protected readonly API_URL = API_URL;

  equipos!: any[];
  allEquipos!: any[];
  loading: boolean = true;
  activityValues: number[] = [0, 100];

  // Filters
  serviciosList: any[] = [];

  // State for tracking open menu
  openMenuId: number | null = null;
  selectedEquipo: any;

  // History Modal State
  displayHistorial: boolean = false;
  historialSeleccionado: any[] = [];
  equipoHistorialNombre: string = '';

  // Variables para Traslados
  displayTrasladoDialog: boolean = false;
  selectedEquipoTraslado: any = null;
  servicioDestinoId: number | null = null;
  nombreReceptor: string = '';
  cargoReceptor: string = '';
  observacionesTransferencia: string = '';
  loadingTraslado: boolean = false;

  // Detail Modal State
  displayDetalleDialog: boolean = false;
  equipoDetalle: any = null;
  historialDetalle: any[] = [];
  loadingDetalle: boolean = false;

  // Hoja de Vida Modal State
  displayHojaVidaDialog: boolean = false;
  hvEquipoInfo: any = null;
  hvHojaVida: any = null;
  hvDatosTecnicos: any = null;
  hvProveedor: any = null;
  hvRegistroApoyo: any = null;
  hvDocumentos: any[] = [];
  loadingHojaVida: boolean = false;
  hvUploading: boolean = false;

  // Reportes History Modal State
  displayReportesDialog: boolean = false;
  reportesEquipo: any[] = [];
  reportesEquipoNombre: string = '';
  loadingReportes: boolean = false;

  // Resumen Reporte Modal State
  displayResumenReporteDialog: boolean = false;
  reporteSeleccionado: any = null;
  rutina: any[] = [];

  userRole: string = '';

  // Dashboard State
  currentView: 'dashboard' | 'table' | 'listSedes' | 'listTipos' | 'listRiesgos' | 'listComodatos' = 'dashboard';
  filterTitle: string = '';

  // Data Lists for Selector Views
  sedesList: any[] = []; // Used for raw list, kept for compatibility if needed
  officialSedesList: any[] = [];
  displayedSedes: any[] = [];
  searchText: string = '';
  searchTextTipo: string = '';
  searchTextComodato: string = '';
  tipoEquiposList: any[] = [];
  responsablesList: any[] = [];

  riesgosList: string[] = ['I', 'IIA', 'IIB', 'III']; // Static or from service
  comodatosList: any[] = [{ label: 'Si', value: true }, { label: 'No', value: false }];

  constructor(
    private router: Router,
    private equiposService: EquiposIndustrialesService,
    private messageService: MessageService,
    private trasladosService: TrasladosIndustrialesService,
    private servicioService: ServicioService,
    private sedeService: SedeService,
    private tipoEquipoService: TipoEquipoService,
    private responsableService: ResponsableService,
    private hojaVidaService: HojaDeVidaIndustrialService,
    private reporteService: ReporteIndustrialService,
    private protocoloService: ProtocoloIndustrialService
  ) { }

  async ngOnInit() {
    this.loadUserRole();
    try {
      this.equipos = await this.equiposService.getAllEquiposTodos();
      this.allEquipos = [...this.equipos]; // Backup for reset
      this.serviciosList = await this.servicioService.getAllServicios();

      // Load Official Sedes
      try {
        this.officialSedesList = await this.sedeService.getAllSedes();
      } catch (e) {
        console.error("Error loading sedes", e);
        this.officialSedesList = [];
      }

      // Load Tipos Equipo
      try {
        this.tipoEquiposList = await this.tipoEquipoService.getTiposEquiposIndustrial();
      } catch (e) {
        console.error("Error loading tipos equipo", e);
        this.tipoEquiposList = [];
      }

      // Load Responsables
      try {
        this.responsablesList = await this.responsableService.getAllResponsables();
      } catch (e) {
        console.error("Error loading responsables", e);
        this.responsablesList = [];
      }

      // Initialize displayed sedes
      this.displayedSedes = [...this.officialSedesList];
      // Keep sedesList populated just in case
      this.sedesList = [...this.officialSedesList];

      this.loading = false;

    } catch (error) {
      this.loading = false;
      Swal.fire({
        icon: 'warning',
        title: 'Inconsistencia en los datos',
        text: `No fue posible cargar la información de los equipos industriales. Detalle: ${(error as any).error?.error || (error as any).message || error}`
      });
    }
  }

  // --- Dashboard Navigation ---

  buscarEquipoPorSerie() {
    if (this.selectedEquipo) {
      this.router.navigate(['/industriales/equipos/hojadevida/' + this.selectedEquipo.id]);
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Seleccione un equipo',
        text: 'Debe seleccionar un Equipo.'
      });
    }
  }

  showDashboard() {
    this.currentView = 'dashboard';
    this.equipos = [...this.allEquipos]; // Reset data
    this.filterTitle = '';
  }

  showAllEquipos() {
    this.currentView = 'table';
    this.equipos = [...this.allEquipos];
    this.filterTitle = 'Todos los Equipos';
  }

  showBySede() {
    this.currentView = 'listSedes';
    this.filterTitle = 'Seleccionar Sede';
    // Reset filters
    this.displayedSedes = [...this.officialSedesList];
    this.searchText = '';
  }

  showByTipo() {
    this.currentView = 'listTipos';
    this.filterTitle = 'Seleccionar Tipo de Equipo';
    this.searchTextTipo = '';
  }

  showByComodato() {
    this.currentView = 'listComodatos';
    this.filterTitle = 'Seleccionar Responsable de Comodato';
    this.searchTextComodato = '';
  }

  showByRiesgo() {
    this.currentView = 'listRiesgos';
    this.filterTitle = 'Seleccionar Clasificación de Riesgo';
  }

  filteredSedes() {
    if (!this.searchText) {
      return this.officialSedesList;
    }
    return this.officialSedesList.filter(sede =>
      sede.nombres.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  filteredTiposEquipo() {
    if (!this.searchTextTipo) {
      return this.tipoEquiposList;
    }
    return this.tipoEquiposList.filter(tipo =>
      tipo.nombres.toLowerCase().includes(this.searchTextTipo.toLowerCase())
    );
  }

  filteredResponsables() {
    if (!this.searchTextComodato) {
      return this.responsablesList;
    }
    return this.responsablesList.filter(resp =>
      resp.nombres.toLowerCase().includes(this.searchTextComodato.toLowerCase())
    );
  }

  selectSedeFromCard(sede: any) {
    // Filter equipment by Sede ID (sedeIdFk on equipment matches sede.id)
    this.equipos = this.allEquipos.filter(e => e.sedeIdFk === sede.id || e.sedeInd?.id === sede.id);
    this.currentView = 'table';
    this.filterTitle = `Sede: ${sede.nombres}`;
  }

  selectTipoFromCard(tipo: any) {
    // Filter equipment by Tipo Equipo ID
    this.equipos = this.allEquipos.filter(e => e.tipoEquipoIdFk === tipo.id || e.tipoEquipoInd?.id === tipo.id);
    this.currentView = 'table';
    this.filterTitle = `Tipo: ${tipo.nombres}`;
  }

  selectResponsableFromCard(responsable: any) {
    // Filter equipment by Responsable ID
    this.equipos = this.allEquipos.filter(e => e.responsableIdFk === responsable.id || e.responsableInd?.id === responsable.id);
    this.currentView = 'table';
    this.filterTitle = `Responsable: ${responsable.nombres}`;
  }

  filterBySede(sedeNombre: string) {
    this.equipos = this.allEquipos.filter(e => (e.sede?.nombre || e.sede) === sedeNombre);
    this.currentView = 'table';
    this.filterTitle = `Equipos en Sede: ${sedeNombre}`;
  }

  filterByRiesgo(riesgo: string) {
    this.equipos = this.allEquipos.filter(e => e.riesgo === riesgo); // Verify property name 'riesgo' or 'claseRiesgo'
    this.currentView = 'table';
    this.filterTitle = `Equipos con Riesgo: ${riesgo}`;
  }

  filterByComodato(isComodato: boolean) {
    this.equipos = this.allEquipos.filter(e => e.isComodato === isComodato); // Verify property 'isComodato' or 'comodato'
    this.currentView = 'table';
    this.filterTitle = `Equipos en Comodato: ${isComodato ? 'Si' : 'No'}`;
  }

  loadUserRole() {
    const token = sessionStorage.getItem('utoken');
    if (token) {
      const decoded: any = this.getDecodedAccessToken(token);
      this.userRole = decoded ? decoded.rol : '';
      console.log('User Role Raw:', this.userRole);

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

  showRegisterForm() {
    this.router.navigate(['/Industriales/nuevoequipoindustrial']);
  }

  verDetalle(idEquipo: any) {
    this.router.navigate(['/detalle-equipo-industrial', idEquipo]);
  }

  async verDetalleModal(id: number) {
    this.displayDetalleDialog = true;
    this.loadingDetalle = true;
    this.equipoDetalle = null;
    this.historialDetalle = [];
    try {
      this.equipoDetalle = await this.equiposService.getEquipoById(id);
      this.historialDetalle = await this.equiposService.getHistorial(id);
    } catch (error) {
      console.error('Error al cargar detalle:', error);
      Swal.fire('Error', 'No se pudo cargar el detalle del equipo', 'error');
      this.displayDetalleDialog = false;
    } finally {
      this.loadingDetalle = false;
    }
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'Operativo': return 'success';
      case 'En Mantenimiento': return 'warning';
      case 'Fuera De Servicio': return 'danger';
      default: return 'secondary';
    }
  }

  datosTecnicosKeys(): string[] {
    return this.equipoDetalle?.hojaDeVida?.datosTecnicos
      ? Object.keys(this.equipoDetalle.hojaDeVida.datosTecnicos).filter(k => !['id', 'equipoIndustrialIdFk', 'createdAt', 'updatedAt'].includes(k))
      : [];
  }

  // --- Hoja de Vida Modal ---
  async verHojaDeVidaModal(idEquipo: number) {
    this.displayHojaVidaDialog = true;
    this.loadingHojaVida = true;
    this.hvEquipoInfo = null;
    this.hvHojaVida = null;
    this.hvDatosTecnicos = null;
    this.hvProveedor = null;
    this.hvRegistroApoyo = null;
    this.hvDocumentos = [];
    try {
      this.hvEquipoInfo = await this.equiposService.getEquipoById(idEquipo);

      const results = await Promise.allSettled([
        this.hojaVidaService.getHojaVidaByEquipo(idEquipo),
        this.hojaVidaService.getDatosTecnicosByEquipo(idEquipo),
        this.hojaVidaService.getProveedorByEquipo(idEquipo),
        this.hojaVidaService.getRegistroApoyoByEquipo(idEquipo)
      ]);

      if (results[0].status === 'fulfilled') this.hvHojaVida = results[0].value;
      if (results[1].status === 'fulfilled') this.hvDatosTecnicos = results[1].value;
      if (results[2].status === 'fulfilled') this.hvProveedor = results[2].value;
      if (results[3].status === 'fulfilled') this.hvRegistroApoyo = results[3].value;

      // Cargar documentos
      try {
        this.hvDocumentos = await this.hojaVidaService.getDocumentsByEquipo(idEquipo);
      } catch (e) {
        console.error('Error cargando documentos:', e);
      }
    } catch (error) {
      console.error('Error al cargar hoja de vida:', error);
      Swal.fire('Error', 'No se pudo cargar la hoja de vida del equipo', 'error');
      this.displayHojaVidaDialog = false;
    } finally {
      this.loadingHojaVida = false;
    }
  }

  async hvOnFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        Swal.fire('Error', 'El archivo supera el límite de 10MB', 'error');
        return;
      }
      try {
        this.hvUploading = true;
        await this.hojaVidaService.uploadDocument(this.hvEquipoInfo.id, file);
        Swal.fire('Éxito', 'Documento subido correctamente', 'success');
        this.hvDocumentos = await this.hojaVidaService.getDocumentsByEquipo(this.hvEquipoInfo.id);
      } catch (error) {
        console.error('Error subiendo documento:', error);
        Swal.fire('Error', 'No se pudo subir el documento', 'error');
      } finally {
        this.hvUploading = false;
        event.target.value = '';
      }
    }
  }

  async hvEliminarDocumento(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
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
          this.hvDocumentos = await this.hojaVidaService.getDocumentsByEquipo(this.hvEquipoInfo.id);
        } catch (error) {
          Swal.fire('Error', 'No se pudo eliminar el documento', 'error');
        }
      }
    });
  }

  hvDescargarDocumento(id: number) {
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

  hvVisualizarDocumento(id: number) {
    const token = sessionStorage.getItem('utoken');
    const url = `${API_URL}/api/industriales/doc-ind/view/${id}?token=${token}`;
    window.open(url, '_blank');
  }

  regresar() {
    this.router.navigate(['/adminindustriales']);
  }

  editarEquipo(idEquipo: any) {
    this.router.navigate(['/editar-equipo-industrial', idEquipo]);
  }

  async cambiarEstadoActivo(idEquipo: any, darDeBaja: boolean) {
    const accion = darDeBaja ? 'dar de baja' : 'reactivar';
    const titulo = darDeBaja ? '¿Desea dar de baja el equipo?' : '¿Desea reactivar el equipo?';
    const btnTexto = darDeBaja ? 'Dar de Baja' : 'Reactivar';
    const mensajeExito = darDeBaja ? 'Equipo dado de baja correctamente!' : 'Equipo reactivado correctamente!';

    Swal.fire({
      title: titulo,
      text: darDeBaja ? 'El equipo dejará de aparecer en la lista de equipos activos' : 'El equipo volverá a estar disponible',
      showCancelButton: true,
      confirmButtonText: btnTexto,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: darDeBaja ? '#d33' : '#3085d6'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (darDeBaja) {
            await this.equiposService.darDeBajaEquipo(idEquipo);
          } else {
            await this.equiposService.reactivarEquipo(idEquipo);
          }
          this.equipos = await this.equiposService.getAllEquipos();

          Swal.fire(mensajeExito, '', 'success');
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `No fue posible ${accion} el equipo`
          });
        }
      } else if (result.isDismissed) {
        Swal.fire(`Se descartó la operación`, '', 'info');
      }
    });
  }

  crearHojaDeVida(idEquipo: any) {
    this.router.navigate(['/industriales/hoja-de-vida', idEquipo]);
  }

  editarHojaDeVida(idEquipo: any) {
    this.router.navigate(['/industriales/hoja-de-vida', idEquipo]);
  }

  verHojaDeVida(idEquipo: any) {
    this.router.navigate(['/industriales/ver-hoja-de-vida', idEquipo]);
  }

  async verHistorial(idEquipo: number, nombreEquipo: string) {
    try {
      this.historialSeleccionado = [];
      this.displayHistorial = true;
      this.equipoHistorialNombre = nombreEquipo;
      this.historialSeleccionado = await this.equiposService.getHistorial(idEquipo);
    } catch (error) {
      console.error('Error cargando historial:', error);
      this.displayHistorial = false;
      Swal.fire('Error', 'No se pudo cargar el historial del equipo', 'error');
    }
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }

  // --- Menu Logic ---

  menuItems: MenuItem[] = [];

  configurarMenu(equipo: any) {
    this.menuItems = [
      {
        label: 'Ver Detalle',
        icon: 'pi pi-eye',
        command: () => this.verDetalleAction(equipo.id)
      },
      {
        label: 'Ver Historial',
        icon: 'pi pi-history',
        command: () => this.verHistorialAction(equipo.id, equipo.nombres)
      },
      {
        label: 'Historial Reportes',
        icon: 'pi pi-file-check',
        command: () => this.verReportesAction(equipo.id, equipo.nombres)
      }
    ];

    // ADMIN Only Actions (EDITAR)
    if (this.userRole === 'INDUSTRIALESADMIN') {
      this.menuItems.push(
        {
          label: 'Editar',
          icon: 'pi pi-file-edit',
          command: () => this.editarEquipoAction(equipo.id)
        }
      );
    }

    // ADMIN and TECNICO Actions (Traslado)
    if (this.userRole === 'INDUSTRIALESADMIN' || this.userRole === 'INDUSTRIALESTECNICO') {
      this.menuItems.push(
        {
          label: 'Registrar Traslado',
          icon: 'pi pi-arrow-right-arrow-left',
          command: () => this.abrirModalTrasladoAction(equipo)
        }
      );
    }

    // ADMIN and TECNICO Actions
    if (this.userRole === 'INDUSTRIALESADMIN' || this.userRole === 'INDUSTRIALESTECNICO') {
      // Only Admin can EDIT the Plan?. User request says: "TECNICO... no podra editarl el plan"
      // So ONLY ADMIN can Edit Plan.
      if (this.userRole === 'INDUSTRIALESADMIN') {
        this.menuItems.push({
          label: 'Editar Plan de Mant.',
          icon: 'pi pi-calendar-plus',
          command: () => this.editarPlanMantenimientoAction(equipo.id)
        });
      }
    }

    this.menuItems.push({ separator: true });

    // Hoja de Vida Logic
    // TECNICO cannot "Create/Edit HV". USER cannot "Create/Edit HV".
    // So ONLY ADMIN can Create/Edit HV.
    // ALL can View HV.

    if (this.userRole === 'INDUSTRIALESADMIN') {
      if (!equipo.hojaDeVida) {
        this.menuItems.push({
          label: 'Crear Hoja de Vida',
          icon: 'pi pi-file-plus',
          command: () => this.crearHojaDeVidaAction(equipo.id)
        });
      } else {
        this.menuItems.push({
          label: 'Editar Hoja de Vida',
          icon: 'pi pi-file-edit',
          command: () => this.editarHojaDeVidaAction(equipo.id)
        });
      }
    }

    // Allow View HV for everyone if it exists
    if (equipo.hojaDeVida) {
      this.menuItems.push({
        label: 'Ver Hoja de Vida',
        icon: 'pi pi-file',
        command: () => this.verHojaDeVidaAction(equipo.id)
      });
    }

    this.menuItems.push({ separator: true });

    // Estado Logic (Dar de Baja / Reactivar)
    // ADMIN and TECNICO can "Dar de baja".
    if (this.userRole === 'INDUSTRIALESADMIN' || this.userRole === 'INDUSTRIALESTECNICO') {
      if (equipo.activo) {
        this.menuItems.push({
          label: 'Dar de Baja',
          icon: 'pi pi-times-circle',
          styleClass: 'text-danger',
          command: () => this.cambiarEstadoActivoAction(equipo.id, true)
        });
      } else {
        this.menuItems.push({
          label: 'Reactivar',
          icon: 'pi pi-check-circle',
          styleClass: 'text-success',
          command: () => this.cambiarEstadoActivoAction(equipo.id, false)
        });
      }
    }
  }

  // Handle menu open manually to ensure model update works before toggle
  abrirMenu(event: MouseEvent, equipo: any, menu: any) {
    event.stopPropagation();
    this.configurarMenu(equipo);
    // Directly update the model on the component instance to bypass change detection delay
    menu.model = this.menuItems;
    menu.toggle(event);
  }

  // Wrapper actions
  verDetalleAction(id: number) {
    this.verDetalleModal(id);
  }
  editarEquipoAction(id: number) {
    this.editarEquipo(id);
  }
  crearHojaDeVidaAction(id: number) {
    this.crearHojaDeVida(id);
  }
  editarHojaDeVidaAction(id: number) {
    this.editarHojaDeVida(id);
  }
  verHojaDeVidaAction(id: number) {
    this.verHojaDeVidaModal(id);
  }
  cambiarEstadoActivoAction(id: number, active: boolean) {
    this.cambiarEstadoActivo(id, active);
  }
  verHistorialAction(id: number, nombre: string) {
    this.verHistorial(id, nombre);
  }
  verReportesAction(id: number, nombre: string) {
    this.verReportesModal(id, nombre);
  }

  async verReportesModal(idEquipo: number, nombreEquipo: string) {
    this.displayReportesDialog = true;
    this.loadingReportes = true;
    this.reportesEquipo = [];
    this.reportesEquipoNombre = nombreEquipo;
    try {
      this.reportesEquipo = await this.reporteService.getReportesEquipo(idEquipo);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
      Swal.fire('Error', 'No se pudo cargar el historial de reportes', 'error');
      this.displayReportesDialog = false;
    } finally {
      this.loadingReportes = false;
    }
  }

  async verResumenReporte(reporte: any) {
    this.reporteSeleccionado = reporte;
    this.rutina = [];

    // Load protocol compliance data
    try {
      this.rutina = await this.protocoloService.getCumplimientoProtocoloReporte(reporte.id);
    } catch (e) {
      console.warn('No se pudo cargar la rutina de mantenimiento', e);
      this.rutina = [];
    }

    this.displayResumenReporteDialog = true;
  }

  getImagenesReporte(rutaImagen: string): string[] {
    if (!rutaImagen) return [];
    try {
      const parsed = JSON.parse(rutaImagen);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [rutaImagen];
    } catch (e) {
      return [rutaImagen];
    }
  }

  getImageUrl(fotoPath: string | null | undefined): string {
    if (!fotoPath) {
      return 'assets/images/equipment-placeholder.png';
    }
    // Extraer solo el nombre del archivo de la ruta absoluta
    const filename = fotoPath.split('\\').pop()?.split('/').pop();
    if (filename) {
      return `${this.API_URL}/api/industriales/hojavida/imagen/${filename}`;
    }
    return 'assets/images/equipment-placeholder.png';
  }

  descargarHojaVidaPdf() {
    if (!this.hvEquipoInfo) {
      Swal.fire('Error', 'No se ha seleccionado ningún equipo.', 'error');
      return;
    }

    this.hojaVidaService.downloadHojaVidaPdf(this.hvEquipoInfo.id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Hoja_de_Vida_${this.hvEquipoInfo.placa || this.hvEquipoInfo.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error: any) => {
        console.error('Error al descargar PDF:', error);
        Swal.fire('Error', 'No se pudo generar el PDF de la hoja de vida.', 'error');
      }
    });
  }

  editarPlanMantenimientoAction(id: number) {
    this.router.navigate(['/industriales/crear-mantenimiento'], { queryParams: { idEquipo: id } });
  }

  abrirModalTrasladoAction(equipo: any) {
    this.abrirModalTraslado(equipo);
  }

  abrirModalTraslado(equipo: any) {
    this.selectedEquipoTraslado = equipo;
    this.displayTrasladoDialog = true;
    // Reset fields
    this.servicioDestinoId = null;
    this.nombreReceptor = '';
    this.cargoReceptor = '';
    this.observacionesTransferencia = '';
  }

  async confirmarTraslado() {
    if (!this.selectedEquipoTraslado || !this.servicioDestinoId || !this.nombreReceptor || !this.cargoReceptor) {
      Swal.fire('Advertencia', 'Por favor complete todos los campos requeridos', 'warning');
      return;
    }

    try {
      this.loadingTraslado = true;
      const decodedToken = this.getDecodedAccessToken(sessionStorage.getItem('utoken') || '');
      const usuarioId = decodedToken ? decodedToken.id : null;

      if (!usuarioId) {
        Swal.fire('Error', 'No se pudo identificar al usuario', 'error');
        this.loadingTraslado = false;
        return;
      }

      const data = {
        equipoId: this.selectedEquipoTraslado.id,
        servicioDestinoId: this.servicioDestinoId!,
        nombreReceptor: this.nombreReceptor,
        cargoReceptor: this.cargoReceptor,
        observaciones: this.observacionesTransferencia,
        usuarioId: usuarioId
      };

      await this.trasladosService.registrarTraslado(data);

      this.displayTrasladoDialog = false;
      this.loadingTraslado = false;
      this.ngOnInit(); // Reload list to show new location

      Swal.fire(
        '¡Traslado Exitoso!',
        'El equipo ha sido trasladado correctamente.',
        'success'
      );

    } catch (error: any) {
      this.loadingTraslado = false;
      console.error(error);

      const errorMessage = error.error?.detalle || error.error?.error || 'No se pudo registrar el traslado.';

      Swal.fire(
        'Error',
        errorMessage,
        'error'
      );
    }
  }
}