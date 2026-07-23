import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../Services/appServices/userServices/user.service';
import { API_URL } from '../../../constantes';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-olvido-contrasena',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './olvido-contrasena.component.html',
  styleUrl: './olvido-contrasena.component.css'
})
export class OlvidoContrasenaComponent {

  userService = inject(UserService);
  router = inject(Router);
  form: FormGroup;
  enviado = false;
  mensajeError = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async enviarCorreoU() {
    this.mensajeError = '';
    if (this.form.invalid) return;

    try {
      const res = await this.userService.recuperarContrasena(this.form.value.email);
      this.enviado = true;
      Swal.fire({
        title: "Código enviado, revise su bandeja de entrada (incluyendo Spam)",
        icon: "success",
        draggable: true
      });
      // Almacenamos el token en sessionStorage en lugar de enviarlo por la URL
      sessionStorage.setItem('utoken', res.token);
      
      // Navegamos directamente a la ruta correcta
      this.router.navigate(['/recuperarcontraseña']);
    } catch (error: any) {
      let msg = 'Verifique los campos.';
      if (error?.error?.error) {
        msg = error.error.error;
      }
      
      Swal.fire({
        icon: 'warning',
        title: 'Error al solicitar código',
        text: msg
      })
    }
  }
}
