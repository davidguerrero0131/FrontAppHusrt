import { Component, inject, OnInit } from '@angular/core';
import { EntidadService } from '../../../../../Services/Servinte/entidad.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';

import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-creacion-citas',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, CardModule, DatePickerModule, SelectModule],
  templateUrl: './creacion-citas.component.html',
  styleUrl: './creacion-citas.component.css'
})
export class CreacionCitasComponent {


  patientId: string = '';
  patientData: any = null;
  pmcUnico: string = '';
  loading: boolean = false;

  appointmentDate: Date | null = null;
  selectedStage: any = null;
  selectedMedico: any = null;
  medicosList: any[] = [];

  stages: any[] = [
    { label: 'Diario', value: 'Diario' },
    { label: 'Semanal', value: 'Semanal' },
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

  private servinteService = inject(EntidadService);

  ngOnInit() {
    this.loadMedicos();
  }

  async loadMedicos() {
    try {
      const medicos = await this.servinteService.getMedicosLocal();
      // Solo médicos activos
      this.medicosList = medicos.filter(m => m.estadoActivo).map(m => ({
        label: `${m.nombre} ${m.apellido}`,
        value: m.id
      }));
    } catch (error) {
      console.error('Error al cargar médicos:', error);
    }
  }

  async searchPatient() {
    if (!this.patientId) {
      Swal.fire('Atención', 'Por favor ingrese un número de documento, PMC Único o ID Servinte.', 'warning');
      return;
    }

    this.loading = true;
    try {
      // Intentar primero en la base de datos local
      try {
        const localData = await this.servinteService.getPacienteLocal(this.patientId);
        if (localData && localData.numeroId) {
          this.patientData = localData;
          this.pmcUnico = localData.PMCUnico || '';
          this.loading = false;
          return; // Encontrado localmente, terminamos
        }
      } catch (localError) {
        // Si no se encuentra (ej. 404), ignoramos y pasamos al servicio externo
        console.log('Paciente no encontrado localmente, buscando en servicio externo...');
      }

      // Si no se encontró localmente, buscar en servicio externo
      const data = await this.servinteService.getDatosPaciente(this.patientId);
      if (data && data.length > 0) {
        this.patientData = data[0]; // Assuming the first item is the patient
        // Limpiamos PMCUnico en caso de que el anterior tuviera uno
        this.pmcUnico = '';
      } else {
        this.patientData = null;
        Swal.fire('No encontrado', 'No se encontraron datos para el paciente ingresado.', 'info');
      }
    } catch (error) {
      console.error('Error al buscar paciente:', error);
      Swal.fire('Error', 'Hubo un problema al consultar los datos del paciente.', 'error');
    } finally {
      this.loading = false;
    }
  }

  async saveAppointment() {
    if (!this.patientData || !this.appointmentDate || !this.selectedStage || !this.pmcUnico) {
      Swal.fire('Error', 'Debe completar todos los datos de la cita, incluyendo el PMC Único.', 'error');
      return;
    }

    this.loading = true;
    try {
      // Add PMCUnico to patientData so it's sent to backend
      this.patientData.PMCUnico = this.pmcUnico;

      const citaData = {
        patientData: this.patientData,
        appointmentDate: this.appointmentDate,
        control: this.selectedStage.value,
        medicoId: this.selectedMedico ? this.selectedMedico.value : null
      };

      console.log('Enviando datos de cita al backend:', citaData);
      const res = await this.servinteService.createAppointment(citaData);
      console.log('Respuesta del servidor:', res);
      Swal.fire('Éxito', res.message || 'Cita creada correctamente.', 'success');

      // Reset form or redirect? 
      // For now, let's keep it simple
      this.patientData = null;
      this.patientId = '';
      this.pmcUnico = '';
      this.appointmentDate = null;
      this.selectedStage = null;
      this.selectedMedico = null;

    } catch (error: any) {
      console.error('Error al guardar cita:', error);
      const errorMsg = error.error?.message || error.error?.error || 'No se pudo guardar la cita.';
      Swal.fire('Atención', errorMsg, 'warning');
    } finally {
      this.loading = false;
    }
  }
}
