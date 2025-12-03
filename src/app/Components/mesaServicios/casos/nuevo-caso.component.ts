import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CasosService } from '../../../Services/mesaServicios/casos.service';
import { AreasService } from '../../../Services/mesaServicios/areas.service';
import { CategoriasService } from '../../../Services/mesaServicios/categorias.service';
import { ServiciosService } from '../../../Services/mesaServicios/servicios.service';
import { SeguimientosService } from '../../../Services/mesaServicios/seguimientos.service';
import { FormatosService } from '../../../Services/mesaServicios/formatos.service';
import { Area } from '../../../models/mesaServicios/area.model';
import { Categoria } from '../../../models/mesaServicios/categoria.model';
import { Servicio } from '../../../models/mesaServicios/servicio.model';
import { TipoCaso, Prioridad, PromesaValor, CrearCasoDTO, DatoFormato } from '../../../models/mesaServicios/caso.model';
import { Formato, TipoCampo } from '../../../models/mesaServicios/formato.model';
import { fadeInAnimation, listAnimation, modalAnimation, scaleInAnimation } from '../../../animations/animations';

@Component({
  selector: 'app-nuevo-caso',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './nuevo-caso.component.html',
  animations: [fadeInAnimation, listAnimation, modalAnimation, scaleInAnimation]
})
export class NuevoCasoComponent implements OnInit {
  casoForm: FormGroup;
  formatosForm: FormGroup;

  areas: Area[] = [];
  categoriasFiltradas: Categoria[] = [];
  servicios: Servicio[] = [];
  formatosPersonalizados: Formato[] = [];

  tiposCaso: TipoCaso[] = ['requerimiento', 'incidencia'];
  prioridades: Prioridad[] = ['baja', 'media', 'alta', 'critica'];
  promesasValor: PromesaValor[] = ['SEGURO', 'UNIVERSITARIO', 'MEJORADO', 'EFICIENTE', 'RESPONSABLE', 'CALIDO', 'EXCELENTE'];

  archivosSeleccionados: File[] = [];
  enviando = false;
  errorMensaje = '';
  exitoMensaje = '';
  mostrarFormatos = false;

  constructor(
    private fb: FormBuilder,
    private casosService: CasosService,
    private areasService: AreasService,
    private categoriasService: CategoriasService,
    private serviciosService: ServiciosService,
    private seguimientosService: SeguimientosService,
    private formatosService: FormatosService,
    private router: Router
  ) {
    this.casoForm = this.fb.group({
      tipo: ['requerimiento', Validators.required],
      area_id: ['', Validators.required],
      categoria_id: ['', Validators.required],
      promesa_valor: [''],
      servicio_id: ['', Validators.required],
      ubicacion_especifica: [''],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      prioridad: ['media', Validators.required]
    });

    this.formatosForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.cargarAreas();
    this.cargarServicios();

    // Configurar listener para cambios en el tipo de caso
    this.casoForm.get('tipo')?.valueChanges.subscribe(tipo => {
      this.aplicarLogicaCondicional(tipo);
    });
  }

  cargarAreas(): void {
    this.areasService.listarGestionanSolicitudes().subscribe({
      next: (response) => {
        if (response.exito && response.datos) {
          this.areas = response.datos;
        }
      },
      error: (error) => {
        console.error('Error al cargar áreas:', error);
        this.errorMensaje = 'Error al cargar las áreas';
      }
    });
  }

  cargarServicios(): void {
    this.serviciosService.listar().subscribe({
      next: (response) => {
        if (response.exito && response.datos) {
          this.servicios = response.datos;
        }
      },
      error: (error) => {
        console.error('Error al cargar servicios:', error);
        this.errorMensaje = 'Error al cargar los servicios';
      }
    });
  }

  onAreaChange(): void {
    const areaId = this.casoForm.get('area_id')?.value;
    if (areaId) {
      this.categoriasService.obtenerPorArea(parseInt(areaId)).subscribe({
        next: (response) => {
          if (response.exito && response.datos) {
            this.categoriasFiltradas = response.datos;
          }
          this.casoForm.patchValue({ categoria_id: '' });
        },
        error: (error) => {
          console.error('Error al cargar categorías:', error);
        }
      });
    } else {
      this.categoriasFiltradas = [];
    }
    this.formatosPersonalizados = [];
    this.mostrarFormatos = false;
  }

  onCategoriaChange(): void {
    const categoriaId = this.casoForm.get('categoria_id')?.value;
    const tipo = this.casoForm.get('tipo')?.value;

    // Solo cargar formatos si es requerimiento
    if (categoriaId && tipo === 'requerimiento') {
      this.cargarFormatosPersonalizados(parseInt(categoriaId));
    } else {
      this.formatosPersonalizados = [];
      this.mostrarFormatos = false;
    }
  }

  onTipoChange(): void {
    const tipo = this.casoForm.get('tipo')?.value;
    this.aplicarLogicaCondicional(tipo);
  }

