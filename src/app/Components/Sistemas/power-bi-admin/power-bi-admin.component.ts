import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { jwtDecode } from 'jwt-decode';

import { PowerBiService } from '../../../Services/appServices/powerbi/power-bi.service';
import { UserService } from '../../../Services/appServices/userServices/user.service';

@Component({
  selector: 'app-power-bi-admin',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, ButtonModule, DialogModule,
    InputTextModule, InputTextarea, ToastModule, MultiSelectModule,
    TagModule, TooltipModule, ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './power-bi-admin.component.html',
  styleUrls: ['./power-bi-admin.component.css']
})
export class PowerBiAdminComponent implements OnInit {
  dashboards: any[] = [];
  usuarios: any[] = [];
  userId: number = 0;

  displayDialog: boolean = false;
  dashboardForm: any = { nombre: '', descripcion: '', url_iframe: '' };
  isEdit: boolean = false;

  displayAssignDialog: boolean = false;
  selectedDashboardForAssign: any = null;
  selectedUsers: any[] = [];

  displayBitacoraDialog: boolean = false;
  bitacora: any[] = [];
  selectedDashboardName: string = '';

  constructor(
    private powerBiService: PowerBiService,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.extractUser();
    this.loadDashboards();
    this.loadUsers();
  }

  extractUser() {
    const token = sessionStorage.getItem('utoken');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.id;
    }
  }

  loadDashboards() {
    this.powerBiService.getAllDashboards().subscribe({
      next: (data: any) => this.dashboards = data,
      error: (err: any) => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los tableros' })
    });
  }

  loadUsers() {
    this.userService.getAllUsers().then((data: any) => {
      this.usuarios = data;
    });
  }

  openNew() {
    this.isEdit = false;
    this.dashboardForm = { nombre: '', descripcion: '', url_iframe: '' };
    this.selectedUsers = [];
    this.displayDialog = true;
  }

  openEdit(dash: any) {
    this.isEdit = true;
    this.dashboardForm = { ...dash };
    this.selectedUsers = dash.usuariosAsignados ? [...dash.usuariosAsignados] : [];
    this.displayDialog = true;
  }

  saveDashboard() {
    if (!this.dashboardForm.nombre || !this.dashboardForm.url_iframe) return;
    
    const payload = {
      ...this.dashboardForm,
      usuarioIdAccion: this.userId,
      usuariosIds: (this.selectedUsers || []).map(u => u.id)
    };

    if (this.isEdit) {
      this.powerBiService.updateDashboard(this.dashboardForm.id, payload).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Tablero actualizado correctamente' });
          this.displayDialog = false;
          this.loadDashboards();
        }
      });
    } else {
      this.powerBiService.createDashboard(payload).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Tablero creado correctamente' });
          this.displayDialog = false;
          this.loadDashboards();
        }
      });
    }
  }

  toggleDashboard(dash: any) {
    this.powerBiService.toggleDashboard(dash.id, this.userId).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Estado actualizado' });
        this.loadDashboards();
      }
    });
  }

  openAssign(dash: any) {
    this.selectedDashboardForAssign = dash;
    this.selectedUsers = dash.usuariosAsignados || [];
    this.displayAssignDialog = true;
  }

  saveAssign() {
    const ids = this.selectedUsers.map(u => u.id);
    this.powerBiService.assignUsersToDashboard(this.selectedDashboardForAssign.id, ids, this.userId).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuarios asignados correctamente' });
        this.displayAssignDialog = false;
        this.loadDashboards();
      }
    });
  }

  openBitacora(dash: any) {
    this.selectedDashboardName = dash.nombre;
    this.powerBiService.getBitacora(dash.id).subscribe({
      next: (data: any) => {
        this.bitacora = data;
        this.displayBitacoraDialog = true;
      }
    });
  }
}
