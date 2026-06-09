import { Component, inject, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { API_URL } from '../../../../constantes';
import { createHeaders } from '../../../../utilidades';
import Swal from 'sweetalert2';

import { MantenimientoadminnavbarComponent } from '../../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import { AreasService } from '../../../../Services/appServices/areasFisicas/areas.service';
import { PlanMantenimientoService } from '../../../../Services/appServices/areasFisicas/plan-mantenimiento.service';
import { ServicioService } from '../../../../Services/appServices/general/servicio/servicio.service';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-programacion-mantenimiento',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MantenimientoadminnavbarComponent,
    ButtonModule,
    CardModule,
    SelectModule,
    InputTextModule,
    InputNumberModule,
    TextareaModule,
    TooltipModule
  ],
  templateUrl: './programacion-mantenimiento.component.html',
  styleUrl: './programacion-mantenimiento.component.css'
})
export class ProgramacionMantenimientoComponent implements OnInit, OnChanges {
  
  @Input() isEmbedded: boolean = false;
  @Input() selectedAreaId?: number;

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private areasService = inject(AreasService);
  private planMantenimientoService = inject(PlanMantenimientoService);
  private servicioService = inject(ServicioService);
  private http = inject(HttpClient);

  programacionForm!: FormGroup;
  servicios: any[] = [];
  areas: any[] = [];
  allAreas: any[] = [];
  filteredAreas: any[] = [];
  tecnicos: any[] = [];
  isSubmitting: boolean = false;

  aniosOptions: { label: string; value: number }[] = [];
  periodicidadOptions = [
    { label: 'Mensual', value: 1 },
    { label: 'Bimestral', value: 2 },
    { label: 'Trimestral', value: 3 },
    { label: 'Semestral', value: 6 },
    { label: 'Anual', value: 12 }
  ];

  mesesOptions = [
    { label: 'Enero', value: 1 },
    { label: 'Febrero', value: 2 },
    { label: 'Marzo', value: 3 },
    { label: 'Abril', value: 4 },
    { label: 'Mayo', value: 5 },
    { label: 'Junio', value: 6 },
    { label: 'Julio', value: 7 },
    { label: 'Agosto', value: 8 },
    { label: 'Septiembre', value: 9 },
    { label: 'Octubre', value: 10 },
    { label: 'Noviembre', value: 11 },
    { label: 'Diciembre', value: 12 }
  ];

  async ngOnInit(): Promise<void> {
    this.loadAnios();
    this.initForm();
    await this.loadServicios();
    await this.loadAreas();
    await this.loadTecnicos();
    if (this.selectedAreaId) {
        this.prefillArea();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes['selectedAreaId'] && !changes['selectedAreaId'].firstChange) {
          this.prefillArea();
      }
  }

  private prefillArea() {
      if (this.selectedAreaId && this.programacionForm) {
          const area = this.allAreas.find(a => a.id === this.selectedAreaId);
          if (area) {
              if (area.servicioIdFk) {
                  this.programacionForm.patchValue({ servicioId: area.servicioIdFk }, { emitEvent: false });
                  this.filteredAreas = this.allAreas.filter(a => a.servicioIdFk === area.servicioIdFk || a.servicios?.id === area.servicioIdFk);
              }
              this.programacionForm.patchValue({ areaId: this.selectedAreaId });
              this.programacionForm.get('areaId')?.enable();
          }
      }
  }

  initForm(): void {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    this.programacionForm = this.fb.group({
      servicioId: [null], 
      areaId: [{value: null, disabled: true}, Validators.required],
      anio: [currentYear, Validators.required],
      mesInicio: [currentMonth, Validators.required],
      periodicidad: [2, Validators.required],
      diaRangoInicio: [1, [Validators.required, Validators.min(1), Validators.max(31)]],
      diaRangoFin: [5, [Validators.required, Validators.min(1), Validators.max(31)]],
      responsable: ['Personal de Mantenimiento', Validators.required],
      tecnicoId: [null],
      actividad: ['', Validators.required]
    }, { validators: this.validarRangoDias });

    this.programacionForm.get('tecnicoId')?.valueChanges.subscribe(id => {
        if (id) {
            const tec = this.tecnicos.find(t => t.value === id);
            if (tec) this.programacionForm.patchValue({ responsable: tec.label }, { emitEvent: false });
        }
    });
  }

  validarRangoDias(group: FormGroup) {
    const inicio = group.get('diaRangoInicio')?.value;
    const fin = group.get('diaRangoFin')?.value;
    return inicio <= fin ? null : { rangoInvalido: true };
  }

  async loadServicios() {
    try {
      this.servicios = await this.servicioService.getAllServicios();
      
      this.programacionForm.get('servicioId')?.valueChanges.subscribe(servicioId => {
        if (servicioId) {
          this.filteredAreas = this.allAreas.filter(area => area.servicioIdFk === servicioId || area.servicios?.id === servicioId);
          this.programacionForm.get('areaId')?.enable();
        } else {
          this.filteredAreas = [...this.allAreas];
          this.programacionForm.get('areaId')?.disable();
        }
        this.programacionForm.get('areaId')?.setValue(null);
      });
      
    } catch (error) {
      console.error('Error al cargar servicios', error);
      Swal.fire('Error', 'No se pudieron cargar los servicios.', 'error');
    }
  }

  async loadAreas() {
    try {
      this.allAreas = await this.areasService.getAllAreas();
      this.filteredAreas = [...this.allAreas];
    } catch (error) {
      console.error('Error al cargar áreas', error);
      Swal.fire('Error', 'No se pudieron cargar las áreas.', 'error');
    }
  }

  async loadTecnicos(): Promise<void> {
    try {
      const allUsers: any = await lastValueFrom(this.http.get(`${API_URL}/users`, createHeaders()));
      this.tecnicos = allUsers
          .filter((u: any) => u.rol && u.rol.nombre === 'TECNICOMANTENIMIENTO')
          .map((t: any) => ({
              label: `${t.nombres} ${t.apellidos}`,
              value: t.id
          }));
    } catch (e) {
      console.error('Error cargando técnicos:', e);
    }
  }

  loadAnios() {
    const currentYear = new Date().getFullYear();
    const temp: { label: string; value: number }[] = [];
    for (let i = 0; i < 11; i++) {
        const year = currentYear + i;
        temp.push({ label: year.toString(), value: year });
    }
    this.aniosOptions = temp;
  }

  getAreaName(id: number): string {
    const area = this.areas.find(a => a.id === id);
    return area ? area.nombre : '';
  }

  getServicioName(id: number): string {
    const servicio = this.servicios.find(s => s.id === id);
    return servicio ? servicio.nombres : '';
  }

  goBack(): void {
    this.router.navigate(['/adminmantenimiento/gestion-operativa']);
  }

  async onSubmit() {
    if (this.programacionForm.invalid) {
      this.programacionForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = this.programacionForm.value;

    try {
      const response = await this.planMantenimientoService.postProgramacionAutomatica(formData);
      
      Swal.fire({
        icon: 'success',
        title: 'Programación Exitosa',
        text: 'La programación fue creada correctamente.',
        confirmButtonColor: '#3085d6',
      }).then(() => {
        if (!this.isEmbedded) {
          this.goBack();
        } else {
          this.initForm();
          if (this.selectedAreaId) {
            this.prefillArea();
          }
        }
      });

    } catch (error: any) {
      console.error('Error al programar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error de Programación',
        text: error.error?.error || 'No se pudo generar la programación. Verifica que los parámetros sean correctos.',
      });
    } finally {
      this.isSubmitting = false;
    }
  }
}
