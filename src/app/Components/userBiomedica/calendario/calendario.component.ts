import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DatePicker } from 'primeng/datepicker'
import { BiomedicausernavbarComponent } from '../../navbars/biomedicausernavbar/biomedicausernavbar.component';
@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarModule, BiomedicausernavbarComponent, DatePicker],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css'
})

export class CalendarioComponent {

  date: Date | undefined;

  panelActivo: 'seguimiento' | 'mantenimientos' | 'metrologia' | 'mensuales' = 'seguimiento';


  setPanel(panel: 'seguimiento' | 'mantenimientos' | 'metrologia' | 'mensuales') {
    this.panelActivo = panel;
  }


  async setDate() {
    if (this.date) {


    } else {
      Swal.fire({
        icon: 'error',
        title: 'Debe seleccionar un mes para continuar',
        text: 'Datos no encontrados.'
      })
    }
  }
}
