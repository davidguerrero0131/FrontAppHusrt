import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CitaspediatriaadminnavbarComponent } from '../../../../navbars/citaspediatriaadminnavbar/citaspediatriaadminnavbar.component';
import { CitaspediatriausernavbarComponent } from '../../../../navbars/citaspediatriausernavbar/citaspediatriausernavbar.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Table, TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { EntidadService } from '../../../../../Services/Servinte/entidad.service';
import Swal from 'sweetalert2';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-gestion-citas',
  standalone: true,
  imports: [CitaspediatriaadminnavbarComponent, CitaspediatriausernavbarComponent, CommonModule, FormsModule, InputTextModule, ButtonModule, CardModule, TableModule, IconFieldModule, InputIconModule, SelectModule, DatePickerModule, DialogModule, TagModule, TextareaModule],
  templateUrl: './gestion-citas.component.html',
  styleUrl: './gestion-citas.component.css'
})
export class GestionCitasComponent implements OnInit {

  rol: string | null = '';
  appointments: any[] = [];
  loading: boolean = false;
  statuses: any[] = [
    { label: 'Pendiente', value: false },
    { label: 'Validada', value: true }
  ];

  appointmentStatuses: any[] = [
    { label: 'Pendiente', value: 'Pendiente' },
    { label: 'Confirmada', value: 'Confirmada' },
    { label: 'Realizada', value: 'Realizada' },
    { label: 'Cancelada', value: 'Cancelada' },
    { label: 'No Asistió', value: 'No Asistio' },
    { label: 'Reprogramada', value: 'Reprogramada' },
    { label: 'Alta', value: 'Alta' },
    { label: 'Deserción', value: 'Desercion' }
  ];

  stages: any[] = [
    { label: 'Ingreso', value: 'Ingreso' },
    { label: '40 Semanas', value: '40 Semanas' },
    { label: 'Mes y Medio', value: 'Mes y Medio' },
    { label: '3 Meses', value: '3 Meses' },
    { label: '4 y Medio Meses', value: '4 y Medio Meses' },
    { label: '6 Meses', value: '6 Meses' },
    { label: '7 y Medio Meses', value: '7 y Medio Meses' },
    { label: '9 Meses', value: '9 Meses' },
    { label: '10 y Medio Meses', value: '10 y Medio Meses' },
    { label: '12 Meses', value: '12 Meses' },
    { label: '15 Meses', value: '15 Meses' },
    { label: '18 Meses', value: '18 Meses' },
    { label: '21 Meses', value: '21 Meses' },
    { label: '24 Meses', value: '24 Meses' }
  ];

  exportDialog: boolean = false;
  startDateExport: any = null;
  endDateExport: any = null;

  editDialog: boolean = false;
  editStatusDialog: boolean = false;
  editingCita: any = {};

  patientDialog: boolean = false;
  selectedPatient: any = null;

  medicosDialog: boolean = false;
  medicosList: any[] = [];
  loadingMedicos: boolean = false;
  newMedico: any = {
    nombre: '',
    apellido: '',
    telefono: '',
    estadoActivo: true,
    especialidadId: null
  };
  editingMedicoId: any = null;
  medicosOptions: any[] = [];

  especialidadesDialog: boolean = false;
  especialidadesList: any[] = [];
  loadingEspecialidades: boolean = false;
  newEspecialidad: any = {
    nombre: '',
    estadoActivo: true
  };
  especialidadesOptions: any[] = [];

  // Filter Models
  filterGlobalText: string = '';
  filterValidacion: any = null;
  filterFecha: any = null;
  filterEstado: any = null;
  filterMedico: any = null;
  filterEspecialidad: any = null;
  filterControl: any = null;

  clearFilters(dt: any) {
    dt.clear();
    dt.filterGlobal('', 'contains');
    this.filterGlobalText = '';
    this.filterValidacion = null;
    this.filterFecha = null;
    this.filterEstado = null;
    this.filterMedico = null;
    this.filterEspecialidad = null;
    this.filterMedico = null;
    this.filterControl = null;
  }




  private servinteService = inject(EntidadService);
  private router = inject(Router);

  formatDate(date: any) {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }


  ngOnInit() {
    this.rol = sessionStorage.getItem('rol');
    this.loadAppointments();
    this.loadMedicos();
  }

  async loadAppointments() {
    this.loading = true;
    try {
      this.appointments = await this.servinteService.getAllAppointmentsLocal();
      // Pre-calcular nombre de médico para facilitar filtrado
      this.appointments.forEach(app => {
        app.medicoNombreCompleto = app.medico ? `${app.medico.nombre} ${app.medico.apellido}` : 'Sin asignar';
      });
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar las citas.', 'error');
    } finally {
      this.loading = false;
    }
  }

