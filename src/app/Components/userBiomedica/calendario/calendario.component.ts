import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DatePicker } from 'primeng/datepicker'
import { BiomedicausernavbarComponent } from '../../navbars/biomedicausernavbar/biomedicausernavbar.component';

import { MantenimientosService } from '../../../Services/appServices/biomedicaServices/mantenimientos/mantenimientos.service';
import { AmetrologicasService } from '../../../Services/appServices/biomedicaServices/ametrologicas/ametrologicas.service';
@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarModule, BiomedicausernavbarComponent, DatePicker],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css'
})

export class CalendarioComponent implements OnInit {

  fechaActual = new Date();
  mes = this.fechaActual.getMonth() + 1;
  anio = this.fechaActual.getFullYear();

  tiposEquipo: any[] = [];
  servicios: any[] = [];

  equiposPlanPreventivoMes: any[] = [];
  equiposPlanMantenimientoServicio: any[] = [];
  equiposPlanMantenimientoTipoEquipo: any[] = [];
  equiposPlanMetrologiaMes: any[] = [];
  equiposPlanAMetrologicasServicio: any[] = [];
  equiposPlanAMetrologicasTipoEquipo: any[] = [];

  date: Date | undefined;
  panelActivo: 'seguimiento' | 'mantenimientos' | 'metrologia' | 'mensuales' = 'seguimiento';

  mantenimientoServices = inject(MantenimientosService);
  ametrologicasServices = inject(AmetrologicasService);

  async ngOnInit(){
      this.equiposPlanPreventivoMes = await this.mantenimientoServices.getPlanMantenimientoMes({ mes: this.mes + 1, ano: this.anio });
      this.equiposPlanMetrologiaMes = await this.ametrologicasServices.getPlanABiometricasMes({ mes: this.mes + 1, ano: this.anio });
  }

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
