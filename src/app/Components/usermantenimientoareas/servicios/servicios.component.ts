import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MantenimientoadminnavbarComponent } from '../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import { getDecodedAccessToken } from '../../../utilidades';
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
  private route = inject(ActivatedRoute);
  private areasService = inject(AreasService);
  private servicioService = inject(ServicioService);

  searchText: string = '';
  servicios: any[] = [];
  cantidadesEquipos: { [key: number]: number } = {};

  async ngOnInit() {
    try {
      const response: any = await this.servicioService.getAllServicios();
      this.servicios = response;

      // Calculate areas count for each service more efficiently
      const countsPromises = this.servicios.map(async (servicio) => {
        try {
          const areas: any[] = await this.areasService.getAreasByServicio(servicio.id);
          // If the backend returns {err: ...} it won't be an array
          const count = Array.isArray(areas) ? areas.length : 0;
          return { id: servicio.id, count };
        } catch (err) {
          console.warn(`Error loading areas for service ${servicio.id}`, err);
          return { id: servicio.id, count: 0 };
        }
      });

      const results = await Promise.all(countsPromises);
      const newCounts = { ...this.cantidadesEquipos };
      results.forEach(res => {
        newCounts[res.id] = res.count;
      });
      this.cantidadesEquipos = newCounts;

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

  location = inject(Location);

  backToDashboard() {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
    } else {
      const tokenData = getDecodedAccessToken();
      if (tokenData.rol === 'ADMINMANTENIMIENTO' || tokenData.rol === 'USERMANTENIMIENTO' || tokenData.rol === 'SUPERADMIN') {
        this.router.navigate(['/adminmantenimiento']);
      } else {
        this.router.navigate(['/adminmantenimiento/gestion-operativa']);
      }
    }
  }

  viewEquiposTipos(id: number) {
    console.log("Ver detalle del servicio:", id);
    this.router.navigate(['/adminmantenimiento/areas-por-servicio', id], { queryParams: { returnUrl: this.router.url } });
  }
}
