import { ResponsableService } from './../../../../Services/appServices/biomedicaServices/responsable/responsable.service';
import { CommonModule, Location } from '@angular/common'; // Added Location
import { Component, inject, model, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router';
import { TipoEquipoService } from '../../../../Services/appServices/general/tipoEquipo/tipo-equipo.service';
import { ServicioService } from '../../../../Services/appServices/general/servicio/servicio.service';

import { UppercaseDirective } from '../../../../Directives/uppercase.directive';
import Swal from 'sweetalert2';
import { EquiposService } from '../../../../Services/appServices/biomedicaServices/equipos/equipos.service';
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { DatePickerModule } from 'primeng/datepicker';
// Removed unused services

import { DropdownModule } from 'primeng/dropdown';
@Component({
  selector: 'app-crear-equipo',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, FormsModule, DatePickerModule, ReactiveFormsModule, DropdownModule],
  templateUrl: './crear-equipo.component.html',
  styleUrl: './crear-equipo.component.css'
})
export class CrearEquipoComponent implements OnInit {

  tiposequipo: any[] | undefined;
  servicios: any[] | undefined;
  responsables: any[] | undefined;

  // Removed proveedores and fabricantes arrays
  fechasMantenimiento: (Date | null)[] = [null, null, null];

  modalAddFechasMantenimiento: boolean = false;
  modalAddFechasCalibracion: boolean = false;
  fechasCalibracion: { fecha: Date | null, tipoActividad: string | null }[] = [];

  tipoActividadOptions = [
    { label: 'Calibración', value: 'Calibración' },
    { label: 'Calificación', value: 'Calificación' },
    { label: 'Validación', value: 'Validación' },
    { label: 'Confirmación Metrológica', value: 'Confirmación Metrológica' }
  ];


  equipo: any;
  showMetrologyFrequency: boolean = false;

  tipoEquipoServices = inject(TipoEquipoService);
  serviciosServices = inject(ServicioService);
  responsablesServices = inject(ResponsableService);

  estandarServices = inject(EquiposService); // Alias for EquiposService to match usage if needed, but existing is equipoServices
  equipoServices = inject(EquiposService);
  // Removed injected services

  equipoForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private location: Location // Injected Location
  ) {

    this.equipoForm = this.formBuilder.group({
      nombres: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      serie: ['', Validators.required],
      placa: ['', Validators.required],
      registroInvima: [''],
      riesgo: ['NA'],
      ubicacion: ['', Validators.required],
      ubicacionEspecifica: ['', Validators.required],
      activo: [true],
      periodicidadM: [0, Validators.required],
      periodicidadAM: [0, Validators.required],
      estadoBaja: [false],
      // actividadMetrologica removed as per requirement
      tipoEquipoIdFk: [null, Validators.required],
      servicioIdFk: [null, Validators.required],

      responsableIdFk: [null, Validators.required]
      // Removed proveedorIdFk and fabricanteIdFk
    });

    this.equipoForm.get('tipoEquipoIdFk')?.valueChanges.subscribe(val => {
      this.checkMetrologyRequirement(val);
    });
  }

  async ngOnInit() {
    // Load data independently to prevent one failure from blocking others
    try {
      await Promise.all([
        this.tipoEquipoServices.getAllTiposEquipos().then(data => this.tiposequipo = data).catch(err => console.error('Error cargando TiposEquipo:', err)),
        this.serviciosServices.getAllServicios().then(data => this.servicios = data).catch(err => console.error('Error cargando Servicios:', err)),
        this.responsablesServices.getAllResponsables().then(data => this.responsables = data).catch(err => console.error('Error cargando Responsables:', err))
        // Removed loading of Proveedores and Fabricantes
      ]);

      this.checkEditMode();
    } catch (error) {
      console.error('Error general en ngOnInit:', error);
    }
  }

  async checkEditMode() {
    this.activatedRoute.params.subscribe(async params => {
      const id = params['id'];
      if (id) {
        try {
          this.equipo = await this.equipoServices.getEquipoById(id);
          this.equipoForm.patchValue({
            nombres: this.equipo.nombres,
            marca: this.equipo.marca,
            modelo: this.equipo.modelo,
            serie: this.equipo.serie,
            placa: this.equipo.placa,
            registroInvima: this.equipo.registroInvima,
            riesgo: this.equipo.riesgo,
            ubicacion: this.equipo.ubicacion,
            ubicacionEspecifica: this.equipo.ubicacionEspecifica,
            activo: this.equipo.activo,
            periodicidadM: this.equipo.periodicidadM,
            periodicidadAM: this.equipo.periodicidadC, // Note: backend might use periodicidadC for AM
            estadoBaja: this.equipo.estadoBaja,
            tipoEquipoIdFk: this.equipo.tipoEquipoIdFk,
            servicioIdFk: this.equipo.servicioIdFk,

            responsableIdFk: this.equipo.responsableIdFk
            // Removed patchValue for proveedorIdFk and fabricanteIdFk
          });

          this.checkMetrologyRequirement(this.equipo.tipoEquipoIdFk);
        } catch (error) {
          console.error("Error loading equipment for edit", error);
        }
      }
    });
  }

  async guardar() {
    if (this.equipoForm.valid) {
      this.equipo = {
        nombres: this.equipoForm.get('nombres')?.value,
        marca: this.equipoForm.get('marca')?.value,
        modelo: this.equipoForm.get('modelo')?.value,
        serie: this.equipoForm.get('serie')?.value,
        placa: this.equipoForm.get('placa')?.value,
        registroInvima: this.equipoForm.get('registroInvima')?.value,
        riesgo: this.equipoForm.get('riesgo')?.value,
        ubicacion: this.equipoForm.get('ubicacion')?.value,
        ubicacionEspecifica: this.equipoForm.get('ubicacionEspecifica')?.value,
        activo: this.equipoForm.get('activo')?.value,
        periodicidadM: this.equipoForm.get('periodicidadM')?.value,
        periodicidadC: this.equipoForm.get('periodicidadAM')?.value,
        estadoBaja: this.equipoForm.get('estadoBaja')?.value,
        calibracion: false,
        calificacion: false,
        validacion: false,
        tipoEquipoIdFk: this.equipoForm.get('tipoEquipoIdFk')?.value,
        servicioIdFk: this.equipoForm.get('servicioIdFk')?.value,

        responsableIdFk: this.equipoForm.get('responsableIdFk')?.value,
        // Removed provider/fabricante form values
        id: this.equipo ? this.equipo.id : null
      }
      if (this.equipo.id) {
        await this.equipoServices.updateEquipo(this.equipo.id, this.equipo);
        Swal.fire({
          title: "Equipo Actualizado",
          icon: "success",
          draggable: true,
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        const createdEquipo = await this.equipoServices.addEquipo(this.equipo);
        this.equipo = createdEquipo;
        this.iniciarFechasMantenimiento();
        Swal.fire({
          title: "Equipo Creado",
          icon: "success",
          draggable: true,
          showConfirmButton: false,
          timer: 1500
        });
        // Remove navigation here, wait for plan modals
        // this.router.navigate(['/biomedica/lista-equipos']); 
        // The initiateFechasMantenimiento handles the flow.
        return;
      }
      this.cancelar();
      // this.router.navigate(['/biomedica/lista-equipos']);


    } else {

      Swal.fire({
        title: "Campos vacios",
        text: "Debe diligenciar Todos los Campos",
        icon: "warning"
      });
      // Marca todos los campos como tocados para mostrar los mensajes de error
      this.equipoForm.markAllAsTouched();
    }
  }

  cancelar() {
    this.location.back();
  }

  viewModalFechasMantenimiento() {
    this.modalAddFechasMantenimiento = true;
  }

  iniciarFechasMantenimiento() {
    if (this.equipo.periodicidadM > 0) {
      const cantidad = this.equipo.periodicidadM;
      this.fechasMantenimiento = [];
      for (let i = 0; i < cantidad; i++) {
        this.fechasMantenimiento.push(null);
      }
      setTimeout(() => {
        this.viewModalFechasMantenimiento();
      }, 1500);
    }
  }

  validarFechasMantenimiento() {
    this.modalAddFechasMantenimiento = false;

    // Chain to Metrology Modal
    if (this.showMetrologyFrequency && this.equipo.periodicidadC > 0) {
      this.iniciarFechasCalibracion();
    } else {
      this.finalizarGuardado();
    }
  }

  iniciarFechasCalibracion() {
    const cantidad = this.equipo.periodicidadC;
    this.fechasCalibracion = [];
    for (let i = 0; i < cantidad; i++) {
      this.fechasCalibracion.push({ fecha: null, tipoActividad: null });
    }
    this.modalAddFechasCalibracion = true;
  }

  validarFechasCalibracion() {
    this.modalAddFechasCalibracion = false;
    this.finalizarGuardado();
  }

  async finalizarGuardado() {
    // Construct payload
    const planesMantenimiento = this.fechasMantenimiento
      .map((fecha, index) => {
        if (fecha) {
          return { mes: fecha.getMonth() + 1 }; // 1-12
        }
        return null;
      })
      .filter(p => p !== null);

    const planesActividadMetrologica = this.fechasCalibracion
      .map(item => {
        if (item.fecha && item.tipoActividad) {
          return { mes: item.fecha.getMonth() + 1, tipoActividad: item.tipoActividad };
        }
        return null;
      })
      .filter(p => p !== null);

    const finalPayload = {
      ...this.equipo,
      planesMantenimiento: planesMantenimiento.length > 0 ? planesMantenimiento : undefined,
      planesActividadMetrologica: planesActividadMetrologica.length > 0 ? planesActividadMetrologica : undefined
    };

    if (finalPayload.planesMantenimiento || finalPayload.planesActividadMetrologica) {
      try {
        await this.equipoServices.updateEquipo(this.equipo.id, finalPayload);
        Swal.fire({
          title: "Equipo Creado Exitosamente",
          text: "Se han guardado el Equipo y sus Planes de Mantenimiento y Metrología.",
          icon: "success",
          showConfirmButton: true
        }).then(() => {
          this.cancelar();
        });
      } catch (e) {
        console.error(e);
        Swal.fire({
          title: "Error al guardar planes",
          text: "El equipo se creó pero hubo un error guardando los planes.",
          icon: "error"
        });
        this.cancelar();
      }
    } else {
      this.cancelar();
    }
  }

  checkMetrologyRequirement(tipoId: any) {
    if (!this.tiposequipo) return;
    // tipoId might be string or number
    const type = this.tiposequipo.find(t => t.id == tipoId);
    if (type && type.requiereMetrologia) {
      this.showMetrologyFrequency = true;
      this.equipoForm.get('periodicidadAM')?.setValidators([Validators.required]);
    } else {
      this.showMetrologyFrequency = false;
      this.equipoForm.get('periodicidadAM')?.clearValidators();
      this.equipoForm.get('periodicidadAM')?.setValue(0);
    }
    this.equipoForm.get('periodicidadAM')?.updateValueAndValidity();
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }
}
