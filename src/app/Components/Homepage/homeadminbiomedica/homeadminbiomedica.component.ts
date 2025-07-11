import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { BiomedicausernavbarComponent } from "../../navbars/biomedicausernavbar/biomedicausernavbar.component";

@Component({
  selector: 'app-homeadminbiomedica',
  standalone: true,
  imports: [BiomedicausernavbarComponent],
  templateUrl: './homeadminbiomedica.component.html',
  styleUrl: './homeadminbiomedica.component.css'
})
export class HomeadminbiomedicaComponent {

    constructor (private router: Router){
  }

  showViewInventarioBio(){
    this.router.navigate(['/biomedica/inventario']);
  }

  showViewMantenimientoBio(){
    this.router.navigate(['/biomedica/mantenimiento']);
  }

  showViewSemaforizacionBio(){
    this.router.navigate(['/biomedica/semaforizacion']);
  }

  showViewIndicadoresBio(){
    this.router.navigate(['/biomedica/indicadores']);
  }

  showViewCalendarioBio(){
    this.router.navigate(['/biomedica/calendario']);
  }
}
