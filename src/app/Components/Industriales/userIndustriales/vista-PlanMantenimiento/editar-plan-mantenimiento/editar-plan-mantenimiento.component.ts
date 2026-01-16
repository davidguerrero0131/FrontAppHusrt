import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { PlanMantenimientoIndustrialesService } from '../../../../../Services/appServices/industrialesServices/planMantenimiento/planMantenimientoIndustriales.service';
import { EquiposIndustrialesService } from '../../../../../Services/appServices/industrialesServices/equipos/equiposIndustriales.service';
import { IndustrialesNavbarComponent } from '../../../../navbars/IndustrialesNavbar/industrialesnavbar.component';

@Component({
  selector: 'app-editar-plan-mantenimiento',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IndustrialesNavbarComponent],
  templateUrl: './editar-plan-mantenimiento.component.html',
  styleUrls: ['./editar-plan-mantenimiento.component.css']
})
export class EditarPlanMantenimientoComponent implements OnInit {

  equipos: any[] = [];
  planId: number | null = null;
  loading: boolean = true;

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
  private route = inject(ActivatedRoute);
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
      const id = this.route.snapshot.params['id'];
      this.planId = parseInt(id);

      this.equipos = await this.equiposService.getAllEquipos();
      const plan = await this.planMantenimientoService.getPlanById(this.planId);

      if (plan) {
        this.planForm.patchValue({
          idEquipo: plan.idEquipo,
          mes: plan.mes,
          ano: plan.ano,
          rangoDeInicio: plan.rangoDeInicio,
          rangoDeFin: plan.rangoDeFin,
          estado: plan.estado
        });
      }

      this.loading = false;
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.loading = false;
      Swal.fire({
        title: "Error",
        text: "Error al cargar los datos del plan",
        icon: "error"
      }).then(() => {
        this.regresar();
      });
    }
  }

  async actualizar() {
    if (this.planForm.valid && this.planId) {
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
        idEquipo: this.planForm.get('idEquipo')?.value,
        mes: this.planForm.get('mes')?.value,
        ano: this.planForm.get('ano')?.value,
        rangoDeInicio: rangoInicio,
        rangoDeFin: rangoFin,
        estado: this.planForm.get('estado')?.value
      };

      try {
        await this.planMantenimientoService.updatePlan(this.planId, plan);

        Swal.fire({
          title: "Plan Actualizado",
          text: "El plan de mantenimiento ha sido actualizado exitosamente",
          icon: "success",
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.regresar();
        });
      } catch (error) {
        console.error('Error al actualizar:', error);
        Swal.fire({
          title: "Error",
          text: "No se pudo actualizar el plan de mantenimiento",
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