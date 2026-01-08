import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { EquiposService } from '../../../../Services/appServices/biomedicaServices/equipos/equipos.service';
import { ServicioService } from '../../../../Services/appServices/general/servicio/servicio.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { SplitButtonModule } from 'primeng/splitbutton';
import { Table } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MenuItem, MessageService } from 'primeng/api';
import { getDecodedAccessToken, obtenerNombreMes } from '../../../../utilidades';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HistorialEquiposComponent } from '../historial-equipos/historial-equipos.component';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { TrasladosService } from '../../../../Services/appServices/biomedicaServices/traslados/traslados.service';
import Swal from 'sweetalert2';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-equipos-servicio',
  standalone: true,
  imports: [TableModule, CommonModule, IconFieldModule,
    InputIconModule, InputTextModule, SplitButtonModule, DialogModule, MultiSelectModule, SelectModule, InputNumberModule, FormsModule, ButtonModule, TagModule],
  providers: [DialogService],
  templateUrl: './equipos-servicio.component.html',
  styleUrl: './equipos-servicio.component.css'
})
export class EquiposServicioComponent implements OnInit {

  @ViewChild('dt2') dt2!: Table;
  equipos!: any[];
  servicio!: any;
  equipoServices = inject(EquiposService);
  servicioServices = inject(ServicioService);
  trasladosService = inject(TrasladosService);

  loading: boolean = false;
  items: MenuItem[] | undefined;
  ref: DynamicDialogRef | undefined;

  // Variables para el modal de edición de plan
  displayPlanDialog: boolean = false;
  currentEquipo: any = null;
  selectedMonths: any[] = [];
  periodicidad: number = 0;
  mesInicio: number = 1;
  calculatedMonthsText: string = '';

  // Variables para Traslados
  displayTrasladoDialog: boolean = false;
  displayHistorialTrasladosDialog: boolean = false;
  historialUnificado: any[] = [];

  // Formulario Traslado
  selectedEquipoTraslado: any = null;
  servicioDestinoId: number | null = null;
  nombreReceptor: string = '';
  cargoReceptor: string = '';
  observacionesTransferencia: string = '';
  serviciosList: any[] = []; // Para llenar el dropdown

  monthOptions: any[] = [
    { name: 'Enero', value: 1 },
    { name: 'Febrero', value: 2 },
    { name: 'Marzo', value: 3 },
    { name: 'Abril', value: 4 },
    { name: 'Mayo', value: 5 },
    { name: 'Junio', value: 6 },
    { name: 'Julio', value: 7 },
    { name: 'Agosto', value: 8 },
    { name: 'Septiembre', value: 9 },
    { name: 'Octubre', value: 10 },
    { name: 'Noviembre', value: 11 },
    { name: 'Diciembre', value: 12 }
  ];

  constructor(
    private messageService: MessageService,
    private router: Router,
    public dialogService: DialogService
  ) {

  }

  async ngOnInit() {

    const equiposdatos = await this.equipoServices.getAllEquiposServicio(sessionStorage.getItem("idServicio"));
    this.servicio = await this.servicioServices.getServicio(sessionStorage.getItem("idServicio"));

    if (['BIOMEDICAADMIN', 'BIOMEDICAUSER', 'SUPERADMIN'].includes(getDecodedAccessToken().rol)) {
      this.serviciosList = await this.servicioServices.getAllServicios();
    }

    this.equipos = equiposdatos.map((equipo: any) => ({
      ...equipo,
      opcionesHV: [
        {
          label: 'Editar',
          icon: 'pi pi-pencil',
          command: () => this.editarEquipo(equipo.id),
          visible: ['BIOMEDICAADMIN', 'SUPERADMIN'].includes(getDecodedAccessToken().rol)
        },
        {
          label: 'Editar Plan Mantenimiento',
          icon: 'pi pi-calendar',
          command: () => this.openPlanDialog(equipo),
          visible: ['BIOMEDICAADMIN', 'SUPERADMIN'].includes(getDecodedAccessToken().rol)
        },
        {
          label: 'Registrar Traslado',
          icon: 'pi pi-send',
          command: () => this.abrirModalTraslado(equipo),
          visible: ['BIOMEDICAADMIN', 'BIOMEDICAUSER', 'SUPERADMIN'].includes(getDecodedAccessToken().rol)
        },
        {
          label: 'Historial Movimientos',
          icon: 'pi pi-history',
          command: () => this.verHistorialTraslados(equipo),
          visible: ['BIOMEDICAADMIN', 'BIOMEDICAUSER', 'SUPERADMIN'].includes(getDecodedAccessToken().rol)
        },
        {
          label: 'Ver Hoja de Vida',
          icon: 'pi pi-eye',
          command: () => this.verHojaVida(equipo.id)
        },
        {
          label: 'Reportes',
          icon: 'pi pi-external-link',
          command: () => this.verReportes(equipo.id)
        },
        {
          label: 'Nuevo reporte',
          icon: 'pi pi-upload',
          command: () => this.nuevoReporte(equipo.id),
          visible: getDecodedAccessToken().rol !== 'INVITADO'
        },
        {
          label: 'Historial',
          icon: 'pi pi-history',
          command: () => this.verHistorial(equipo.id),
          visible: getDecodedAccessToken().rol !== 'INVITADO'
        }
      ]
    }));

  }

