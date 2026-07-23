import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EspaciosReservaService, EspacioReserva } from '../../../Services/EspaciosReserva/espacios-reserva.service';
import { ReservasEspaciosService, ReservaEspacio } from '../../../Services/ReservasEspacios/reservas-espacios.service';
import { UserService } from '../../../Services/appServices/userServices/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adminespacios-home',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    TableModule, 
    TagModule, 
    ButtonModule, 
    RouterModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    MultiSelectModule,
    ToastModule,
    FullCalendarModule
  ],
  providers: [MessageService],
  templateUrl: './adminespacios-home.component.html',
  styleUrl: './adminespacios-home.component.css'
})
export class AdminespaciosHomeComponent implements OnInit {
  misEspacios: EspacioReserva[] = [];
  loading: boolean = true;
  userData: any;

  espacioDialog: boolean = false;
  espacio: EspacioReserva = this.getEmptyEspacio();
  
  opcionesDisponibilidad = [
    { label: 'Todos los días', value: 'TODOS_LOS_DIAS' },
    { label: 'Entre semana', value: 'ENTRE_SEMANA' },
    { label: 'Días específicos', value: 'DIAS_ESPECIFICOS' }
  ];
  
  opcionesDias = [
    { label: 'Lunes', value: 'Lunes' },
    { label: 'Martes', value: 'Martes' },
    { label: 'Miércoles', value: 'Miércoles' },
    { label: 'Jueves', value: 'Jueves' },
    { label: 'Viernes', value: 'Viernes' },
    { label: 'Sábado', value: 'Sábado' },
    { label: 'Domingo', value: 'Domingo' }
  ];
  
  diasSeleccionados: string[] = [];

  calendarioDialog: boolean = false;
  isCalendarVisible: boolean = false;
  espacioCalendario: EspacioReserva | null = null;

