import { Component, inject, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // ✅ Importar Validators
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../Services/appServices/userServices/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  formulario: FormGroup;
  userServices = inject(UserService);
  router = inject(Router);

  constructor(
    private formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // ✅ Agregar validaciones
    this.formulario = new FormGroup({
      usuarion: new FormControl('', [Validators.required]), // ✅ Campo requerido
      contraseña: new FormControl('', [Validators.required]) // ✅ Campo requerido
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

    // ✅ Validar que el formulario sea válido
    if (this.formulario.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor complete todos los campos.'
      });
      return;
    }

    console.log('📝 Valores del formulario:', this.formulario.value); // ✅ Debugging
    console.log('📝 Usuario:', this.formulario.value.usuarion); // ✅ Ver el usuario
    console.log('📝 Contraseña:', this.formulario.value.contraseña ? '****' : 'VACÍA'); // ✅ Ver si hay contraseña

    try {
      const response = await this.userServices.login(this.formulario.value);
      
      console.log('✅ Respuesta del servidor:', response); // ✅ Ver respuesta

      if (!response.error && response.token) {
        localStorage.setItem('utoken', response.token);
        const token = localStorage.getItem('utoken');
        
        if (token) {
          const decodedToken = this.getDecodedAccessToken(token);
          const rol = decodedToken?.rol;

          const rutasPorRol: { [key: string]: string } = {
            'SYSTEMADMIN': '/adminsistemas',
            'SUPERADMIN': '/superadmin',
            'MANTENIMIENTOADMIN': '/adminmantenimiento',
            'BIOMEDICAADMIN': '/adminbiomedica',
            'BIOMEDICAUSER': '/userbiomedica',
            'BIOMEDICATECNICO': '/userbiomedica'
          };

          if (rol && rutasPorRol[rol]) {
            this.router.navigate([rutasPorRol[rol]]);
          } else {
            Swal.fire({
              icon: 'warning',
              title: 'Rol no reconocido',
              text: 'Contacte al administrador.'
            });
          }
        }
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Credenciales incorrectas',
          text: response.error || 'Verifique los campos.'
        });
      }
    } catch (error: any) {
      console.error('❌ Error completo:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.error?.error || error.message || 'Error al iniciar sesión.'
      });
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