import { Component, OnInit , inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { FieldsetModule } from 'primeng/fieldset';
import { MessageService } from 'primeng/api';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { MesaService } from '../../../../Services/mesa-servicios/mesa.service';
import { ServicioService } from '../../../../Services/appServices/general/servicio/servicio.service';
import { UserService } from '../../../../Services/appServices/userServices/user.service';
import { ParametrosService } from '../../../../Services/appServices/biomedicaServices/parametros/parametros.service';
import { EquiposService as EquipoService } from '../../../../Services/appServices/biomedicaServices/equipos/equipos.service';
import { TipoEquipoService } from '../../../../Services/appServices/general/tipoEquipo/tipo-equipo.service';
import { jwtDecode } from 'jwt-decode';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';

import { UppercaseDirective } from '../../../../Directives/uppercase.directive';

@Component({
  selector: 'app-mesa-caso-create',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ButtonModule, InputTextModule,
    TextareaModule, SelectModule, ToastModule, FieldsetModule,
    EditorModule, FileUploadModule, UppercaseDirective,
    IconFieldModule, InputIconModule, RouterModule, TagModule
  ],
  providers: [MessageService],
  templateUrl: './mesa-caso-create.component.html',
  styleUrl: './mesa-caso-create.component.css'
})
export class MesaCasoCreateComponent implements OnInit {

  caso: any = {
    titulo: '',
    descripcion: '',
    prioridad: 'MEDIA',
    tipo: 'INCIDENCIA'
  };

  servicios: any[] = [];
  categorias: any[] = [];
  subcategorias: any[] = [];

  // Selections
  selectedServicio: any = null;
  selectedCategoria: any = null;
  selectedSubcategoria: any = null;
  selectedSumerce: any = null;

  uploadedFiles: any[] = []; // Store selected files

  tipos = [
    { label: 'Incidencia', value: 'INCIDENCIA' },
    { label: 'Requerimiento', value: 'REQUERIMIENTO' }
  ];

  prioridades = [
    { label: 'Baja', value: 'BAJA' },
    { label: 'Media', value: 'MEDIA' },
    { label: 'Alta', value: 'ALTA' },
    { label: 'Crítica', value: 'CRITICA' }
  ];

  sumerceOptions = [
    { label: 'S - Seguro', value: 'S_SEGURO' },
    { label: 'U - Universitario', value: 'U_UNIVERSITARIO' },
    { label: 'M - Mejorado', value: 'M_MEJORADO' },
    { label: 'E - Eficiente', value: 'E_EFICIENTE' },
    { label: 'R - Responsable', value: 'R_RESPONSABLE' },
    { label: 'C - Cálido', value: 'C_CALIDO' },
    { label: 'E - Excelente', value: 'E_EXCELENTE' }
  ];

  parametrosService = inject(ParametrosService);
  equipoService = inject(EquipoService);
  tipoEquipoService = inject(TipoEquipoService);

  subcategoriaMantenimientoId: number | null = null;
  requiereEquipo: boolean = false;
  tiposEquipos: any[] = [];
  equiposFiltrados: any[] = [];
  selectedTipoEquipo: any = null;
  selectedEquipo: any = null;

  userId: number = 0;
  userRole: string = '';

  constructor(
    private mesaService: MesaService,
    private servicioService: ServicioService,
    private userService: UserService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.extractUser();
    this.loadServicios();
    this.cargarParametroSubcategoria();
  }

