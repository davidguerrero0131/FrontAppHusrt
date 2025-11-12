import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../Services/appServices/userServices/user.service';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './editar-usuario.component.html',
  styleUrl: './editar-usuario.component.css'
})
export class EditarUsuarioComponent implements OnInit {

  usuarioServices = inject(UserService);
  usuario!: any;

  constructor(private location: Location) { }

  async ngOnInit() {
    try {
      this.usuario = await this.usuarioServices.getUserProfil(this.getDecodedAccessToken(localStorage.getItem('utoken') + "").id);
      console.log(this.usuario);
    } catch {

    }
  }


  async guardarCambios() {
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