  /**
   * LÓGICA CONDICIONAL: Incidencia vs Requerimiento
   * - Incidencia: Área fija en "Gestión de la Información"
   * - Requerimiento: Todas las áreas disponibles
   */
  aplicarLogicaCondicional(tipo: TipoCaso): void {
    const areaControl = this.casoForm.get('area_id');
    const categoriaControl = this.casoForm.get('categoria_id');

    if (tipo === 'incidencia') {
      // Buscar el área "Gestión de la Información"
      const areaGestionInfo = this.areas.find(a => a.nombre === 'Gestión de la Información');

      if (areaGestionInfo) {
        // Fijar el área automáticamente
        areaControl?.setValue(areaGestionInfo.id.toString());
        areaControl?.disable();  // Deshabilitar para que no se pueda cambiar

        // Cargar categorías del área fija
        this.onAreaChange();
      } else {
        console.error('No se encontró el área "Gestión de la Información"');
        this.errorMensaje = 'Error: No se encontró el área de Gestión de la Información';
      }

      // Las incidencias no usan formatos personalizados
      this.formatosPersonalizados = [];
      this.mostrarFormatos = false;

    } else if (tipo === 'requerimiento') {
      // Habilitar el selector de áreas para requerimientos
      areaControl?.enable();

      // Limpiar selección para que el usuario elija
      areaControl?.setValue('');
      categoriaControl?.setValue('');
      this.categoriasFiltradas = [];

      // Verificar si hay categoría seleccionada para cargar formatos
      const categoriaId = categoriaControl?.value;
      if (categoriaId) {
        this.cargarFormatosPersonalizados(parseInt(categoriaId));
      } else {
        this.formatosPersonalizados = [];
        this.mostrarFormatos = false;
      }
    }
  }

  cargarFormatosPersonalizados(categoriaId: number): void {
    this.formatosService.listarPorCategoria(categoriaId).subscribe({
      next: (response) => {
        if (response.exito && response.datos) {
          this.formatosPersonalizados = response.datos.filter(f => f.activo);

          // Crear controles dinámicos en el formulario
          this.formatosPersonalizados.forEach(formato => {
            const validators = formato.obligatorio ? [Validators.required] : [];
            this.formatosForm.addControl(
              `formato_${formato.id}`,
              this.fb.control('', validators)
            );
          });

          this.mostrarFormatos = this.formatosPersonalizados.length > 0;
        }
      },
      error: (error) => {
        console.error('Error al cargar formatos:', error);
        this.formatosPersonalizados = [];
        this.mostrarFormatos = false;
      }
    });
  }

  onFileSelect(event: any): void {
    const files: FileList = event.target.files;
    this.archivosSeleccionados = Array.from(files);
  }

  eliminarArchivo(index: number): void {
    this.archivosSeleccionados.splice(index, 1);
  }

  enviar(): void {
    if (this.casoForm.invalid) {
      Object.keys(this.casoForm.controls).forEach(key => {
        this.casoForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.enviando = true;
    this.errorMensaje = '';
    this.exitoMensaje = '';

    // Usar getRawValue() para incluir controles deshabilitados (como área en incidencias)
    const formData = this.casoForm.getRawValue();

    // Recopilar datos de formatos dinámicos
    const datosFormatos: DatoFormato[] = [];
    if (this.mostrarFormatos && this.formatosPersonalizados.length > 0) {
      const formatosData = this.formatosForm.getRawValue();
      this.formatosPersonalizados.forEach(formato => {
        const valor = formatosData[`formato_${formato.id}`];
        if (valor) {
          datosFormatos.push({
            formato_id: formato.id,
            valor: valor
          });
        }
      });
    }

    const datos: CrearCasoDTO = {
      tipo: formData.tipo,
      area_id: parseInt(formData.area_id),
      categoria_id: parseInt(formData.categoria_id),
      servicio_id: parseInt(formData.servicio_id),
      promesa_valor: formData.promesa_valor || undefined,
      ubicacion_especifica: formData.ubicacion_especifica || undefined,
      descripcion: formData.descripcion,
      prioridad: formData.prioridad,
      datos_formatos: datosFormatos.length > 0 ? datosFormatos : undefined
    };

    this.casosService.crear(datos).subscribe({
      next: (response) => {
        if (response.exito && response.datos) {
          const casoId = response.datos.id;

          // Subir archivos si hay
          if (this.archivosSeleccionados.length > 0) {
            this.subirArchivos(casoId);
          } else {
            this.exitoMensaje = `Caso ${response.datos.numero_caso} creado exitosamente`;
            setTimeout(() => {
              this.router.navigate(['/mesaservicios/casos', casoId]);
            }, 1500);
          }
        }
        this.enviando = false;
      },
      error: (error) => {
        console.error('Error al crear caso:', error);
        this.errorMensaje = error.error?.mensaje || 'Error al crear el caso';
        this.enviando = false;
      }
    });
  }

  subirArchivos(casoId: number): void {
    let archivosSubidos = 0;
    const totalArchivos = this.archivosSeleccionados.length;

    this.archivosSeleccionados.forEach((archivo) => {
      this.seguimientosService.subirArchivo(archivo, 'caso', casoId).subscribe({
        next: () => {
          archivosSubidos++;
          if (archivosSubidos === totalArchivos) {
            this.exitoMensaje = 'Caso y archivos creados exitosamente';
            setTimeout(() => {
              this.router.navigate(['/mesaservicios/casos', casoId]);
            }, 1500);
          }
        },
        error: (error) => {
          console.error('Error al subir archivo:', archivo.name, error);
          archivosSubidos++;
          if (archivosSubidos === totalArchivos) {
            this.exitoMensaje = 'Caso creado, algunos archivos no se pudieron subir';
            setTimeout(() => {
              this.router.navigate(['/mesaservicios/casos', casoId]);
            }, 2000);
          }
        }
      });
    });
  }

  cancelar(): void {
    this.router.navigate(['/mesaservicios/casos']);
  }
}
