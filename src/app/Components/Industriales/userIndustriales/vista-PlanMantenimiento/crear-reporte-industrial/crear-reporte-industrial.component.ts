import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, FormArray, ReactiveFormsModule } from '@angular/forms';

// PrimeNG
import { CalendarModule } from 'primeng/calendar';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

import Swal from 'sweetalert2';
import { getDecodedAccessToken } from '../../../../../utilidades';

// Services
import { ReporteIndustrialService } from '../../../../../Services/appServices/industrialesServices/reportes/reporte-industrial.service';
import { ProtocoloIndustrialService } from '../../../../../Services/appServices/industrialesServices/protocolo/protocolo-industrial.service';
import { EquiposIndustrialesService } from '../../../../../Services/appServices/industrialesServices/equipos/equiposIndustriales.service';
import { UserService } from '../../../../../Services/appServices/userServices/user.service';

import { PlanMantenimientoIndustrialesService } from '../../../../../Services/appServices/industrialesServices/planMantenimiento/planMantenimientoIndustriales.service';
import { IndustrialesNavbarComponent } from '../../../../navbars/IndustrialesNavbar/industrialesnavbar.component';

@Component({
  selector: 'app-crear-reporte-industrial',
  standalone: true,
  imports: [
    DatePickerModule, SelectModule, TextareaModule, InputTextModule, ButtonModule,
    CardModule, CalendarModule, InputMaskModule, CommonModule, DropdownModule,
    CheckboxModule, ReactiveFormsModule, FormsModule,
  ],
  templateUrl: './crear-reporte-industrial.component.html',
  styleUrl: './crear-reporte-industrial.component.css'
})
export class CrearReporteIndustrialComponent implements OnInit {

  reporteForm!: FormGroup;

  // Data
  reporte: any = {};
  equipo: any = {};
  protocolos: any[] = [];
  nombreUsuario: any;
  tipoMantenimiento = '';
  id!: number; // ID del equipo o del plan? En biomedica es ID equipo.

  // Injects
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  location = inject(Location);

  reporteService = inject(ReporteIndustrialService);
  protocoloService = inject(ProtocoloIndustrialService);
  equipoService = inject(EquiposIndustrialesService);
  userService = inject(UserService);

  planService = inject(PlanMantenimientoIndustrialesService); // Inject Plan Service

  planDetails: any = null; // Store plan details


  tiposMantenimiento = [
    { label: 'Correctivo', value: 'Correctivo' },
    { label: 'Preventivo', value: 'Preventivo' },
    { label: 'Predictivo', value: 'Predictivo' },
    { label: 'Otro', value: 'Otro' },
  ];

  selectedFiles: File[] = []; // Variable for selected files

  tiposFalla = [
    'Desgaste', 'Operación Indebida', 'Causa Externa', 'Accesorios',
    'Desconocido', 'Sin Falla', 'Otros'
  ].map(v => ({ label: v, value: v }));

  optionsProtocolo = [
    { label: 'Realizado', value: 'Realizado' },
    { label: 'No Realizado', value: 'No Realizado' },
    { label: 'No Aplica', value: 'No Aplica' }
  ];

  constructor() {
    this.validarTipoMantenimiento();
    this.initForm();
  }

  async ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    // DEBUG: Check Session Storage
    const planId = sessionStorage.getItem('idPlanMantenimientoIndustrial');
    console.log('DEBUG: CrearReporteForm loaded. ID Plan in Session:', planId);

    if (!planId) {
      console.warn('DEBUG: No plan ID found in session. Report will not be linked to a maintenance plan.');
    } else {
      try {
        this.planDetails = await this.planService.getPlanById(Number(planId));
        console.log('DEBUG: Plan Details Loaded:', this.planDetails);
      } catch (error) {
        console.error('Error fetching plan details:', error);
      }
    }

