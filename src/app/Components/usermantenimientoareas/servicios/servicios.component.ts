import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MantenimientoadminnavbarComponent } from '../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import { ServicioService } from '../../../Services/appServices/general/servicio/servicio.service';
import { AreasService } from '../../../Services/appServices/areasFisicas/areas.service';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextModule, FormsModule, MantenimientoadminnavbarComponent],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
})
export class ServiciosComponent implements OnInit {
  private router = inject(Router);
  private areasService = inject(AreasService);
  private servicioService = inject(ServicioService);

  searchText: string = '';
  servicios: any[] = [];
  cantidadesEquipos: { [key: number]: number } = {};

  async ngOnInit() {
    try {
      const response: any = await this.servicioService.getAllServicios();
      this.servicios = response;

      // Calculate areas count for each service
      for (let servicio of this.servicios) {
        try {
          const areas: any[] = await this.areasService.getAreasByServicio(servicio.id);
          this.cantidadesEquipos[servicio.id] = areas ? areas.length : 0;
        } catch (err) {
          console.warn(`Error loading areas for service ${servicio.id}`, err);
          this.cantidadesEquipos[servicio.id] = 0;
        }
      }

    } catch (error) {
      console.error('Error loading services', error);
    }
  }

  filteredTiposEquipos() {
    if (!this.searchText) {
      return this.servicios;
    }
    return this.servicios.filter(s => s.nombres.toLowerCase().includes(this.searchText.toLowerCase()));
  }

  backToDashboard() {
    this.router.navigate(['/adminmantenimiento/inventario']);
  }

  viewEquiposTipos(id: number) {
    console.log("Ver detalle del servicio:", id);
    this.router.navigate(['/adminmantenimiento/areas-por-servicio', id]);
  }
}
