import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { CalendarModule } from 'primeng/calendar';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ToolbarModule } from 'primeng/toolbar';
import { FieldsetModule } from 'primeng/fieldset';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MesaService } from '../../../../Services/mesa-servicios/mesa.service';
import { ServicioService } from '../../../../Services/appServices/general/servicio/servicio.service';
import { UserService } from '../../../../Services/appServices/userServices/user.service';
import { MenuItem } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MesaCasoDetailComponent } from '../mesa-caso-detail/mesa-caso-detail.component';

import { UppercaseDirective } from '../../../../Directives/uppercase.directive';

@Component({
  selector: 'app-mesa-casos-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, ButtonModule, SelectModule,
    CalendarModule, TagModule, TooltipModule, ToolbarModule, FieldsetModule, DialogModule, InputTextModule,
    MenuModule,
    AutoCompleteModule, ConfirmDialogModule, IconFieldModule, InputIconModule,
    UppercaseDirective, ToastModule
  ],
   providers: [ConfirmationService, MessageService, DialogService],
  templateUrl: './mesa-casos-list.component.html',
  styleUrl: './mesa-casos-list.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, height: 0, marginBottom: 0, transform: 'translateY(-10px)' }),
        animate('250ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, height: '*', marginBottom: '*', transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 0, height: 0, marginBottom: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class MesaCasosListComponent implements OnInit {
  // Rating feature
  displayRatingDialog: boolean = false;
  ratingForm = {
    casoId: 0,
    calificacion: 0,
    comentario: ''
  };
  emojis = [
    { value: 1, icon: '😠', label: 'Muy Malo' },
    { value: 2, icon: '🙁', label: 'Malo' },
    { value: 3, icon: '😐', label: 'Regular' },
    { value: 4, icon: '🙂', label: 'Bueno' },
    { value: 5, icon: '🤩', label: 'Excelente' }
  ];

  casos: any[] = [];
  servicios: any[] = [];

  estados = [
    { label: 'Abiertos y Pendientes', value: 'ABIERTOS_Y_PENDIENTES' },
    { label: 'Abiertos', value: 'ABIERTOS' },
    { label: 'Pendientes de Calificación', value: 'CERRADOS_SIN_CALIFICACION' },
    { label: 'Todos', value: null },
    { label: 'Nuevo', value: 'NUEVO' },
    { label: 'En Curso', value: 'EN_CURSO' },
    { label: 'En Espera', value: 'EN_ESPERA' },
    { label: 'Resuelto', value: 'RESUELTO' },
    { label: 'Cerrado', value: 'CERRADO' }
  ];

  // Filters
  selectedServicio: any = null;
  selectedEstado: any = this.estados[0]; // Default to Abiertos y Pendientes
  selectedTipo: any = null;
  selectedSumerce: any = null;
  selectedId: any = null;


  tipos = [
    { label: 'Todos', value: null },
    { label: 'Incidencia', value: 'INCIDENCIA' },
    { label: 'Requerimiento', value: 'REQUERIMIENTO' }
  ];

  sumerceOptions = [
    { label: 'Todos', value: null },
    { label: 'S - Seguro', value: 'S_SEGURO' },
    { label: 'U - Universitario', value: 'U_UNIVERSITARIO' },
    { label: 'M - Mejorado', value: 'M_MEJORADO' },
    { label: 'E - Eficiente', value: 'E_EFICIENTE' },
    { label: 'R - Responsable', value: 'R_RESPONSABLE' },
    { label: 'C - Cálido', value: 'C_CALIDO' },
    { label: 'E - Excelente', value: 'E_EXCELENTE' }
  ];

  loading: boolean = false;
  showFilters: boolean = false;
  stats = {
    total: 0,
    abiertos: 0,
    enCurso: 0,
    resueltos: 0
  };

  @ViewChild('dtCasos') dtCasos!: any;

  constructor(
    private mesaService: MesaService,
    private servicioService: ServicioService,
    private userService: UserService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public dialogService: DialogService
  ) { }

  async ngOnInit() {
    await this.loadUserProfile();
    this.loadServicios();
    this.loadCasos();
  }

  loadServicios() {
    this.servicioService.getAllServiciosActivos().then(data => {
      if (Array.isArray(data)) {
        // Filter for Mesa de Servicios
        const serviciosMesa = data.filter((s: any) => s.requiereMesaServicios === true);
        this.servicios = [{ nombres: 'Todos', id: null }, ...serviciosMesa];
      } else {
        this.servicios = [{ nombres: 'Todos', id: null }];
      }
    }).catch(err => {
      console.error('Error loading servicios:', err);
    });
  }

  loadCasos() {
    this.loading = true;
    const filters: any = {};
    if (this.selectedId) filters.id = this.selectedId;
    if (this.selectedServicio?.id) filters.servicioId = this.selectedServicio.id;
    if (this.selectedEstado?.value) filters.estado = this.selectedEstado.value;
    if (this.selectedTipo?.value) filters.tipo = this.selectedTipo.value;
    if (this.selectedSumerce?.value) filters.sumerce = this.selectedSumerce.value;

    this.mesaService.getCasos(filters).subscribe({
      next: (data) => {
        this.casos = data;
        this.calculateStats();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
      }
    });
  }

  calculateStats() {
    this.stats.total = this.casos.length;
    this.stats.abiertos = this.casos.filter(c => c.estado === 'NUEVO').length;
    this.stats.enCurso = this.casos.filter(c => c.estado === 'EN_CURSO').length;
    this.stats.resueltos = this.casos.filter(c => c.estado === 'RESUELTO').length;
  }

  onGlobalFilter(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (target && this.dtCasos) {
      this.dtCasos.filterGlobal(target.value, 'contains');
    }
  }

  clearFilters() {
    this.selectedId = null;
    this.selectedServicio = { nombres: 'Todos', id: null };
    this.selectedEstado = this.estados[3]; // Todos
    this.selectedTipo = { label: 'Todos', value: null };
    this.selectedSumerce = { label: 'Todos', value: null };
    if (this.dtCasos) {
      this.dtCasos.clear();
    }
    const globalSearchInput = document.querySelector('input[placeholder*="Búsqueda General"]') as HTMLInputElement;
    if (globalSearchInput) {
      globalSearchInput.value = '';
    }
    this.loadCasos();
  }

  viewCaso(id: number) {
    this.router.navigate(['/adminmesaservicios/casos', id]);
  }

  createNew() {
    this.router.navigate(['/adminmesaservicios/casos/novo']);
  }

  displaySearchDialog: boolean = false;
  searchQuery: string = '';
  searchResults: any[] = [];
  loadingSearch: boolean = false;
  ref: DynamicDialogRef | undefined;

  openSearchDialog() {
    this.searchQuery = '';
    this.searchResults = [];
    this.displaySearchDialog = true;
  }

  searchSpecificCase() {
    if (!this.searchQuery) return;
    this.loadingSearch = true;
    
    this.mesaService.searchCasosGeneral(this.searchQuery).subscribe({
      next: (data) => {
        this.loadingSearch = false;
        this.searchResults = data;
        if (data.length === 0) {
            this.messageService.add({ severity: 'info', summary: 'Búsqueda', detail: 'No se encontraron casos' });
        }
      },
      error: (err) => {
        this.loadingSearch = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al buscar los casos' });
      }
    });
  }

  openDetailModal(casoId: number) {
      this.ref = this.dialogService.open(MesaCasoDetailComponent, {
          data: { casoId },
          header: `Detalles del Caso #${casoId}`,
          width: '85vw',
          contentStyle: { overflow: 'auto' },
          baseZIndex: 10000,
          maximizable: true
      });
  }


  // Menu
  menuItems: MenuItem[] = [];
  selectedCaseForMenu: any = null;

  setMenuCase(caso: any) {
    this.selectedCaseForMenu = caso;
    this.menuItems = [
      {
        label: 'Ver Detalle',
        icon: 'pi pi-eye',
        command: () => this.viewCaso(caso.id)
      }
    ];

    if (this.canEdit(caso)) {
      this.menuItems.push({
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => this.openAdminEdit(caso)
      });
    }

    if (this.canAssign(caso)) {
      this.menuItems.push({
        label: 'Asignar',
        icon: 'pi pi-user-plus',
        command: () => this.openAssignDialog(caso)
      });
    }
  }

  openRatingDialog(caso: any) {
    this.ratingForm = {
      casoId: caso.id,
      calificacion: 0,
      comentario: ''
    };
    this.displayRatingDialog = true;
  }

  selectRating(value: number) {
    this.ratingForm.calificacion = value;
  }

  submitRating() {
    if (!this.ratingForm.calificacion) return;
    const payload = {
      ...this.ratingForm,
      usuarioId: this.userId
    };
    this.mesaService.rateCaso(this.ratingForm.casoId, payload).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Calificación guardada correctamente' });
        this.displayRatingDialog = false;
        this.loadCasos();
        this.mesaService.notificationsUpdated.next();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al guardar la calificación' });
      }
    });
  }

  getSeverity(estado: string): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" | undefined {
    switch (estado) {
      case 'NUEVO': return 'info';
      case 'EN_CURSO': return 'warning';
      case 'EN_ESPERA': return 'secondary';
      case 'RESUELTO': return 'success';
      case 'CERRADO': return 'contrast';
      default: return 'info';
    }
  }

  getPrioritySeverity(prioridad: string): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" | undefined {
    switch (prioridad) {
      case 'CRITICA': return 'danger';
      case 'ALTA': return 'warning';
      case 'MEDIA': return 'info';
      case 'BAJA': return 'success'; // Or secondary/info
      default: return 'info';
    }
  }

  // Admin Edit Section
  displayAdminDialog: boolean = false;
  editingCaso: any = null;
  adminForm: any = {
    prioridad: null,
    sumerce: null,
    servicioId: null
  };

  prioridades = [
    { label: 'Critica', value: 'CRITICA' },
    { label: 'Alta', value: 'ALTA' },
    { label: 'Media', value: 'MEDIA' },
    { label: 'Baja', value: 'BAJA' }
  ];

  userRoleCode: string = '';
  userServiceId: number = 0;
  userId: number = 0;
  userRole: string = '';
  isMesaUser: boolean = false;

  checkSuperAdmin(): boolean {
    if (typeof localStorage === 'undefined') return false;
    const token = sessionStorage.getItem('utoken');
    if (!token) return false;
    try {
      const decoded: any = JSON.parse(atob(token.split('.')[1]));
      return decoded.rol === 'SUPERADMIN';
    } catch {
      return false;
    }
  }

  async loadUserProfile() {
    if (typeof localStorage === 'undefined') return;
    const token = sessionStorage.getItem('utoken');
    if (token) {
      const decoded: any = JSON.parse(atob(token.split('.')[1]));
      this.userId = decoded.id;
      this.userRole = decoded.rol;
      this.isMesaUser = decoded.rol === 'MESAUSER';

      try {
        // Fetch full profile for Mesa Role
        const user = await this.userService.getUserProfil(this.userId);
        if (user && user.mesaServicioRol) {
          this.userRoleCode = user.mesaServicioRol.codigo;
          this.userServiceId = user.servicioId;
        } else if (this.userRole !== 'SUPERADMIN' && this.userRole !== 'MESAADMIN') {
          // Si el usuario es un solicitante (sin rol de mesa ni superadmin)
          const calificacionState = this.estados.find(e => e.value === 'CERRADOS_SIN_CALIFICACION');
          if (calificacionState) {
            this.selectedEstado = calificacionState;
          }
        }
      } catch (err) {
        console.error('Error cargando el perfil del usuario:', err);
      }
    }
  }

  canEdit(caso: any): boolean {
    if (caso.estado === 'CERRADO') return false;
    // Strict requirement: Only SUPERADMIN can edit the case details (List View)
    return this.checkSuperAdmin();
  }

  openAdminEdit(caso: any) {
    this.editingCaso = caso;
    this.adminForm = {
      prioridad: caso.prioridad,
      sumerce: caso.sumerce,
      servicioId: caso.servicioId
    };
    this.displayAdminDialog = true;
  }

  // Assignment
  displayAssignDialog: boolean = false;
  assigningCaso: any = null;
  usersService: any[] = [];
  selectedResolutor: any = null; // Can be single object or array
  filteredUsers: any[] = [];

  filterUsers(event: any) {
    const query = event.query.toLowerCase();
    this.filteredUsers = this.usersService.filter(user =>
      user.nombres.toLowerCase().includes(query) ||
      user.apellidos.toLowerCase().includes(query) ||
      (user.mesaServicioRol?.nombre && user.mesaServicioRol.nombre.toLowerCase().includes(query))
    );
  }

  canAssign(caso: any): boolean {
    if (caso.estado === 'CERRADO') return false;
    if (this.checkSuperAdmin()) return true;

    // Admin, Agent, Resolutor of the same service
    if (['ADMIN_SERVICIO', 'ADMINISTRADOR', 'RESOLUTOR', 'AGENTE', 'ADM', 'AG'].includes(this.userRoleCode) && this.userServiceId === caso.servicio?.id) {
      return true;
    }
    return false;
  }

  openAssignDialog(caso: any) {
    this.assigningCaso = caso;
    this.selectedResolutor = null;

    // Fetch users for the service of the case
    if (caso.servicioId) {
      this.mesaService.getUsersByServicio(caso.servicioId).subscribe({
        next: (data: any[]) => {
          // Filter users: Role (Admin/Agent) AND Active
          this.usersService = data.filter(user => {
            const roleName = user.mesaServicioRol?.nombre;
            const isActive = user.estado;
            return (roleName === 'ADMINISTRADOR' || roleName === 'AGENTE') && isActive === true;
          });
          this.displayAssignDialog = true;
        },
        error: (err) => {
          console.error('Error fetching users', err);
        }
      });
    }
  }

  confirmAssign() {
    if (!this.assigningCaso || !this.selectedResolutor) return;

    this.confirmationService.confirm({
      message: '¿Está seguro de asignar este(os) responsable(s) al caso?',
      header: 'Confirmar Asignación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let userId = 0;
        const token = sessionStorage.getItem('utoken');
        if (token) {
          const decoded: any = JSON.parse(atob(token.split('.')[1]));
          userId = decoded.id;
        }

        // Handle multiple selection (array) or single (object)
        let resolutorsToAssign = [];
        if (Array.isArray(this.selectedResolutor)) {
          resolutorsToAssign = this.selectedResolutor;
        } else {
          resolutorsToAssign = [this.selectedResolutor];
        }

        if (resolutorsToAssign.length === 0) return;

        let completed = 0;
        let errors = 0;

        const finalize = () => {
          if (completed + errors === resolutorsToAssign.length) {
            this.displayAssignDialog = false;
            this.assigningCaso = null;
            this.selectedResolutor = null;
            this.loadCasos();
          }
        };

        resolutorsToAssign.forEach((user: any) => {
          const payload = {
            usuarioId: user.id,
            asignadoPor: userId
          };

          this.mesaService.assignResolutor(this.assigningCaso.id, payload).subscribe({
            next: () => {
              completed++;
              finalize();
            },
            error: (err) => {
              console.error('Error assigning', err);
              errors++;
              finalize();
            }
          });
        });
      }
    });
  }

  saveAdminEdit() {
    if (!this.editingCaso) return;

    // Get current user ID
    let userId = 0;
    const token = sessionStorage.getItem('utoken');
    if (token) {
      const decoded: any = JSON.parse(atob(token.split('.')[1]));
      userId = decoded.id;
    }

    const payload = {
      ...this.adminForm,
      usuarioId: userId
    };

    this.mesaService.updateCasoDetails(this.editingCaso.id, payload).subscribe({
      next: () => {
        this.displayAdminDialog = false;
        this.loadCasos();
        // Optional: Show success toast if MessageService was injected, but simplified here
      },
      error: (err) => {
        console.error('Error updating case', err);
      }
    });

  }
}
// Re-compilation trigger
