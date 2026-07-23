const fs = require('fs');
const path = 'd:/REPOSITORIO_NUEVO_APLICATIVO_HUSRT/FrontAppHusrt/src/app/Components/userBiomedica/Reportes/ver-reporte/ver-reporte.component.ts';
let content = fs.readFileSync(path, 'utf8');

// 1. Add missing imports
const importsToAdd = 
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { ReporteBajaModalComponent } from '../../vista-Equipos/reporte-baja-modal/reporte-baja-modal.component';
import { obtenerNombreMes, getDecodedAccessToken } from '../../../../../utilidades';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { InputTextareaModule } from 'primeng/inputtextarea';
;
content = importsToAdd + content;

// Update imports array
content = content.replace(
  'imports: [TableModule, IconFieldModule, InputIconModule, InputTextModule, SplitButtonModule, ButtonModule, CommonModule, Dialog, CardModule, PanelModule, TabViewModule, TagModule, TooltipModule, FormsModule, DropdownModule, CalendarModule],',
  'imports: [TableModule, IconFieldModule, InputIconModule, InputTextModule, SplitButtonModule, ButtonModule, CommonModule, Dialog, CardModule, PanelModule, TabViewModule, TagModule, TooltipModule, FormsModule, DropdownModule, CalendarModule, DatePickerModule, CheckboxModule, SelectModule, InputTextareaModule],'
);
content = content.replace('providers: []', 'providers: [DialogService, MessageService]');
// If there are no providers, add it
if (!content.includes('providers:')) {
  content = content.replace('templateUrl:', 'providers: [DialogService, MessageService],\n  templateUrl:');
}

