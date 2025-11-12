import { UserService } from './../../Services/appServices/userServices/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import { TableModule } from 'primeng/table';
import { SuperadminnavbarComponent } from '../navbars/superadminnavbar/superadminnavbar.component';
import { char } from '@zxing/library/esm/customTypings';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [SuperadminnavbarComponent, TableModule, CommonModule],
  providers: [MessageService],
  templateUrl: './gestion-usuarios.component.html',
  styleUrl: './gestion-usuarios.component.css'
})
export class GestionUsuariosComponent {

  usuarios!: any[];
  loading: boolean = true;
  activityValues: number[] = [0, 100];

  userService = inject(UserService);

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) { }


  async ngOnInit() {
    try {
      this.usuarios = await this.userService.getAllUsers();
      this.loading = false;

    } catch {
      Swal.fire({
        icon: 'warning',
        title: 'Inconsistencia en los datos',
        text: 'No fue posible Cargar la informacion '
      })
    }
  }

  showRegisterForm() {
    this.router.navigate(['/registro']);
  }

  async estadoUsuario(idUsuario: any, accion: string) {
    if (accion === 'A') {
      Swal.fire({
        title: "Desea activar el Usuario?",
        showCancelButton: true,
        confirmButtonText: "Activar",
        cancelButtonText: `Cancelar`
      }).then(async (result) => {
        if (result.isConfirmed) {
          const res = await this.userService.activarUsuario(idUsuario);
          this.usuarios = await this.userService.getAllUsers();
          Swal.fire("Usuario Activo!", "", "success");
        } else if (result.isDenied) {
          Swal.fire("Se descarto la activacion del usuario", "", "info");
        }
      });
    } else if (accion === 'D') {
      Swal.fire({
        title: "Desea desactivar el Usuario?",
        showCancelButton: true,
        confirmButtonText: "Desactivar",
        cancelButtonText: `Cancelar`
      }).then(async (result) => {
        if (result.isConfirmed) {
          const res = await this.userService.desactivarUsuario(idUsuario);
          this.usuarios = await this.userService.getAllUsers();
          Swal.fire("Usuario Inactivo!", "", "success");
        } else if (result.isDenied) {
          Swal.fire("Se descarto la activacion del usuario", "", "info");
        }
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
