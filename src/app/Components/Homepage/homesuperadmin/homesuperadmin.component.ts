import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { SuperadminnavbarComponent } from '../../navbars/superadminnavbar/superadminnavbar.component';

@Component({
  selector: 'app-homesuperadmin',
  standalone: true,
  imports: [SuperadminnavbarComponent],
  templateUrl: './homesuperadmin.component.html',
  styleUrl: './homesuperadmin.component.css'
})
export class HomesuperadminComponent {

  constructor(
    private router: Router
  ){}

  showRegisterForm(){
    this.router.navigate(['/registro']);
  }
  showViewUsers(){
    this.router.navigate(['/admusuarios']);
  }

  newEquipo(){
    this.router.navigate(['/biomedica/nuevoequipo']);
  }

  viewEquipos(){
    this.router.navigate(['/biomedica/inventario']);
  }


}
