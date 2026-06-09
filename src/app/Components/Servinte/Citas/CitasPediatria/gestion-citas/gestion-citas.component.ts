import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
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
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, CardModule, TableModule, IconFieldModule, InputIconModule, SelectModule, DatePickerModule, DialogModule, TagModule, TextareaModule],
  templateUrl: './gestion-citas.component.html',
  styleUrl: './gestion-citas.component.css'
})
export class GestionCitasComponent implements OnInit {

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
    estadoActivo: true
  };
  medicosFilterOptions: any[] = [];

  // Filter Models
  filterGlobalText: string = '';
  filterValidacion: any = null;
  filterFecha: any = null;
  filterEstado: any = null;
  filterMedico: any = null;
  filterControl: any = null;

  clearFilters(dt: any) {
    dt.clear();
    dt.filterGlobal('', 'contains');
    this.filterGlobalText = '';
    this.filterValidacion = null;
    this.filterFecha = null;
    this.filterEstado = null;
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
      text: '¿Está seguro de marcar esta cita como creada en Servinte?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, Confirmar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      this.loading = true;
      try {
        await this.servinteService.validateAppointmentLocal(appointment.id);
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
    if (!this.editingCita.fechaCita || !this.editingCita.control) {
      Swal.fire('Atención', 'Complete todos los campos obligatorios.', 'warning');
      return;
    }

    this.loading = true;
    try {
      const updateData = {
        fechaCita: this.formatDate(this.editingCita.fechaCita),
        control: this.editingCita.control,
        estadoCita: this.editingCita.estadoCita,
        validada: this.editingCita.validada
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
  }

  async loadMedicos() {
    this.loadingMedicos = true;
    try {
      this.medicosList = await this.servinteService.getMedicosLocal();
      this.medicosFilterOptions = this.medicosList.map(m => ({ label: `${m.nombre} ${m.apellido}`, value: `${m.nombre} ${m.apellido}` }));
      this.medicosFilterOptions.unshift({ label: 'Sin asignar', value: 'Sin asignar' });
    } catch (error) {
      console.error('Error al cargar médicos:', error);
      Swal.fire('Error', 'No se pudieron cargar los médicos.', 'error');
    } finally {
      this.loadingMedicos = false;
    }
  }

  async saveMedico() {
    if (!this.newMedico.nombre || !this.newMedico.apellido) {
      Swal.fire('Atención', 'Nombre y apellido son requeridos.', 'warning');
      return;
    }

    this.loadingMedicos = true;
    try {
      await this.servinteService.createMedicoLocal(this.newMedico);
      Swal.fire('Éxito', 'Médico creado correctamente.', 'success');
      this.newMedico = { nombre: '', apellido: '', telefono: '', estadoActivo: true };
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
}


