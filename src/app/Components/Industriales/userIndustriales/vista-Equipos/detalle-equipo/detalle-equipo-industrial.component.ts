import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { EquiposIndustrialesService } from '../../../../../Services/appServices/industrialesServices/equipos/equiposIndustriales.service';

import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip'; // Import TooltipModule
import { obtenerNombreMes } from '../../../../../utilidades';
import { IndustrialesNavbarComponent } from '../../../../navbars/IndustrialesNavbar/industrialesnavbar.component';

import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-detalle-equipo-industrial',
  standalone: true,
  imports: [CommonModule, AccordionModule, CardModule, DividerModule, TableModule, ButtonModule, TooltipModule],
  templateUrl: './detalle-equipo-industrial.component.html',
  styleUrls: ['./detalle-equipo-industrial.component.css']
})
export class DetalleEquipoIndustrialComponent implements OnInit {

  equipo: any = null;
  historial: any[] = [];
  equipoId: number | null = null;
  loading: boolean = true;
  userRole: string = '';

  equiposService = inject(EquiposIndustrialesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() { }

  async ngOnInit() {
    this.loadUserRole();
    try {
      // Obtener el ID del equipo de la URL
      const id = this.route.snapshot.params['id'];
      this.equipoId = parseInt(id);

      // Cargar datos del equipo
      this.equipo = await this.equiposService.getEquipoById(this.equipoId);

      // Cargar historial
      this.historial = await this.equiposService.getHistorial(this.equipoId);

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

  loadUserRole() {
    const token = sessionStorage.getItem('utoken');
    if (token) {
      const decoded: any = this.getDecodedAccessToken(token);
      this.userRole = decoded ? decoded.rol : '';

      // Normalization for Role IDs and Names
      const rawRole = String(this.userRole);

      if (rawRole === '8' || rawRole === 'INDUSTRIALESADMIN' || rawRole === '1' || rawRole === 'SUPERADMIN' || rawRole === '2' || rawRole === 'SYSTEMADMIN') {
        this.userRole = 'INDUSTRIALESADMIN';
      } else if (rawRole === '9' || rawRole === 'INDUSTRIALESTECNICO' || rawRole === '7' || rawRole === 'BIOMEDICATECNICO') {
        this.userRole = 'INDUSTRIALESTECNICO';
      } else if (rawRole === '10' || rawRole === 'INDUSTRIALESUSER' || rawRole === '5' || rawRole === 'SYSTEMUSER' || rawRole === '6' || rawRole === 'BIOMEDICAUSER') {
        this.userRole = 'INDUSTRIALESUSER';
      } else {
        this.userRole = rawRole;
      }
    }
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }

  editarEquipo() {
    if (this.equipoId) {
      this.router.navigate(['/editar-equipo-industrial', this.equipoId]);
    }
  }

  regresar() {
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

  getNombreMes(mes: number): string {
    return obtenerNombreMes(mes);
  }

  datosTecnicosKeys(): string[] {
    return this.equipo?.hojaDeVida?.datosTecnicos
      ? Object.keys(this.equipo.hojaDeVida.datosTecnicos).filter(k => !['id', 'equipoIndustrialIdFk', 'createdAt', 'updatedAt'].includes(k))
      : [];
  }
}