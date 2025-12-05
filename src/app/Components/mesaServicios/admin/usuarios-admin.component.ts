import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UsuariosService } from '../../../Services/mesaServicios/usuarios.service';
import { AreasService } from '../../../Services/mesaServicios/areas.service';
import { ServiciosService } from '../../../Services/mesaServicios/servicios.service';
import { Usuario, CrearUsuarioDTO, ActualizarUsuarioDTO, Perfil } from '../../../models/mesaServicios/usuario.model';
import { Area } from '../../../models/mesaServicios/area.model';
import { Servicio } from '../../../models/mesaServicios/servicio.model';

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './usuarios-admin.component.html',
  styleUrls: ['./usuarios-admin.component.css']
})
export class UsuariosAdminComponent implements OnInit {
  usuarios: Usuario[] = [];
  perfiles: Perfil[] = [];
  areas: Area[] = [];
  servicios: Servicio[] = [];
  usuarioForm: FormGroup;
  cargando = false;
  enviando = false;
  errorMensaje = '';
  exitoMensaje = '';

  // Modal
  mostrarModal = false;
  modoEdicion = false;
  usuarioEditando: Usuario | null = null;

  // Búsqueda y filtros
  busqueda = '';
  filtroPerfil: number | null = null;
  filtroArea: number | null = null;
  mostrarInactivos = false;

