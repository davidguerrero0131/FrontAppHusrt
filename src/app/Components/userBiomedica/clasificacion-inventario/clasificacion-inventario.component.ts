import { Component, OnInit, Inject, forwardRef } from '@angular/core';
import { Router } from '@angular/router';
import { EquiposService } from '../../../Services/appServices/biomedicaServices/equipos/equipos.service';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-clasificacion-inventario',
  standalone: true,
  imports: [FormsModule, CommonModule, SelectModule, ButtonModule],
  templateUrl: './clasificacion-inventario.component.html',
  styleUrl: './clasificacion-inventario.component.css'
})
export class ClasificacionInventarioComponent implements OnInit {

  equipos!: any[];
  selectedEquipo: any | undefined;
  // constructor(private router: Router, @Inject(forwardRef(() => EquiposService)) private equipoServices: EquiposService) {
  // }
  constructor(private router: Router) { }

  async ngOnInit() {
    // this.equipos = await this.equipoServices.getAllEquiposSeries();
    this.equipos = []; // Mock data to prevent crash
  }

  buscarEquipo() {

    console.log(this.selectedEquipo);
    if (this.selectedEquipo) {
      this.router.navigate(['/biomedica/reportesequipo/' + this.selectedEquipo.id]);
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Seleccione un equipo',
        text: 'Debe seleccionar un Equipo.'
      })
    }

  }

  showViewTiposEquipoBio() {
    this.router.navigate(['/biomedica/tiposequipo']);
  }

  showViewServicios() {
    this.router.navigate(['/biomedica/servicios']);
  }

  showViewEmpComodatos() {
    this.router.navigate(['/biomedica/empComodatos']);
  }

  showViewResponsables() {
    this.router.navigate(['/biomedica/responsables']);
  }

  showViewSedes() {
    this.router.navigate(['/biomedica/sedes']);
  }

}

