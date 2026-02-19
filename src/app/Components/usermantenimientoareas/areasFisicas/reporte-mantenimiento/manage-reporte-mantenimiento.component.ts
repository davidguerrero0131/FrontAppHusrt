import { Component, inject, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputTextarea } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DividerModule } from 'primeng/divider';
import { MantenimientoadminnavbarComponent } from '../../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import { ReporteMantenimientoService } from '../../../../Services/appServices/areasFisicas/reporte-mantenimiento.service';
import { AreaElementoService } from '../../../../Services/appServices/areasFisicas/area-elemento.service';
import { getDecodedAccessToken } from '../../../../utilidades';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-reporte-mantenimiento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, InputTextModule, ButtonModule, InputTextarea, CalendarModule, CheckboxModule, RadioButtonModule, DividerModule, MantenimientoadminnavbarComponent],
  templateUrl: './manage-reporte-mantenimiento.component.html',
  styleUrls: ['./manage-reporte-mantenimiento.component.css']
})
export class ManageReporteMantenimientoComponent implements OnInit {

  @Input() inputAreaElementoId: number | null = null;
  @Input() inputInspeccionId: number | null = null;
  @Input() isDialog: boolean = false;
  @Output() onClose = new EventEmitter<boolean>();

  fb = inject(FormBuilder);
  reporteService = inject(ReporteMantenimientoService);
  areaElementoService = inject(AreaElementoService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  form: FormGroup;
  isEditMode: boolean = false;
  idToEdit: number | null = null;
  loading: boolean = false;

  tipoReporteOptions = [
    { label: 'Equipo Industrial', value: 'Equipo Industrial' },
    { label: 'Infraestructura', value: 'Infraestructura' },
    { label: 'Mobiliario', value: 'Mobiliario' }
  ];

  tipoMantenimientoOptions = [
    { label: 'Preventivo', value: 'Preventivo' },
    { label: 'Correctivo', value: 'Correctivo' }
  ];

  constructor() {
    this.form = this.fb.group({
      fecha: [new Date(), Validators.required],
      tipoReporte: ['Mobiliario', Validators.required],

      // Datos Técnicos
      nombre: ['', Validators.required],
      ubicacion: ['', Validators.required],

      tipoMantenimiento: ['Correctivo', Validators.required],

      fallasEncontradas: ['', Validators.required],
      reporte: [''],
      observaciones: [''],

      realizadoPor: [''],
      recibidoPor: [''],
      cargo: [''],

      // Fks
      areaElementoId: [null],
      inspeccionId: [null]
    });
  }

  async ngOnInit() {
    this.route.params.subscribe(async params => {
      if (params['id']) {
        this.isEditMode = true;
        this.idToEdit = +params['id'];
        await this.loadReporte(this.idToEdit);
      }
    });

    this.route.queryParams.subscribe(async queryParams => {
      const aeId = this.inputAreaElementoId || (queryParams['areaElementoId'] ? +queryParams['areaElementoId'] : null);
      if (aeId) {
        this.form.patchValue({ areaElementoId: aeId });
        await this.loadElementoData(aeId);
      }

      const insId = this.inputInspeccionId || (queryParams['inspeccionId'] ? +queryParams['inspeccionId'] : null);
      if (insId) {
        this.form.patchValue({ inspeccionId: insId });
      }

      // Pre-fill user data from token
      const tokenData = getDecodedAccessToken();
      if (tokenData) {
        // Asumiendo que el token tiene propiedades como 'nombres' y 'apellidos' o 'nombre_completo'
        // Ajustar según la estructura real del token del backend
        const nombreCompleto = tokenData.nombres ? `${tokenData.nombres} ${tokenData.apellidos || ''}`.trim() : (tokenData.nombre || '');
        this.form.patchValue({ realizadoPor: nombreCompleto });
      }
    });
  }

  async loadElementoData(id: number) {
    try {
      const data: any = await this.areaElementoService.getAllAsignaciones(); // Hack if no direct get by ID
      const found = data.find((x: any) => x.id === id);

      if (found) {
        this.form.patchValue({
          nombre: found.elemento?.nombre || '',
          ubicacion: found.areas?.nombre || '' // Or specific location field
        });
      }

    } catch (error) {
      console.error("Error loading element data", error);
    }
  }

  async loadReporte(id: number) {
    try {
      const data = await this.reporteService.getReporteById(id);
      data.fecha = new Date(data.fecha);
      this.form.patchValue(data);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo cargar el reporte', 'error');
    }
  }

  async guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Swal.fire('Error', 'Complete los campos obligatorios', 'warning');
      return;
    }

    this.loading = true;
    try {
      const value = this.form.value;
      if (this.isEditMode && this.idToEdit) {
        await this.reporteService.updateReporte(this.idToEdit, value);
        Swal.fire('Éxito', 'Reporte actualizado', 'success');
      } else {
        await this.reporteService.createReporte(value);
        Swal.fire('Éxito', 'Reporte creado', 'success');
      }
      this.back(true);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo guardar el reporte', 'error');
    } finally {
      this.loading = false;
    }
  }

  back(success: boolean = false) {
    if (this.isDialog) {
      this.onClose.emit(success);
      return;
    }

    // Return to previous page or dashboard
    // If queryParams had returnUrl
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
    } else {
      this.router.navigate(['/adminmantenimiento/gestion-operativa']);
    }
  }

  cancelar() {
    this.back(false);
  }
}