  // Control de visibilidad del campo área
  mostrarCampoArea = true;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private areasService: AreasService,
    private serviciosService: ServiciosService
  ) {
    this.usuarioForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      nombreUsuario: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      tipoId: ['CC'], // Agregar campo tipoId con valor por defecto
      numeroId: ['', [Validators.required, Validators.minLength(6)]],
      telefono: [''],
      contraseña: ['', [Validators.required, Validators.minLength(6)]],
      rolId: [null, [Validators.required]],
      areaId: [null],
      servicioId: [null]
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarPerfiles();
    this.cargarAreas();
    this.cargarServicios();

    // Suscribirse a cambios en rolId para mostrar/ocultar área
    this.usuarioForm.get('rolId')?.valueChanges.subscribe((rolId: number) => {
      this.actualizarCampoArea(rolId);
    });
  }

  cargarUsuarios(): void {
    this.cargando = true;
    this.errorMensaje = '';

    const filtros: any = {};
    if (this.busqueda) filtros.busqueda = this.busqueda;
    if (this.filtroPerfil) filtros.rolId = this.filtroPerfil;
    if (this.filtroArea) filtros.areaId = this.filtroArea;

    this.usuariosService.listar(filtros).subscribe({
      next: (response) => {
        if (response.exito && response.datos) {
          this.usuarios = this.mostrarInactivos
            ? response.datos
            : response.datos.filter((u: Usuario) => u.estado);
        }
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.errorMensaje = 'Error al cargar los usuarios';
        this.cargando = false;
      }
    });
  }

  cargarPerfiles(): void {
    this.usuariosService.obtenerPerfiles().subscribe({
      next: (response) => {
        if (response.exito && response.datos) {
          this.perfiles = response.datos;
        }
      },
      error: (error) => {
        console.error('Error al cargar perfiles:', error);
      }
    });
  }

  cargarAreas(): void {
    this.areasService.listar().subscribe({
      next: (response: any) => {
        if (response.exito && response.datos) {
          this.areas = response.datos;
        }
      },
      error: (error: any) => {
        console.error('Error al cargar áreas:', error);
      }
    });
  }

  cargarServicios(): void {
    this.serviciosService.listar({}).subscribe({
      next: (response) => {
        if (response.exito && response.datos) {
          this.servicios = response.datos;
        }
      },
      error: (error) => {
        console.error('Error al cargar servicios:', error);
      }
    });
  }

  abrirModalCrear(): void {
    this.modoEdicion = false;
    this.usuarioEditando = null;
    this.usuarioForm.reset({
      nombres: '',
      apellidos: '',
      nombreUsuario: '',
      email: '',
      tipoId: 'CC',
      numeroId: '',
      telefono: '',
      contraseña: '',
      rolId: null,
      areaId: null,
      servicioId: null
    });
    // Hacer contraseña requerida en modo creación
    this.usuarioForm.get('contraseña')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.usuarioForm.get('contraseña')?.updateValueAndValidity();
    // Mostrar campo área por defecto
    this.mostrarCampoArea = true;
    this.mostrarModal = true;
  }

  abrirModalEditar(usuario: Usuario): void {
    this.modoEdicion = true;
    this.usuarioEditando = usuario;
    this.usuarioForm.patchValue({
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      nombreUsuario: usuario.nombreUsuario,
      email: usuario.email,
      numeroId: usuario.numeroId,
      telefono: usuario.telefono || '',
      contraseña: '',
      rolId: usuario.rolId,
      areaId: usuario.areaId || null,
      servicioId: usuario.servicioId || null
    });
    // Hacer contraseña opcional en modo edición
    this.usuarioForm.get('contraseña')?.clearValidators();
    this.usuarioForm.get('contraseña')?.updateValueAndValidity();
    // Actualizar visibilidad del campo área según el rol del usuario
    this.actualizarCampoArea(usuario.rolId);
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.usuarioForm.reset();
    this.errorMensaje = '';
  }

  guardar(): void {
    if (this.usuarioForm.invalid) {
      Object.keys(this.usuarioForm.controls).forEach(key => {
        this.usuarioForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.enviando = true;
    this.errorMensaje = '';
    this.exitoMensaje = '';

    if (this.modoEdicion && this.usuarioEditando) {
      this.actualizar();
    } else {
      this.crear();
    }
  }

  crear(): void {
    const datos: any = {
      // NO enviar codigo - se genera automáticamente en el backend
      nombres: this.usuarioForm.value.nombres,
      apellidos: this.usuarioForm.value.apellidos,
      nombreUsuario: this.usuarioForm.value.nombreUsuario,
      email: this.usuarioForm.value.email,
      numeroId: this.usuarioForm.value.numeroId,
      tipoId: this.usuarioForm.value.tipoId || 'CC', // Agregar tipoId con valor por defecto
      contraseña: this.usuarioForm.value.contraseña,
      rolId: parseInt(this.usuarioForm.value.rolId), // Asegurar que sea número
    };

    // Solo agregar telefono, areaId y servicioId si tienen valor
    if (this.usuarioForm.value.telefono) {
      datos.telefono = this.usuarioForm.value.telefono;
    }
    if (this.usuarioForm.value.areaId) {
      datos.areaId = parseInt(this.usuarioForm.value.areaId);
    }
    if (this.usuarioForm.value.servicioId) {
      datos.servicioId = parseInt(this.usuarioForm.value.servicioId);
    }

    this.usuariosService.crear(datos).subscribe({
      next: (response) => {
        if (response.exito) {
          this.exitoMensaje = 'Usuario creado exitosamente';
          this.cargarUsuarios();
          this.cerrarModal();
          setTimeout(() => this.exitoMensaje = '', 3000);
        }
        this.enviando = false;
      },
      error: (error) => {
        console.error('Error al crear usuario:', error);
        this.errorMensaje = error.error?.mensaje || 'Error al crear el usuario';
        this.enviando = false;
      }
    });
  }

  actualizar(): void {
    if (!this.usuarioEditando) return;

    const datos: ActualizarUsuarioDTO = {
      nombres: this.usuarioForm.value.nombres,
      apellidos: this.usuarioForm.value.apellidos,
      nombreUsuario: this.usuarioForm.value.nombreUsuario,
      email: this.usuarioForm.value.email,
      numeroId: this.usuarioForm.value.numeroId,
      telefono: this.usuarioForm.value.telefono || undefined,
      rolId: this.usuarioForm.value.rolId,
      areaId: this.usuarioForm.value.areaId || undefined,
      servicioId: this.usuarioForm.value.servicioId || undefined
    };

    // Si hay contraseña, agregarla
    if (this.usuarioForm.value.contraseña) {
      datos.contraseña = this.usuarioForm.value.contraseña;
    }

    this.usuariosService.actualizar(this.usuarioEditando.id, datos).subscribe({
      next: (response) => {
        if (response.exito) {
          this.exitoMensaje = 'Usuario actualizado exitosamente';
          this.cargarUsuarios();
          this.cerrarModal();
          setTimeout(() => this.exitoMensaje = '', 3000);
        }
        this.enviando = false;
      },
      error: (error) => {
        console.error('Error al actualizar usuario:', error);
        this.errorMensaje = error.error?.mensaje || 'Error al actualizar el usuario';
        this.enviando = false;
      }
    });
  }

  toggleActivo(usuario: Usuario): void {
    const accion = usuario.estado ? 'desactivar' : 'activar';

    if (!confirm(`¿Está seguro de ${accion} al usuario "${usuario.nombre_completo}"?`)) {
      return;
    }

    const observable = usuario.activo
      ? this.usuariosService.desactivar(usuario.id)
      : this.usuariosService.activar(usuario.id);

    observable.subscribe({
      next: (response) => {
        if (response.exito) {
          this.exitoMensaje = `Usuario ${accion === 'activar' ? 'activado' : 'desactivado'} exitosamente`;
          this.cargarUsuarios();
          setTimeout(() => this.exitoMensaje = '', 3000);
        }
      },
      error: (error) => {
        console.error(`Error al ${accion} usuario:`, error);
        this.errorMensaje = error.error?.mensaje || `Error al ${accion} el usuario`;
      }
    });
  }

  buscar(): void {
    this.cargarUsuarios();
  }

  limpiarBusqueda(): void {
    this.busqueda = '';
    this.filtroPerfil = null;
    this.filtroArea = null;
    this.cargarUsuarios();
  }

  toggleMostrarInactivos(): void {
    this.mostrarInactivos = !this.mostrarInactivos;
    this.cargarUsuarios();
  }

  get usuariosFiltrados(): Usuario[] {
    return this.usuarios;
  }

  // Helper para obtener el nombre del perfil por ID
  getNombrePerfil(perfilId: number): string {
    const perfil = this.perfiles.find(p => p.id === perfilId);
    return perfil ? perfil.nombre : 'Sin perfil';
  }

  // Helper para obtener el color del badge del perfil
  getColorPerfil(perfilId: number): string {
    switch(perfilId) {
      case 4: return 'bg-red-100 text-red-800'; // MESASERVICIOSADMIN
      case 5: return 'bg-purple-100 text-purple-800'; // MESASERVICIOSSOPORTE
      case 6: return 'bg-blue-100 text-blue-800'; // MESASERVICIOSUSUARIO
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  // Actualizar visibilidad y validadores del campo área según perfil
  actualizarCampoArea(perfilId: number): void {
    const areaControl = this.usuarioForm.get('areaId');

    if (!areaControl) return;

    if (perfilId === 6) {
      // MESASERVICIOSUSUARIO: Ocultar campo área, limpiar valor y quitar validadores
      this.mostrarCampoArea = false;
      areaControl.setValue(null);
      areaControl.clearValidators();
    } else if (perfilId === 5) {
      // MESASERVICIOSSOPORTE: Mostrar campo área y hacerlo requerido
      this.mostrarCampoArea = true;
      areaControl.setValidators([Validators.required]);
    } else if (perfilId === 4) {
      // MESASERVICIOSADMIN: Mostrar campo área pero opcional
      this.mostrarCampoArea = true;
      areaControl.clearValidators();
    } else {
      // Otros perfiles: Mostrar como opcional
      this.mostrarCampoArea = true;
      areaControl.clearValidators();
    }

    areaControl.updateValueAndValidity();
  }
}
