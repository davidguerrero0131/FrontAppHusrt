import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EquiposService } from '../../../Services/appServices/biomedicaServices/equipos/equipos.service';
import { FormsModule } from '@angular/forms';
import { BiomedicausernavbarComponent } from '../../navbars/biomedicausernavbar/biomedicausernavbar.component';

@Component({
  selector: 'app-clasificacion-inventario',
  standalone: true,
  imports: [BiomedicausernavbarComponent, FormsModule],
  templateUrl: './clasificacion-inventario.component.html',
  styleUrl: './clasificacion-inventario.component.css'
})
export class ClasificacionInventarioComponent implements OnInit{

  equipos! : any[];
  equipoServices = inject(EquiposService);
  equipoSeleccionado: string = '';


  constructor (private router: Router){
  }

  async ngOnInit() {
      this.equipos = await this.equipoServices.getAllEquipos();
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

