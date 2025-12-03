import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { SuperadminnavbarComponent } from '../../navbars/superadminnavbar/superadminnavbar.component';
import { ServicioService } from '../../../Services/appServices/general/servicio/servicio.service';
import { Table } from 'primeng/table';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-admservicios',
  standalone: true,
  imports: [SuperadminnavbarComponent, TableModule, CommonModule, InputIconModule, IconFieldModule, InputTextModule],

  templateUrl: './admservicios.component.html',
  styleUrl: './admservicios.component.css'
})
export class AdmserviciosComponent implements OnInit {

  @ViewChild('dt2') dt2!: Table;
  servicios!: any[];
  servicioServices = inject(ServicioService);
  loading: boolean = false;

  async ngOnInit() {
    this.servicios = await this.servicioServices.getAllServicios();
    console.log(this.servicios);
  }

  estadoServicio(idServicio: any, accion: String){
if (accion === 'A') {
      Swal.fire({
        title: "Desea activar el Servicio?",
        showCancelButton: true,
        confirmButtonText: "Activar",
        cancelButtonText: `Cancelar`
      }).then(async (result) => {
        if (result.isConfirmed) {
          const res = await this.servicioServices.activarServicio(idServicio);
          this.servicios = await this.servicioServices.getAllServicios();
          Swal.fire("Servicio activo!", "", "success");
        } else if (result.isDenied) {
          Swal.fire("Se descarto la activacion del servicio", "", "info");
        }
      });
    } else if (accion === 'D') {
      Swal.fire({
        title: "Desea desactivar el servicio?",
        showCancelButton: true,
        confirmButtonText: "Desactivar",
        cancelButtonText: `Cancelar`
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await this.servicioServices.desactivarServicio(idServicio);
            this.servicios = await this.servicioServices.getAllServicios();
            Swal.fire("servicio Inactivo!", "", "success");
          } catch {
            Swal.fire("El servicio tiene equipos activos relacionados", "", "error");
          }
        } else if (result.isDenied) {
          Swal.fire("Se descarto la activacion del servicio", "", "info");
        }
      });
    }
  }
  


  onGlobalFilter(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (target) {
      this.dt2.filterGlobal(target.value, 'contains');
    }
  }
}
