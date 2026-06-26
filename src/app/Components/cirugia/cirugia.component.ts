import { AfterViewInit, Component, inject, OnInit, OnDestroy } from '@angular/core';
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
export class CirugiaComponent implements OnInit, OnDestroy {

  pacientes: any[] = [];
  servinteServices = inject(EntidadService);
  visibleSearch: boolean = false;
  vistaPacientes: boolean = false;
  intervalTimer: any;

  ngOnInit() {
    this.vistaPacientes = true;
    this.inicierPacientes(true);

    this.intervalTimer = setInterval(() => {
      this.inicierPacientes(false);
    }, 60000);
  }

  ngOnDestroy() {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
    }
  }

  async inicierPacientes(showLoader: boolean = true) {
    if (showLoader) {
      this.visibleSearch = true;
    }

    try {
      const pacientesC = await this.servinteServices.getPacientesCirugia();
      let nuevosPacientes = [];

      for (let i = 0; i < pacientesC.length; i++) {
        const datosCirugia = await this.servinteServices.getDatosCirugiaPaciente(pacientesC[i].episodio);
        nuevosPacientes.push({
          datosPaciente: pacientesC[i],
          datosCirugia: datosCirugia ? datosCirugia[0] : null
        });
      }

      this.pacientes = nuevosPacientes;
    } catch (e) {
      console.error("Error al cargar pacientes de cirugía", e);
    } finally {
      if (showLoader) {
        this.visibleSearch = false;
      }
    }
  }
}