// 2. Add variables and methods
const codeToAdd = 
  // --- Variables para Opciones ---
  opcionesHV: any[] = [];
  ref: DynamicDialogRef | undefined;
  dialogService = inject(DialogService);
  messageService = inject(MessageService);

  // Variables Plan Mantenimiento
  displayPlanDialog: boolean = false;
  currentEquipo: any = null;
  selectedMonths: any[] = [];
  selectedPlans: any[] = [];
  intervencionesAnuales: number = 1;
  mesInicio: number = 1;
  anioInicio: number = new Date().getFullYear();
  calculatedMonthsText: string = '';
  libreMantenimiento: boolean = false;

  intervencionOptions = [
    { name: '1 vez al año (Anual)', value: 1 },
    { name: '2 veces al año (Semestral)', value: 2 },
    { name: '3 veces al año (Cuatrimestral)', value: 3 },
    { name: '4 veces al año (Trimestral)', value: 4 }
  ];
  anioOptions = Array.from({ length: 11 }, (_, i) => ({ name: (new Date().getFullYear() + i).toString(), value: new Date().getFullYear() + i }));

  // Variables Traslados
  displayTrasladoDialog: boolean = false;
  displayHistorialTrasladosDialog: boolean = false;
  historialUnificado: any[] = [];
  selectedEquipoTraslado: any = null;
  servicioDestinoId: number | null = null;
  ubicacionDestino: string = '';
  ubicacionEspecificaDestino: string = '';
  nombreReceptor: string = '';
  cargoReceptor: string = '';
  entregadoPor: string = '';
  cedulaEntrega: string = '';
  cargoEntrega: string = '';
  cedulaRecibe: string = '';
  observacionesTransferencia: string = '';
  serviciosList: any[] = [];

  monthOptions: any[] = [
    { name: 'Enero', value: 1 }, { name: 'Febrero', value: 2 }, { name: 'Marzo', value: 3 },
    { name: 'Abril', value: 4 }, { name: 'Mayo', value: 5 }, { name: 'Junio', value: 6 },
    { name: 'Julio', value: 7 }, { name: 'Agosto', value: 8 }, { name: 'Septiembre', value: 9 },
    { name: 'Octubre', value: 10 }, { name: 'Noviembre', value: 11 }, { name: 'Diciembre', value: 12 }
  ];

  // Variables Metrologia Plan
  displayPlanMetrologiaDialog: boolean = false;
  libreActividadesMetrologicas: boolean = false;
  intervencionesAnualesMetrologia: number = 1;
  mesInicioMetrologia: number = 1;
  anioInicioMetrologia: number = new Date().getFullYear();
  selectedPlansMetrologia: any[] = [];
  calculatedMonthsTextMetrologia: string = '';
  tipoActividadGlobal: string = 'Calibración';

  tipoActividadOptions: any[] = [
    { label: 'Calibración', value: 'Calibración' },
    { label: 'Calificación', value: 'Calificación' },
    { label: 'Mantenimiento Correctivo', value: 'Mantenimiento Correctivo' },
    { label: 'Inspección', value: 'Inspección' }
  ];

  // Variables Metrologia Actividad
  modalAddActividadMetrologica: boolean = false;
  tipoActividad: string = '';
  empresa: string = '';
  fechaRealizadoActividad: Date | undefined;
  resultado: string = '';
  errorMaximoIdentificado: number | null = null;
  observacionesMetrologia: string = '';
  unidadMedicion: string = '';
  selectedFileConfirmacion: File | null = null;
  opcionesResultado: any[] = [
    { label: 'Cumple', value: 'Cumple' }, { label: 'No Cumple', value: 'No Cumple' }, { label: 'No Aplica', value: 'No Aplica' }
  ];

  // Métodos
  initOpcionesHV() {
    this.opcionesHV = [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => this.editarEquipo(this.equipo.id),
        visible: ['BIOMEDICAADMIN', 'SUPERADMIN', 'BIOMEDICAUSER'].includes(getDecodedAccessToken().rol)
      },
      {
        label: 'Editar Plan Mantenimiento',
        icon: 'pi pi-calendar',
        command: () => this.openPlanDialog(this.equipo),
        visible: ['BIOMEDICAADMIN', 'SUPERADMIN'].includes(getDecodedAccessToken().rol)
      },
      {
        label: 'Editar Plan Metrología',
        icon: 'pi pi-cog',
        command: () => this.openPlanMetrologiaDialog(this.equipo),
        visible: ['BIOMEDICAADMIN', 'SUPERADMIN'].includes(getDecodedAccessToken().rol) && this.equipo?.tipoEquipos?.requiereMetrologia
      },
      {
        label: 'Registrar Actividad Metrológica',
        icon: 'pi pi-file-excel',
        command: () => this.viewModalMetrologia(this.equipo),
        visible: ['BIOMEDICAADMIN', 'SUPERADMIN', 'BIOMEDICAUSER'].includes(getDecodedAccessToken().rol)
      },
      {
        label: 'Dar de Baja',
        icon: 'pi pi-trash',
        command: () => this.darDeBaja(this.equipo),
        visible: ['BIOMEDICAADMIN', 'BIOMEDICAUSER', 'SUPERADMIN'].includes(getDecodedAccessToken().rol)
      },
      {
        label: 'Registrar Traslado',
        icon: 'pi pi-send',
        command: () => this.abrirModalTraslado(this.equipo),
        visible: ['BIOMEDICAADMIN', 'BIOMEDICAUSER', 'SUPERADMIN', 'BIOMEDICATECNICO'].includes(getDecodedAccessToken().rol)
      },
      {
        label: 'Historial Movimientos',
        icon: 'pi pi-history',
        command: () => this.verHistorialTraslados(this.equipo),
        visible: ['BIOMEDICAADMIN', 'BIOMEDICAUSER', 'SUPERADMIN'].includes(getDecodedAccessToken().rol)
      },
      {
        label: 'Ver Hoja de Vida',
        icon: 'pi pi-eye',
        command: () => this.verHojaVida()
      },
      {
        label: 'Nuevo reporte',
        icon: 'pi pi-upload',
        command: () => this.nuevoReporte(this.equipo.id),
        visible: ['BIOMEDICAADMIN', 'BIOMEDICAUSER', 'SUPERADMIN', 'BIOMEDICATECNICO'].includes(getDecodedAccessToken().rol)
      }
    ];
  }

  editarEquipo(id: number) { this.router.navigate(['biomedica/adminequipos/edit/', id]); }
  nuevoReporte(id: number) { 
    if (typeof localStorage !== 'undefined') localStorage.setItem('TipoMantenimiento', 'C');
    this.router.navigate(['biomedica/nuevoreporte/', id]); 
  }
  
  darDeBaja(equipo: any) {
    this.ref = this.dialogService.open(ReporteBajaModalComponent, {
      header: 'Reporte de Baja - ' + equipo.nombres + ' (' + equipo.serie + ')',
      width: '50vw',
      breakpoints: { '960px': '75vw', '640px': '90vw' },
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      data: { equipoId: equipo.id },
      closable: true
    });
    this.ref.onClose.subscribe((result: any) => { if (result) { window.location.reload(); } });
  }

  openPlanDialog(equipo: any) {
    this.currentEquipo = equipo;
    this.displayPlanDialog = true;
    this.libreMantenimiento = equipo.periodicidadM === 0;
    if (equipo.planesMantenimiento && equipo.planesMantenimiento.length > 0) {
      const firstPlan = equipo.planesMantenimiento[0];
      this.mesInicio = firstPlan.mes || 1;
      this.anioInicio = firstPlan.ano || new Date().getFullYear();
      this.intervencionesAnuales = equipo.periodicidadM || 1;
      this.selectedPlans = equipo.planesMantenimiento;
    } else {
      this.mesInicio = new Date().getMonth() + 1;
      this.anioInicio = new Date().getFullYear();
      this.intervencionesAnuales = 1;
      this.selectedPlans = [];
    }
    this.calcularFechas();
  }

  calcularFechas() {
    if (this.libreMantenimiento) {
      this.selectedPlans = [];
      this.updateCalculatedText();
      return;
    }
    if (this.intervencionesAnuales <= 0) {
      this.selectedPlans = [];
      this.updateCalculatedText();
      return;
    }
    this.selectedPlans = [];
    const interval = Math.floor(12 / this.intervencionesAnuales);
    for (let i = 0; i < this.intervencionesAnuales; i++) {
      let calcMes = this.mesInicio + (i * interval);
      let calcAno = this.anioInicio;
      if (calcMes > 12) {
        calcMes -= 12;
        calcAno += 1;
      }
      this.selectedPlans.push({ mes: calcMes, ano: calcAno, tipoActividad: 'Mantenimiento Preventivo' });
    }
    this.updateCalculatedText();
  }

  updateCalculatedText() {
    if (this.libreMantenimiento) {
      this.calculatedMonthsText = 'El equipo no requiere mantenimientos programados.';
      return;
    }
    if (this.selectedPlans.length === 0) {
      this.calculatedMonthsText = 'Seleccione intervenciones válidas.';
      return;
    }
    const parts = this.selectedPlans.map(p => obtenerNombreMes(p.mes) + ' ' + p.ano);
    this.calculatedMonthsText = parts.join(' - ');
  }

  async savePlan() {
    try {
      if (this.libreMantenimiento) {
        this.selectedPlans = [];
        this.intervencionesAnuales = 0;
      } else if (this.selectedPlans.length === 0) {
        Swal.fire('Atención', 'Calcule el ciclo de mantenimiento antes de guardar.', 'warning');
        return;
      }
      const dataToSave = {
        equipoId: this.currentEquipo.id,
        planes: this.selectedPlans,
        periodicidad: this.intervencionesAnuales,
        tipoPlan: 'Mantenimiento'
      };
      await this.equipoService.updatePlanMantenimiento(this.currentEquipo.id, dataToSave);
      Swal.fire('Éxito', 'Plan de mantenimiento actualizado.', 'success');
      this.displayPlanDialog = false;
      window.location.reload();
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al actualizar el plan.', 'error');
    }
  }

  openPlanMetrologiaDialog(equipo: any) {
    this.currentEquipo = equipo;
    this.displayPlanMetrologiaDialog = true;
    this.libreActividadesMetrologicas = equipo.periodicidadC === 0;
    if (equipo.planesActividadMetrologica && equipo.planesActividadMetrologica.length > 0) {
      const firstPlan = equipo.planesActividadMetrologica[0];
      this.mesInicioMetrologia = firstPlan.mes || 1;
      this.anioInicioMetrologia = firstPlan.ano || new Date().getFullYear();
      this.intervencionesAnualesMetrologia = equipo.periodicidadC || 1;
      this.tipoActividadGlobal = firstPlan.tipoActividad || 'Calibración';
      this.selectedPlansMetrologia = equipo.planesActividadMetrologica;
    } else {
      this.mesInicioMetrologia = new Date().getMonth() + 1;
      this.anioInicioMetrologia = new Date().getFullYear();
      this.intervencionesAnualesMetrologia = 1;
      this.tipoActividadGlobal = 'Calibración';
      this.selectedPlansMetrologia = [];
    }
    this.calcularFechasMetrologia();
  }

  calcularFechasMetrologia() {
    if (this.libreActividadesMetrologicas) {
      this.selectedPlansMetrologia = [];
      this.updateCalculatedTextMetrologia();
      return;
    }
    if (this.intervencionesAnualesMetrologia <= 0) {
      this.selectedPlansMetrologia = [];
      this.updateCalculatedTextMetrologia();
      return;
    }
    this.selectedPlansMetrologia = [];
    const interval = Math.floor(12 / this.intervencionesAnualesMetrologia);
    for (let i = 0; i < this.intervencionesAnualesMetrologia; i++) {
      let calcMes = this.mesInicioMetrologia + (i * interval);
      let calcAno = this.anioInicioMetrologia;
      if (calcMes > 12) {
        calcMes -= 12;
        calcAno += 1;
      }
      this.selectedPlansMetrologia.push({ mes: calcMes, ano: calcAno, tipoActividad: this.tipoActividadGlobal });
    }
    this.updateCalculatedTextMetrologia();
  }

  updateCalculatedTextMetrologia() {
    if (this.libreActividadesMetrologicas) {
      this.calculatedMonthsTextMetrologia = 'El equipo no requiere actividades metrológicas programadas.';
      return;
    }
    if (this.selectedPlansMetrologia.length === 0) {
      this.calculatedMonthsTextMetrologia = 'Seleccione intervenciones válidas.';
      return;
    }
    const parts = this.selectedPlansMetrologia.map(p => obtenerNombreMes(p.mes) + ' ' + p.ano + ' (' + p.tipoActividad + ')');
    this.calculatedMonthsTextMetrologia = parts.join(' - ');
  }

  async savePlanMetrologia() {
    try {
      if (this.libreActividadesMetrologicas) {
        this.selectedPlansMetrologia = [];
        this.intervencionesAnualesMetrologia = 0;
      } else if (this.selectedPlansMetrologia.length === 0) {
        Swal.fire('Atención', 'Calcule el ciclo de metrología antes de guardar.', 'warning');
        return;
      }
      const dataToSave = {
        equipoId: this.currentEquipo.id,
        planes: this.selectedPlansMetrologia,
        periodicidad: this.intervencionesAnualesMetrologia,
        tipoPlan: 'Metrologia'
      };
      await this.equipoService.updatePlanMantenimiento(this.currentEquipo.id, dataToSave);
      Swal.fire('Éxito', 'Plan de metrología actualizado.', 'success');
      this.displayPlanMetrologiaDialog = false;
      window.location.reload();
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al actualizar el plan.', 'error');
    }
  }

  viewModalMetrologia(equipo: any) {
    this.currentEquipo = equipo;
    this.modalAddActividadMetrologica = true;
    this.tipoActividad = '';
    this.empresa = '';
    this.fechaRealizadoActividad = undefined;
    this.resultado = '';
    this.errorMaximoIdentificado = null;
    this.observacionesMetrologia = '';
    this.selectedFile = null;
    this.selectedFileConfirmacion = null;
    this.unidadMedicion = '';
  }

  onFileSelectedConfirmacion(event: any) { this.selectedFileConfirmacion = event.target.files[0]; }
  
  async registrarMetrologia() {
    if (!this.tipoActividad || !this.empresa || !this.fechaRealizadoActividad || !this.resultado) {
      Swal.fire('Faltan datos', 'Por favor diligencie todos los campos requeridos', 'warning');
      return;
    }
    try {
      const token = getDecodedAccessToken();
      const payload: any = {
        equipoIdFk: this.currentEquipo.id,
        tipoActividad: this.tipoActividad,
        empresa: this.empresa,
        fechaRealizado: this.fechaRealizadoActividad.toISOString().split('T')[0],
        resultado: this.resultado,
        errorMaximoIdentificado: this.errorMaximoIdentificado,
        unidadMedicion: this.unidadMedicion,
        observaciones: this.observacionesMetrologia,
        usuarioId: token.id
      };
      const response = await this.metrologiaService.addMetrologia(payload);
      if (this.selectedFile) {
        await this.archivosServices.UploadArchivo(this.selectedFile, 'Metrologia', response.id);
      }
      if (this.selectedFileConfirmacion) {
        await this.archivosServices.UploadArchivo(this.selectedFileConfirmacion, 'ConfirmacionMetrologica', response.id);
      }
      Swal.fire('Éxito', 'Actividad metrológica registrada exitosamente', 'success');
      this.modalAddActividadMetrologica = false;
      window.location.reload();
    } catch (error) {
      Swal.fire('Error', 'Error al registrar actividad', 'error');
    }
  }

  async abrirModalTraslado(equipo: any) {
    this.selectedEquipoTraslado = equipo;
    this.displayTrasladoDialog = true;
    this.servicioDestinoId = null;
    this.ubicacionDestino = '';
    this.ubicacionEspecificaDestino = '';
    this.nombreReceptor = '';
    this.cargoReceptor = '';
    this.entregadoPor = '';
    this.cedulaEntrega = '';
    this.cargoEntrega = '';
    this.cedulaRecibe = '';
    this.observacionesTransferencia = '';
    if (this.serviciosList.length === 0) {
      this.serviciosList = await this.servicioService.getAllServicios();
    }
  }

  async confirmarTraslado() {
    if (!this.servicioDestinoId || !this.nombreReceptor || !this.cargoReceptor || !this.entregadoPor || !this.cedulaEntrega || !this.cargoEntrega || !this.cedulaRecibe) {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor complete todos los campos requeridos.' });
      return;
    }
    try {
      const token = getDecodedAccessToken();
      const data = {
        equipoIdFk: this.selectedEquipoTraslado.id,
        servicioDestinoIdFk: this.servicioDestinoId,
        ubicacionDestino: this.ubicacionDestino,
        ubicacionEspecificaDestino: this.ubicacionEspecificaDestino,
        nombreReceptor: this.nombreReceptor,
        cargoReceptor: this.cargoReceptor,
        entregadoPor: this.entregadoPor,
        cedulaEntrega: this.cedulaEntrega,
        cargoEntrega: this.cargoEntrega,
        cedulaRecibe: this.cedulaRecibe,
        observaciones: this.observacionesTransferencia,
        usuarioId: token.id
      };
      await this.trasladosService.addTraslado(data);
      Swal.fire('Éxito', 'Traslado registrado exitosamente.', 'success');
      this.displayTrasladoDialog = false;
      window.location.reload();
    } catch (error) {
      Swal.fire('Error', 'Hubo un error al registrar el traslado', 'error');
    }
  }

  async verHistorialTraslados(equipo: any) {
    this.loading = true;
    try {
      this.historialUnificado = await this.trasladosService.getHistorialCompleto(equipo.id);
      this.displayHistorialTrasladosDialog = true;
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el historial.' });
    } finally {
      this.loading = false;
    }
  }
} // END OF CLASS
;

