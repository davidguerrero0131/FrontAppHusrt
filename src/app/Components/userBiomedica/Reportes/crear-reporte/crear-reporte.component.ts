import { Component, inject, OnInit } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';

import { ActivatedRoute } from '@angular/router';
import { EquiposService } from '../../../../Services/appServices/biomedicaServices/equipos/equipos.service';

@Component({
  selector: 'app-crear-reporte',
  imports: [CalendarModule, InputMaskModule, CommonModule, DropdownModule, CheckboxModule],
  templateUrl: './crear-reporte.component.html',
  styleUrl: './crear-reporte.component.css'
})
export class CrearReporteComponent implements OnInit{

  equiposervices = inject(EquiposService);
  tiposMantenimiento: String[] = ['Preventivo', 'Correctivo A', 'Correctivo P'];
  tiposFalla: String[] = ['Desgaste', 'Operación Indebida', 'Causa Externa', 'Accesorios', 'Desconocido', 'Sin Falla', 'Otros', 'No Registra'];

    id!: number;

  constructor(private route: ActivatedRoute) {}

  async ngOnInit() {
      this.id = Number(this.route.snapshot.paramMap.get('id'));
       const Equipo = await this.equiposervices.getEquipoById(this.id);
       console.log(Equipo);
  }
}
