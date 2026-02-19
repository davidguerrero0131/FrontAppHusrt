import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MantenimientoadminnavbarComponent } from '../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import { ServicioService } from '../../../Services/appServices/general/servicio/servicio.service';

@Component({
  selector: 'app-detalle-servicio',
  standalone: true,
  imports: [CommonModule, ButtonModule, MantenimientoadminnavbarComponent],
  templateUrl: './detalle-servicio.component.html',
  styleUrl: './detalle-servicio.component.css'
})
export class DetalleServicioComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private servicioService = inject(ServicioService);

  serviceId: number = 0;
  servicioSeleccionado: any = null;

  ngOnInit() {
    this.route.params.subscribe(async params => {
      this.serviceId = +params['id'];
      await this.loadServicio();
    });
  }

  async loadServicio() {
    try {
      const response: any = await this.servicioService.getServicio(this.serviceId);
      this.servicioSeleccionado = response;
    } catch (error) {
      console.error("Error al cargar servicio", error);
    }
  }

  backToDashboard() {
    this.router.navigate(['/adminmantenimiento/servicios']);
  }

  viewAreas() {
    this.router.navigate(['/adminmantenimiento/areas-por-servicio', this.serviceId]);
  }

  viewMantenimientos() {
    this.router.navigate(['/adminmantenimiento/mantenimientos-servicio', this.serviceId]);
  }

  viewInspecciones() {
    this.router.navigate(['/adminmantenimiento/inspecciones-servicio', this.serviceId]);
  }
}
