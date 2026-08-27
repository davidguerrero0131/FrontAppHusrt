import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { AdminEspaciosReservaComponent } from '../admin-espacios-reserva/admin-espacios-reserva.component';
import { AdminespaciosHomeComponent } from '../adminespacios-home/adminespacios-home.component';
import { ReservasEspaciosInternoComponent } from '../../Interno/reservas-espacios-interno/reservas-espacios-interno.component';

@Component({
  selector: 'app-homereserva',
  standalone: true,
  imports: [CommonModule, AdminEspaciosReservaComponent, AdminespaciosHomeComponent, ReservasEspaciosInternoComponent],
  templateUrl: './homereserva.component.html',
  styleUrls: ['./homereserva.component.css']
})
export class HomereservaComponent implements OnInit {
  role: string = '';

  ngOnInit(): void {
    if (typeof sessionStorage !== 'undefined') {
      const token = sessionStorage.getItem('utoken');
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          const roles: string[] = decoded.roles || [decoded.rol];

          if (roles.includes('SUPERADMIN')) {
            this.role = 'SUPERADMIN';
          } else if (roles.includes('ADMINESPACIORESERVA')) {
            this.role = 'ADMINESPACIORESERVA';
          } else {
            this.role = roles[0] || 'USER';
          }
        } catch(e) {}
      }
    }
  }
}
