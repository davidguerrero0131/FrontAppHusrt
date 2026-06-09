import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { MessageService, ConfirmationService } from 'primeng/api';
import { MesaService } from '../../../../Services/mesa-servicios/mesa.service';
import { ServicioService } from '../../../../Services/appServices/general/servicio/servicio.service';
import { UserService } from '../../../../Services/appServices/userServices/user.service';
import { jwtDecode } from 'jwt-decode';
import { TableStateService } from '../../../../Services/appServices/shared/table-state.service';
import { Table } from 'primeng/table';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-mesa-roles',
  imports: [
    CommonModule, FormsModule, TableModule, ButtonModule, DialogModule,
    SelectModule, ToastModule, ConfirmDialogModule, ToolbarModule, TagModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './mesa-roles.component.html',
  styleUrl: './mesa-roles.component.css'
})
export class MesaRolesComponent implements OnInit {

  servicios: any[] = [];
  selectedServicio: any = null;

  assignedUsers: any[] = [];
  platformId = inject(PLATFORM_ID);
  stateService = inject(TableStateService);
  isBrowser: boolean = false;

  @ViewChild('dt') dt!: Table;
  first: number = 0;
  searchText: string = '';

  // Assign Dialog
  displayAssignDialog: boolean = false;
  allUsers: any[] = [];
  roles: any[] = [];

  selectedUser: any = null;
  selectedRole: any = null;

  constructor(
    private mesaService: MesaService,
    private servicioService: ServicioService,
    private userService: UserService,
    private messageService: MessageService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  userRole: string = '';

  ngOnInit() {
    this.extractUser();
    this.loadServicios();
    this.loadCatalogos();

    // Load state
    const savedState = this.stateService.getState('mesa-roles');
    this.first = savedState.first || 0;
    this.searchText = savedState.globalFilter || '';
  }

  extractUser() {
    const token = sessionStorage.getItem('utoken');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userRole = decoded.rol;
    }
  }

  loadServicios() {
    const token = this.userService.getToken();
    if (!token) return;
    const decoded: any = this.userService.getDecodedAccessToken(token);

    this.userService.getUserProfil(decoded.id).then((user: any) => {
      this.selectedUser = user; // Store current user info

      if (user.rol && (user.rol.nombre === 'SUPERADMIN' || user.rol.nombre === 'MESAADMIN')) {
        this.servicioService.getAllServiciosActivos().then(data => {
          this.servicios = data.filter((s: any) => s && s.requiereMesaServicios === true);
        });
      } else {
        // Fetch assigned services
        this.mesaService.getUserServices(user.id).subscribe((assignments: any[]) => {
          // Map assignments to services and unique them
          const assignedServices = assignments.map(a => a.servicio).filter(s => s && s.requiereMesaServicios === true);

          // Also include user's primary service if exists
          if (user.servicio && !assignedServices.find(s => s && s.id === user.servicio.id)) {
            assignedServices.push(user.servicio);
          }

          this.servicios = assignedServices;

          if (this.servicios.length > 0) {
            this.selectedServicio = this.servicios[0];
            this.onServicioChange();
          }
        });
      }
    });
  }

  loadCatalogos() {
    this.userService.getAllUsers().then(data => {
      this.allUsers = data.filter((u: any) => u.estado === true);
    });
    this.mesaService.getRoles().subscribe(data => {
      this.roles = data;
    });
  }

  onServicioChange() {
    if (this.selectedServicio) {
      this.loadAssignedUsers();
    } else {
      this.assignedUsers = [];
    }
  }

  loadAssignedUsers() {
    this.mesaService.getUsersByServicio(this.selectedServicio.id).subscribe({
      next: (data) => {
        this.assignedUsers = data;
        // Restore filter after data load
        if (this.searchText && this.dt) {
          setTimeout(() => {
            this.dt.filterGlobal(this.searchText, 'contains');
          }, 0);
        }
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar usuarios asignados' });
      }
    });
  }

  onGlobalFilter(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (target) {
      this.searchText = target.value;
      this.dt.filterGlobal(this.searchText, 'contains');
      this.stateService.setState('mesa-roles', { globalFilter: this.searchText });
    }
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.stateService.setState('mesa-roles', { first: this.first });
  }

  openEditRole(user: any) {
    this.selectedUser = user;
    // Find the role in the roles array to ensure ngModel binding works
    this.selectedRole = this.roles.find(r => r.codigo === user.mesaServicioRol?.codigo);
    this.displayAssignDialog = true;
  }

  assignRole() {
    if (!this.selectedUser || !this.selectedRole) return;

    const payload = {
      servicioId: this.selectedServicio.id,
      usuarioId: this.selectedUser.id,
      rolCodigo: this.selectedRole.codigo
    };

    this.mesaService.assignRole(payload).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Rol actualizado correctamente' });
        this.displayAssignDialog = false;
        this.loadAssignedUsers();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Falló la actualización del rol' });
      }
    });
  }
  getSeverity(roleCode: string): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" | undefined {
    switch (roleCode) {
      case 'ADM':
      case 'ADMIN_SERVICIO': return 'warning';
      case 'AG':
      case 'RESOLUTOR': return 'info';
      case 'SOL':
      case 'CREADOR': return 'success';
      default: return 'secondary';
    }
  }

}
