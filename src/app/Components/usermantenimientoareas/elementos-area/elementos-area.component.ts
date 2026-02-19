
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MantenimientoadminnavbarComponent } from '../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import { AreaElementoService } from '../../../Services/appServices/areasFisicas/area-elemento.service';
import { AreasService } from '../../../Services/appServices/areasFisicas/areas.service';

@Component({
  selector: 'app-elementos-area',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule, MantenimientoadminnavbarComponent],
  templateUrl: './elementos-area.component.html',
  styleUrl: './elementos-area.component.css'
})
export class ElementosAreaComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private areasService = inject(AreasService);
  private areaElementoService = inject(AreaElementoService);

  areaId: number = 0;
  elementos: any[] = [];
  areaNombre: string = '';
  servicioId: number = 0;

  ngOnInit() {
    this.route.params.subscribe(async params => {
      this.areaId = +params['id'];
      await this.loadElementos();
    });
  }

  async loadElementos() {
    try {
      // Get Area Info
      const area: any = await this.areasService.getAreaById(this.areaId);
      this.areaNombre = area.nombre;
      this.servicioId = area.servicioIdFk;

      // Get Attributes/Elements by Area
      const asignaciones: any[] = await this.areaElementoService.getElementosByArea(this.areaId);

      // Map assignments to extract element details
      // Verification of structure needed: asignacion.elemento -> object with name, etc.
      // Based on previous file read, assigned elements seem to have 'elemento' property
      this.elementos = asignaciones.map((a: any) => a.elemento);

    } catch (error) {
      console.error("Error loading elements", error);
    }
  }

  backToDashboard() {
    this.router.navigate(['/adminmantenimiento/areas-por-servicio', this.servicioId]);
  }
}

