import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { EquiposIndustrialesService } from '../../../../../Services/appServices/industrialesServices/equipos/equiposIndustriales.service';
import { IndustrialesNavbarComponent } from '../../../../navbars/IndustrialesNavbar/industrialesnavbar.component';

@Component({
  selector: 'app-detalle-equipo-industrial',
  standalone: true,
  imports: [CommonModule, IndustrialesNavbarComponent],
  templateUrl: './detalle-equipo-industrial.component.html',
  styleUrls: ['./detalle-equipo-industrial.component.css']
})
export class DetalleEquipoIndustrialComponent implements OnInit {

  equipo: any = null;
  equipoId: number | null = null;
  loading: boolean = true;

  equiposService = inject(EquiposIndustrialesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() { }

  async ngOnInit() {
    try {
      // Obtener el ID del equipo de la URL
      const id = this.route.snapshot.params['id'];
      this.equipoId = parseInt(id);

      // Cargar datos del equipo
      this.equipo = await this.equiposService.getEquipoById(this.equipoId);

      if (!this.equipo) {
        throw new Error('Equipo no encontrado');
      }

      this.loading = false;
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.loading = false;
      Swal.fire({
        title: "Error",
        text: "Error al cargar los datos del equipo",
        icon: "error"
      }).then(() => {
        this.regresar();
      });
    }
  }

  editarEquipo() {
    if (this.equipoId) {
      this.router.navigate(['/editar-equipo-industrial', this.equipoId]);
    }
  }

  regresar() {
    console.log('Ejecutando regresar...');
    this.router.navigate(['/adminequipos']);
  }


  getRiesgoColor(riesgo: string): string {
    switch (riesgo) {
      case 'III': return 'danger';
      case 'IIB': return 'warning';
      case 'IIA': return 'info';
      case 'I': return 'success';
      default: return 'secondary';
    }
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'Operativo': return 'success';
      case 'En Mantenimiento': return 'warning';
      case 'Fuera De Servicio': return 'danger';
      default: return 'secondary';
    }
  }
}