import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProtocolosService } from './../../../Services/appServices/biomedicaServices/protocolos/protocolos.service';
import { TipoEquipoService } from './../../../Services/appServices/general/tipoEquipo/tipo-equipo.service';
import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { SuperadminnavbarComponent } from '../../navbars/superadminnavbar/superadminnavbar.component';
import { CommonModule } from '@angular/common';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { Dialog } from "primeng/dialog";
import { Table } from 'primeng/table';


@Component({
  selector: 'app-admtiposequipo',
  imports: [TableModule, SuperadminnavbarComponent, CommonModule, InputIconModule, IconFieldModule, InputTextModule, Dialog],
  templateUrl: './admtiposequipo.component.html',
  styleUrl: './admtiposequipo.component.css'
})
export class AdmtiposequipoComponent implements OnInit {

  formGroup: FormGroup;
  formBuilder = inject(FormBuilder);

  @ViewChild('dt2') dt2!: Table;
  tipoequipoService = inject(TipoEquipoService);
  protocolosServices = inject(ProtocolosService);
  tiposEquipos!: any[];
  loading: boolean = false;
  viewModalTipoEquipo: boolean = false;
  tipoEquipoSelected!: any;
  protocoloTipoEquipo!: any[];


  constructor( ) {
     this.formGroup = this.formBuilder.group({
      nombres: this.formBuilder.control(this.tipoEquipoSelected.nombres || '', [Validators.required]),
      materialConsumible: this.formBuilder.control(this.tipoEquipoSelected.materialConsumible || '', [Validators.required]),
      herramienta: this.formBuilder.control(this.tipoEquipoSelected.herramienta || '', [Validators.required]),
      tiempoMinutos: this.formBuilder.control(this.tipoEquipoSelected.tiempoMinutos || '', [Validators.required]),
      repuestosMinimos: this.formBuilder.control(this.tipoEquipoSelected.repuestosMinimos || '', [Validators.required]),
      actividad: this.formBuilder.control(this.tipoEquipoSelected.actividad || '', [Validators.required]),
     });
   }

  async ngOnInit() {

    this.tiposEquipos = await this.tipoequipoService.getAllTiposEquipos();
    console.log(this.tiposEquipos);
  }

  onGlobalFilter(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (target) {
      this.dt2.filterGlobal(target.value, 'contains');
    }
  }

  async viewTipoEquipo(tipoEquipo: any) {
    this.tipoEquipoSelected = tipoEquipo;
    this.protocoloTipoEquipo = await this.protocolosServices.getProtocoloTipoEquipo(this.tipoEquipoSelected.id);
    this.viewModalTipoEquipo = true;
    console.log(this.protocoloTipoEquipo);
  }


  async desactivarTipoEquipo(tipoEquipo: any) {
    this.tipoEquipoSelected = tipoEquipo;
    this.tipoEquipoSelected.estado = 0;
    this.tipoEquipoSelected = await this.tipoequipoService.actualizarTipoEquipo(this.tipoEquipoSelected.id, this.tipoEquipoSelected);
    this.tiposEquipos = await this.tipoequipoService.getAllTiposEquipos();
  }
}
