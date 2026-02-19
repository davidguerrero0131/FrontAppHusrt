import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

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
  private platformId = inject(PLATFORM_ID);

  constructor(
    private formBuilder: FormBuilder,


  ) {
    this.formulario = new FormGroup({
      usuario: new FormControl(),
      contraseña: new FormControl()
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('utoken', '');
    }
  }

  async onSubmit() {
    try {
      const response = await this.userServices.login(this.formulario.value);
      if (!response.error) {
        sessionStorage.setItem('utoken', response.token);
        if (this.getDecodedAccessToken(sessionStorage.getItem('utoken')!).rol === 'SYSTEMADMIN') {
          this.router.navigate(['/adminsistemas']);
        } else if (this.getDecodedAccessToken(sessionStorage.getItem('utoken')!).rol === 'SUPERADMIN') {
          this.router.navigate(['/superadmin']);
        } else if (this.getDecodedAccessToken(sessionStorage.getItem('utoken')!).rol === 'MANTENIMIENTOADMIN') {
          this.router.navigate(['/adminmantenimiento']);
        } else if (this.getDecodedAccessToken(sessionStorage.getItem('utoken')!).rol === 'BIOMEDICAADMIN') {
          this.router.navigate(['/adminbiomedica']);
        } else if (this.getDecodedAccessToken(sessionStorage.getItem('utoken')!).rol === 'BIOMEDICAUSER') {
          this.router.navigate(['/userbiomedica']);
        } else if (this.getDecodedAccessToken(sessionStorage.getItem('utoken')!).rol === 'BIOMEDICATECNICO') {
          this.router.navigate(['/userbiomedica']);
        } else if (['INDUSTRIALESADMIN', 'INDUSTRIALESTECNICO'].includes(this.getDecodedAccessToken(sessionStorage.getItem('utoken')!).rol)) {
          this.router.navigate(['/adminindustriales']);
        } else if (this.getDecodedAccessToken(sessionStorage.getItem('utoken')!).rol === 'INDUSTRIALESUSER') {
          this.router.navigate(['/industriales/gestion-operativa']);
        }
      }
    } catch {
      Swal.fire({
        icon: 'warning',
        title: 'Usuario o contraseña incorecto',
        text: 'Verifique los campos.'
      })
    }
  }

  async loginInvitado() {
    try {
      const response = await this.userServices.loginInvitado();

      if (response && response.token) {
        sessionStorage.setItem('utoken', response.token);
        sessionStorage.setItem('idUser', response.idUser);
        sessionStorage.setItem('rol', response.rol);

        Swal.fire({
          icon: 'success',
          title: 'Acceso Correcto',
          text: 'Bienvenido Invitado',
        })

        this.router.navigate(['/biomedica/home-invitado']);
      } else {
        console.error('Invalid response:', response);
      }
    } catch (err) {
      console.error('Guest Login Error:', err); // Debug
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo acceder como invitado.',
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
