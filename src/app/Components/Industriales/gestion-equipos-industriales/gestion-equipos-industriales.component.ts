import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';

import { IndustrialesNavbarComponent  } from '../../navbars/IndustrialesNavbar/industrialesnavbar.component';
import { EquiposIndustrialesService } from '../../../Services/appServices/industrialesServices/equipos/equiposIndustriales.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestion-equipos-industriales',
  standalone: true,
  imports: [
    IndustrialesNavbarComponent , 
    TableModule, 
    CommonModule
  ],
  providers: [MessageService],
  templateUrl: './gestion-equipos-industriales.component.html',
  styleUrls: ['./gestion-equipos-industriales.component.css']
})
export class GestionEquiposIndustrialesComponent implements OnInit {
  
  equipos!: any[];
  loading: boolean = true;
  activityValues: number[] = [0, 100];

  constructor(
    private router: Router,
    private equiposService: EquiposIndustrialesService,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
    try {
      this.equipos = await this.equiposService.getAllEquiposTodos();
      this.loading = false;

    } catch (error) {
      this.loading = false;
      Swal.fire({
        icon: 'warning',
        title: 'Inconsistencia en los datos',
        text: 'No fue posible cargar la información de los equipos industriales'
      });
    }
  }

  showRegisterForm() {
    // Ajusta la ruta según tu configuración de routing
    this.router.navigate(['/Industriales/nuevoequipoindustrial']);
  }

  verDetalle(idEquipo: any) {
    // Navegar a la vista de detalle del equipo
    this.router.navigate(['/detalle-equipo-industrial', idEquipo]);
  }

  editarEquipo(idEquipo: any) {
    // Navegar a la vista de edición del equipo
    this.router.navigate(['/editar-equipo-industrial', idEquipo]);
  }

  async cambiarEstadoActivo(idEquipo: any, darDeBaja: boolean) {
    const accion = darDeBaja ? 'dar de baja' : 'reactivar';
    const titulo = darDeBaja ? '¿Desea dar de baja el equipo?' : '¿Desea reactivar el equipo?';
    const btnTexto = darDeBaja ? 'Dar de Baja' : 'Reactivar';
    const mensajeExito = darDeBaja ? 'Equipo dado de baja correctamente!' : 'Equipo reactivado correctamente!';

    Swal.fire({
      title: titulo,
      text: darDeBaja ? 'El equipo dejará de aparecer en la lista de equipos activos' : 'El equipo volverá a estar disponible',
      showCancelButton: true,
      confirmButtonText: btnTexto,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: darDeBaja ? '#d33' : '#3085d6'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (darDeBaja) {
            await this.equiposService.darDeBajaEquipo(idEquipo);
          } else {
            await this.equiposService.reactivarEquipo(idEquipo);
          }
          this.equipos = await this.equiposService.getAllEquipos();
          
          Swal.fire(mensajeExito, '', 'success');
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `No fue posible ${accion} el equipo`
          });
        }
      } else if (result.isDismissed) {
        Swal.fire(`Se descartó la operación`, '', 'info');
      }
    });
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }
}