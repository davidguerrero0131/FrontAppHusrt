import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { PlanMantenimientoIndustrialesService } from '../../../../../Services/appServices/industrialesServices/planMantenimiento/planMantenimientoIndustriales.service';
import { EquiposIndustrialesService } from '../../../../../Services/appServices/industrialesServices/equipos/equiposIndustriales.service';
import { IndustrialesNavbarComponent } from '../../../../navbars/IndustrialesNavbar/industrialesnavbar.component';


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
  private route = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);

  planForm: FormGroup;

  constructor() {
    this.planForm = this.formBuilder.group({
      idEquipo: [null, Validators.required],
      periodicidad: [1, Validators.required], // Default Monthly
      mes: [null, Validators.required],
      ano: [new Date().getFullYear(), Validators.required],
      rangoDeInicio: [1, [Validators.required, Validators.min(1), Validators.max(31)]],
      rangoDeFin: [31, [Validators.required, Validators.min(1), Validators.max(31)]],
      estado: [false]
    });
  }

  async ngOnInit() {
    try {
      this.equipos = await this.equiposService.getAllEquipos();

      // Check for query params to pre-select equipment
      this.route.queryParams.subscribe(params => {
        if (params['idEquipo']) {
          this.planForm.patchValue({ idEquipo: parseInt(params['idEquipo']) });
        }
      });

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
      const idEquipo = parseInt(this.planForm.get('idEquipo')?.value);
      const periodicidad = parseInt(this.planForm.get('periodicidad')?.value);
      let mesInicio = parseInt(this.planForm.get('mes')?.value);
      let anoInicio = parseInt(this.planForm.get('ano')?.value);
      const estado = this.planForm.get('estado')?.value;

      if (rangoInicio > rangoFin) {
        Swal.fire({
          title: "Rango inválido",
          text: "El día de inicio no puede ser mayor al día de fin",
          icon: "warning"
        });
        return;
      }

      // Logic to schedule for the next 2 years (24 months coverage)
      // Logic: Start from selected month/year.
      // Advance by 'periodicidad' months until we cover 2 years from start date.

      // Calculate end date (2 years from start)
      const startDate = new Date(anoInicio, mesInicio - 1, 1);
      const endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 2);

      let currentDate = new Date(startDate);
      let plansCreated = 0;
      let errors = 0;

      Swal.fire({
        title: 'Generando planes...',
        html: 'Espere mientras se generan los mantenimientos programados.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        while (currentDate < endDate) {
          const mesActual = currentDate.getMonth() + 1; // 1-12
          const anoActual = currentDate.getFullYear();

          const plan = {
            idEquipo: idEquipo,
            mes: mesActual,
            ano: anoActual,
            rangoDeInicio: parseInt(rangoInicio),
            rangoDeFin: parseInt(rangoFin),
            estado: estado
          };

          await this.planMantenimientoService.addPlan(plan);
          plansCreated++;

          // Advance date
          currentDate.setMonth(currentDate.getMonth() + periodicidad);
        }

        Swal.close();

        Swal.fire({
          title: "Planes Creados",
          text: `Se han programado ${plansCreated} mantenimientos exitosamente para los próximos 2 años.`,
          icon: "success",
          showConfirmButton: true
        }).then(() => {
          this.regresar();
        });

      } catch (error) {
        console.error('Error al guardar ciclo:', error);
        Swal.fire({
          title: "Error Parcial",
          text: `Se crearon ${plansCreated} planes, pero ocurrió un error. Verifique la programación.`,
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
    this.router.navigate(['/industriales/gestion-mantenimientos']);
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