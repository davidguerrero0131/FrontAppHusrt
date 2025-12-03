import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, FormArray, FormControl } from '@angular/forms';
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
import { Router } from '@angular/router';
import { ReportesService } from '../../../../Services/appServices/biomedicaServices/reportes/reportes.service';

@Component({
  selector: 'app-crear-reporte',
  standalone: true,
  imports: [DatePickerModule, SelectModule, TextareaModule, InputTextModule, ButtonModule, CardModule, CalendarModule, InputMaskModule, CommonModule, DropdownModule, CheckboxModule, ReactiveFormsModule, FormsModule, BiomedicausernavbarComponent],
  templateUrl: './crear-reporte.component.html',
  styleUrl: './crear-reporte.component.css'
})
export class CrearReporteComponent implements OnInit {

  reporte!: any;
  equipo!: any;
  protocolos!: any[];
  cumplimientoProtocolo: any[] = [];
  nombreUsuario!: any;
  selectProtocolos: any[] = [];
  reporteForm!: FormGroup;
  equiposervices = inject(EquiposService);
  protocoloservices = inject(ProtocolosService);
  userServices = inject(UserService);
  reprteServices = inject(ReportesService);
  router = inject(Router);
  tipoMantenimiento = '';

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

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private location: Location) {
    this.validarTipoMantenimiento();
    this.reporteForm = this.fb.group({
      fechaRealizado: [null],
      horaInicio: [null],
      fechaFin: [null],
      horaTerminacion: [null],
      horaTotal: [null],
      tipoMantenimiento: this.tipoMantenimiento,
      tipoFalla: [null],
      motivo: [''],
      trabajoRealizado: [''],
      calificacion: [null],
      nombreRecibio: [''],
      cedulaRecibio: [''],
      observaciones: [''],
      cumplimientoProtocolo: this.fb.array([])
    });

    if (this.tipoMantenimiento === 'Preventivo') {
      this.reporteForm.get('tipoFalla')?.setValue('Sin Falla');
      this.reporteForm.get('tipoFalla')?.disable();
      this.reporteForm.get('motivo')?.setValue('Programado para mantenimiento preventivo');
      this.reporteForm.get('motivo')?.disable();
    }

    this.reporteForm.get('tipoMantenimiento')?.disable();
  }

  async ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.reporte = await this.reprteServices.getPreventivoProgramado(Number(sessionStorage.getItem('idReporte'))) || {};
    this.equipo = await this.equiposervices.getEquipoById(this.id);
    this.protocolos = await this.protocoloservices.getProtocoloTipoEquipo(this.equipo.tipoEquipoIdFk);
    this.nombreUsuario = await this.userServices.getNameUSer(getDecodedAccessToken().id);
    this.selectProtocolos = [this.protocolos[1]];
    await this.iniCumplimientoProtocolo();
  }

  async onSubmit() {
    if (this.reporteForm.valid) {
      this.reporte =
      {
        id: this.reporte.id || null,
        añoProgramado: this.reporte.añoProgramado || null,
        mesProgramado: this.reporte.mesProgramado || null,
        fechaRealizado: this.reporteForm.value.fechaRealizado,
        horaInicio: this.reporteForm.value.horaInicio,
        fechaFin: this.reporteForm.value.fechaFin,
        horaTerminacion: this.reporteForm.value.horaTerminacion,
        horaTotal: 0,
        tipoMantenimiento: this.tipoMantenimiento,
        tipoFalla: this.tipoMantenimiento == 'Preventivo' ? 'Sin Falla' : this.reporteForm.value.tipoFalla,
        motivo: this.tipoMantenimiento == 'Preventivo' ? 'Programado para mantenimiento preventivo' : this.reporteForm.value.motivo,
        trabajoRealizado: this.reporteForm.value.trabajoRealizado,
        calificacion: this.reporteForm.value.calificacion,
        nombreRecibio: this.reporteForm.value.nombreRecibio,
        cedulaRecibio: this.reporteForm.value.cedulaRecibio,
        observaciones: this.reporteForm.value.observaciones,
        mantenimientoPropio: true,
        realizado: true,
        rutaPdf: null,
        servicioIdFk: this.equipo.servicioIdFk,
        equipoIdFk: this.equipo.id,
        usuarioIdFk: getDecodedAccessToken().id,
      }
      if (this.tipoMantenimiento === 'Preventivo') {
        await this.reprteServices.ActualizarPreventivoProgramado(this.reporte.id, this.reporte).then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Se almaceno el reporte Preventivo',
            showConfirmButton: false,
            timer: 1500
          });
          this.guardarCumplimiento();
          console.log(this.reporte)
          this.router.navigate(['/biomedica/reportesequipo/', this.reporte.equipoIdFk]);
        }).catch(error => {
          console.error('Error al actualizar el reporte:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar el reporte',
            text: 'Por favor, inténtelo de nuevo más tarde.'
          });
        });
      } else {
        await this.reprteServices.CrearReporteCorrectivo(this.reporte).then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Se almaceno el reporte correctamente',
            showConfirmButton: false,
            timer: 1500
          });
          this.guardarCumplimiento();
          this.router.navigate(['/biomedica/mantenimineto']);
        }).catch(error => {
          console.error('Error al crear el reporte:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error al crear el reporte',
            text: 'Por favor, inténtelo de nuevo más tarde.'
          });
        });
      }
    }
  }

  iniCumplimientoProtocolo() {
    const array = this.reporteForm.get('cumplimientoProtocolo') as FormArray;
    array.clear();
    this.protocolos.forEach(p => {
      array.push(this.fb.group({
        protocoloPreventivoIdFk: [p.id],
        cumple: [false],
        reporteIdFk: [this.reporte.id],
        paso: [p.paso]
      }));
    });
  }

  async guardarCumplimiento() {
    for (let i = 0; i < this.reporteForm.value.cumplimientoProtocolo.length; i++) {
      const cp = {
        protocoloPreventivoIdFk: this.reporteForm.value.cumplimientoProtocolo[i].protocoloPreventivoIdFk,
        cumple: this.reporteForm.value.cumplimientoProtocolo[i].cumple,
        reporteIdFk: this.reporteForm.value.cumplimientoProtocolo[i].reporteIdFk
      };
      const response = await this.protocoloservices.addCumplimientoProtocolo(cp);
    }
  }

  get cumplimientoProtocoloFormArray(): FormArray {
    return this.reporteForm.get('cumplimientoProtocolo') as FormArray;
  }

  testViewCumplimiento() {
    console.log('Cumplimiento:', this.reporteForm.value.cumplimientoProtocolo);
    this.guardarCumplimiento();
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

  validarQR() {
    this.router.navigate(['/biomedica/validarqr']);
  }

  validarTipoMantenimiento() {
    if (sessionStorage.getItem('TipoMantenimiento') === 'C') {
      this.tipoMantenimiento = 'Correctivo';
    } else if (sessionStorage.getItem('TipoMantenimiento') === 'P') {
      this.tipoMantenimiento = 'Preventivo';
    }
  }

  convertirMayusculas(texto: string): string {
    return texto ? texto.toUpperCase() : '';
  }

}