// Remove the final closing brace and append our code
content = content.replace(/}[^}]*$/, codeToAdd);

// Inject initOpcionesHV() inside the successful load block of ngOnInit
content = content.replace(
  'this.rutina = await this.protocolosServices.getRutina(this.equipo.tipoEquipos.id);',
  'this.rutina = await this.protocolosServices.getRutina(this.equipo.tipoEquipos.id);\n      this.initOpcionesHV();'
);

// We need to also add the p-splitbutton to ver-reporte.component.html
let html = fs.readFileSync('d:/REPOSITORIO_NUEVO_APLICATIVO_HUSRT/FrontAppHusrt/src/app/Components/userBiomedica/Reportes/ver-reporte/ver-reporte.component.html', 'utf8');
html = html.replace(
  '<p-button label="Ver Hoja de Vida" icon="pi pi-file" (onClick)="verHojaVida()"></p-button>',
  '<p-splitbutton label="Opciones HV" icon="pi pi-check" dropdownIcon="pi pi-cog" [model]="opcionesHV" severity="secondary"></p-splitbutton>'
);

// Fix duplicate 'observaciones' model for metrologia
html = html.replace('[(ngModel)]="observaciones"', '[(ngModel)]="observacionesMetrologia"');

fs.writeFileSync(path, content, 'utf8');
fs.writeFileSync('d:/REPOSITORIO_NUEVO_APLICATIVO_HUSRT/FrontAppHusrt/src/app/Components/userBiomedica/Reportes/ver-reporte/ver-reporte.component.html', html, 'utf8');
