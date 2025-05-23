import { UserService } from './../../Services/appServices/userServices/user.service';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {

  formGroup: FormGroup;
  roles!: any[];
  private userService = inject(UserService);

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
  ) {

    this.formGroup = this.formBuilder.group({
      nombres: new FormControl('', [Validators.required]),
      apellidos: new FormControl('', [Validators.required]),
      nombreUsuario: new FormControl('', [Validators.required]),
      tipoId: new FormControl('', [Validators.required]),
      numeroId: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      password2: new FormControl('', [Validators.required]),
      registroInvima: new FormControl('', [Validators.required]),
      rolId: new FormControl('', [Validators.required])
    })

  }

  async ngOnInit() {
    try {
      this.roles = await this.userService.getAllRoles();
      console.log(this.roles);
    } catch {
      Swal.fire({
        icon: 'warning',
        title: 'Inconsistencia en los datos',
        text: 'No fue posible Cargar la informacion '
      })
    }
  }

  async registro() {

    if (this.formGroup.valid) {
      if (
        this.formGroup.value.password == this.formGroup.value.password2
      ) {
        let obj = {
          nombres: this.formGroup.value.nombres,
          apellidos: this.formGroup.value.apellidos,
          nombreUsuario: this.formGroup.value.nombreUsuario,
          tipoId: this.formGroup.value.tipoId,
          numeroId: this.formGroup.value.numeroId,
          telefono: this.formGroup.value.telefono,
          email: this.formGroup.value.email.toLowerCase(),
          contrasena: this.formGroup.value.password,
          registroInvima: this.formGroup.value.registroInvima,
          estado: true,
          rolId: this.formGroup.value.rolId
        };
        try {
          const ress = await this.userService.registro(obj);
          if (!ress.error) {
            Swal.fire({
              icon: 'success',
              title: 'Registro Exitoso',
              text: 'Inicie sesión para continuar.'
            })
            this.router.navigate(['/login']);
          }
        } catch {
          Swal.fire({
            icon: 'warning',
            title: 'No se puede registrar',
            text: 'El nombre de usuario o correo electronico ya se encuentra registrado.'
          })
        }

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Validacion',
          confirmButtonText: 'Verificar',
          confirmButtonColor: '#3F51B5',
          text: 'La contraseña no coincide!'
        })
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Se deben diligenciar todos los campos.'
      })
    }
  }
}

