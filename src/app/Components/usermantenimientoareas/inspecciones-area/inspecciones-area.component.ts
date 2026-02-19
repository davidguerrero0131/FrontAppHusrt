import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MantenimientoadminnavbarComponent } from '../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import { InspeccionService } from '../../../Services/appServices/areasFisicas/inspeccion.service';
import { AreasService } from '../../../Services/appServices/areasFisicas/areas.service';

@Component({
  selector: 'app-inspecciones-area',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, MantenimientoadminnavbarComponent],
  templateUrl: './inspecciones-area.component.html',
  styleUrl: './inspecciones-area.component.css'
})
export class InspeccionesAreaComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private inspeccionService = inject(InspeccionService);
  private areasService = inject(AreasService);

  areaId: number = 0;
  inspecciones: any[] = [];
  areaNombre: string = '';
  servicioId: number = 0;

  ngOnInit() {
    this.route.params.subscribe(async params => {
      this.areaId = +params['id'];
      await this.loadData();
    });
  }

  async loadData() {
    try {
      const area: any = await this.areasService.getAreaById(this.areaId);
      this.areaNombre = area.nombre;
      this.servicioId = area.servicioIdFk;

      // Retrieve all inspections
      const response: any = await this.inspeccionService.getAllInspecciones();


      let allInspecciones: any[] = [];
      if (Array.isArray(response)) {
        allInspecciones = response;
      } else if (response && Array.isArray(response.data)) {
        allInspecciones = response.data;
      } else {
        console.warn('La respuesta de inspecciones no es un array:', response);
      }

      // Filter by areaId (handle string/number mismatch)
      this.inspecciones = allInspecciones.filter((ins: any) => {
        const insAreaId = ins.areaId || (ins.area ? ins.area.id : null);
        return insAreaId == this.areaId;
      });



    } catch (error) {
      console.error("Error loading inspections", error);
    }
  }

  backToDashboard() {
    this.router.navigate(['/adminmantenimiento/areas-por-servicio', this.servicioId]);
  }
}
