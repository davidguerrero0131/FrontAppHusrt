import { Component, inject, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { isPlatformBrowser } from '@angular/common';

import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../Services/appServices/userServices/user.service';
import { ThemeService } from '../../Services/theme/theme.service';
import { UppercaseDirective } from '../../Directives/uppercase.directive';
import { ROLE_REDIRECTS } from '../../constantes';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  formulario: FormGroup;
  userServices = inject(UserService);
  router = inject(Router);
  themeService = inject(ThemeService);

  constructor(
    private formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.formulario = new FormGroup({
      usuarion: new FormControl(),
      contraseña: new FormControl()
    });
  }

  ngOnInit(): void {
    // Si la pestaña actual ya cargó o sincronizó un token válido, redirigir automáticamente
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('utoken')) {
      const decoded = this.getDecodedAccessToken(sessionStorage.getItem('utoken')!);
      if (decoded) {
        this.redirectBasedOnToken(decoded);
      }
    }
  }

  async onSubmit() {
    try {
      const response = await this.userServices.login(this.formulario.value);
      if (!response.error) {
        sessionStorage.setItem('utoken', response.token);
        if (response.idUser) {
          sessionStorage.setItem('idUser', response.idUser.toString());
        }
        const decoded = this.getDecodedAccessToken(response.token);
        if (decoded) {
          if (decoded.rol) {
            sessionStorage.setItem('rol', decoded.rol);
          }
          this.redirectBasedOnToken(decoded);
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

  redirectBasedOnToken(decoded: any) {
    // A petición del usuario, todos los roles se redirigen a /homeuser
    this.router.navigate(['/homeuser']);
  }

  async loginInvitado() {
    try {
      const response = await this.userServices.loginInvitado();

      if (response && response.token) {
        sessionStorage.setItem('utoken', response.token);
        sessionStorage.setItem('idUser', response.idUser);
        sessionStorage.setItem('rol', response.rol);

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
