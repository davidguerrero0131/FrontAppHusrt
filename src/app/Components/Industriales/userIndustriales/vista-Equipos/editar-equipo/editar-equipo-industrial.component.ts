import { ResponsableService } from '../../../../../Services/appServices/industrialesServices/responsable/responsable.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TipoEquipoService } from '../../../../../Services/appServices/general/tipoEquipo/tipo-equipo.service';
import { ServicioService } from '../../../../../Services/appServices/general/servicio/servicio.service';
import { SedeService } from '../../../../../Services/appServices/general/sede/sede.service';
import { UppercaseDirective } from '../../../../../Directives/uppercase.directive';
import Swal from 'sweetalert2';
import { EquiposIndustrialesService } from '../../../../../Services/appServices/industrialesServices/equipos/equiposIndustriales.service';

@Component({
  selector: 'app-editar-equipo-industrial',
  standalone: true,
  imports: [CommonModule, UppercaseDirective, FormsModule, ReactiveFormsModule],
  templateUrl: './editar-equipo-industrial.component.html',
  styleUrls: ['./editar-equipo-industrial.component.css']
})
export class EditarEquipoIndustrialComponent implements OnInit {

  tiposequipo: any[] | undefined;
  servicios: any[] | undefined;
  responsables: any[] | undefined;
  sedes: any[] | undefined;
  equipoId: number | null = null;
  loading: boolean = true;

  tipoEquipoServices = inject(TipoEquipoService);
  serviciosServices = inject(ServicioService);
  responsablesServices = inject(ResponsableService);
  sedesServices = inject(SedeService);
  equiposService = inject(EquiposIndustrialesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  equipoForm: FormGroup;

  constructor() {
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
      estado: ['Operativo'],
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
      // Obtener el ID del equipo de la URL
      const id = this.route.snapshot.params['id'];
      this.equipoId = parseInt(id);

      // Cargar datos de los selectores
      this.tiposequipo = await this.tipoEquipoServices.getAllTiposEquipos();
      this.servicios = await this.serviciosServices.getAllServicios();
      this.responsables = await this.responsablesServices.getAllResponsables();
      this.sedes = await this.sedesServices.getAllSedes();

      // Cargar datos del equipo
      const equipo = await this.equiposService.getEquipoById(this.equipoId);
      
      if (equipo) {
        // Llenar el formulario con los datos del equipo
        this.equipoForm.patchValue({
          nombres: equipo.nombres,
          marca: equipo.marca,
          modelo: equipo.modelo,
          serie: equipo.serie,
          placa: equipo.placa,
          registroInvima: equipo.registroInvima,
          riesgo: equipo.riesgo,
          ubicacionEspecifica: equipo.ubicacionEspecifica,
          activo: equipo.activo,
          periodicidadM: equipo.periodicidadM,
          periodicidadC: equipo.periodicidadC,
          estadoBaja: equipo.estadoBaja,
          estado: equipo.estado,
          calibracion: equipo.calibracion,
          calificacion: equipo.calificacion,
          validacion: equipo.validacion,
          tipoEquipoIdFk: equipo.tipoEquipoIdFk,
          servicioIdFk: equipo.servicioIdFk,
          sedeIdFk: equipo.sedeIdFk,
          responsableIdFk: equipo.responsableIdFk
        });
      }

      this.loading = false;
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.loading = false;
      Swal.fire({
        title: "Error",
        text: "Error al cargar los datos del equipo",
        icon: "error"
      }).then(() => {
        this.regresar();
      });
    }
  }

  async actualizar() {
    if (this.equipoForm.valid && this.equipoId) {
      const equipoActualizado = {
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

      try {
        await this.equiposService.updateEquipo(this.equipoId, equipoActualizado);
        
        Swal.fire({
          title: "Equipo Actualizado",
          text: "El equipo industrial ha sido actualizado exitosamente",
          icon: "success",
          draggable: true,
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.regresar();
        });
      } catch (error) {
        console.error('Error al actualizar:', error);
        Swal.fire({
          title: "Error",
          text: "No fue posible actualizar el equipo",
          icon: "error"
        });
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

  regresar() {
    this.router.navigate(['/industriales/gestion-equipos']);
  }
}