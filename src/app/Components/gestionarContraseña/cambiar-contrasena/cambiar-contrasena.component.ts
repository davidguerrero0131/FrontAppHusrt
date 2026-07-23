import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../../constantes';
import { UserService } from '../../../Services/appServices/userServices/user.service';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';

import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cambiar-contrasena',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './cambiar-contrasena.component.html',
  styleUrl: './cambiar-contrasena.component.css'
})
export class CambiarContrasenaComponent implements OnInit {
  form: FormGroup;
  token = '';
  mensaje = '';
  error = '';
  contraseñascoinciden = true
  userService = inject(UserService);



  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
      codigo: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      nuevaContrasena: ['', [Validators.required, Validators.minLength(8)]],
      nuevaContrasena2: ['', [Validators.required, Validators.minLength(8)]]
    },
      {
      });
  }

  ngOnInit(): void {
    // Leemos el token desde el sessionStorage para no exponerlo en la URL
    this.token = sessionStorage.getItem('utoken') || '';
    if (!this.token) {
      Swal.fire('Error', 'Sesión de recuperación inválida o caducada.', 'error').then(() => {
        this.router.navigate(['/olvidocontraseña']);
      });
      return;
    }

    try {
      const decoded: any = jwtDecode(this.token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTime) {
        sessionStorage.removeItem('utoken');
        Swal.fire('Error', 'El tiempo límite de 15 minutos ha expirado. Por favor solicite un nuevo código.', 'error').then(() => {
          this.router.navigate(['/olvidocontraseña']);
        });
      }
    } catch (e) {
      sessionStorage.removeItem('utoken');
      Swal.fire('Error', 'Token corrupto.', 'error').then(() => {
        this.router.navigate(['/olvidocontraseña']);
      });
    }
  }

  async actualizarContrasena() {
    this.error = '';
    this.mensaje = '';
    if (this.form.invalid) return;

    if (this.form.value.nuevaContrasena !== this.form.value.nuevaContrasena2) {
      Swal.fire({
        icon: 'warning',
        title: 'Las Contraseñas no coinciden',
        text: 'Verifique los campos.'
      })
      return;
    } else {
      try {
        await this.userService.cambiarContrasena(this.form.value);
        this.mensaje = 'Contraseña actualizada con éxito. Serás redirigido al login.';
        Swal.fire({
          icon: 'success',
          title: 'Contraseña Actualizada',
          text: 'Su contraseña ha sido restablecida exitosamente.'
        });
        setTimeout(() => this.router.navigate(['/login']), 1500);
      } catch (error: any) {
        // Obtenemos el error exacto del backend (evitando problemas de codificación)
        let msg = error?.error?.error || 'Error al procesar la solicitud.';
        
        // Si el backend incluye detalle, lo sumamos
        if (error?.error?.detalle) {
          msg += '\nDetalle: ' + error.error.detalle;
        }

        // Renombramos los errores más comunes para el usuario
        if (msg.includes('incorrecto')) {
          msg = 'El código de seguridad ingresado es incorrecto.';
        } else if (msg.includes('inv') && msg.includes('expirado')) {
          msg = 'El token ha expirado. Por favor, solicite un nuevo código.';
        }

        Swal.fire({
          icon: 'warning',
          title: 'Error al actualizar',
          text: msg
        })
      }
    }
  }

  validarContrasenas() {
    if (this.form.value.nuevaContrasena !== this.form.value.nuevaContrasena2) {
      return false;
    } else {
      return true;
    }
  }
}