  detalleReservaDialog: boolean = false;
  reservaSeleccionada: ReservaEspacio | null = null;
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
    eventClick: this.onEventClick.bind(this)
  };

  constructor(
    private espaciosService: EspaciosReservaService,
    private reservasService: ReservasEspaciosService,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const idUser = sessionStorage.getItem('idUser');
    if (idUser) {
      this.cargarMisEspacios(Number(idUser));
    } else {
      this.loading = false;
    }
    this.getUserData();
  }

  async getUserData() {
    try {
      if (typeof sessionStorage !== 'undefined') {
        const idUser = sessionStorage.getItem('idUser');
        if (idUser) {
          this.userData = await this.userService.getUserProfil(idUser);
        }
      }
    } catch (err: any) {
      console.error('Error getting profile:', err);
    }
  }

  cargarMisEspacios(userId: number) {
    this.espaciosService.getMisEspacios(userId).subscribe({
      next: (espacios: EspacioReserva[]) => {
        this.misEspacios = espacios;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error cargando mis espacios:', err);
        Swal.fire('Error', 'No se pudieron cargar los espacios asignados', 'error');
        this.loading = false;
      }
    });
  }

  getEmptyEspacio(): EspacioReserva {
    return {
      nombre: '',
      ubicacion: '',
      aforoMinimo: 0,
      aforoMaximo: 0,
      tipoDisponibilidad: 'TODOS_LOS_DIAS',
      diasEspecificos: null,
      horaInicio: '06:00',
      horaFin: '20:00',
      estado: true,
      responsablesIds: []
    };
  }

  editEspacio(esp: EspacioReserva) {
    this.espacio = { ...esp };
    this.diasSeleccionados = esp.diasEspecificos ? esp.diasEspecificos.split(',') : [];
    
    // Fallbacks para tiempos si vienen nulos
    if (!this.espacio.horaInicio) this.espacio.horaInicio = '06:00';
    if (!this.espacio.horaFin) this.espacio.horaFin = '20:00';
    if (this.espacio.horaInicio.length > 5) this.espacio.horaInicio = this.espacio.horaInicio.substring(0,5);
    if (this.espacio.horaFin.length > 5) this.espacio.horaFin = this.espacio.horaFin.substring(0,5);

    this.espacioDialog = true;
  }

  hideDialog() {
    this.espacioDialog = false;
  }

  saveEspacio() {
    if (this.espacio.nombre.trim() && this.espacio.ubicacion.trim()) {
      
      if (this.espacio.tipoDisponibilidad === 'DIAS_ESPECIFICOS') {
        this.espacio.diasEspecificos = this.diasSeleccionados.length > 0 ? this.diasSeleccionados.join(',') : null;
      } else {
        this.espacio.diasEspecificos = null;
      }

      if (this.espacio.id) {
        this.espaciosService.updateEspacio(this.espacio.id, this.espacio).subscribe({
          next: res => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Espacio actualizado' });
            const idUser = sessionStorage.getItem('idUser');
            if (idUser) {
              this.cargarMisEspacios(Number(idUser));
            }
            this.espacioDialog = false;
          },
          error: err => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar' })
        });
      }
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Nombre y ubicación son obligatorios' });
    }
  }

  verReservas(esp: EspacioReserva) {
    this.espacioCalendario = esp;
    this.reservasService.getReservas().subscribe({
      next: (reservas) => {
        // Quitamos la condición que ocultaba los cancelados
        const reservasEspacio = reservas.filter(r => r.espacioReservaIdFk === esp.id && r.estado !== 'RECHAZADA');
        
        const events = reservasEspacio.map(r => {
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

          let bgColor = '#17a2b8';
          let borderColor = '#17a2b8';
          let txtColor = '#fff';

          if (r.estado === 'APROBADA' || r.estado === 'ACTIVA') {
            bgColor = '#38bdf8'; // Azul clarito
            borderColor = '#0284c7';
          } else if (r.estado === 'CANCELADA' || r.estado === 'CANCELADO') {
            bgColor = '#fecaca'; // Rojo claro
            borderColor = '#fca5a5';
            txtColor = '#991b1b';
          } else if (r.estado === 'FINALIZADO') {
            bgColor = '#cbd5e1'; // Gris para finalizado
            borderColor = '#94a3b8';
            txtColor = '#334155';
          } else if (r.estado === 'EN CURSO') {
            bgColor = '#fcd34d'; // Amarillo para en curso
            borderColor = '#f59e0b';
            txtColor = '#92400e';
          }

          const hInicio = r.horaInicio ? r.horaInicio.substring(0, 5) : '';
          const hFin = r.horaFin ? r.horaFin.substring(0, 5) : '';

          return {
            title: `${hInicio} - ${hFin} | ${r.nombreCompleto}`,
            start: `${r.fechaReserva}T${r.horaInicio}`,
            end: `${r.fechaReserva}T${r.horaFin}`,
            backgroundColor: bgColor,
            borderColor: borderColor,
            textColor: txtColor,
            extendedProps: { reserva: r }
          };
        });
        
        this.calendarOptions = {
          ...this.calendarOptions,
          events: events,
          displayEventTime: false // Oculta la hora automática que pone FullCalendar
        };
        this.calendarioDialog = true;
      },
      error: () => {
         this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las reservas' });
      }
    });
  }

  onEventClick(arg: any) {
    this.reservaSeleccionada = arg.event.extendedProps['reserva'];
    this.detalleReservaDialog = true;
  }

  confirmarCancelacion(reserva?: ReservaEspacio) {
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
        this.detalleReservaDialog = false; // Cierra el modal de detalles
      }
    });
  }

  cambiarEstado(reserva: ReservaEspacio, nuevoEstado: string, motivoCancelacion?: string) {
    if (!reserva.id) return;
    
    const dataActualizada: ReservaEspacio = { ...reserva, estado: nuevoEstado };
    if (motivoCancelacion) {
      dataActualizada.motivoCancelacion = motivoCancelacion;
    }
    
    this.reservasService.updateReserva(reserva.id, dataActualizada).subscribe({
      next: () => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Reserva actualizada con éxito',
          showConfirmButton: false,
          timer: 3000
        });
        // Refrescar el calendario
        if (this.espacioCalendario) {
          this.verReservas(this.espacioCalendario);
        }
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo actualizar el estado de la reserva', 'error');
      }
    });
  }
}
