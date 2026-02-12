import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
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

  constructor(
    private formBuilder: FormBuilder,

  ) {
    this.formulario = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    });
  }

  ngOnInit(): void {
    localStorage.setItem('utoken', '');
  }

  async onSubmit() {
    try {
      // Map email/password to usuarion/contraseña for backend
      const loginData = {
        usuarion: this.formulario.value.email,
        contraseña: this.formulario.value.password
      };

      const response = await this.userServices.login(loginData);
      if (!response.error) {
        localStorage.setItem('utoken', response.token);
        const decoded = this.getDecodedAccessToken(response.token);

        if (decoded?.rol === 'SYSTEMADMIN') {
          this.router.navigate(['/adminsistemas']);
        } else if (decoded?.rol === 'SUPERADMIN') {
          this.router.navigate(['/superadmin']);
        } else if (decoded?.rol === 'ADMINMANTENIMIENTO') {
          this.router.navigate(['/adminmantenimiento']);
        } else if (decoded?.rol === 'MANTENIMIENTOADMIN') {
          this.router.navigate(['/adminmantenimiento']);
        } else if (decoded?.rol === 'BIOMEDICAADMIN') {
          this.router.navigate(['/adminbiomedica']);
        } else if (decoded?.rol === 'BIOMEDICAUSER') {
          this.router.navigate(['/userbiomedica']);
        } else if (decoded?.rol === 'BIOMEDICATECNICO') {
          this.router.navigate(['/userbiomedica']);
        }
      } else {
        // Handle specific API error if available, or fallback
        Swal.fire({
          icon: 'warning',
          title: 'Usuario o contraseña incorrecto',
          text: 'Verifique los campos.'
        })
      }
    } catch {
      Swal.fire({
        icon: 'warning',
        title: 'Usuario o contraseña incorrecto',
        text: 'Verifique los campos.'
      })
    }
  }

  loginInvitado() {
    // Implement guest login logic or redirect
    this.router.navigate(['/home-invitado']); // Assuming a route for guests exists or created later
    Swal.fire({
      icon: 'info',
      title: 'Acceso Invitado',
      text: 'Funcionalidad de invitado en desarrollo.'
    });
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }
}
