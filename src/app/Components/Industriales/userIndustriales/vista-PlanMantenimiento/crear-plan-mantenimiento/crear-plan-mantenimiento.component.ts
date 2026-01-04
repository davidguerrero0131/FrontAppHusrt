import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PlanMantenimientoIndustrialesService } from '../../../../../Services/appServices/industrialesServices/planMantenimiento/planMantenimientoIndustriales.service';
import { EquiposIndustrialesService } from '../../../../../Services/appServices/industrialesServices/equipos/equiposIndustriales.service';

@Component({
  selector: 'app-crear-plan-mantenimiento',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './crear-plan-mantenimiento.component.html',
  styleUrls: ['./crear-plan-mantenimiento.component.css']
})
export class CrearPlanMantenimientoComponent implements OnInit {

  equipos: any[] = [];
  meses = [
    { valor: 1, nombre: 'Enero' },
    { valor: 2, nombre: 'Febrero' },
    { valor: 3, nombre: 'Marzo' },
    { valor: 4, nombre: 'Abril' },
    { valor: 5, nombre: 'Mayo' },
    { valor: 6, nombre: 'Junio' },
    { valor: 7, nombre: 'Julio' },
    { valor: 8, nombre: 'Agosto' },
    { valor: 9, nombre: 'Septiembre' },
    { valor: 10, nombre: 'Octubre' },
    { valor: 11, nombre: 'Noviembre' },
    { valor: 12, nombre: 'Diciembre' }
  ];

  planMantenimientoService = inject(PlanMantenimientoIndustrialesService);
  equiposService = inject(EquiposIndustrialesService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  planForm: FormGroup;

  constructor() {
    this.planForm = this.formBuilder.group({
      idEquipo: [null, Validators.required],
      mes: [null, Validators.required],
      ano: [new Date().getFullYear(), Validators.required],
      rangoDeInicio: [1, [Validators.required, Validators.min(1), Validators.max(31)]],
      rangoDeFin: [31, [Validators.required, Validators.min(1), Validators.max(31)]],
      estado: [true]
    });
  }

  async ngOnInit() {
    try {
      this.equipos = await this.equiposService.getAllEquipos();
    } catch (error) {
      console.error('Error al cargar equipos:', error);
      Swal.fire({
        title: "Error",
        text: "Error al cargar la lista de equipos",
        icon: "error"
      });
    }
  }

  async guardar() {
  if (this.planForm.valid) {
    const rangoInicio = this.planForm.get('rangoDeInicio')?.value;
    const rangoFin = this.planForm.get('rangoDeFin')?.value;

    if (rangoInicio > rangoFin) {
      Swal.fire({
        title: "Rango inválido",
        text: "El día de inicio no puede ser mayor al día de fin",
        icon: "warning"
      });
      return;
    }

    const plan = {
      idEquipo: parseInt(this.planForm.get('idEquipo')?.value), // ✅ Convertir a número
      mes: parseInt(this.planForm.get('mes')?.value),           // ✅ Convertir a número
      ano: parseInt(this.planForm.get('ano')?.value),           // ✅ Convertir a número
      rangoDeInicio: parseInt(rangoInicio),                     // ✅ Convertir a número
      rangoDeFin: parseInt(rangoFin),                           // ✅ Convertir a número
      estado: this.planForm.get('estado')?.value
    };

    console.log('Plan a enviar:', plan); // Para debug

    try {
      await this.planMantenimientoService.addPlan(plan);
      
      Swal.fire({
        title: "Plan Creado",
        text: "El plan de mantenimiento ha sido creado exitosamente",
        icon: "success",
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        this.regresar();
      });
    } catch (error) {
      console.error('Error al guardar:', error);
      Swal.fire({
        title: "Error",
        text: "No se pudo crear el plan de mantenimiento",
        icon: "error"
      });
    }
  } else {
    Swal.fire({
      title: "Campos incompletos",
      text: "Debe completar todos los campos obligatorios",
      icon: "warning"
    });
    this.planForm.markAllAsTouched();
  }
  }

  regresar() {
    this.router.navigate(['/industriales/gestion-plan-mantenimiento']);
  }

  getAnosDisponibles(): number[] {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 1; i <= currentYear + 2; i++) {
      years.push(i);
    }
    return years;
  }
}