  extractUser() {
    const token = this.userService.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.id; // Assuming payload has id
      this.userRole = decoded.rol;
    }
  }

  loadServicios() {
    this.servicioService.getAllServiciosActivos().then(data => {
      let filtrados = data.filter((s: any) => s.requiereMesaServicios === true);
      this.servicios = filtrados.map((s: any) => {
        let limpio = s.nombres;
        // Quitar "SERVICIO HOSPITALARIO DE " (con DE)
        limpio = limpio.replace(/SERVICIO\s+HOSPITALARIO\s+DE\s+/i, '');
        // Quitar "SERVICIO HOSPITALARIO " (sin DE, por si acaso)
        limpio = limpio.replace(/SERVICIO\s+HOSPITALARIO\s+/i, '');
        return {
          ...s,
          nombres: limpio.trim()
        };
      });
    });
  }

  onServicioChange() {
    if (this.selectedServicio) {
      this.mesaService.getCategorias(this.selectedServicio.id, true).subscribe(data => {
        this.categorias = data;
        this.selectedCategoria = null;
        this.selectedSubcategoria = null;
        this.subcategorias = [];
      });
    } else {
      this.categorias = [];
    }
  }

  async cargarParametroSubcategoria() {
    try {
      const param = await this.parametrosService.getParametro('subcategoria_mantenimiento_equipo');
      if (param && param.valor) {
        this.subcategoriaMantenimientoId = parseInt(param.valor, 10);
      }
    } catch (e) { console.log('Sin parametro subcategoria'); }
  }

  onCategoriaChange() {
    if (this.selectedCategoria) {
      this.subcategorias = this.selectedCategoria.subcategorias || [];
      this.selectedSubcategoria = null;
    } else {
      this.subcategorias = [];
    }
  }

  onSubcategoriaChange() {
    if (this.selectedSubcategoria && this.selectedSubcategoria.id === this.subcategoriaMantenimientoId) {
      this.requiereEquipo = true;
      this.cargarEquiposServicio();
    } else {
      this.requiereEquipo = false;
      this.selectedTipoEquipo = null;
      this.selectedEquipo = null;
    }
  }

  async cargarEquiposServicio() {
    if (!this.selectedServicio) return;
    try {
      const [tipos, equipos] = await Promise.all([
        this.tipoEquipoService.getAllTiposEquipos(),
        this.equipoService.getAllEquiposServicio(this.selectedServicio.id)
      ]);
      this.tiposEquipos = tipos.filter((t: any) => t.activo === true);
      this.equiposFiltrados = equipos;
    } catch(e) { console.error('Error cargando equipos', e); }
  }

  onTipoEquipoChange() {
    // We can filter if needed, but PrimeNg dropdown allows filter.
    // We just clear selectedEquipo.
    this.selectedEquipo = null;
  }

  get filteredEquipos() {
    if (this.selectedTipoEquipo) {
      return this.equiposFiltrados.filter(e => e.tipoEquipoIdFk === this.selectedTipoEquipo.id);
    }
    return [];
  }

  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  getPrioridadSeverity(prioridad: string): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" | undefined {
    switch (prioridad) {
      case 'BAJA': return 'success';
      case 'MEDIA': return 'info';
      case 'ALTA': return 'warning';
      case 'CRITICA': return 'danger';
      default: return 'info';
    }
  }

  submit() {
    if (!this.caso.titulo || !this.selectedServicio || !this.selectedCategoria || !this.selectedSubcategoria || !this.selectedSumerce) {
      this.messageService.add({ severity: 'warn', summary: 'Faltan datos', detail: 'Complete todos los campos obligatorios' });
      return;
    }

    if (!this.caso.descripcion || this.caso.descripcion.trim() === '') {
      this.messageService.add({ severity: 'warn', summary: 'Descripción requerida', detail: 'Por favor ingrese una descripción detallada' });
      return;
    }

    const formData = new FormData();
    formData.append('titulo', this.caso.titulo);
    formData.append('descripcion', this.caso.descripcion);
    formData.append('prioridad', this.caso.prioridad || 'MEDIA');
    formData.append('tipo', this.caso.tipo || 'INCIDENCIA');
    formData.append('servicioId', this.selectedServicio.id);
    formData.append('sedeId', (this.selectedServicio.sedeIdFk || 1).toString());
    formData.append('categoriaId', this.selectedCategoria.id);
    formData.append('subcategoriaId', this.selectedSubcategoria.id);
    if (this.requiereEquipo) {
      if (this.selectedTipoEquipo) formData.append('tipoEquipoId', this.selectedTipoEquipo.id);
      if (this.selectedEquipo) formData.append('equipoId', this.selectedEquipo.id);
    }
    formData.append('sumerce', this.selectedSumerce.value);
    formData.append('creadorId', this.userId.toString());

    // Append files
    if (this.uploadedFiles && this.uploadedFiles.length > 0) {
      for (let file of this.uploadedFiles) {
        formData.append('archivos', file);
      }
    }

    this.mesaService.createCaso(formData).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Caso creado con éxito' });
        setTimeout(() => {
          this.router.navigate(['/adminmesaservicios/casos']);
        }, 1500);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el caso' });
      }
    });
  }
}
