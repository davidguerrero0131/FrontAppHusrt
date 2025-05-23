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
  ){}


  async ngOnInit() {
    try {
      this.usuarios = await this.userService.getAllUsers();
      this.loading = false;

      console.log(this.usuarios);

    } catch {
      Swal.fire({
        icon: 'warning',
        title: 'Inconsistencia en los datos',
        text: 'No fue posible Cargar la informacion '
      })
    }
  }

  showRegisterForm(){
    this.router.navigate(['/registro']);
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }

}