  async validateAppointment(appointment: any) {
    if (appointment.validada) return;

    const result = await Swal.fire({
      title: '¿Confirmar que la cita fue creada en Servinte?',
      html: `
        <p>¿Está seguro de marcar esta cita como creada en Servinte?</p>
        <div class="mt-3">
          <label for="horaCita" class="form-label font-bold">Hora de la cita:</label>
          <input type="time" id="horaCita" class="swal2-input" style="max-width: 100%;">
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, Confirmar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const hora = (document.getElementById('horaCita') as HTMLInputElement).value;
        if (!hora) {
          Swal.showValidationMessage('Debe ingresar la hora de la cita');
        }
        return hora;
      }
    });

    if (result.isConfirmed) {
      const horaCita = result.value;
      this.loading = true;
      try {
        await this.servinteService.validateAppointmentLocal(appointment.id, horaCita);
        Swal.fire('Éxito', 'Cita creada correctamente en Servinte.', 'success');
        this.loadAppointments(); // Refresh list
      } catch (error) {
        console.error('Error al crear cita en Servinte:', error);
        Swal.fire('Error', 'No se pudo crear la cita en Servinte.', 'error');
      } finally {
        this.loading = false;
      }
    }
  }

  downloadExcel() {
    if (!this.startDateExport || !this.endDateExport) {
      Swal.fire('Atención', 'Seleccione ambas fechas para exportar.', 'warning');
      return;
    }

    const start = this.formatDate(this.startDateExport);
    const end = this.formatDate(this.endDateExport);

    this.loading = true;
    this.servinteService.exportAppointmentsExcel(start, end).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_Citas_${start}_a_${end}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.loading = false;
        this.exportDialog = false;
        Swal.fire('Éxito', 'Reporte descargado correctamente.', 'success');
      },
      error: (err) => {
        console.error('Error al descargar:', err);
        Swal.fire('Error', 'No se pudo generar el reporte.', 'error');
        this.loading = false;
      }
    });
  }

  openEdit(cita: any) {
    this.editingCita = {
      ...cita,
      fechaCita: new Date(cita.fechaCita) // Ensure Date object for DatePicker
    };
    this.editDialog = true;
  }

  async saveEdit() {
    if (!this.editingCita.fechaCita || !this.editingCita.especialidadId) {
      Swal.fire('Atención', 'Complete todos los campos obligatorios.', 'warning');
      return;
    }

    if (this.editingCita.especialidadId === 1 && !this.editingCita.control) {
      Swal.fire('Atención', 'El Control/Etapa es obligatorio para Pediatría.', 'warning');
      return;
    }

    this.loading = true;
    try {
      const updateData = {
        fechaCita: this.formatDate(this.editingCita.fechaCita),
        control: this.editingCita.especialidadId === 1 ? this.editingCita.control : null,
        estadoCita: this.editingCita.estadoCita,
        validada: this.editingCita.validada,
        especialidadId: this.editingCita.especialidadId
      };

      await this.servinteService.updateAppointmentLocal(this.editingCita.id, updateData);
      Swal.fire('Éxito', 'Cita actualizada correctamente.', 'success');
      this.editDialog = false;
      this.loadAppointments();
    } catch (error) {
      console.error('Error al actualizar:', error);
      Swal.fire('Error', 'No se pudo actualizar la cita.', 'error');
    } finally {
      this.loading = false;
    }
  }

  viewPatient(patient: any) {
    this.selectedPatient = patient;
    this.patientDialog = true;
  }

  goToDashboard() {
    this.router.navigate(['/servinte/citasmadrecanguro/stats']);
  }

  goToCreacion() {
    this.router.navigate(['/servinte/citasmadrecanguro/creacion']);
  }

  openEditStatus(cita: any) {
    this.editingCita = {
      ...cita
    };
    if (this.editingCita.fechaReprogramacion) {
        this.editingCita.fechaReprogramacion = new Date(this.editingCita.fechaReprogramacion);
    }
    this.editStatusDialog = true;
  }

  async saveEditStatus() {
    this.loading = true;
    try {
      const updateData: any = {
        estadoCita: this.editingCita.estadoCita
      };

      if (['Cancelada', 'No Asistio', 'Reprogramada'].includes(this.editingCita.estadoCita)) {
        updateData.observaciones = this.editingCita.observaciones;
      }

      if (this.editingCita.estadoCita === 'Reprogramada' && this.editingCita.fechaReprogramacion) {
        updateData.fechaReprogramacion = this.formatDate(this.editingCita.fechaReprogramacion);
      }

      await this.servinteService.updateAppointmentLocal(this.editingCita.id, updateData);
      Swal.fire('Éxito', 'Estado de la cita actualizado correctamente.', 'success');
      this.editStatusDialog = false;
      this.loadAppointments();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      Swal.fire('Error', 'No se pudo actualizar el estado.', 'error');
    } finally {
      this.loading = false;
    }
  }

  getSeverity(status: string) {
    switch (status) {
      case 'Pendiente':
        return 'warn';
      case 'Confirmada':
        return 'info';
      case 'Realizada':
        return 'success';
      case 'Cancelada':
        return 'danger';
      case 'No Asistio':
        return 'secondary';
      case 'Reprogramada':
        return 'contrast';
      default:
        return 'info';
    }
  }

  // --- MÉTODOS DE MÉDICOS ---
  openMedicosModal() {
    this.medicosDialog = true;
    this.loadMedicos();
    this.loadEspecialidades();
    this.newMedico = { nombre: '', apellido: '', telefono: '', estadoActivo: true, especialidadId: null };
    this.editingMedicoId = null;
  }

  async loadMedicos() {
    this.loadingMedicos = true;
    try {
      this.medicosList = await this.servinteService.getMedicosLocal();
      this.medicosOptions = this.medicosList.map(m => ({ label: `${m.nombre} ${m.apellido}`, value: `${m.nombre} ${m.apellido}` }));
      this.medicosOptions.unshift({ label: 'Sin asignar', value: 'Sin asignar' });
    } catch (error) {
      console.error('Error al cargar médicos:', error);
      Swal.fire('Error', 'No se pudieron cargar los médicos.', 'error');
    } finally {
      this.loadingMedicos = false;
    }
  }

  editMedico(medico: any) {
    this.editingMedicoId = medico.id;
    this.newMedico = {
      nombre: medico.nombre,
      apellido: medico.apellido,
      telefono: medico.telefono,
      estadoActivo: medico.estadoActivo,
      especialidadId: medico.especialidadId
    };
  }

  cancelEditMedico() {
    this.editingMedicoId = null;
    this.newMedico = { nombre: '', apellido: '', telefono: '', estadoActivo: true, especialidadId: null };
  }

  async saveMedico() {
    if (!this.newMedico.nombre || !this.newMedico.apellido || !this.newMedico.especialidadId) {
      Swal.fire('Atención', 'Nombre, apellido y especialidad son requeridos.', 'warning');
      return;
    }

    this.loadingMedicos = true;
    try {
      if (this.editingMedicoId) {
        await this.servinteService.updateMedicoLocal(this.editingMedicoId, this.newMedico);
        Swal.fire('Éxito', 'Médico actualizado correctamente.', 'success');
      } else {
        await this.servinteService.createMedicoLocal(this.newMedico);
        Swal.fire('Éxito', 'Médico creado correctamente.', 'success');
      }
      this.cancelEditMedico();
      this.loadMedicos();
    } catch (error) {
      console.error('Error al guardar médico:', error);
      Swal.fire('Error', 'No se pudo guardar el médico.', 'error');
    } finally {
      this.loadingMedicos = false;
    }
  }

  async toggleEstadoMedico(medico: any) {
    this.loadingMedicos = true;
    try {
      await this.servinteService.updateMedicoLocal(medico.id, { estadoActivo: !medico.estadoActivo });
      Swal.fire('Éxito', 'Estado del médico actualizado.', 'success');
      this.loadMedicos();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      Swal.fire('Error', 'No se pudo actualizar el estado.', 'error');
    } finally {
      this.loadingMedicos = false;
    }
  }

  // --- MÉTODOS DE ESPECIALIDADES ---
  openEspecialidadesModal() {
    this.especialidadesDialog = true;
    this.loadEspecialidades();
  }

  async loadEspecialidades() {
    this.loadingEspecialidades = true;
    try {
      this.especialidadesList = await this.servinteService.getEspecialidadesLocal();
      this.especialidadesOptions = this.especialidadesList.map(e => ({ label: e.nombre, value: e.id }));
      this.especialidadesOptions.unshift({ label: 'Sin asignar', value: null });
    } catch (error) {
      console.error('Error al cargar especialidades:', error);
      Swal.fire('Error', 'No se pudieron cargar las especialidades.', 'error');
    } finally {
      this.loadingEspecialidades = false;
    }
  }

  async saveEspecialidad() {
    if (!this.newEspecialidad.nombre) {
      Swal.fire('Atención', 'El nombre es requerido.', 'warning');
      return;
    }

    this.loadingEspecialidades = true;
    try {
      await this.servinteService.createEspecialidadLocal(this.newEspecialidad);
      Swal.fire('Éxito', 'Especialidad creada correctamente.', 'success');
      this.newEspecialidad = { nombre: '', estadoActivo: true };
      this.loadEspecialidades();
    } catch (error) {
      console.error('Error al guardar especialidad:', error);
      Swal.fire('Error', 'No se pudo guardar la especialidad.', 'error');
    } finally {
      this.loadingEspecialidades = false;
    }
  }

  async toggleEstadoEspecialidad(esp: any) {
    this.loadingEspecialidades = true;
    try {
      await this.servinteService.updateEspecialidadLocal(esp.id, { estadoActivo: !esp.estadoActivo });
      Swal.fire('Éxito', 'Estado de la especialidad actualizado.', 'success');
      this.loadEspecialidades();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      Swal.fire('Error', 'No se pudo actualizar el estado.', 'error');
    } finally {
      this.loadingEspecialidades = false;
    }
  }
}


