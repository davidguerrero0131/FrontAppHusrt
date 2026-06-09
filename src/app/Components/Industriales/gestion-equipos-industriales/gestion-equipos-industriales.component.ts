import { CommonModule, Location } from '@angular/common';
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
import { MantenimientoadminnavbarComponent } from '../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';


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
import { Router, ActivatedRoute } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
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
    InputTextarea,
    AccordionModule,
    CardModule,
    DividerModule,
    ImageModule,
    TooltipModule,
    IndustrialesNavbarComponent
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

  // Baja Equipo State
  displayBajaDialog: boolean = false;
  equipoBajaSeleccionado: any = null;
  bajaForm: any = {
    fechaBaja: new Date().toISOString().split('T')[0],
    conceptoTecnico: '',
    descripcionFalla: '',
    observaciones: ''
  };
  loadingBaja: boolean = false;

  // Resumen Baja Modal
  displayResumenBajaDialog: boolean = false;
  reporteBajaSeleccionado: any = null;

  userRole: string = '';

  // Dashboard State
  currentView: 'dashboard' | 'table' | 'listSedes' | 'listTipos' | 'listComodatos' = 'dashboard';
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


  comodatosList: any[] = [{ label: 'Si', value: true }, { label: 'No', value: false }];
  private equiposService = inject(EquiposIndustrialesService);
  private trasladosService = inject(TrasladosIndustrialesService);
  private hojaVidaService = inject(HojaDeVidaIndustrialService);
  private reporteService = inject(ReporteIndustrialService);
  private protocoloService = inject(ProtocoloIndustrialService);
  private responsableService = inject(ResponsableService);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private servicioService: ServicioService,
    private sedeService: SedeService,
    private tipoEquipoService: TipoEquipoService,
    private location: Location
  ) { }

  async ngOnInit() {
    this.loadUserRole();
    
    // Set view early based on URL to prevent flashing
    const params = this.route.snapshot.queryParams;
    if (params['servicioId']) {
      this.currentView = 'table';
      this.filterTitle = 'Equipos Filtrados por Servicio';
    }

    try {
      this.equipos = await this.equiposService.getAllEquiposTodos();
      this.allEquipos = [...this.equipos]; // Backup for reset

      // Filter by query parameters if any
      if (params['servicioId']) {
        const servId = Number(params['servicioId']);
        this.equipos = this.allEquipos.filter(e => e.servicioIdFk === servId || (e.servicioInd && e.servicioInd.id === servId));
      }

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
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    if (returnUrl) {
      this.regresar();
      return;
    }
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
    console.log('Responsables en componente:', this.responsablesList);
    // Filtrar solo los responsables que pertenecen a industriales
    const list = this.responsablesList.filter(r => r.modulo === 'industriales');
    console.log('Filtrados para industriales:', list);

    if (!this.searchTextComodato) {
      return list;
    }
    return list.filter(resp =>
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



  filterByComodato(isComodato: boolean) {
    this.equipos = this.allEquipos.filter(e => e.isComodato === isComodato); // Verify property 'isComodato' or 'comodato'
    this.currentView = 'table';
    this.filterTitle = `Equipos en Comodato: ${isComodato ? 'Si' : 'No'}`;
  }

  loadUserRole() {
    if (typeof sessionStorage === 'undefined') return;
    const token = sessionStorage.getItem('utoken');
    if (token) {
      const decoded: any = this.getDecodedAccessToken(token);
      if (decoded) {
        this.userRole = decoded.rol;
      }
    }
  }

  isAdmin(): boolean {
    const adminRoles = ['8', 'ADMINMANTENIMIENTO', 'USERMANTENIMIENTO', '1', 'SUPERADMIN', '2', 'SYSTEMADMIN', 'ADMINMANTENIMIENTO'];
    return adminRoles.includes(this.userRole);
  }

  canCreateEquipment(): boolean {
    return this.isAdmin() || this.userRole === 'USERMANTENIMIENTO' || this.userRole === 'TECNICOMANTENIMIENTO';
  }

  canEditEquipment(): boolean {
    return this.isAdmin() || this.userRole === 'USERMANTENIMIENTO';
  }

  canTranslate(): boolean {
    return this.isAdmin(); // User and Technician cannot translate
  }

  canEditPlan(): boolean {
    return this.isAdmin() || this.userRole === 'USERMANTENIMIENTO' || this.userRole === 'TECNICOMANTENIMIENTO';
  }

  canCreateHV(): boolean {
    return this.isAdmin() || this.userRole === 'USERMANTENIMIENTO' || this.userRole === 'TECNICOMANTENIMIENTO';
  }

  canEditHV(): boolean {
    return this.isAdmin() || this.userRole === 'USERMANTENIMIENTO';
  }

  canBaja(): boolean {
    return this.isAdmin(); // User and Technician cannot give baja
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
      case 'Bueno': return 'success';
      case 'Regular': return 'warning text-dark';
      case 'Malo': return 'danger';
      case 'Ruina': return 'dark';
      case 'Operativo': return 'success';
      case 'En Mantenimiento': return 'warning text-dark';
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



  hvDescargarDocumento(id: number, filename: string) {
    this.hojaVidaService.downloadDocument(id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error: any) => {
        console.error('Error al descargar documento:', error);
        Swal.fire('Error', 'No se pudo descargar el documento', 'error');
      }
    });
  }
 
  async hvEliminarDocumento(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer y el archivo será eliminado permanentemente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await this.hojaVidaService.deleteDocument(id);
          Swal.fire('Eliminado', 'El documento ha sido eliminado correctamente.', 'success');
          // Recargar la lista de documentos para el equipo actual en el modal
          if (this.hvEquipoInfo) {
            this.hvDocumentos = await this.hojaVidaService.getDocumentsByEquipo(this.hvEquipoInfo.id);
          }
        } catch (error) {
          console.error('Error al eliminar documento:', error);
          Swal.fire('Error', 'No se pudo eliminar el documento', 'error');
        }
      }
    });
  }

  hvVisualizarDocumento(id: number) {
    this.hojaVidaService.downloadDocument(id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      },
      error: (error: any) => {
        console.error('Error al visualizar documento:', error);
        Swal.fire('Error', 'No se pudo visualizar el documento', 'error');
      }
    });
  }

  regresar() {
    window.history.back();
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
        console.log('Iniciando cambio de estado para equipo:', idEquipo, 'darDeBaja:', darDeBaja);
        try {
          if (darDeBaja) {
            // Si es baja, forzar el uso del modal
            console.log('Redirigiendo a modal de baja formal...');
            this.abrirModalBajaAction(this.equipos.find(e => e.id === idEquipo));
            return;
          } else {
            await this.equiposService.reactivarEquipo(idEquipo);
          }
          this.equipos = await this.equiposService.getAllEquipos();
          this.allEquipos = [...this.equipos];

          Swal.fire(mensajeExito, '', 'success');
        } catch (error: any) {
          console.error('Error en cambiarEstadoActivo:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error de Comunicación',
            text: `No fue posible ${accion} el equipo. Detalle: ${error.error?.error || error.message || 'Error desconocido'}`
          });
        }
      } else if (result.isDismissed) {
        Swal.fire(`Se descartó la operación`, '', 'info');
      }
    });
  }

  crearHojaDeVida(idEquipo: any) {
    this.router.navigate(['/industriales/hoja-de-vida/crear', idEquipo]);
  }

  editarHojaDeVida(idEquipo: any) {
    this.router.navigate(['/industriales/hoja-de-vida/editar', idEquipo]);
  }

  verHojaDeVida(idEquipo: any) {
    this.router.navigate(['/industriales/hoja-de-vida', idEquipo]);
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
      }
    ];

    // Historial and Reportes access
    if (this.isAdmin() || this.userRole === 'USERMANTENIMIENTO' || this.userRole === 'TECNICOMANTENIMIENTO') {
      this.menuItems.push(
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
      );
    }

    // Editar Equipo
    if (this.canEditEquipment()) {
      this.menuItems.push(
        {
          label: 'Editar',
          icon: 'pi pi-file-edit',
          command: () => this.editarEquipoAction(equipo.id)
        }
      );
    }

    // Registrar Traslado
    if (this.canTranslate()) {
      this.menuItems.push(
        {
          label: 'Registrar Traslado',
          icon: 'pi pi-arrow-right-arrow-left',
          command: () => this.abrirModalTrasladoAction(equipo)
        }
      );
    }

    // Editar plan
    if (this.canEditPlan()) {
      this.menuItems.push({
        label: 'Editar Plan de Mant.',
        icon: 'pi pi-calendar-plus',
        command: () => this.editarPlanMantenimientoAction(equipo.id)
      });
    }

    this.menuItems.push({ separator: true });

    // Hoja de Vida Logic
    if (equipo.hojaDeVida) {
      // Ver HV
      this.menuItems.push({
        label: 'Ver Hoja de Vida',
        icon: 'pi pi-file',
        command: () => this.verHojaDeVidaAction(equipo.id)
      });

      // Editar HV
      if (this.canEditHV()) {
        this.menuItems.push({
          label: 'Editar Hoja de Vida',
          icon: 'pi pi-file-edit',
          command: () => this.editarHojaDeVidaAction(equipo.id)
        });
      }
    } else {
      // Crear HV
      if (this.canCreateHV()) {
        this.menuItems.push({
          label: 'Crear Hoja de Vida',
          icon: 'pi pi-file-plus',
          command: () => this.crearHojaDeVidaAction(equipo.id)
        });
      }
    }

    this.menuItems.push({ separator: true });

    // Estado Logic (Dar de Baja / Reactivar)
    if (this.canBaja()) {
      if (!equipo.estadoBaja) {
        this.menuItems.push({
          label: 'Dar de Baja',
          icon: 'pi pi-times-circle',
          styleClass: 'text-danger',
          command: () => this.abrirModalBajaAction(equipo)
        });
      } else {
        this.menuItems.push({
          label: 'Reactivar',
          icon: 'pi pi-check-circle',
          styleClass: 'text-success',
          command: () => this.cambiarEstadoActivoAction(equipo.id, false)
        });
        this.menuItems.push({
          label: 'Ver Reporte de Baja',
          icon: 'pi pi-file-pdf',
          command: () => this.verResumenBaja(equipo.id)
        });
      }
    } else if (equipo.estadoBaja) {
      // Allow viewing baja report even if they can't manage it
      this.menuItems.push({
        label: 'Ver Reporte de Baja',
        icon: 'pi pi-file-pdf',
        command: () => this.verResumenBaja(equipo.id)
      });
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
      const reportesMantenimiento = await this.reporteService.getReportesEquipo(idEquipo);
      this.reportesEquipo = [...reportesMantenimiento];

      // Verificar si tiene reporte de baja
      try {
        const reporteBaja = await this.equiposService.getReporteBaja(idEquipo);
        if (reporteBaja) {
          // Agregar el reporte de baja al inicio con un tipo especial
          this.reportesEquipo.unshift({
            ...reporteBaja,
            isBaja: true,
            tipoMantenimiento: 'REPORTE DE BAJA',
            createdAt: reporteBaja.createdAt || reporteBaja.fechaBaja
          });
        }
      } catch (e) {
        // No tiene reporte de baja o error al buscarlo, ignorar
      }

    } catch (error) {
      console.error('Error al cargar reportes:', error);
      Swal.fire('Error', 'No se pudo cargar el historial de reportes', 'error');
      this.displayReportesDialog = false;
    } finally {
      this.loadingReportes = false;
    }
  }

  async verResumenBaja(idEquipo: number) {
    try {
      this.reporteBajaSeleccionado = await this.equiposService.getReporteBaja(idEquipo);
      this.displayResumenBajaDialog = true;
    } catch (error) {
      Swal.fire('Info', 'No se encontró un reporte de baja detallado para este equipo', 'info');
    }
  }

  abrirModalBajaAction(equipo: any) {
    this.equipoBajaSeleccionado = equipo;
    this.bajaForm = {
      fechaBaja: new Date().toISOString().split('T')[0],
      conceptoTecnico: '',
      descripcionFalla: '',
      observaciones: ''
    };
    this.displayBajaDialog = true;
  }

  async confirmarBaja() {
    if (!this.bajaForm.fechaBaja || !this.bajaForm.conceptoTecnico || !this.bajaForm.descripcionFalla) {
      Swal.fire('Error', 'Debe completar todos los campos obligatorios', 'error');
      return;
    }

    try {
      const payload = {
        fechaBaja: this.bajaForm.fechaBaja,
        conceptoTecnico: this.bajaForm.conceptoTecnico,
        descripcionFalla: this.bajaForm.descripcionFalla,
        observaciones: this.bajaForm.observaciones
      };
      
      console.log('Enviando payload de baja:', payload);
      this.loadingBaja = true;
      const res = await this.equiposService.darDeBajaEquipo(this.equipoBajaSeleccionado.id, payload);
      console.log('Respuesta del servidor:', res);
      
      this.displayBajaDialog = false;
      Swal.fire('Éxito', 'El equipo ha sido dado de baja correctamente', 'success');
      
      // Recargar lista
      this.equipos = await this.equiposService.getAllEquiposTodos();
      this.allEquipos = [...this.equipos];

    } catch (error: any) {
      console.error('Error al dar de baja:', error);
      Swal.fire('Error', 'No se pudo procesar la baja del equipo: ' + (error.error?.error || error.message || ''), 'error');
    } finally {
      this.loadingBaja = false;
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
    if (fotoPath) {
      // Extraer solo el nombre del archivo de la ruta absoluta
      const filename = fotoPath.split('\\').pop()?.split('/').pop();
      if (filename) {
        return `${this.API_URL}/uploads/industriales/Hoja De Vida/${filename}`;
      }
    }
    
    // Si no hay foto específica, buscar la imagen por el nombre del tipo de equipo
    if (this.hvEquipoInfo && this.hvEquipoInfo.tipoEquipoInd && this.hvEquipoInfo.tipoEquipoInd.nombres) {
      const tipo = this.hvEquipoInfo.tipoEquipoInd.nombres;
      return `${this.API_URL}/imagenequipotipo/${encodeURIComponent(tipo)}`;
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
      const utoken = (typeof sessionStorage !== 'undefined') ? sessionStorage.getItem('utoken') : null;
      const decodedToken = this.getDecodedAccessToken(utoken || '');
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