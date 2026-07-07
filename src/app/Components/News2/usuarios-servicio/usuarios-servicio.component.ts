import { News2Service } from './../../../Services/news2/news2.service';
import { Component, inject, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-usuarios-servicio',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule],
  providers: [MessageService],
  templateUrl: './usuarios-servicio.component.html',
  styleUrl: './usuarios-servicio.component.css'
})
export class UsuariosServicioComponent implements OnInit {

  services!: any[];
  pacientes!: any[];
  signosVitales!: any[];
  itemselected: Number | undefined;
  news2Service = inject(News2Service);

  visibleSearch: boolean = false;


  async verServicio() {
    const ubicacion = {
      ubicod: this.itemselected
    }
    const sigpac: any[] = [];

    try {
      this.visibleSearch = true;
      // 1. Cargamos rápidamente la lista base de pacientes
      this.pacientes = await this.news2Service.getPacientesServicio(ubicacion);

      // 2. Mostramos todos los pacientes en la pantalla inmediatamente sin esperar a los signos
      this.signosVitales = this.pacientes.map(pacienteact => ({ pacienteact, signos: undefined, cargando: true }));
      this.visibleSearch = false; // ¡El spinner gigante se oculta casi al instante!

      // 3. Consultamos los signos vitales "en segundo plano" por cada paciente
      // Angular irá pintando los datos en las tarjetas progresivamente a medida que vayan llegando
      this.signosVitales.forEach(async (item) => {
        try {
          const signos = await this.news2Service.getSignosPaciente(item.pacienteact.epiactepi);
          if (signos && signos.frecuenciaCardiaca != undefined && signos.SO2 != undefined) {
            // Cuando la respuesta llega, actualizamos solo a este paciente en específico
            item.signos = signos;
          }
        } catch (error) {
          // Si el paciente no tiene signos o falla, la tarjeta se queda en blanco sin afectar al resto
        } finally {
          item.cargando = false; // Terminamos de procesar a este paciente
        }
      });

    } catch (error) {
      console.error('Error cargando servicio:', error);
      this.visibleSearch = false;
    }
    setTimeout(() => {
      this.verServicio();
    }, 240000);
  }

  async ngOnInit() {
    try {
      this.services = await this.news2Service.getServicios();
    }
    catch {

    }
  }
}
