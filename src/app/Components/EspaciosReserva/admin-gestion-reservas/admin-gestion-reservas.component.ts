import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { InputNumberModule } from 'primeng/inputnumber';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EspaciosReservaService, EspacioReserva } from '../../../Services/EspaciosReserva/espacios-reserva.service';
import { ReservasEspaciosService, ReservaEspacio } from '../../../Services/ReservasEspacios/reservas-espacios.service';
import { UserService } from '../../../Services/appServices/userServices/user.service';
import Swal from 'sweetalert2';

interface ReservaExtendida extends ReservaEspacio {
  nombreEspacio?: string;
  estadoStyle?: 'success' | 'info' | 'warning' | 'danger';
}

@Component({
  selector: 'app-admin-gestion-reservas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    TagModule,
    TooltipModule,
    DialogModule,
    FullCalendarModule,
    InputNumberModule
  ],
  templateUrl: './admin-gestion-reservas.component.html',
  styleUrl: './admin-gestion-reservas.component.css'
})
export class AdminGestionReservasComponent implements OnInit {

  reservasBase: ReservaExtendida[] = [];
  reservas: ReservaExtendida[] = [];
  espacios: EspacioReserva[] = [];
  loading: boolean = true;
  
  // Filtros
  fechaDesde: string = '';
  fechaHasta: string = '';
  espacioFiltro: number | null = null;

  detalleReservaDialog: boolean = false;
  reservaSeleccionada: ReservaExtendida | null = null;
  isCalendarVisible: boolean = true;

  // Formulario Creación
  crearReservaDialog: boolean = false;
  opcionesHoras: { label: string, value: string }[] = [];
  nuevaReserva: ReservaEspacio = {
    nombreCompleto: '',
    telefono: '',
    correoElectronico: '',
    servicioSolicitante: '',
    institucionEducativa: '',
    tipoActividad: '',
    espacioReservaIdFk: 0,
    fechaReserva: '',
    horaInicio: '',
    horaFin: '',
    cantidadParticipantes: 1
  };

