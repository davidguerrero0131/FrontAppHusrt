import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { MantenimientoadminnavbarComponent } from '../../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import { ObservacionesService } from '../../../../Services/appServices/areasFisicas/observaciones.service';
import { PlanMantenimientoService } from '../../../../Services/appServices/areasFisicas/plan-mantenimiento.service';
import { getDecodedAccessToken } from '../../../../utilidades';
import Swal from 'sweetalert2';

import { TextareaModule } from 'primeng/textarea';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../../../constantes';
import { createHeaders } from '../../../../utilidades';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-mis-tareas',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule, TooltipModule, DialogModule, TextareaModule, DropdownModule, FormsModule, MantenimientoadminnavbarComponent],
  templateUrl: './mis-tareas.component.html',
  styleUrl: './mis-tareas.component.css'
})
export class MisTareasComponent implements OnInit {
  private router = inject(Router);
  private observacionesService = inject(ObservacionesService);
  private planService = inject(PlanMantenimientoService);

  observaciones: any[] = [];
  loading: boolean = false;
  myId: number | null = null;
  userRole: string = '';

  activeTab: 'pendientes' | 'completadas' = 'pendientes';
  groupedPendientes: any[] = [];

  selectedObs: any = null;
  displayDetalle: boolean = false;

  displayCompletar: boolean = false;
  observacionCierre: string = '';
  imagenCierre: File | null = null;
  obsToComplete: any = null;

  // Variables for reassignment
  displayReasignar: boolean = false;
  tecnicos: any[] = [];
  selectedTecnicoId: number | null = null;
  obsToReassign: any = null;
  private http = inject(HttpClient);
  public API_URL = API_URL;

  async ngOnInit() {
    const tokenData = getDecodedAccessToken();
    if (tokenData) {
      this.userRole = tokenData.rol;
      this.myId = tokenData.id || tokenData.usuarioId || tokenData.uid;
    }
    await this.loadTecnicos();
    await this.loadData();
  }

  async loadTecnicos() {
    try {
      if (['SUPERADMIN', 'ADMINMANTENIMIENTO', 'USERMANTENIMIENTO'].includes(this.userRole)) {
        const url = `${API_URL}/users`;
        const allUsers: any = await lastValueFrom(this.http.get(url, createHeaders()));
        this.tecnicos = allUsers.filter((u: any) => u.rol && ['TECNICOMANTENIMIENTO', 'USERMANTENIMIENTO'].includes(u.rol.nombre)).map((t: any) => ({
          label: `${t.nombres} ${t.apellidos}`,
          value: t.id
        }));
      }
    } catch (e) {
      console.error('Error cargando técnicos:', e);
    }
  }

  async loadData() {
    if (!this.myId) return;
    this.loading = true;
    try {
      let resObs: any;

      if (['SUPERADMIN', 'ADMINMANTENIMIENTO', 'USERMANTENIMIENTO'].includes(this.userRole)) {
        resObs = await this.observacionesService.getAllObservaciones();
      } else {
        resObs = await this.observacionesService.getObservacionesByTecnico(this.myId);
      }
      
      const allObs = Array.isArray(resObs) ? resObs : (resObs?.data || []);

      // Filtrar para ocultar tareas genéricas (sin observaciones reales)
      const filteredObs = allObs.filter((o: any) => {
        const desc = (o.descripcion || '').toLowerCase();
        return !desc.includes('elemento reportado en estado') && !desc.includes('sin observación técnica detallada');
      });

      this.observaciones = [...filteredObs];
      
      this.groupTasks();
    } catch (e) {
      console.error(e);
      Swal.fire('Error', 'No se pudieron cargar tus tareas', 'error');
    } finally {
      this.loading = false;
    }
  }

  get tareasPendientes() {
    return this.observaciones.filter(o => o.estado === 'Pendiente');
  }

  groupTasks() {
    const pendientes = this.tareasPendientes;
    const groups: any = {};

    pendientes.forEach(obs => {
      const area = obs.areaElemento?.areas?.nombre || 'Área General';
      const fecha = new Date(obs.createdAt).toISOString().split('T')[0];
      const key = `${area}_${fecha}`;

      if (!groups[key]) {
        groups[key] = {
          areaName: area,
          fecha: obs.createdAt,
          items: []
        };
      }
      groups[key].items.push(obs);
    });

    this.groupedPendientes = Object.values(groups);
  }

  get tareasCompletadas() {
    return this.observaciones.filter(o => o.estado === 'Completado');
  }

  setTab(tab: 'pendientes' | 'completadas') {
    this.activeTab = tab;
  }

  volver() {
    this.router.navigate(['/adminmantenimiento/gestion-operativa']);
  }

  verDetalle(obs: any) {
    this.selectedObs = obs;
    this.displayDetalle = true;
  }

  completar(obs: any) {
    this.obsToComplete = obs;
    this.observacionCierre = '';
    this.imagenCierre = null;
    this.displayCompletar = true;
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.imagenCierre = event.target.files[0];
    }
  }

  async confirmarCompletar() {
    if (!this.observacionCierre || !this.imagenCierre) {
      Swal.fire('Atención', 'Debes ingresar una observación y subir una evidencia fotográfica', 'warning');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('observacionCierre', this.observacionCierre);
      if (this.imagenCierre) {
        formData.append('imagenCierre', this.imagenCierre);
      }

      if (this.obsToComplete.isMantenimiento) {
        // Para mantenimientos preventivos, estado 3 = Completado
        formData.append('estado', '3');
        await this.planService.changeMantenimientoEstado(this.obsToComplete.id, 3, formData);
      } else {
        // Para observaciones/correctivos, estado = Completado (string)
        formData.append('estado', 'Completado');
        await this.observacionesService.updateObservacion(this.obsToComplete.id, formData);
      }
      
      this.displayCompletar = false;
      Swal.fire('Éxito', 'La tarea se completó correctamente', 'success');
      
      await this.loadData();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo completar la tarea.', 'error');
    }
  }

  reasignar(obs: any) {
    this.obsToReassign = obs;
    this.selectedTecnicoId = obs.tecnicoId;
    this.displayReasignar = true;
  }

  async confirmarReasignacion() {
    if (!this.selectedTecnicoId) {
      Swal.fire('Atención', 'Selecciona un técnico', 'warning');
      return;
    }

    try {
      if (this.obsToReassign.isMantenimiento) {
        await this.planService.changeMantenimientoEstado(this.obsToReassign.id, undefined, { tecnicoId: this.selectedTecnicoId });
      } else {
        await this.observacionesService.updateObservacion(this.obsToReassign.id, { tecnicoId: this.selectedTecnicoId });
      }

      this.displayReasignar = false;
      Swal.fire('Éxito', 'La tarea se reasignó correctamente', 'success');
      await this.loadData();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo reasignar la tarea.', 'error');
    }
  }

  getImageUrl(filename: string): string {
    if (!filename) return '';
    // Si el nombre contiene una ruta completa (caso antiguo), extraemos solo el nombre del archivo
    const cleanName = filename.split(/[\\/]/).pop();
    return `${this.API_URL}/uploads/mantenimiento/${cleanName}`;
  }
}