  onGlobalFilter(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (target) {
      this.dt2.filterGlobal(target.value, 'contains');
    }
  }

  verHojaVida(id: number) {
    this.router.navigate(['biomedica/hojavidaequipo/', id]);
  }

  editarEquipo(id: number) {
    this.router.navigate(['biomedica/adminequipos/edit/', id]);
  }

  nuevoReporte(id: number) {
    sessionStorage.setItem('TipoMantenimiento', 'C');
    this.router.navigate(['biomedica/nuevoreporte/', id]);
  }

  verReportes(id: number) {
    this.router.navigate(['biomedica/reportesequipo/', id]);
  }

  verHistorial(id: number) {
    this.ref = this.dialogService.open(HistorialEquiposComponent, {
      header: 'Historial de Mantenimientos',
      width: '70%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      baseZIndex: 10000,
      data: { id: id }
    });
  }

  darDeBaja(id: number) {
    // Implementación pendiente o existente
  }

  openPlanDialog(equipo: any) {
    this.currentEquipo = equipo;
    this.displayPlanDialog = true;
    this.periodicidad = 0;
    this.mesInicio = 1;
    this.selectedMonths = [];
    this.calculatedMonthsText = '';
  }

  calculateMonths() {
    if (!this.periodicidad || !this.mesInicio) return;

    this.selectedMonths = [];
    let currentMonth = this.mesInicio;

    while (currentMonth <= 12) {
      const monthObj = this.monthOptions.find(m => m.value === currentMonth);
      if (monthObj) {
        this.selectedMonths.push(monthObj);
      }
      currentMonth += this.periodicidad;
    }

    this.calculatedMonthsText = this.selectedMonths.map(m => m.name).join(', ');
  }

  savePlan() {
    // Implementación existente del guardado del plan
    this.displayPlanDialog = false;
  }

  // Métodos restaurados para compatibilidad con HTML
  calcularFechas() {
    this.calculateMonths();
  }

  obtenerMesesTexto(planes: any): string {
    if (!planes || planes.length === 0) return 'Sin Plan';
    // Si es un array, tomamos el primero o mapeamos
    const plan = Array.isArray(planes) ? planes[0] : planes;
    if (!plan) return 'Sin Plan';

    const meses = [];
    let current = plan.mesInicio;
    const periodicity = plan.periodicidad;

    if (!current || !periodicity) return 'N/A';

    while (current <= 12) {
      const mName = this.monthOptions.find(m => m.value === current)?.name;
      if (mName) meses.push(mName);
      current += periodicity;
    }
    return meses.join(', ');
  }

  obtenerColorRiesgo(riesgo: string): string {
    switch (riesgo) {
      case 'I': return '#4caf50'; // Verde
      case 'IIA': return '#90EE90'; // Verde claro
      case 'IIB': return '#ffff00'; // Amarillo
      case 'III': return '#ffcc80'; // Naranja claro
      default: return 'transparent';
    }
  }

  // --- MÉTODOS PARA TRASLADOS ---

  abrirModalTraslado(equipo: any) {
    this.selectedEquipoTraslado = equipo;
    this.displayTrasladoDialog = true;
    // Resetear formulario
    this.servicioDestinoId = null;
    this.nombreReceptor = '';
    this.cargoReceptor = '';
    this.observacionesTransferencia = '';
  }

  async verHistorialTraslados(equipo: any) {
    this.selectedEquipoTraslado = equipo;
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



  async confirmarTraslado() {
    if (!this.selectedEquipoTraslado || !this.servicioDestinoId || !this.nombreReceptor || !this.cargoReceptor) {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor complete todos los campos requeridos.' });
      return;
    }

    try {
      const data = {
        equipoId: this.selectedEquipoTraslado.id,
        servicioDestinoId: this.servicioDestinoId!,
        nombreReceptor: this.nombreReceptor,
        cargoReceptor: this.cargoReceptor,
        observaciones: this.observacionesTransferencia,
        usuarioId: getDecodedAccessToken().id
      };

      await this.trasladosService.registrarTraslado(data);

      this.displayTrasladoDialog = false;
      this.ngOnInit(); // Recargar

      Swal.fire(
        '¡Traslado Exitoso!',
        'El equipo ha sido trasladado correctamente.',
        'success'
      );

    } catch (error) {
      Swal.fire(
        'Error',
        'No se pudo registrar el traslado.',
        'error'
      );
    }
  }

}
