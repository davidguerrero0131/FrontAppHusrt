import { ResponsableService } from './../../../../Services/appServices/biomedicaServices/responsable/responsable.service';
import { CommonModule } from '@angular/common';
import { Component, inject, model, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Router } from '@angular/router';
import { TipoEquipoService } from '../../../../Services/appServices/general/tipoEquipo/tipo-equipo.service';
import { ServicioService } from '../../../../Services/appServices/general/servicio/servicio.service';
import { SedeService } from '../../../../Services/appServices/general/sede/sede.service';
import { UppercaseDirective } from '../../../../Directives/uppercase.directive';
import Swal from 'sweetalert2';
import { platform } from 'os';
import e from 'express';
import { EquiposService } from '../../../../Services/appServices/biomedicaServices/equipos/equipos.service';
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-crear-equipo',
  imports: [CommonModule, UppercaseDirective, DialogModule, ButtonModule, FormsModule, DatePickerModule, ReactiveFormsModule],
  templateUrl: './crear-equipo.component.html',
  styleUrl: './crear-equipo.component.css'
})
export class CrearEquipoComponent implements OnInit {

  tiposequipo: any[] | undefined;
  servicios: any[] | undefined;
  responsables: any[] | undefined;
  sedes: any[] | undefined;
  fechasMantenimiento: (Date | null)[] = [null, null, null];

  modalAddFechasMantenimiento: boolean = false;
  modalAddFechasCalibracion: boolean = false;

  equipo: any;

  tipoEquipoServices = inject(TipoEquipoService);
  serviciosServices = inject(ServicioService);
  responsablesServices = inject(ResponsableService);
  sedesServices = inject(SedeService);
  equipoServices = inject(EquiposService);

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
      ubicacion: ['', Validators.required],
      ubicacionEspecifica: ['', Validators.required],
      activo: [true],
      periodicidadM: [0, Validators.required],
      periodicidadAM: [0, Validators.required],
      estadoBaja: [false],
      actividadMetrologica: [false],
      tipoEquipoIdFk: [null, Validators.required],
      servicioIdFk: [null, Validators.required],
      sedeIdFk: [null, Validators.required],
      responsableIdFk: [null, Validators.required]
    });
  }

  async ngOnInit() {
    try {

      this.tiposequipo = await this.tipoEquipoServices.getAllTiposEquipos();
      this.servicios = await this.serviciosServices.getAllServicios();
      this.responsables = await this.responsablesServices.getAllResponsables();
      this.sedes = await this.sedesServices.getAllSedes();
      this
    } catch (error) {

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
        sedeIdFk: this.equipoForm.get('sedeIdFk')?.value,
        responsableIdFk: this.equipoForm.get('responsableIdFk')?.value
      }
      // this.equipo = await this.equipoServices.addEquipo(this.equipo);
      this.iniciarFechasMantenimiento();

      Swal.fire({
        title: "Equipo Creado",
        icon: "success",
        draggable: true,
        showConfirmButton: false,
        timer: 1500

      });


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

  viewModalFechasMantenimiento() {
    this.modalAddFechasMantenimiento = true;
    console.log("Modal Mantenimiento: " + this.modalAddFechasMantenimiento);
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
        console.log(this.fechasMantenimiento);
      }, 1500);
    }
  }

  validarFechasMantenimiento() {

    this.fechasMantenimiento.forEach(fecha => {
      console.log(fecha);
    });

    this.modalAddFechasMantenimiento = false;
  }

  trackByIndex(index: number, item: any): number {
  return index;
}
}
