import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, HostListener } from '@angular/core';
import { TableModule } from 'primeng/table';
import { MessageService, MenuItem } from 'primeng/api';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import { MenuModule } from 'primeng/menu';

import { IndustrialesNavbarComponent } from '../../navbars/IndustrialesNavbar/industrialesnavbar.component';


import { EquiposIndustrialesService } from '../../../Services/appServices/industrialesServices/equipos/equiposIndustriales.service';
import { TrasladosIndustrialesService } from '../../../Services/appServices/industrialesServices/traslados/trasladosIndustriales.service';
import { ServicioService } from '../../../Services/appServices/general/servicio/servicio.service';

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
    SelectModule
  ],
  providers: [MessageService],
  templateUrl: './gestion-equipos-industriales.component.html',
  styleUrls: ['./gestion-equipos-industriales.component.css']
})
export class GestionEquiposIndustrialesComponent implements OnInit {

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
    private responsableService: ResponsableService
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
    this.verDetalle(id);
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
    this.verHojaDeVida(id);
  }
  cambiarEstadoActivoAction(id: number, active: boolean) {
    this.cambiarEstadoActivo(id, active);
  }
  verHistorialAction(id: number, nombre: string) {
    this.verHistorial(id, nombre);
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