    await this.loadData();
  }

  initForm() {
    this.reporteForm = this.fb.group({
      fechaRealizado: [null],
      horaInicio: [null],
      fechaFin: [null],
      horaTerminacion: [null],
      horaTotal: [{ value: null, disabled: true }],
      tipoMantenimiento: [this.tipoMantenimiento],
      tipoFalla: [null],
      motivo: [''],
      trabajoRealizado: [''],
      calificacion: [null],
      nombreRecibio: [''],
      cedulaRecibio: [''],
      observaciones: [''],
      cumplimientoProtocolo: this.fb.array([])
    });

    this.reporteForm.valueChanges.subscribe(() => {
      this.calcularHoras();
    });

    if (this.tipoMantenimiento === 'Preventivo') {
      this.reporteForm.get('tipoFalla')?.setValue('Sin Falla');
      this.reporteForm.get('tipoFalla')?.disable();
      this.reporteForm.get('motivo')?.setValue('Programado para mantenimiento preventivo');
      this.reporteForm.get('motivo')?.disable();
    }
    this.reporteForm.get('tipoMantenimiento')?.disable();
  }

  async loadData() {
    // 1. Get User
    try {
      this.nombreUsuario = await this.userService.getNameUSer(getDecodedAccessToken().id);
    } catch (e) {
      console.error('Error loading user', e);
    }

    // 2. Get Equipment
    try {
      this.equipo = await this.equipoService.getEquipoById(this.id);
    } catch (e) {
      console.error('Error loading equipo', e);
      Swal.fire('Error', 'No se pudo cargar el equipo', 'error');
      return;
    }

    // 3. Get Report/Plan if exists
    const idReporteSession = sessionStorage.getItem('idReporteIndustrial'); // Use specific key
    if (idReporteSession) {

    }

    // 4. Load Protocols
    const typeId = this.equipo.tipoEquipoInd?.id || this.equipo.tipoEquipoIdFk || this.equipo.tipoEquipoIndustrialIdFk;

    if (typeId) {
      this.protocolos = await this.protocoloService.getProtocolosPorTipo(typeId);
      this.iniCumplimientoProtocolo();
    }
  }

  iniCumplimientoProtocolo() {
    const array = this.reporteForm.get('cumplimientoProtocolo') as FormArray;
    array.clear();
    this.protocolos.forEach(p => {
      array.push(this.fb.group({
        protocoloPreventivoIdFk: [p.id],
        cumple: [null], // Default to null for dropdown
        paso: [p.paso]
      }));
    });
  }

  calcularHoras() {
    const fechaInicio = this.reporteForm.get('fechaRealizado')?.value;
    const horaInicio = this.reporteForm.get('horaInicio')?.value;
    const fechaFin = this.reporteForm.get('fechaFin')?.value;
    const horaFin = this.reporteForm.get('horaTerminacion')?.value;

    if (fechaInicio && horaInicio && fechaFin && horaFin) {
      const inicio = new Date(fechaInicio);
      const [horasInicio, minutosInicio] = horaInicio.split(':');
      inicio.setHours(Number(horasInicio), Number(minutosInicio));

      const fin = new Date(fechaFin);
      const [horasFin, minutosFin] = horaFin.split(':');
      fin.setHours(Number(horasFin), Number(minutosFin));

      const diferenciaMs = fin.getTime() - inicio.getTime();

      if (diferenciaMs < 0) {
        this.reporteForm.get('horaTotal')?.setValue('00:00:00');
        return;
      }

      const hours = Math.floor(diferenciaMs / (1000 * 60 * 60));
      const minutes = Math.floor((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diferenciaMs % (1000 * 60)) / 1000);

      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      this.reporteForm.get('horaTotal')?.setValue(formattedTime);
    }
  }

  validarTipoMantenimiento() {
    // Read from SessionStorage set by the previous component
    const tipo = sessionStorage.getItem('TipoMantenimientoIndustrial');
    if (tipo === 'C') {
      this.tipoMantenimiento = 'Correctivo';
    } else if (tipo === 'P') {
      this.tipoMantenimiento = 'Preventivo';
    } else {
      this.tipoMantenimiento = 'Preventivo'; // Default
    }
  }

  get cumplimientoProtocoloFormArray(): FormArray {
    return this.reporteForm.get('cumplimientoProtocolo') as FormArray;
  }

  convertirMayusculas(texto: string): string {
    return texto ? texto.toUpperCase() : '';
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }

  goBack() {
    this.location.back();
  }

  async onSubmit() {
    if (this.reporteForm.invalid) {
      Swal.fire('Error', 'Complete los campos obligatorios', 'warning');
      return;
    }

    const formData = this.reporteForm.getRawValue(); // getRawValue to include disabled fields

    // Create FormData object for multipart/form-data
    const uploadData = new FormData();

    // Append fields
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined) {
        // Handle array (cumplimientoProtocolo) - FormData doesn't support arrays naturally well without stringifying
        // The backend expects flat keys for basic fields. 

        // EXCLUDE fields that we handle manually below to avoid duplicates (which become arrays in backend)
        if (key !== 'cumplimientoProtocolo' &&
          key !== 'tipoMantenimiento' &&
          key !== 'tipoFalla' &&
          key !== 'motivo') {
          uploadData.append(key, formData[key]);
        }
      }
    });

    uploadData.append('tipoMantenimiento', this.tipoMantenimiento);
    uploadData.append('equipoIndustrialIdFk', this.equipo.id);
    uploadData.append('usuarioIdFk', getDecodedAccessToken().id);

    if (this.tipoMantenimiento === 'Preventivo') {
      uploadData.append('tipoFalla', 'Sin Falla');
      uploadData.append('motivo', 'Programado para mantenimiento preventivo');
    } else {
      uploadData.append('tipoFalla', formData.tipoFalla);
      uploadData.append('motivo', formData.motivo);
    }

    uploadData.append('servicioIdFk', this.equipo.servicioIdFk);

    const planId = sessionStorage.getItem('idPlanMantenimientoIndustrial');
    if (planId) {
      uploadData.append('planMantenimientoIdFk', planId);
      uploadData.append('idPlanMantenimientoIndustrial', planId); // Needed for backend logic to update plan status
    }

    if (this.planDetails) {
      uploadData.append('mesProgramado', this.planDetails.mes);
      uploadData.append('añoProgramado', this.planDetails.ano);
    }

    // Append File
    if (this.selectedFiles.length > 0) {
      this.selectedFiles.forEach(file => {
        uploadData.append('imagenesReporte', file);
      });
    }

    try {
      const response = await this.reporteService.createReporte(uploadData);

      // Save Protocol Compliance if Preventivo
      if (this.tipoMantenimiento === 'Preventivo') {
        await this.guardarCumplimiento(response.id);
      }

      Swal.fire('Éxito', 'Reporte creado correctamente', 'success');
      sessionStorage.removeItem('idPlanMantenimientoIndustrial'); // Clear session
      this.location.back();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo crear el reporte', 'error');
    }
  }

  async guardarCumplimiento(reporteId: number) {
    const complianceData = this.reporteForm.value.cumplimientoProtocolo;

    for (const item of complianceData) {
      const cp = {
        protocoloPreventivoIdFk: item.protocoloPreventivoIdFk,
        cumple: item.cumple || 'No Realizado', // Use selected value or default
        reporteIdFk: reporteId
      };
      await this.protocoloService.addCumplimientoProtocolo(cp);
    }
  }
}
