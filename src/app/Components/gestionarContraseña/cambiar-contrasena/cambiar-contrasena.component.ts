import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../../constantes';
import { UserService } from '../../../Services/appServices/userServices/user.service';
import Swal from 'sweetalert2';

import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cambiar-contrasena',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
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
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    sessionStorage.setItem('utoken', this.token);



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
        let msg = 'Token inválido o expirado.';
        if (error?.error?.error === 'Código de seguridad incorrecto') {
           msg = 'El código ingresado es incorrecto.';
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
