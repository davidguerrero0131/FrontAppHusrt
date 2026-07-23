import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { OverlayPanel } from 'primeng/overlaypanel';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { EspaciosReservaService, EspacioReserva } from '../../../Services/EspaciosReserva/espacios-reserva.service';
import { ReservasEspaciosService, ReservaEspacio } from '../../../Services/ReservasEspacios/reservas-espacios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservas-espacios-interno',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    CalendarModule,
    FullCalendarModule,
    OverlayPanelModule
  ],
  templateUrl: './reservas-espacios-interno.component.html',
  styleUrl: './reservas-espacios-interno.component.css'
})
export class ReservasEspaciosInternoComponent implements OnInit {

  espacios: EspacioReserva[] = [];
  espacioSeleccionado: number | null = null;
  opcionesHoras: { label: string, value: string }[] = [];
  
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    locales: [esLocale],
    locale: 'es',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [],
    slotMinTime: '06:00:00',
    slotMaxTime: '22:00:00',
    allDaySlot: false,
    selectable: false,
    displayEventTime: true,
    displayEventEnd: true,
    eventTimeFormat: {
      hour: 'numeric',
      minute: '2-digit',
      meridiem: 'short'
    },
    eventClick: this.handleEventClick.bind(this)
  };

  // OverlayPanel para Detalles de Evento
  @ViewChild('op') op!: OverlayPanel;
  selectedEventDetails: any = null;

  // Modal y Formulario
  displayModal: boolean = false;
  reserva: ReservaEspacio = {
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

  constructor(
    private espaciosService: EspaciosReservaService,
    private reservasService: ReservasEspaciosService
  ) {}

  ngOnInit(): void {
    this.cargarEspacios();
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

  cargarEspacios() {
    this.espaciosService.getEspacios().subscribe({
      next: (data) => {
        // Filtrar solo espacios activos
        this.espacios = data.filter(e => e.estado);
      },
      error: (err) => {
        console.error('Error cargando espacios:', err);
      }
    });
  }

  onEspacioChange() {
    if (this.espacioSeleccionado) {
      this.cargarReservasPorEspacio(this.espacioSeleccionado);
    } else {
      this.calendarOptions.events = [];
    }
  }

  getNombreEspacioSeleccionado(): string {
    const espacio = this.espacios.find(e => e.id === this.espacioSeleccionado);
    return espacio ? espacio.nombre : '';
  }

  getEspacioSeleccionadoCompleto(): EspacioReserva | null {
    return this.espacios.find(e => e.id === this.espacioSeleccionado) || null;
  }

  cargarReservasPorEspacio(espacioId: number) {
    this.reservasService.getReservas().subscribe({
      next: (data) => {
        const reservasEspacio = data.filter(r => r.espacioReservaIdFk === espacioId && (r.estado === 'ACTIVA' || r.estado === 'EN CURSO'));
        
        const events = reservasEspacio.map(r => {
          return {
            title: `Reserva: ${r.tipoActividad} (${r.servicioSolicitante}) - ${this.getNombreEspacioSeleccionado()}`,
            start: `${r.fechaReserva}T${r.horaInicio}`,
            end: `${r.fechaReserva}T${r.horaFin}`,
            color: '#3b2c7a',
            textColor: 'white',
            extendedProps: {
              actividad: r.tipoActividad,
              horaInicio: r.horaInicio,
              horaFin: r.horaFin,
              espacio: this.getNombreEspacioSeleccionado()
            }
          };
        });

        this.calendarOptions = { ...this.calendarOptions, events: events };
      },
      error: (err) => {
        console.error('Error cargando reservas:', err);
      }
    });
  }

  handleEventClick(clickInfo: any) {
    const event = clickInfo.event;
    this.selectedEventDetails = {
      actividad: event.extendedProps.actividad,
      horaInicio: event.extendedProps.horaInicio,
      horaFin: event.extendedProps.horaFin,
      espacio: event.extendedProps.espacio
    };
    // Toggle the overlay panel at the click position using the event element as anchor
    this.op.toggle(clickInfo.jsEvent, clickInfo.el);
  }

  abrirModal() {
    if (!this.espacioSeleccionado) {
      Swal.fire('Atención', 'Por favor seleccione un espacio primero', 'warning');
      return;
    }
    
    this.reserva = {
      nombreCompleto: '',
      telefono: '',
      correoElectronico: '',
      servicioSolicitante: '',
      institucionEducativa: '',
      tipoActividad: '',
      espacioReservaIdFk: this.espacioSeleccionado,
      fechaReserva: '',
      horaInicio: '',
      horaFin: '',
      cantidadParticipantes: 1
    };
    this.displayModal = true;
  }

  cerrarModal() {
    this.displayModal = false;
  }

  guardarReserva() {
    if (!this.reserva.nombreCompleto || !this.reserva.fechaReserva || !this.reserva.horaInicio || !this.reserva.horaFin || !this.reserva.institucionEducativa) {
      Swal.fire('Error', 'Complete los campos obligatorios', 'error');
      return;
    }

    const espacio = this.getEspacioSeleccionadoCompleto();
    if (espacio) {
      const cantidad = this.reserva.cantidadParticipantes || 0;
      if (espacio.aforoMaximo && cantidad > espacio.aforoMaximo) {
        Swal.fire('Atención', `La cantidad de participantes (${cantidad}) supera el aforo máximo permitido para este espacio (${espacio.aforoMaximo}).`, 'warning');
        return;
      }
      if (espacio.aforoMinimo && cantidad < espacio.aforoMinimo) {
        Swal.fire('Atención', `La cantidad de participantes (${cantidad}) no cumple con el aforo mínimo requerido para este espacio (${espacio.aforoMinimo}).`, 'warning');
        return;
      }
    }

    this.reservasService.createReserva(this.reserva).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Reserva solicitada correctamente', 'success');
        this.cerrarModal();
        if (this.espacioSeleccionado) {
          this.cargarReservasPorEspacio(this.espacioSeleccionado);
        }
      },
      error: (err) => {
        const msg = err.error?.error || 'Ocurrió un error al procesar la reserva';
        Swal.fire('Error', msg, 'error');
      }
    });
  }
}
