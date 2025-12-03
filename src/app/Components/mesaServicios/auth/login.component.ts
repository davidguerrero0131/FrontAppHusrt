import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../Services/mesaServicios/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  cargando = false;
  errorMensaje = '';
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      codigo: ['', Validators.required],
      contrasena: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.cargando = true;
    this.errorMensaje = '';

    const { codigo, contrasena } = this.loginForm.value;

    this.authService.login(codigo, contrasena).subscribe({
      next: (response) => {
        if (response.exito) {
          // Redirigir al dashboard
          this.router.navigate(['/mesaservicios/dashboard']);
        }
      },
      error: (error) => {
        this.cargando = false;
        this.errorMensaje = error.error?.mensaje || 'Error al iniciar sesión. Por favor, intente nuevamente.';
      },
      complete: () => {
        this.cargando = false;
      }
    });
  }
}
