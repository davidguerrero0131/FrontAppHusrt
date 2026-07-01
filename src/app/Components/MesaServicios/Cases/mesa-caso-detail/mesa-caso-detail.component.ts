import { Component, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';
import { RatingModule } from 'primeng/rating';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { jwtDecode } from 'jwt-decode';
import { FileUploadModule } from 'primeng/fileupload';
import { EquiposService } from '../../../../Services/appServices/biomedicaServices/equipos/equipos.service';
import { TipoEquipoService } from '../../../../Services/appServices/general/tipoEquipo/tipo-equipo.service';
import { ParametrosService } from '../../../../Services/appServices/biomedicaServices/parametros/parametros.service';
import { PdfGeneratorService } from '../../../../Services/appServices/biomedicaServices/pdf-generator/pdf-generator.service';
import { ReportesService } from '../../../../Services/appServices/biomedicaServices/reportes/reportes.service';
import { ProtocolosService } from '../../../../Services/appServices/biomedicaServices/protocolos/protocolos.service';
import { ArchivosService } from '../../../../Services/appServices/general/archivos/archivos.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { MesaService } from '../../../../Services/mesa-servicios/mesa.service';
import { UserService } from '../../../../Services/appServices/userServices/user.service';

import { ChipModule } from 'primeng/chip';
import { EditorModule } from 'primeng/editor';
import { ImageModule } from 'primeng/image';
import { TooltipModule } from 'primeng/tooltip';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { API_URL } from '../../../../constantes';

@Component({
  selector: 'app-mesa-caso-detail',
  standalone: true,
  imports: [
    CommonModule, FormsModule, CardModule, ButtonModule, TextareaModule,
    TagModule, PanelModule, DialogModule, RatingModule, ToastModule, ConfirmDialogModule,
    FileUploadModule, SelectModule, ChipModule, RouterModule, EditorModule, ImageModule, TooltipModule,
    AutoCompleteModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './mesa-caso-detail.component.html',
  styleUrl: './mesa-caso-detail.component.css'
})
export class MesaCasoDetailComponent implements OnInit {
  requiereEquipo: boolean = false;
  equipoActual: any = null;
  tipoEquipoActual: any = null;
  editandoEquipo: boolean = false;
  tiposEquipos: any[] = [];
  filteredEquipos: any[] = [];
  selectedTipoEquipo: any = null;
  selectedEquipo: any = null;

  apiUrl = API_URL;
  casoId: number = 0;
  caso: any = null;
  userId: number = 0;

  get currentToken(): string {
    return this.userService.getToken() || '';
  }

  newMessage: string = '';
  uploadedFiles: any[] = []; // Store selected files

  editandoClasificacion: boolean = false;
  categorias: any[] = [];
  subcategoriasDisponibles: any[] = [];
  selectedCategoria: any = null;
  selectedSubcategoria: any = null;

  onFileSelect(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.uploadedFiles.push(files[i]);
      }
    }
    // Clear input so same file can be selected again if removed
    event.target.value = '';
  }

  removeFile(index: number) {
    this.uploadedFiles.splice(index, 1);
  }

  // Close Case Dialog
  displayCloseDialog: boolean = false;
  cierreMensaje: string = '';
  uploadedCloseFiles: any[] = [];

  onFileSelectClose(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.uploadedCloseFiles.push(files[i]);
      }
    }
    event.target.value = '';
  }

  removeFileClose(index: number) {
    this.uploadedCloseFiles.splice(index, 1);
  }

  // Rating Dialog
  displayRatingDialog: boolean = false;
  ratingValue: number = 0;
  ratingComment: string = '';

  // Assignment Dialog
  displayAssignDialog: boolean = false;
  usersService: any[] = [];
  selectedResolutor: any = null; // Can be single object or array if multiple="true"
  filteredUsers: any[] = [];

  filterUsers(event: any) {
    const query = event.query.toLowerCase();
    this.filteredUsers = this.usersService.filter(user =>
      user.nombres.toLowerCase().includes(query) ||
      user.apellidos.toLowerCase().includes(query) ||
      (user.mesaServicioRol?.nombre && user.mesaServicioRol.nombre.toLowerCase().includes(query))
    );
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mesaService: MesaService,
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private equipoService: EquiposService,
    private tipoEquipoService: TipoEquipoService,
    private parametrosService: ParametrosService,
    private pdfGeneratorService: PdfGeneratorService,
    private reportesService: ReportesService,
    private protocolosService: ProtocolosService,
    private archivosService: ArchivosService,
    @Optional() public config: DynamicDialogConfig
  ) { }

  userRole: string = '';
  modalReport: boolean = false;
  reportSelected: any = null;
  rutina: any[] = [];

  iniciarEdicionClasificacion() {
    this.editandoClasificacion = true;
    this.selectedCategoria = this.caso?.categoria;
    this.selectedSubcategoria = this.caso?.subcategoria;
    
    if (this.caso?.servicioId || this.caso?.servicio?.id) {
      const sId = this.caso.servicioId || this.caso.servicio.id;
      this.mesaService.getCategorias(sId, true).subscribe(cat => {
        this.categorias = cat;
        if (this.selectedCategoria) {
            const matchingCat = this.categorias.find((c: any) => c.id === this.selectedCategoria.id);
            if (matchingCat) {
                this.selectedCategoria = matchingCat;
                this.subcategoriasDisponibles = matchingCat.subcategorias || [];
                if (this.selectedSubcategoria) {
                    this.selectedSubcategoria = this.subcategoriasDisponibles.find((s: any) => s.id === this.selectedSubcategoria.id);
                }
            }
        }
      });
    }
  }

  cancelarEdicionClasificacion() {
    this.editandoClasificacion = false;
  }

  onCategoriaChange() {
    if (this.selectedCategoria) {
        this.subcategoriasDisponibles = this.selectedCategoria.subcategorias || [];
    } else {
        this.subcategoriasDisponibles = [];
    }
    this.selectedSubcategoria = null;
  }

  guardarClasificacion() {
    if (!this.selectedCategoria) {
        this.messageService.add({ severity: 'warn', summary: 'Requerido', detail: 'Debe seleccionar una categoría' });
        return;
    }

    const payload = {
        categoriaId: this.selectedCategoria.id,
        subcategoriaId: this.selectedSubcategoria ? this.selectedSubcategoria.id : null,
        usuarioId: this.userId
    };

    this.mesaService.updateCasoDetails(this.casoId, payload).subscribe({
        next: () => {
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Clasificación actualizada' });
            this.editandoClasificacion = false;
            this.loadCaso();
        },
        error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la clasificación' });
        }
    });
  }

  irACrearReporte() {
    if (this.equipoActual) {
      if (this.tipoEquipoActual?.tipoR === 1 || this.tipoEquipoActual?.tipoR === 2) {
        this.router.navigate(['/biomedica/nuevoreporte', this.equipoActual.id], { queryParams: { casoId: this.casoId } });
      } else {
        this.router.navigate(['/mantenimiento/nuevoreporte', this.equipoActual.id], { queryParams: { casoId: this.casoId } });
      }
    }
  }

  irAReportesEquipo() {
    if (this.equipoActual) {
      if (this.tipoEquipoActual?.tipoR === 1 || this.tipoEquipoActual?.tipoR === 2) {
        this.router.navigate(['/biomedica/reportesequipo', this.equipoActual.id]);
      } else {
        this.router.navigate(['/mantenimiento/reportesequipo', this.equipoActual.id]);
      }
    }
  }

  async irAVerReporte() {
    const reporteId = this.caso?.reporteMantenimiento?.id || this.caso?.biomedicaInfo?.reporteId;
    if (reporteId) {
      try {
        this.reportSelected = await this.reportesService.getReporteById(reporteId);
        if (this.tipoEquipoActual?.tipoR === 1 || this.tipoEquipoActual?.tipoR === 2) {
           this.rutina = await this.protocolosService.getCumplimientoProtocoloReporte(reporteId);
        }
        this.modalReport = true;
      } catch (error) {
        console.error('Error fetching report details:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la información del reporte.' });
      }
    }
  }

  async viewPdf(ruta: string) {
    try {
      const blob = await this.archivosService.getArchivo(ruta);
      if (blob.type === 'application/pdf') {
        const objectUrl = URL.createObjectURL(blob);
        window.open(objectUrl, '_blank');
      } else {
        const errorText = await blob.text();
        console.error('No se recibió un PDF:', errorText);
      }
    } catch (error) {
      console.error('Error al obtener el PDF:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo abrir el archivo PDF.' });
    }
  }

  descargarFormato() {
    if (this.reportSelected) {
      if (this.reportSelected.tipoMantenimiento === 'Preventivo') {
        this.pdfGeneratorService.generateReportePreventivo(this.reportSelected);
      } else {
        this.pdfGeneratorService.generateReporteCorrectivo(this.reportSelected);
      }
    }
  }

  iniciarEdicionEquipo() {
    this.editandoEquipo = true;
    this.selectedEquipo = this.equipoActual;
    this.selectedTipoEquipo = this.tipoEquipoActual;
  }

  cancelarEdicionEquipo() {
    this.editandoEquipo = false;
    this.selectedEquipo = this.equipoActual;
    this.selectedTipoEquipo = this.tipoEquipoActual;
  }

  guardarEquipoCaso() {
    if (!this.selectedEquipo) {
      this.messageService.add({ severity: 'warn', summary: 'Requerido', detail: 'Debe seleccionar un equipo' });
      return;
    }

    const payload = {
      equipoId: this.selectedEquipo.id,
      tipoEquipoId: this.selectedTipoEquipo.id,
      usuarioId: this.userId
    };

    this.mesaService.updateEquipoCaso(this.casoId, payload).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Equipo asociado al caso exitosamente' });
        this.equipoActual = this.selectedEquipo;
        this.tipoEquipoActual = this.selectedTipoEquipo;
        this.editandoEquipo = false;
        this.loadCaso();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo asociar el equipo' });
      }
    });
  }

  ngOnInit() {
    this.extractUser();
    this.cargarParametroSubcategoria();
    if (this.config && this.config.data && this.config.data.casoId) {
      this.casoId = this.config.data.casoId;
      this.loadCaso();
      this.loadTiposEquipos();
    } else {
      this.route.params.subscribe(params => {
        this.casoId = +params['id'];
        if (this.casoId) {
          this.loadCaso();
          this.loadTiposEquipos();
        }
      });
    }
  }

  subcategoriaMantenimientoId: number = 0;

  async cargarParametroSubcategoria() {
    try {
      const param = await this.parametrosService.getParametro('subcategoria_mantenimiento_equipo');
      if (param && param.valor) {
        this.subcategoriaMantenimientoId = parseInt(param.valor, 10);
      }
    } catch (e) { console.log('Sin parametro subcategoria'); }
  }

  userRoleCode: string = '';
  userServiceId: number = 0;

  extractUser() {
    const token = this.userService.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.id;
      this.userRole = decoded.rol;

      this.userService.getUserProfil(this.userId).then(user => {
        if (user && user.mesaServicioRol) {
          this.userRoleCode = user.mesaServicioRol.codigo;
          this.userServiceId = user.servicioId;
        }
      });
    }
  }

  loadTiposEquipos() {
    this.tipoEquipoService.getAllTiposEquipos().then((res: any) => {
      this.tiposEquipos = res;
    });
  }

  loadEquipos(tipoId: number) {
    this.equipoService.getAllEquiposTipo(tipoId).then((res: any) => {
      this.filteredEquipos = res.filter((e: any) => e.estadoBaja === false);
    }).catch(e => console.error("Error cargando equipos", e));
  }

  get selectedTipoEquipoGetter() {
    return this.selectedTipoEquipo;
  }

  set selectedTipoEquipoGetter(val) {
    this.selectedTipoEquipo = val;
    this.selectedEquipo = null;
    if (val) {
      this.loadEquipos(val.id);
    } else {
      this.filteredEquipos = [];
    }
  }
    if (!this.selectedResolutor) return;

    this.confirmationService.confirm({
      message: '¿Está seguro de actualizar los responsables asignados a este caso?',
      header: 'Confirmar Actualización de Asignaciones',
      icon: 'pi pi-users',
      accept: () => {
        const selectedList = Array.isArray(this.selectedResolutor) ? this.selectedResolutor : [this.selectedResolutor];
        const selectedIds = selectedList.map(u => u.id);
        const currentIds = this.caso.asignaciones.map((a: any) => a.usuarioId);

        // Identify new assignments
        const toAdd = selectedList.filter(u => !currentIds.includes(u.id));
        
        // Identify removals
        const toRemove = this.caso.asignaciones.filter((a: any) => !selectedIds.includes(a.usuarioId));

        let totalOps = toAdd.length + toRemove.length;
        if (totalOps === 0) {
          this.displayAssignDialog = false;
          return;
        }

        let completed = 0;
        let errors = 0;

        const checkFinalize = () => {
          completed++;
          if (completed === totalOps) {
            this.displayAssignDialog = false;
            this.selectedResolutor = null;
            this.messageService.add({ 
              severity: errors === 0 ? 'success' : 'warn', 
              summary: 'Actualización Finalizada', 
              detail: errors === 0 ? 'Responsables actualizados correctamente' : 'Se completó con algunos errores' 
            });
            this.loadCaso();
          }
        };

        // Process Additions
        toAdd.forEach((user: any) => {
          const payload = { usuarioId: user.id, asignadoPor: this.userId };
          this.mesaService.assignResolutor(this.casoId, payload).subscribe({
            next: () => checkFinalize(),
            error: () => { errors++; checkFinalize(); }
          });
        });

        // Process Removals
        toRemove.forEach((asig: any) => {
          const payload = { usuarioId: asig.usuarioId, desasignadoPor: this.userId };
          this.mesaService.removeResolutor(this.casoId, payload).subscribe({
            next: () => checkFinalize(),
            error: () => { errors++; checkFinalize(); }
          });
        });
      }
    });
  }

  removeResolutor(usuarioId: number) {
    if (!usuarioId) return;

    this.confirmationService.confirm({
      message: '¿Está seguro de quitar a este resolutor del caso?',
      header: 'Confirmar Desasignación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const payload = {
          usuarioId: usuarioId,
          desasignadoPor: this.userId
        };

        this.mesaService.removeResolutor(this.casoId, payload).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Desasignado', detail: 'Resolutor eliminado del caso' });
            this.loadCaso();
          },
          error: (err: any) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Error al desasignar' });
          }
        });
      }
    });
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return parts[0].charAt(0).toUpperCase();
  }

  getRatingEmoji(val: number | undefined): string {
    switch(val) {
      case 1: return '😠';
      case 2: return '🙁';
      case 3: return '😐';
      case 4: return '🙂';
      case 5: return '🤩';
      default: return '❓';
    }
  }

  getRatingLabel(val: number | undefined): string {
    switch(val) {
      case 1: return 'Muy Malo';
      case 2: return 'Malo';
      case 3: return 'Regular';
      case 4: return 'Bueno';
      case 5: return 'Excelente';
      default: return 'Sin calificar';
    }
  }
}
