import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AreasService, Area } from '../../../Services/mesaServicios/areas.service';
import { AuthService } from '../../../Services/mesaServicios/auth.service';
import { fadeInAnimation, listAnimation, modalAnimation, scaleInAnimation } from '../../../animations/animations';

@Component({
  selector: 'app-lista-areas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './lista-areas.component.html',
  animations: [fadeInAnimation, listAnimation, modalAnimation, scaleInAnimation]
})
export class ListaAreasComponent implements OnInit {
  areas: Area[] = [];
  cargando = false;
  errorMensaje = '';
  exitoMensaje = '';
  mostrarModal = false;
  enviando = false;
  areaPadreSeleccionada: number | null = null;
  areaForm: FormGroup;

  constructor(
    private areasService: AreasService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.areaForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      area_padre_id: ['']
    });
  }

  ngOnInit() {
    this.cargarAreas();
  }

  cargarAreas() {
    this.cargando = true;
    this.errorMensaje = '';

    this.areasService.listar().subscribe({
      next: (response) => {
        if (response.exito) {
          this.areas = response.datos || [];
          console.log('Áreas cargadas:', this.areas);
          if (this.areas.length > 0) {
            console.log('Primera área:', this.areas[0]);
            console.log('ruta_completa:', this.areas[0].ruta_completa);
            console.log('nivel:', this.areas[0].nivel);
          }
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar áreas:', err);
        this.errorMensaje = 'Error al cargar las áreas';
        this.cargando = false;
      }
    });
  }

  abrirModalNueva(areaPadreId?: number) {
    this.areaForm.reset();
    this.areaPadreSeleccionada = areaPadreId || null;

    if (areaPadreId) {
      this.areaForm.patchValue({ area_padre_id: areaPadreId });
    }

    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.areaForm.reset();
    this.areaPadreSeleccionada = null;
  }

  obtenerNombreAreaPadre(): string {
    if (!this.areaPadreSeleccionada) return '';
    const area = this.areas.find(a => a.id === this.areaPadreSeleccionada);
    return area?.ruta_completa || '';
  }

  guardarArea() {
    if (this.areaForm.valid) {
      this.enviando = true;
      this.errorMensaje = '';
      this.exitoMensaje = '';

      const datos = {
        nombre: this.areaForm.value.nombre,
        descripcion: this.areaForm.value.descripcion || undefined,
        area_padre_id: this.areaForm.value.area_padre_id ? parseInt(this.areaForm.value.area_padre_id) : undefined
      };

      this.areasService.crear(datos).subscribe({
        next: (response) => {
          if (response.exito) {
            this.exitoMensaje = 'Área creada exitosamente';
            this.cerrarModal();
            this.cargarAreas();
            setTimeout(() => this.exitoMensaje = '', 3000);
          }
          this.enviando = false;
        },
        error: (err) => {
          this.errorMensaje = err.error?.mensaje || 'Error al crear el área';
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
