import { UserService } from './../../Services/appServices/userServices/user.service';
import { CargosService } from './../../Services/appServices/general/cargos/cargos.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import { TableModule } from 'primeng/table';

import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [TableModule, CommonModule, DialogModule, ReactiveFormsModule, InputTextModule, DropdownModule, ButtonModule, TooltipModule, ToolbarModule, TagModule,
    IconFieldModule, InputIconModule
  ],
  providers: [MessageService],
  templateUrl: './gestion-usuarios.component.html',
  styleUrl: './gestion-usuarios.component.css'
})
export class GestionUsuariosComponent implements OnInit {

  usuarios!: any[];
  roles!: any[];
  cargos: any[] = [];
  loading: boolean = true;

  tipoIdOptions = [
    { label: 'Cédula de Ciudadanía', value: 'CC' },
    { label: 'Tarjeta de Identidad', value: 'TI' },
    { label: 'Cédula de Extranjería', value: 'CE' },
    { label: 'Pasaporte', value: 'PASAPORTE' }
  ];

  formGroup!: FormGroup;
  visibleEditModal: boolean = false;
  selectedUser: any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private userService: UserService,
    private cargosService: CargosService
  ) { }


  passwordFormGroup!: FormGroup;
  visiblePasswordModal: boolean = false;

  async ngOnInit() {
    this.formGroup = this.formBuilder.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nombreUsuario: ['', Validators.required],
      tipoId: ['', Validators.required],
      numeroId: ['', Validators.required],
      registroInvima: [''],
      rolId: ['', Validators.required],
      cargoId: ['', Validators.required]
    });

    this.passwordFormGroup = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', Validators.required]
    });

    try {
      this.usuarios = await this.userService.getAllUsers();
      this.roles = await this.userService.getAllRoles();
      this.cargosService.getCargos().subscribe(data => {
        this.cargos = data;
      });
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

  openEditModal(user: any) {
    this.selectedUser = user;
    this.formGroup.patchValue({
      nombres: user.nombres,
      apellidos: user.apellidos,
      telefono: user.telefono,
      email: user.email,
      nombreUsuario: user.nombreUsuario,
      tipoId: user.tipoId,
      numeroId: user.numeroId,
      registroInvima: user.registroInvima,
      rolId: user.rolId,
      cargoId: user.cargoId
    });
    this.visibleEditModal = true;
  }

  async saveUser() {
    if (this.formGroup.valid) {
      try {
        await this.userService.update(this.formGroup.value, this.selectedUser.id);
        this.usuarios = await this.userService.getAllUsers();
        this.visibleEditModal = false;
        Swal.fire("Usuario Actualizado!", "", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo actualizar el usuario", "error");
      }
    } else {
      Swal.fire("Formulario Inválido", "Por favor revise los campos", "warning");
    }
  }

  openPasswordModal(user: any) {
    this.selectedUser = user;
    this.passwordFormGroup.reset();
    this.visiblePasswordModal = true;
  }

  async savePassword() {
    if (this.passwordFormGroup.valid) {
      const { newPassword, confirmPassword } = this.passwordFormGroup.value;
      if (newPassword !== confirmPassword) {
        Swal.fire("Error", "Las contraseñas no coinciden", "error");
        return;
      }

      try {
        await this.userService.update({ contraseña: newPassword }, this.selectedUser.id);
        this.visiblePasswordModal = false;
        Swal.fire("Contraseña Actualizada!", "", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo actualizar la contraseña", "error");
      }
    } else {
      Swal.fire("Formulario Inválido", "La contraseña debe tener al menos 4 caracteres", "warning");
    }
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
