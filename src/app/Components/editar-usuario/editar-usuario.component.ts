import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../Services/appServices/userServices/user.service';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { CommonModule, Location } from '@angular/common';
import Swal from 'sweetalert2';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  imports: [FormsModule, CommonModule, CardModule, InputTextModule, PasswordModule, ButtonModule, DropdownModule, DividerModule, IconFieldModule, InputIconModule],
  templateUrl: './editar-usuario.component.html',
  styleUrl: './editar-usuario.component.css'
})
export class EditarUsuarioComponent implements OnInit {

  usuarioServices = inject(UserService);
  usuario!: any;

  nuevaContrasena: string = '';
  confirmarContrasena: string = '';

  estadoOptions = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false }
  ];

  constructor(private location: Location) { }

  async ngOnInit() {
    try {
      this.usuario = await this.usuarioServices.getUserProfil(this.getDecodedAccessToken(sessionStorage.getItem('utoken') + "").id);

    } catch {

    }
  }

  validarContrasena(contrasena: string): boolean {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/;
    return regex.test(contrasena);
  }

  async guardarCambios() {
    // Validar contraseña si se ingresó algo
    if (this.nuevaContrasena || this.confirmarContrasena) {
      if (this.nuevaContrasena !== this.confirmarContrasena) {
        Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
        return;
      }

      if (!this.validarContrasena(this.nuevaContrasena)) {
        Swal.fire('Error', 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.', 'error');
        return;
      }

      this.usuario.contraseña = this.nuevaContrasena;
    }

    Swal.fire({
      title: "Desea guardar los cambio?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      denyButtonText: `Descartar`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.usuarioServices.update(this.usuario, this.usuario.id);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Usuario Actualizado",
          showConfirmButton: false,
          timer: 1500
        });
        this.location.back();
      } else if (result.isDenied) {
        Swal.fire("Cancelado", "", "info");
      }
    });
  }

  cancelarEdicion() {
    Swal.fire({
      icon: 'warning',
      title: 'Usuario o contraseña incorecto',
      text: 'Verifique los campos.'
    })
    this.location.back();
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }
}
