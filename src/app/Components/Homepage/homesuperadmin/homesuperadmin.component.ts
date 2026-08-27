import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { getDecodedAccessToken } from '../../../utilidades';
import { UserService } from '../../../Services/appServices/userServices/user.service';

@Component({
  selector: 'app-homesuperadmin',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TooltipModule, RouterModule],
  templateUrl: './homesuperadmin.component.html',
  styleUrl: './homesuperadmin.component.css'
})
export class HomesuperadminComponent implements OnInit {

  modulos: any[] = [];
  isSuperadmin: boolean = false;
  userService = inject(UserService);

  constructor(private router: Router) { }

  ngOnInit() {
    const token = getDecodedAccessToken();
    if (token) {
       this.modulos = token.modulos || [];
       const roles = token.roles || (token.rol ? [token.rol] : []);
       this.isSuperadmin = roles.includes('SUPERADMIN');

       if (token.id) {
           this.userService.getUserProfil(token.id).then((profile: any) => {
               if (profile && profile.mesaServicioRol) {
                   const mesaRol = profile.mesaServicioRol.codigo;
                   if (mesaRol === 'AG' || mesaRol === 'AGENTE' || mesaRol === 'SOL' || mesaRol === 'SOLICITANTE') {
                       // Find Mesa de Servicios module and change its route
                       const mesaModulo = this.modulos.find((m: any) => m.ruta === '/mesaservicios');
                       if (mesaModulo) {
                           mesaModulo.ruta = '/mesaservicios/casos';
                       }
                   }
               }
           }).catch((err: any) => console.error("Error al obtener perfil para redirección de mesa", err));
       }
    }
  }

  getIconClass(icono: string): string {
    if (!icono) return 'pi pi-folder'; // Fallback
    if (icono.startsWith('pi-')) return 'pi ' + icono;
    if (icono.startsWith('bi-')) return 'bi ' + icono;
    return icono;
  }

}

