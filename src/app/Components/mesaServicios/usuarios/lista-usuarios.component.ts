import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService, Usuario } from '../../../Services/mesaServicios/usuarios.service';
import { AreasService, Area } from '../../../Services/mesaServicios/areas.service';
import { AuthService } from '../../../Services/mesaServicios/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { fadeInAnimation, listAnimation, modalAnimation, scaleInAnimation } from '../../../animations/animations';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './lista-usuarios.component.html',
  animations: [fadeInAnimation, listAnimation, modalAnimation, scaleInAnimation]
})
export class ListaUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  areas: Area[] = [];
  areasGestion: Area[] = [];
  servicios: any[] = [];
  perfiles: any[] = [];
  cargando = false;
  errorMensaje = '';
  exitoMensaje = '';
  mostrarModal = false;
  mostrarModalContrasena = false;
  enviando = false;
  usuarioForm: FormGroup;
  contrasenaForm: FormGroup;
  usuarioSeleccionado: Usuario | null = null;
  perfilSeleccionado: number = 0;

  // Filtros
  busqueda: string = '';
  filtroPerfil: string = '';
  filtroArea: string = '';

  constructor(
    private usuariosService: UsuariosService,
    private areasService: AreasService,
    private authService: AuthService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.usuarioForm = this.fb.group({
      codigo: ['', Validators.required],
      cedula: ['', Validators.required],
      nombre_completo: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      perfil_id: ['', Validators.required],
      area_id: [''],
      servicio: [''],
      contrasena: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.contrasenaForm = this.fb.group({
      nueva_contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmar_contrasena: ['', [Validators.required, Validators.minLength(6)]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('nueva_contrasena')?.value === g.get('confirmar_contrasena')?.value
      ? null : { 'mismatch': true };
  }

  ngOnInit() {
    this.cargarUsuarios();
    this.cargarAreas();
    this.cargarPerfiles();
    this.cargarServicios();
  }

  aplicarFiltros() {
    this.usuariosFiltrados = this.usuarios.filter(usuario => {
      const matchBusqueda = !this.busqueda ||
        usuario.nombre_completo?.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        usuario.correo?.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        usuario.email?.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        usuario.codigo?.toLowerCase().includes(this.busqueda.toLowerCase());

      const matchPerfil = !this.filtroPerfil || usuario.rolId?.toString() === this.filtroPerfil;
      const matchArea = !this.filtroArea || usuario.areaId?.toString() === this.filtroArea;

      return matchBusqueda && matchPerfil && matchArea;
    });
  }

  limpiarBusqueda() {
    this.busqueda = '';
    this.aplicarFiltros();
  }

  cargarUsuarios() {
    this.cargando = true;
    this.errorMensaje = '';

    this.usuariosService.listar().subscribe({
      next: (response) => {
        if (response.exito) {
          this.usuarios = response.datos || [];
          this.usuariosFiltrados = [...this.usuarios];
        }
        this.cargando = false;
      },
      error: (err) => {
        this.errorMensaje = 'Error al cargar los usuarios';
        this.cargando = false;
      }
    });
  }

  cargarAreas() {
    // Cargar todas las áreas
    this.areasService.listar().subscribe({
      next: (response) => {
        if (response.exito) {
          this.areas = response.datos || [];
        }
      }
    });

    // Cargar solo áreas de gestión (para Soporte Profesional)
    this.areasService.listarGestionanSolicitudes().subscribe({
      next: (response) => {
        if (response.exito) {
          this.areasGestion = response.datos || [];
        }
      }
    });
  }

  cargarServicios() {
    this.http.get<any>(`${environment.apiUrl}/servicios-hospital`).subscribe({
      next: (response) => {
        if (response.exito) {
          this.servicios = response.datos;
        }
      },
      error: (err) => {
        console.error('Error al cargar servicios:', err);
      }
    });
  }

  cargarPerfiles() {
    this.usuariosService.obtenerPerfiles().subscribe({
      next: (response) => {
        if (response.exito) {
          this.perfiles = response.datos || [];
        }
      }
    });
  }

  abrirModalNuevo() {
    this.usuarioForm.reset();
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.usuarioForm.reset();
  }

  guardarUsuario() {
    if (this.usuarioForm.valid) {
      this.enviando = true;
      this.errorMensaje = '';
      this.exitoMensaje = '';

      const datos = {
        ...this.usuarioForm.value,
        perfil_id: parseInt(this.usuarioForm.value.perfil_id),
        area_id: this.usuarioForm.value.area_id ? parseInt(this.usuarioForm.value.area_id) : undefined
      };

      this.usuariosService.crear(datos).subscribe({
        next: (response) => {
          if (response.exito) {
            this.exitoMensaje = 'Usuario creado exitosamente';
            this.cerrarModal();
            this.cargarUsuarios();
            setTimeout(() => this.exitoMensaje = '', 3000);
          }
          this.enviando = false;
        },
        error: (err) => {
          this.errorMensaje = err.error?.mensaje || 'Error al crear el usuario';
          this.enviando = false;
        }
      });
    }
  }

  activarUsuario(id: number) {
    this.usuariosService.activar(id).subscribe({
      next: (response) => {
        if (response.exito) {
          this.exitoMensaje = 'Usuario activado';
          this.cargarUsuarios();
          setTimeout(() => this.exitoMensaje = '', 3000);
        }
      },
      error: (err) => {
        this.errorMensaje = 'Error al activar el usuario';
      }
    });
  }

  desactivarUsuario(id: number) {
    if (confirm('¿Está seguro de desactivar este usuario?')) {
      this.usuariosService.desactivar(id).subscribe({
        next: (response) => {
          if (response.exito) {
            this.exitoMensaje = 'Usuario desactivado';
            this.cargarUsuarios();
            setTimeout(() => this.exitoMensaje = '', 3000);
          }
        },
        error: (err) => {
          this.errorMensaje = 'Error al desactivar el usuario';
        }
      });
    }
  }

  onPerfilChange() {
    const perfilId = parseInt(this.usuarioForm.get('perfil_id')?.value);
    this.perfilSeleccionado = perfilId;

    // Limpiar validaciones anteriores
    this.usuarioForm.get('area_id')?.clearValidators();
    this.usuarioForm.get('servicio')?.clearValidators();

    // Si es Soporte Profesional (ID: 2), área es requerida
    if (perfilId === 2) {
      this.usuarioForm.get('area_id')?.setValidators([Validators.required]);
      this.usuarioForm.get('servicio')?.setValue('');
    }
    // Si es Solicitante (ID: 3), servicio es requerido
    else if (perfilId === 3) {
      this.usuarioForm.get('servicio')?.setValidators([Validators.required]);
      this.usuarioForm.get('area_id')?.setValue('');
    }
    // Si es Administrador (ID: 1), ninguno es requerido
    else {
      this.usuarioForm.get('area_id')?.setValue('');
      this.usuarioForm.get('servicio')?.setValue('');
    }

    this.usuarioForm.get('area_id')?.updateValueAndValidity();
    this.usuarioForm.get('servicio')?.updateValueAndValidity();
  }

  abrirModalCambiarContrasena(usuario: Usuario) {
    this.usuarioSeleccionado = usuario;
    this.contrasenaForm.reset();
    this.mostrarModalContrasena = true;
  }

  cerrarModalContrasena() {
    this.mostrarModalContrasena = false;
    this.usuarioSeleccionado = null;
    this.contrasenaForm.reset();
  }

  cambiarContrasena() {
    if (this.contrasenaForm.valid && this.usuarioSeleccionado) {
      this.enviando = true;
      this.errorMensaje = '';
      this.exitoMensaje = '';

      const datos = {
        contrasena: this.contrasenaForm.value.nueva_contrasena
      };

      this.usuariosService.actualizar(this.usuarioSeleccionado.id, datos).subscribe({
        next: (response) => {
          if (response.exito) {
            this.exitoMensaje = 'Contraseña actualizada exitosamente';
            this.cerrarModalContrasena();
            setTimeout(() => this.exitoMensaje = '', 3000);
          }
          this.enviando = false;
        },
        error: (err) => {
          this.errorMensaje = err.error?.mensaje || 'Error al cambiar la contraseña';
          this.enviando = false;
        }
      });
    }
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }
}
