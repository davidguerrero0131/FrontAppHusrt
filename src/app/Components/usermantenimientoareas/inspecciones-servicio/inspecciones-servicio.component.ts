
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MantenimientoadminnavbarComponent } from '../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import { InspeccionService } from '../../../Services/appServices/areasFisicas/inspeccion.service';
import { AreasService } from '../../../Services/appServices/areasFisicas/areas.service';

@Component({
  selector: 'app-inspecciones-servicio',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule, MantenimientoadminnavbarComponent],
  templateUrl: './inspecciones-servicio.component.html',
  styleUrl: './inspecciones-servicio.component.css'
})
export class InspeccionesServicioComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private inspeccionService = inject(InspeccionService);
  private areasService = inject(AreasService);

  serviceId: number = 0;
  inspecciones: any[] = [];

  ngOnInit() {
    this.route.params.subscribe(async params => {
      this.serviceId = +params['id'];
      await this.loadInspecciones();
    });
  }

  async loadInspecciones() {
    try {
      const areas: any[] = await this.areasService.getAreasByServicio(this.serviceId);
      const areaIds = areas.map(a => a.id);

      const allInspecciones = await this.inspeccionService.getAllInspecciones();

      // Filter inspections that belong to one of the service's areas
      // Assuming inspection has 'areaId' or 'area' object with id
      this.inspecciones = allInspecciones.filter(ins => areaIds.includes(ins.areaId || ins.area?.id));

    } catch (error) {
      console.error("Error loading inspections", error);
    }
  }

  backToDashboard() {
    this.router.navigate(['/adminmantenimiento/detalle-servicio', this.serviceId]);
  }
}

