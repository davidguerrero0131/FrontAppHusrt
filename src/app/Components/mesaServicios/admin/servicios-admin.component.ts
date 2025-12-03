import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ServiciosService } from '../../../Services/mesaServicios/servicios.service';
import { AreasService } from '../../../Services/mesaServicios/areas.service';
import { Servicio, CrearServicioDTO, ActualizarServicioDTO } from '../../../models/mesaServicios/servicio.model';
import { Area } from '../../../models/mesaServicios/area.model';
import { fadeInAnimation, listAnimation, modalAnimation, scaleInAnimation } from '../../../animations/animations';

@Component({
  selector: 'app-servicios-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './servicios-admin.component.html',
  styleUrls: ['./servicios-admin.component.css'],
  animations: [fadeInAnimation, listAnimation, modalAnimation, scaleInAnimation]
})
export class ServiciosAdminComponent implements OnInit {
  servicios: Servicio[] = [];
  areas: Area[] = [];
  servicioForm: FormGroup;
  cargando = false;
  enviando = false;
  errorMensaje = '';
  exitoMensaje = '';

  // Modal
  mostrarModal = false;
  modoEdicion = false;
  servicioEditando: Servicio | null = null;

  // Búsqueda y filtros
  busqueda = '';
  mostrarInactivos = false;

  constructor(
    private fb: FormBuilder,
    private serviciosService: ServiciosService,
    private areasService: AreasService
  ) {
    this.servicioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: [''],
      area_id: ['', [Validators.required]],
      orden: [0, [Validators.min(0)]],
      activo: [true]
    });
  }

  ngOnInit(): void {
    this.cargarAreas();
    this.cargarServicios();
  }

  cargarAreas(): void {
    this.areasService.listar().subscribe({
      next: (response) => {
        if (response.exito && response.datos) {
          this.areas = response.datos.filter((a: Area) => a.activo);
        }
      },
      error: (error) => {
        console.error('Error al cargar áreas:', error);
      }
    });
  }

  cargarServicios(): void {
    this.cargando = true;
    this.errorMensaje = '';

    this.serviciosService.listar({ busqueda: this.busqueda }).subscribe({
      next: (response) => {
        if (response.exito && response.datos) {
          this.servicios = this.mostrarInactivos
            ? response.datos
            : response.datos.filter((s: Servicio) => s.activo);
        }
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar servicios:', error);
        this.errorMensaje = 'Error al cargar los servicios';
        this.cargando = false;
      }
    });
  }

  abrirModalCrear(): void {
    this.modoEdicion = false;
    this.servicioEditando = null;
    this.servicioForm.reset({
      nombre: '',
      descripcion: '',
      area_id: '',
      orden: this.servicios.length + 1,
      activo: true
    });
    this.mostrarModal = true;
  }

  abrirModalEditar(servicio: Servicio): void {
    this.modoEdicion = true;
    this.servicioEditando = servicio;
    this.servicioForm.patchValue({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion || '',
      area_id: servicio.areaId,
      orden: servicio.orden || 0,
      activo: servicio.activo
    });
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.servicioForm.reset();
    this.errorMensaje = '';
  }

  guardar(): void {
    if (this.servicioForm.invalid) {
      Object.keys(this.servicioForm.controls).forEach(key => {
        this.servicioForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.enviando = true;
    this.errorMensaje = '';
    this.exitoMensaje = '';

    if (this.modoEdicion && this.servicioEditando) {
      this.actualizar();
    } else {
      this.crear();
    }
  }

  crear(): void {
    const datos: CrearServicioDTO = {
      nombre: this.servicioForm.value.nombre,
      descripcion: this.servicioForm.value.descripcion || undefined,
      areaId: parseInt(this.servicioForm.value.area_id),
      orden: this.servicioForm.value.orden
    };

    this.serviciosService.crear(datos).subscribe({
      next: (response) => {
        if (response.exito) {
          this.exitoMensaje = 'Servicio creado exitosamente';
          this.cargarServicios();
          this.cerrarModal();
          setTimeout(() => this.exitoMensaje = '', 3000);
        }
        this.enviando = false;
      },
      error: (error) => {
        console.error('Error al crear servicio:', error);
        this.errorMensaje = error.error?.mensaje || 'Error al crear el servicio';
        this.enviando = false;
      }
    });
  }

  actualizar(): void {
    if (!this.servicioEditando) return;

    const datos: ActualizarServicioDTO = {
      nombre: this.servicioForm.value.nombre,
      descripcion: this.servicioForm.value.descripcion || undefined,
      areaId: parseInt(this.servicioForm.value.area_id),
      orden: this.servicioForm.value.orden,
      activo: this.servicioForm.value.activo
    };

    this.serviciosService.actualizar(this.servicioEditando.id, datos).subscribe({
      next: (response) => {
        if (response.exito) {
          this.exitoMensaje = 'Servicio actualizado exitosamente';
          this.cargarServicios();
          this.cerrarModal();
          setTimeout(() => this.exitoMensaje = '', 3000);
        }
        this.enviando = false;
      },
      error: (error) => {
        console.error('Error al actualizar servicio:', error);
        this.errorMensaje = error.error?.mensaje || 'Error al actualizar el servicio';
        this.enviando = false;
      }
    });
  }

  toggleActivo(servicio: Servicio): void {
    const accion = servicio.activo ? 'desactivar' : 'activar';

    if (!confirm(`¿Está seguro de ${accion} el servicio "${servicio.nombre}"?`)) {
      return;
    }

    const datos: ActualizarServicioDTO = {
      activo: !servicio.activo
    };

    this.serviciosService.actualizar(servicio.id, datos).subscribe({
      next: (response) => {
        if (response.exito) {
          this.exitoMensaje = `Servicio ${accion === 'activar' ? 'activado' : 'desactivado'} exitosamente`;
          this.cargarServicios();
          setTimeout(() => this.exitoMensaje = '', 3000);
        }
      },
      error: (error) => {
        console.error(`Error al ${accion} servicio:`, error);
        this.errorMensaje = error.error?.mensaje || `Error al ${accion} el servicio`;
      }
    });
  }

  eliminar(servicio: Servicio): void {
    if (!confirm(`¿Está seguro de eliminar el servicio "${servicio.nombre}"?\n\nEsta acción no se puede deshacer.`)) {
      return;
    }

    this.serviciosService.desactivar(servicio.id).subscribe({
      next: (response) => {
        if (response.exito) {
          this.exitoMensaje = 'Servicio eliminado exitosamente';
          this.cargarServicios();
          setTimeout(() => this.exitoMensaje = '', 3000);
        }
      },
      error: (error) => {
        console.error('Error al eliminar servicio:', error);
        this.errorMensaje = error.error?.mensaje || 'Error al eliminar el servicio';
      }
    });
  }

  buscar(): void {
    this.cargarServicios();
  }

  limpiarBusqueda(): void {
    this.busqueda = '';
    this.cargarServicios();
  }

  toggleMostrarInactivos(): void {
    this.mostrarInactivos = !this.mostrarInactivos;
    this.cargarServicios();
  }

  get serviciosFiltrados(): Servicio[] {
    return this.servicios;
  }
}
