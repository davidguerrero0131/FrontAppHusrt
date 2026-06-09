import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getDecodedAccessToken } from '../../../utilidades';

import { SuperadminnavbarComponent } from '../../navbars/superadminnavbar/superadminnavbar.component';
import { MantenimientoadminnavbarComponent } from '../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import { BiomedicaadminnavbarComponent } from '../../navbars/biomedicaadminnavbar/biomedicaadminnavbar.component';
import { BiomedicatecniconavbarComponent } from '../../navbars/biomedicatecniconavbar/biomedicatecniconavbar.component';
import { BiomedicausernavbarComponent } from '../../navbars/biomedicausernavbar/biomedicausernavbar.component';
import { MesausernavbarComponent } from '../../navbars/mesausernavbar/mesausernavbar.component';
import { SistemasadminnavbarComponent } from '../../navbars/sistemasadminnavbar/sistemasadminnavbar.component';

@Component({
  selector: 'app-mesa-navbar',
  standalone: true,
  imports: [
    CommonModule, 
    SuperadminnavbarComponent, 
    MantenimientoadminnavbarComponent,
    BiomedicaadminnavbarComponent,
    BiomedicatecniconavbarComponent,
    BiomedicausernavbarComponent,
    MesausernavbarComponent,
    SistemasadminnavbarComponent
  ],
  templateUrl: './mesa-navbar.component.html',
  styleUrl: './mesa-navbar.component.css'
})
export class MesaNavbarComponent implements OnInit {
  isSuperAdmin = false;
  isAdminMantenimiento = false;
  isAdminBiomedica = false;
  isTecnicoBiomedica = false;
  isUserBiomedica = false;
  isAdminSistemas = false;
  isMesaUser = false;

  ngOnInit() {
    if (typeof sessionStorage !== 'undefined') {
      const token = sessionStorage.getItem('utoken');
      if (token) {
        const decoded = getDecodedAccessToken();
        if (decoded) {
          const rol = decoded.rol;
          this.isSuperAdmin = rol === 'SUPERADMIN';
          this.isAdminMantenimiento = rol === 'ADMINMANTENIMIENTO' || rol === 'USERMANTENIMIENTO' || rol === 'TECNICOMANTENIMIENTO' || rol === 'USERMANTENIMIENTO';
          this.isAdminBiomedica = rol === 'BIOMEDICAADMIN';
          this.isTecnicoBiomedica = rol === 'BIOMEDICATECNICO';
          this.isUserBiomedica = rol === 'BIOMEDICAUSER';
          this.isAdminSistemas = rol === 'ADMINSISTEMAS' || rol === 'USERSISTEMAS';
          
          if (!this.isSuperAdmin && !this.isAdminMantenimiento && !this.isAdminBiomedica && !this.isTecnicoBiomedica && !this.isUserBiomedica && !this.isAdminSistemas) {
            this.isMesaUser = true; // Fallback for MESAUSER, ADM, SOL, AG, etc
          }
        }
      }
    }
  }
}
