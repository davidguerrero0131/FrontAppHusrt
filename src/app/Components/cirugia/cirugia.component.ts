import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { EntidadService } from '../../Services/Servinte/entidad.service';
import { TableModule } from "primeng/table";
import { CommonModule } from '@angular/common';
import { Card } from "primeng/card";
import { Dialog } from "primeng/dialog";

@Component({
  selector: 'app-cirugia',
  imports: [TableModule, CommonModule, Dialog],
  templateUrl: './cirugia.component.html',
  styleUrl: './cirugia.component.css'
})
export class CirugiaComponent implements OnInit {

  pacientes!: any[];
  servinteServices = inject(EntidadService);
  visibleSearch: boolean = false;

  async ngOnInit() {


    this.pacientes = await this.servinteServices.getPacientesCirugia();

  }
}
