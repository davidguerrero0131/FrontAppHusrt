import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MantenimientoadminnavbarComponent } from '../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import { PlanMantenimientoService } from '../../../Services/appServices/areasFisicas/plan-mantenimiento.service';
import { AreasService } from '../../../Services/appServices/areasFisicas/areas.service';

@Component({
  selector: 'app-mantenimientos-servicio',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule, MantenimientoadminnavbarComponent],
  templateUrl: './mantenimientos-servicio.component.html',
  styleUrl: './mantenimientos-servicio.component.css'
})
export class MantenimientosServicioComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private planService = inject(PlanMantenimientoService);
  private areasService = inject(AreasService);

  serviceId: number = 0;
  mantenimientos: any[] = [];

  ngOnInit() {
    this.route.params.subscribe(async params => {
      this.serviceId = +params['id'];
      await this.loadMantenimientos();
    });
  }

  async loadMantenimientos() {
    try {
      // Strategy: Get Areas for Service, then get plans for those areas (or filter all plans)
      // If backend doesn't support getPlansByServicio, we might need to iterate areas.
      // Method 1: Get all plans and filter (might be heavy if many plans)
      // Method 2: Get areas of service, then for each area get plans (many requests)

      // Trying Method 1 first as it's simpler if dataset isn't huge, or Method 2 if Method 1 is too broad.
      // However, PlanMantenimientoService has getPlanesByArea.

      const areas: any[] = await this.areasService.getAreasByServicio(this.serviceId);

      if (areas && areas.length > 0) {
        const planesPromises = areas.map(area => this.planService.getPlanesByArea(area.id));
        const results = await Promise.all(planesPromises);
        // results is array of arrays
        this.mantenimientos = results.flat();
      } else {
        this.mantenimientos = [];
      }

    } catch (error) {
      console.error("Error loading maintenances", error);
    }
  }

  backToDashboard() {
    this.router.navigate(['/adminmantenimiento/detalle-servicio', this.serviceId]);
  }
}
