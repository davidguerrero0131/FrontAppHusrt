import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { PlanMantenimientoIndustrialesService } from '../../../../../Services/appServices/industrialesServices/planMantenimiento/planMantenimientoIndustriales.service';
import { IndustrialesNavbarComponent } from '../../../../navbars/IndustrialesNavbar/industrialesnavbar.component';


@Component({
  selector: 'app-detalle-plan-mantenimiento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-plan-mantenimiento.component.html',
  styleUrls: ['./detalle-plan-mantenimiento.component.css']
})
export class DetallePlanMantenimientoComponent implements OnInit {

  plan: any = null;
  planId: number | null = null;
  loading: boolean = true;

  planMantenimientoService = inject(PlanMantenimientoIndustrialesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  async ngOnInit() {
    try {
      const id = this.route.snapshot.params['id'];
      this.planId = parseInt(id);

      this.plan = await this.planMantenimientoService.getPlanById(this.planId);

      if (!this.plan) {
        throw new Error('Plan no encontrado');
      }

      this.loading = false;
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.loading = false;
      Swal.fire({
        title: "Error",
        text: "Error al cargar los datos del plan de mantenimiento",
        icon: "error"
      }).then(() => {
        this.regresar();
      });
    }
  }

  editarPlan() {
    if (this.planId) {
      this.router.navigate(['/industriales/editar-plan-mantenimiento', this.planId]);
    }
  }

  regresar() {
    this.router.navigate(['/industriales/gestion-mantenimientos']);
  }

  obtenerNombreMes(numeroMes: number): string {
    const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return meses[numeroMes - 1] || '';
  }

  getEstadoColor(estado: boolean): string {
    return estado ? 'success' : 'danger';
  }
}