  // Paleta de colores para asignar a cada espacio (colores pastel suaves)
  palette = [
    '#bfdbfe', // Azul pastel
    '#bbf7d0', // Verde pastel
    '#e9d5ff', // Morado pastel
    '#fbcfe8', // Rosa pastel
    '#a5f3fc', // Cyan pastel
    '#fed7aa', // Naranja pastel
    '#99f6e4', // Teal pastel
    '#c7d2fe', // Índigo pastel
    '#fef08a', // Amarillo pastel
    '#fecdd3'  // Rose pastel
  ];

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
      list: 'Agenda'
    },
    events: [],
    locale: 'es',
    contentHeight: 'auto',
    dayMaxEvents: true,
    eventDisplay: 'block',
    displayEventTime: false,
    eventClick: this.onEventClick.bind(this),
    eventContent: (arg) => {
      const reserva = arg.event.extendedProps['reserva'];
      let dotColor = '#10b981'; // ACTIVA/APROBADA = verde
      if (reserva.estado === 'CANCELADO' || reserva.estado === 'CANCELADA') dotColor = '#ef4444'; // rojo
      else if (reserva.estado === 'FINALIZADO') dotColor = '#e2e8f0'; // gris muy clarito/blanco
      else if (reserva.estado === 'EN CURSO') dotColor = '#fde047'; // amarillo

      return {
        html: `<div style="display: flex; align-items: center; gap: 6px; overflow: hidden; padding: 1px 2px; width: 100%;">
                 <div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${dotColor}; flex-shrink: 0; box-shadow: 0 0 0 1px rgba(0,0,0,0.1);"></div>
                 <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #1e293b; font-weight: 600;">${arg.event.title}</div>
               </div>`
      };
    }
  };

  constructor(
    private reservasService: ReservasEspaciosService,
    private espaciosService: EspaciosReservaService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
    this.generarOpcionesHoras();
  }

  generarOpcionesHoras() {
    this.opcionesHoras = [];
    for (let h = 6; h <= 22; h++) {
      for (let m of ['00', '30']) {
        if (h === 22 && m === '30') continue;
        const hora24 = h.toString().padStart(2, '0') + ':' + m;
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 === 0 ? 12 : h % 12;
        const label = `${h12}:${m} ${ampm}`;
        this.opcionesHoras.push({ label, value: hora24 });
      }
    }
  }

  async cargarDatos() {
    this.loading = true;
    try {
      if (typeof sessionStorage !== 'undefined') {
        const rol = sessionStorage.getItem('rol');
        const idUser = sessionStorage.getItem('idUser');
        
        if (rol === 'ADMINESPACIORESERVA' && idUser) {
          this.espaciosService.getMisEspacios(Number(idUser)).subscribe({
            next: (espaciosData: EspacioReserva[]) => {
              this.espacios = espaciosData;
              this.cargarReservas();
            },
            error: (err: any) => this.handleEspaciosError(err)
          });
        } else {
          this.espaciosService.getEspacios().subscribe({
            next: (espaciosData: EspacioReserva[]) => {
              this.espacios = espaciosData;
              this.cargarReservas();
            },
            error: (err: any) => this.handleEspaciosError(err)
          });
        }
      } else {
        this.loading = false;
      }
    } catch (err: any) {
      this.handleEspaciosError(err);
    }
  }

  private handleEspaciosError(err: any) {
    console.error('Error cargando espacios:', err);
    this.loading = false;
    Swal.fire('Error', 'No se pudieron cargar los espacios', 'error');
  }

  cargarReservas() {
    this.reservasService.getReservas().subscribe({
      next: (reservasData) => {
        this.reservasBase = reservasData.map(r => {
          const espacioEncontrado = this.espacios.find(e => e.id === r.espacioReservaIdFk);
          
          let estadoCalculado = r.estado;
          if (estadoCalculado !== 'CANCELADO' && estadoCalculado !== 'CANCELADA' && estadoCalculado !== 'RECHAZADA') {
            const now = new Date();
            const startDate = new Date(`${r.fechaReserva}T${r.horaInicio}`);
            const endDate = new Date(`${r.fechaReserva}T${r.horaFin}`);
            
            if (now > endDate) {
              estadoCalculado = 'FINALIZADO';
            } else if (now >= startDate && now <= endDate) {
              estadoCalculado = 'EN CURSO';
            } else if (now < startDate) {
              estadoCalculado = r.estado === 'APROBADA' ? 'APROBADA' : 'ACTIVA';
            }
          }

          r.estado = estadoCalculado;

          let tagType: 'success' | 'info' | 'warning' | 'danger' = 'info';
          if (r.estado === 'ACTIVA' || r.estado === 'APROBADA') tagType = 'success';
          else if (r.estado === 'EN CURSO') tagType = 'info';
          else if (r.estado === 'FINALIZADO') tagType = 'warning';
          else if (r.estado === 'CANCELADO' || r.estado === 'CANCELADA') tagType = 'danger';

          return {
            ...r,
            nombreEspacio: espacioEncontrado ? espacioEncontrado.nombre : 'Desconocido',
            estadoStyle: tagType
          };
        }).filter(r => r.nombreEspacio !== 'Desconocido');
        
        // Ordenar por fecha descendente
        this.reservasBase.sort((a, b) => new Date(b.fechaReserva).getTime() - new Date(a.fechaReserva).getTime());
        this.aplicarFiltros();
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando reservas:', err);
        this.loading = false;
        Swal.fire('Error', 'No se pudieron cargar las reservas', 'error');
      }
    });
  }

  aplicarFiltros() {
    this.reservas = this.reservasBase.filter(reserva => {
      let coincideEspacio = true;
      let coincideFechaDesde = true;
      let coincideFechaHasta = true;

      if (this.espacioFiltro) {
        coincideEspacio = reserva.espacioReservaIdFk === this.espacioFiltro;
      }
      if (this.fechaDesde) {
        coincideFechaDesde = new Date(reserva.fechaReserva) >= new Date(this.fechaDesde);
      }
      if (this.fechaHasta) {
        coincideFechaHasta = new Date(reserva.fechaReserva) <= new Date(this.fechaHasta);
      }

      return coincideEspacio && coincideFechaDesde && coincideFechaHasta;
    });

    this.actualizarCalendario();
  }

  getColorForEspacio(id: number): string {
    return this.palette[id % this.palette.length];
  }

  actualizarCalendario() {
    const events = this.reservas.map(r => {
      let bgColor = this.getColorForEspacio(r.espacioReservaIdFk);
      let textColor = '#1e293b'; // Texto oscuro para contrastar con pasteles

      const hInicio = r.horaInicio ? r.horaInicio.substring(0, 5) : '';
      const hFin = r.horaFin ? r.horaFin.substring(0, 5) : '';
      const nombreEspacio = r.nombreEspacio || '';

      return {
        title: `${hInicio} - ${hFin} | ${r.nombreCompleto} (${nombreEspacio})`,
        start: `${r.fechaReserva}T${r.horaInicio}`,
        end: `${r.fechaReserva}T${r.horaFin}`,
        backgroundColor: bgColor,
        borderColor: bgColor,
        textColor: textColor,
        extendedProps: { reserva: r }
      };
    });

    this.calendarOptions = {
      ...this.calendarOptions,
      events: events
    };
  }

  limpiarFiltros() {
    this.fechaDesde = '';
    this.fechaHasta = '';
    this.espacioFiltro = null;
    this.aplicarFiltros();
  }

  onEventClick(arg: any) {
    this.reservaSeleccionada = arg.event.extendedProps['reserva'];
    this.detalleReservaDialog = true;
  }

  confirmarCancelacion(reserva?: ReservaExtendida) {
    const res = reserva || this.reservaSeleccionada;
    if (!res) return;

    if (res.estado === 'CANCELADO' || res.estado === 'CANCELADA') {
      Swal.fire('Información', 'Esta reserva ya se encuentra cancelada.', 'info');
      return;
    }
    
    Swal.fire({
      title: 'Cancelar Reserva',
      html: `Vas a cancelar la reserva de <strong>${res.nombreCompleto}</strong>.<br/><br/>Por favor, ingresa el motivo de la cancelación:`,
      icon: 'warning',
      input: 'textarea',
      inputPlaceholder: 'Motivo de la cancelación...',
      inputAttributes: {
        'aria-label': 'Motivo de la cancelación'
      },
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cancelar e informar',
      cancelButtonText: 'Cerrar',
      inputValidator: (value) => {
        if (!value || value.trim().length === 0) {
          return '¡Debes ingresar un motivo de cancelación!';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.cambiarEstado(res, 'CANCELADO', result.value);
      }
    });
  }

  cambiarEstado(reserva?: ReservaExtendida, nuevoEstado?: string, motivoCancelacion?: string) {
    const res = reserva || this.reservaSeleccionada;
    if (!res || !res.id || !nuevoEstado) return;
    
    const dataActualizada: ReservaEspacio = { ...res, estado: nuevoEstado };
    if (motivoCancelacion) {
      dataActualizada.motivoCancelacion = motivoCancelacion;
    }
    
    delete (dataActualizada as any).nombreEspacio;
    delete (dataActualizada as any).estadoStyle;

    this.reservasService.updateReserva(res.id, dataActualizada).subscribe({
      next: () => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Reserva actualizada con éxito',
          showConfirmButton: false,
          timer: 3000
        });
        
        if (this.reservaSeleccionada && this.reservaSeleccionada.id === res.id) {
            this.reservaSeleccionada.estado = nuevoEstado;
            if (motivoCancelacion) this.reservaSeleccionada.motivoCancelacion = motivoCancelacion;
        }
        this.cargarReservas();
        this.detalleReservaDialog = false;
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo actualizar el estado de la reserva', 'error');
      }
    });
  }

  getSeverity(estado: string): string {
    switch (estado) {
      case 'ACTIVA': return 'success';
      case 'EN CURSO': return 'info';
      case 'FINALIZADO': return 'warning';
      case 'CANCELADO': return 'danger';
      default: return 'info';
    }
  }

  abrirModalCrear() {
    this.nuevaReserva = {
      nombreCompleto: '',
      telefono: '',
      correoElectronico: '',
      servicioSolicitante: '',
      institucionEducativa: '',
      tipoActividad: '',
      espacioReservaIdFk: 0,
      fechaReserva: '',
      horaInicio: '',
      horaFin: '',
      cantidadParticipantes: 1
    };
    this.crearReservaDialog = true;
  }

  cerrarModalCrear() {
    this.crearReservaDialog = false;
  }

  guardarNuevaReserva() {
    if (!this.nuevaReserva.nombreCompleto || !this.nuevaReserva.fechaReserva || !this.nuevaReserva.horaInicio || 
        !this.nuevaReserva.horaFin || !this.nuevaReserva.institucionEducativa || !this.nuevaReserva.espacioReservaIdFk) {
      Swal.fire('Error', 'Complete todos los campos obligatorios', 'error');
      return;
    }

    const espacio = this.espacios.find(e => e.id === this.nuevaReserva.espacioReservaIdFk);
    if (espacio) {
      const cantidad = this.nuevaReserva.cantidadParticipantes || 0;
      if (espacio.aforoMaximo && cantidad > espacio.aforoMaximo) {
        Swal.fire('Atención', `La cantidad de participantes (${cantidad}) supera el aforo máximo permitido para este espacio (${espacio.aforoMaximo}).`, 'warning');
        return;
      }
      if (espacio.aforoMinimo && cantidad < espacio.aforoMinimo) {
        Swal.fire('Atención', `La cantidad de participantes (${cantidad}) no cumple con el aforo mínimo requerido para este espacio (${espacio.aforoMinimo}).`, 'warning');
        return;
      }
    }

    this.reservasService.createReserva(this.nuevaReserva).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Reserva creada correctamente', 'success');
        this.cerrarModalCrear();
        this.cargarReservas();
      },
      error: (err) => {
        const msg = err.error?.error || 'Ocurrió un error al procesar la reserva';
        Swal.fire('Error', msg, 'error');
      }
    });
  }


}
