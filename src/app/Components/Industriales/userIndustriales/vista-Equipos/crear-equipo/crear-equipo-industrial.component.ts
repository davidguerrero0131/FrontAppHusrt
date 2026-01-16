import { ResponsableService } from '../../../../../Services/appServices/industrialesServices/responsable/responsable.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TipoEquipoService } from '../../../../../Services/appServices/general/tipoEquipo/tipo-equipo.service';
import { ServicioService } from '../../../../../Services/appServices/general/servicio/servicio.service';
import { SedeService } from '../../../../../Services/appServices/general/sede/sede.service';
import { UppercaseDirective } from '../../../../../Directives/uppercase.directive';
import Swal from 'sweetalert2';
import { EquiposIndustrialesService } from '../../../../../Services/appServices/industrialesServices/equipos/equiposIndustriales.service';
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { DatePicker } from 'primeng/datepicker';
import { IndustrialesNavbarComponent } from '../../../../navbars/IndustrialesNavbar/industrialesnavbar.component';

@Component({
  selector: 'app-crear-equipo-industrial',
  standalone: true,
  imports: [CommonModule, UppercaseDirective, DialogModule, ButtonModule, FormsModule, DatePicker, ReactiveFormsModule, IndustrialesNavbarComponent],
  templateUrl: './crear-equipo-industrial.component.html',
  styleUrls: ['./crear-equipo-industrial.component.css']
})
export class CrearEquipoIndustrialComponent implements OnInit {

  tiposequipo: any[] | undefined;
  servicios: any[] | undefined;
  responsables: any[] | undefined;
  sedes: any[] | undefined;
  fechasMantenimiento: (Date | null)[] = [];
  fechasCalibracion: (Date | null)[] = [];

  modalAddFechasMantenimiento: boolean = false;
  modalAddFechasCalibracion: boolean = false;

  equipo: any;

  tipoEquipoServices = inject(TipoEquipoService);
  serviciosServices = inject(ServicioService);
  responsablesServices = inject(ResponsableService);
  sedesServices = inject(SedeService);
  EquiposService = inject(EquiposIndustrialesService);

  equipoForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
  ) {
    this.equipoForm = this.formBuilder.group({
      nombres: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      serie: ['', Validators.required],
      placa: ['', Validators.required],
      registroInvima: [''],
      riesgo: ['NA'],
      ubicacionEspecifica: ['', Validators.required],
      activo: [true],
      periodicidadM: [0, Validators.required],
      periodicidadC: [0, Validators.required],
      estadoBaja: [false],
      estado: ['Bueno'],
      calibracion: [false],
      calificacion: [false],
      validacion: [false],
      tipoEquipoIdFk: [null, Validators.required],
      servicioIdFk: [null, Validators.required],
      sedeIdFk: [null, Validators.required],
      responsableIdFk: [null, Validators.required]
    });
  }

  async ngOnInit() {
    try {
      this.tiposequipo = await this.tipoEquipoServices.getAllTiposEquipos();
      console.log('Tipos de equipo:', this.tiposequipo);

      this.servicios = await this.serviciosServices.getAllServicios();
      console.log('Servicios:', this.servicios);

      this.responsables = await this.responsablesServices.getAllResponsables();
      console.log('Responsables:', this.responsables);

      this.sedes = await this.sedesServices.getAllSedes();
      console.log('Sedes:', this.sedes);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Swal.fire({
        title: "Error",
        text: "Error al cargar los datos iniciales",
        icon: "error"
      });
    }
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
        ubicacionEspecifica: this.equipoForm.get('ubicacionEspecifica')?.value,
        activo: this.equipoForm.get('activo')?.value,
        periodicidadM: this.equipoForm.get('periodicidadM')?.value,
        periodicidadC: this.equipoForm.get('periodicidadC')?.value,
        estadoBaja: this.equipoForm.get('estadoBaja')?.value,
        estado: this.equipoForm.get('estado')?.value,
        calibracion: this.equipoForm.get('calibracion')?.value,
        calificacion: this.equipoForm.get('calificacion')?.value,
        validacion: this.equipoForm.get('validacion')?.value,
        tipoEquipoIdFk: this.equipoForm.get('tipoEquipoIdFk')?.value,
        servicioIdFk: this.equipoForm.get('servicioIdFk')?.value,
        sedeIdFk: this.equipoForm.get('sedeIdFk')?.value,
        responsableIdFk: this.equipoForm.get('responsableIdFk')?.value
      };

      // Si hay mantenimientos programados, abrir modal para fechas
      if (this.equipo.periodicidadM > 0) {
        await this.iniciarFechasMantenimiento();
      } else {
        // Si no hay mantenimientos, ir directo a calibraciones
        if (this.equipo.periodicidadC > 0) {
          this.iniciarFechasCalibracion();
        } else {
          // Si no hay ni mantenimientos ni calibraciones, guardar directamente
          await this.guardarEquipoConFechas();
        }
      }

    } else {
      Swal.fire({
        title: "Campos vacíos",
        text: "Debe diligenciar todos los campos obligatorios",
        icon: "warning"
      });
      this.equipoForm.markAllAsTouched();
    }
  }

  // Nuevo método para guardar el equipo con las fechas
  async guardarEquipoConFechas() {
    try {
      // Preparar datos para enviar al backend
      const equipoConFechas = {
        ...this.equipo,
        fechasMantenimiento: this.fechasMantenimiento.filter(f => f !== null),
        fechasCalibracion: this.fechasCalibracion.filter(f => f !== null)
      };

      console.log('Enviando equipo con fechas:', equipoConFechas);

      // Guardar en el backend
      const resultado = await this.EquiposService.addEquipo(equipoConFechas);

      console.log('Respuesta del backend:', resultado);

      Swal.fire({
        title: "Equipo Creado",
        text: `Equipo creado exitosamente${resultado.planesMantenimientoCreados > 0 ? ` con ${resultado.planesMantenimientoCreados} planes de mantenimiento` : ''}`,
        icon: "success",
        draggable: true,
        confirmButtonText: "Aceptar"
      }).then(() => {
        this.regresar();
      });

    } catch (error) {
      console.error('Error al guardar el equipo:', error);
      Swal.fire({
        title: "Error",
        text: "No se pudo guardar el equipo. Intente nuevamente.",
        icon: "error"
      });
    }
  }

  async iniciarFechasMantenimiento() {
    if (this.equipo.periodicidadM > 0) {
      const cantidad = this.equipo.periodicidadM;
      this.fechasMantenimiento = [];
      for (let i = 0; i < cantidad; i++) {
        this.fechasMantenimiento.push(null);
      }
      setTimeout(() => {
        this.viewModalFechasMantenimiento();
        console.log('Fechas Mantenimiento inicializadas:', this.fechasMantenimiento);
      }, 100); // Reducido de 1500 a 100ms
    } else {
      this.iniciarFechasCalibracion();
    }
  }

  iniciarFechasCalibracion() {
    if (this.equipo.periodicidadC > 0) {
      const cantidad = this.equipo.periodicidadC;
      this.fechasCalibracion = [];
      for (let i = 0; i < cantidad; i++) {
        this.fechasCalibracion.push(null);
      }
      setTimeout(() => {
        this.viewModalFechasCalibracion();
        console.log('Fechas Calibración inicializadas:', this.fechasCalibracion);
      }, 100); // Reducido de 500 a 100ms
    } else {
      // Si no hay calibraciones, guardar el equipo
      this.guardarEquipoConFechas();
    }
  }

  viewModalFechasMantenimiento() {
    this.modalAddFechasMantenimiento = true;
    console.log("Modal Mantenimiento abierto: " + this.modalAddFechasMantenimiento);
  }

  viewModalFechasCalibracion() {
    this.modalAddFechasCalibracion = true;
    console.log("Modal Calibración abierto: " + this.modalAddFechasCalibracion);
  }

  validarFechasMantenimiento() {
    const fechasCompletas = this.fechasMantenimiento.every(fecha => fecha !== null);

    if (!fechasCompletas) {
      Swal.fire({
        title: "Fechas incompletas",
        text: "Debe completar todas las fechas de mantenimiento",
        icon: "warning"
      });
      return;
    }

    console.log('Fechas de mantenimiento guardadas:', this.fechasMantenimiento);

    this.modalAddFechasMantenimiento = false;

    // Continuar con las fechas de calibración
    this.iniciarFechasCalibracion();
  }

  validarFechasCalibracion() {
    const fechasCompletas = this.fechasCalibracion.every(fecha => fecha !== null);

    if (!fechasCompletas) {
      Swal.fire({
        title: "Fechas incompletas",
        text: "Debe completar todas las fechas de calibración",
        icon: "warning"
      });
      return;
    }

    console.log('Fechas de calibración guardadas:', this.fechasCalibracion);

    this.modalAddFechasCalibracion = false;

    // Ahora sí, guardar el equipo con todas las fechas
    this.guardarEquipoConFechas();
  }

  // Este método ya no se usa, se reemplaza por guardarEquipoConFechas
  // pero lo dejo por si lo necesitas para referencia
  finalizarRegistro() {
    Swal.fire({
      title: "Registro Completo",
      text: "El equipo industrial ha sido registrado exitosamente",
      icon: "success",
      confirmButtonText: "Aceptar"
    }).then(() => {
      this.router.navigate(['/adminequipos']);
    });
  }

  regresar() {
    this.router.navigate(['/adminequipos']);
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }
}