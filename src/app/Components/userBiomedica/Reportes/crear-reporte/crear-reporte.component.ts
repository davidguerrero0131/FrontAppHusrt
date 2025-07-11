import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import Swal from 'sweetalert2';
import { getDecodedAccessToken } from '../../../../utilidades';
import { BiomedicausernavbarComponent } from '../../../navbars/biomedicausernavbar/biomedicausernavbar.component';
import { ProtocolosService } from '../../../../Services/appServices/biomedicaServices/protocolos/protocolos.service';
import { EquiposService } from '../../../../Services/appServices/biomedicaServices/equipos/equipos.service';
import { UserService } from '../../../../Services/appServices/userServices/user.service';

@Component({
  selector: 'app-crear-reporte',
  imports: [DatePickerModule, SelectModule, TextareaModule, InputTextModule, ButtonModule, CardModule, CalendarModule, InputMaskModule, CommonModule, DropdownModule, CheckboxModule, ReactiveFormsModule, FormsModule, BiomedicausernavbarComponent],
  templateUrl: './crear-reporte.component.html',
  styleUrl: './crear-reporte.component.css'
})
export class CrearReporteComponent implements OnInit {

  reporte!: any;
  equipo!: any;
  protocolos!: any[];
  nombreUsuario!: any;
  selectProtocolos: any[] = [];
  reporteForm!: FormGroup;
  equiposervices = inject(EquiposService);
  protocoloservices = inject(ProtocolosService);
  userServices = inject(UserService);

  tiposMantenimiento = [
    { label: 'Correctivo', value: 'Correctivo' },
    { label: 'Preventivo', value: 'Preventivo' },
    { label: 'Predictivo', value: 'Predictivo' },
    { label: 'Otro', value: 'Otro' },
  ];

  tiposFalla = [
    'Desgaste', 'Operación Indebida', 'Causa Externa', 'Accesorios',
    'Desconocido', 'Sin Falla', 'Otros'
  ].map(v => ({ label: v, value: v }));

  id!: number;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private location: Location) { }

  async ngOnInit() {
    this.reporteForm = this.fb.group({
      fechaRealizado: [null],
      horaInicio: [null],
      fechaFin: [null],
      horaTerminacion: [null],
      horaTotal: [null],
      tipoMantenimiento: [null],
      tipoFalla: [null],
      ubicacion: [''],
      motivo: [''],
      trabajoRealizado: [''],
      calificacion: [null],
      nombreRecibio: [''],
      cedulaRecibio: [''],
      observaciones: [''],
    });

    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.equipo = await this.equiposervices.getEquipoById(this.id);
    this.protocolos = await this.protocoloservices.getProtocoloTipoEquipo(this.equipo.tipoEquipoIdFk);
    this.nombreUsuario = await this.userServices.getNameUSer(getDecodedAccessToken().id);
    this.selectProtocolos = [this.protocolos[1]];

  }

  onSubmit() {
    if (this.reporteForm.valid) {
      this.reporte =
      {
        añoProgramado: 2025,
        mesProgramado: 1,
        fechaRealizado: this.reporteForm.value.fechaRealizado,
        horaInicio: this.reporteForm.value.horaInicio,
        fechaFin: this.reporteForm.value.fechaFin,
        horaTerminacion: this.reporteForm.value.horaTerminacion,
        horaTotal: 0,
        tipoMantenimiento: this.reporteForm.value.tipoMantenimiento,
        tipoFalla: this.reporteForm.value.tipoFalla,
        motivo: this.reporteForm.value.motivo,
        trabajoRealizado: this.reporteForm.value.trabajoRealizado,
        calificacion: this.reporteForm.value.calificacion,
        nombreRecibio: this.reporteForm.value.nombreRecibio,
        cedulaRecibio: this.reporteForm.value.cedulaRecibio,
        observaciones: this.reporteForm.value.observaciones,
        mantenimientoPropio: true,
        realizado: true,
        rutaPdf: 'src/assets/pdf/reporte.pdf',
        servicioIdFk: this.equipo.servicioIdFk,
        equipoIdFk: this.equipo.id,
        usuarioIdFk: getDecodedAccessToken().id,
      }
      console.log(this.reporte);
    }
  }

  goBack(): void {
    Swal.fire({
      title: "¿Quieres guardar los cambios?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      denyButtonText: `No guardar`,
      cancelButtonText: "Cancelar",
      icon: "question"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Reporte Guardado!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("Los cambios no se guardan", "", "info");
        this.location.back();
      }
    });
  }

  validarPreventivo(): boolean {
    console.log(this.reporteForm.value.tipoMantenimiento);
    return this.reporteForm.value.tipoMantenimiento === 'Preventivo' ? true : false;

  }


}
