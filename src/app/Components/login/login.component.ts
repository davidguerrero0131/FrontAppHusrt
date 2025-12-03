import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { isPlatformBrowser } from '@angular/common';

import { Router } from '@angular/router';
import { UserService } from '../../Services/appServices/userServices/user.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  formulario: FormGroup;
  userServices = inject(UserService);
  router = inject(Router);
  platformId = inject(PLATFORM_ID);

  constructor(
    private formBuilder: FormBuilder,

  ) {
    this.formulario = new FormGroup({
      nombreUsuario: new FormControl(),
      contraseña: new FormControl()
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('utoken', '');
    }
  }

  async onSubmit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const response = await this.userServices.login(this.formulario.value);
      if (response.exito && response.datos) {
        localStorage.setItem('utoken', response.datos.token);
        // Guardar también la información del usuario para que AuthService pueda usarla
        localStorage.setItem('usuario', JSON.stringify(response.datos.usuario));

        if (this.getDecodedAccessToken(localStorage.getItem('utoken')!).rol === 'SYSTEMADMIN') {
          this.router.navigate(['/adminsistemas']);
        } else if (this.getDecodedAccessToken(localStorage.getItem('utoken')!).rol === 'SUPERADMIN') {
          this.router.navigate(['/superadmin']);
        } else if (this.getDecodedAccessToken(localStorage.getItem('utoken')!).rol === 'MANTENIMIENTOADMIN') {
          this.router.navigate(['/adminmantenimiento']);
        } else if (this.getDecodedAccessToken(localStorage.getItem('utoken')!).rol === 'BIOMEDICAADMIN') {
          this.router.navigate(['/adminbiomedica']);
        } else if (this.getDecodedAccessToken(localStorage.getItem('utoken')!).rol === 'BIOMEDICAUSER') {
          this.router.navigate(['/userbiomedica']);
        } else if (this.getDecodedAccessToken(localStorage.getItem('utoken')!).rol === 'BIOMEDICATECNICO') {
          this.router.navigate(['/userbiomedica']);
        } else if (this.getDecodedAccessToken(localStorage.getItem('utoken')!).rol === 'BIOMEDICA') {
          this.router.navigate(['/userbiomedica']);
        } else if (this.getDecodedAccessToken(localStorage.getItem('utoken')!).rol === 'MESASERVICIOSADMIN') {
          this.router.navigate(['/mesaservicios']);
        } else if (this.getDecodedAccessToken(localStorage.getItem('utoken')!).rol === 'MESASERVICIOSSOPORTE') {
          this.router.navigate(['/mesaservicios']);
        } else if (this.getDecodedAccessToken(localStorage.getItem('utoken')!).rol === 'MESASERVICIOSUSUARIO') {
          this.router.navigate(['/mesaservicios']);
        }
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Usuario o contraseña incorecto',
          text: response.mensaje || 'Verifique los campos.'
        })
      }
    } catch (error) {
      Swal.fire({
        icon: 'warning',
        title: 'Usuario o contraseña incorecto',
        text: 'Verifique los campos.'
      })
    }
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }
}
