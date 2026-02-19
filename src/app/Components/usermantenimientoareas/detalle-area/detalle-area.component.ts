import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MantenimientoadminnavbarComponent } from '../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import { AreasService } from '../../../Services/appServices/areasFisicas/areas.service';

@Component({
  selector: 'app-detalle-area',
  standalone: true,
  imports: [CommonModule, ButtonModule, MantenimientoadminnavbarComponent],
  templateUrl: './detalle-area.component.html',
  styleUrl: './detalle-area.component.css'
})
export class DetalleAreaComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private areasService = inject(AreasService);

  areaId: number = 0;
  areaSeleccionada: any = null;

  ngOnInit() {
    this.route.params.subscribe(async params => {
      this.areaId = +params['id'];
      await this.loadArea();
    });
  }

  async loadArea() {
    try {
      const area: any = await this.areasService.getAreaById(this.areaId);
      this.areaSeleccionada = area;
    } catch (error) {
      console.error("Error loading area", error);
    }
  }

  backToAreas() {
    // Navigate back to the service detail page. We need the service ID from the area.
    // Assuming area object has service information or 'servicios' relation.
    // If not directly available in 'areaSeleccionada.servicioId', we might need to rely on 'areaSeleccionada.servicios.id' based on the backend structure.

    if (this.areaSeleccionada && this.areaSeleccionada.servicios) {
      this.router.navigate(['/adminmantenimiento/areas-por-servicio', this.areaSeleccionada.servicios.id]);
    } else {
      // Fallback if service ID is not easily accessible, maybe go back to full service list or history.back()
      window.history.back();
    }
  }

  viewMantenimientos() {
    this.router.navigate(['/adminmantenimiento/mantenimientos-area', this.areaId]);
  }

  viewInspecciones() {
    this.router.navigate(['/adminmantenimiento/inspecciones-area', this.areaId]);
  }

  viewElementos() {
    this.router.navigate(['/adminmantenimiento/elementos-area', this.areaId]);
  }
}
