import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriasService, Categoria } from '../../../Services/mesaServicios/categorias.service';
import { ServiciosService } from '../../../Services/mesaServicios/servicios.service';
import { Servicio } from '../../../models/mesaServicios/servicio.model';
import { AuthService } from '../../../Services/mesaServicios/auth.service';
import { fadeInAnimation, listAnimation, modalAnimation, scaleInAnimation } from '../../../animations/animations';

@Component({
  selector: 'app-lista-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './lista-categorias.component.html',
  animations: [fadeInAnimation, listAnimation, modalAnimation, scaleInAnimation]
})
export class ListaCategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  servicios: Servicio[] = [];
  cargando = false;
  errorMensaje = '';
  exitoMensaje = '';
  mostrarModal = false;
  enviando = false;
  filtroServicio = '';
  categoriaForm: FormGroup;

  constructor(
    private categoriasService: CategoriasService,
    private serviciosService: ServiciosService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.categoriaForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      servicio_id: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.cargarCategorias();
    this.cargarServicios();
  }

  cargarCategorias() {
    this.cargando = true;
    this.errorMensaje = '';

    const filtros: any = {};
    if (this.filtroServicio) filtros.servicio_id = parseInt(this.filtroServicio);

    this.categoriasService.listar(filtros).subscribe({
      next: (response) => {
        if (response.exito) {
          this.categorias = response.datos;
        }
        this.cargando = false;
      },
      error: (err) => {
        this.errorMensaje = 'Error al cargar las categorías';
        this.cargando = false;
      }
    });
  }

  cargarServicios() {
    this.serviciosService.listar().subscribe({
      next: (response) => {
        if (response.exito) {
          this.servicios = response.datos || [];
        }
      }
    });
  }

  aplicarFiltros() {
    this.cargarCategorias();
  }

  abrirModalNueva() {
    this.categoriaForm.reset();
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.categoriaForm.reset();
  }

  guardar() {
    this.guardarCategoria();
  }

  guardarCategoria() {
    if (this.categoriaForm.valid) {
      this.enviando = true;
      this.errorMensaje = '';
      this.exitoMensaje = '';

      const datos = {
        ...this.categoriaForm.value,
        servicio_id: parseInt(this.categoriaForm.value.servicio_id)
      };

      this.categoriasService.crear(datos).subscribe({
        next: (response) => {
          if (response.exito) {
            this.exitoMensaje = 'Categoría creada exitosamente';
            this.cerrarModal();
            this.cargarCategorias();
            setTimeout(() => this.exitoMensaje = '', 3000);
          }
          this.enviando = false;
        },
        error: (err) => {
          this.errorMensaje = err.error?.mensaje || 'Error al crear la categoría';
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
