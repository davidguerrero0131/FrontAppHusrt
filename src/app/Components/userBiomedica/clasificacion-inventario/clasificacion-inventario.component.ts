import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EquiposService } from '../../../Services/appServices/biomedicaServices/equipos/equipos.service';
import { FormsModule } from '@angular/forms';
import { BiomedicausernavbarComponent } from '../../navbars/biomedicausernavbar/biomedicausernavbar.component';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-clasificacion-inventario',
  standalone: true,
  imports: [BiomedicausernavbarComponent, FormsModule, CommonModule, SelectModule],
  templateUrl: './clasificacion-inventario.component.html',
  styleUrl: './clasificacion-inventario.component.css'
})
export class ClasificacionInventarioComponent implements OnInit{

  equipos! : any[];
  selectedEquipo: string | undefined;
  equipoServices = inject(EquiposService);
  equipoSeleccionado: string = '';


  constructor (private router: Router){
  }

  async ngOnInit() {
      this.equipos = await this.equipoServices.getAllEquiposSeries();
      console.log(this.equipos);
  }

  showViewTiposEquipoBio(){
    this.router.navigate(['/biomedica/tiposequipo']);
  }

  showViewServicios(){
    this.router.navigate(['/biomedica/servicios']);
  }

  showViewEmpComodatos(){
    this.router.navigate(['biomedica/empComodatos']);
  }

}

