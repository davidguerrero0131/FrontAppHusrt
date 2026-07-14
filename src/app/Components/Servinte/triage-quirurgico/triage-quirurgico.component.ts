import { EntidadService } from './../../../Services/Servinte/entidad.service';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-triage-quirurgico',
  standalone: true,
  imports: [DialogModule, NgStyle],
  templateUrl: './triage-quirurgico.component.html',
  styleUrl: './triage-quirurgico.component.css'
})
export class TriageQuirurgicoComponent implements OnInit, OnDestroy {

  // Variables de estado
  pacientes: any[] = [];
  cargando: boolean = true;

  
  // Variables Modal
  displayModal: boolean = false;
  pacienteSeleccionado: any = null;

  // Variables de Tiempo
  now: Date = new Date();
  timer: any;
  refreshTimer: any;

  // Inyección del servicio
  servinteServices = inject(EntidadService);

  ngOnInit() {
    this.loadPacientes();
    this.timer = setInterval(() => {
      this.now = new Date();
    }, 1000);

    // Actualizar la lista de pacientes cada 60 segundos
    this.refreshTimer = setInterval(() => {
      this.loadPacientes(false);
    }, 60000);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  }

  async loadPacientes(mostrarLoader: boolean = true) {
    try {
      if (mostrarLoader) {
        this.cargando = true;
      }

      // Declaramos explícitamente como 'any' para evitar el error de tipo 'never'
      const response: any = await this.servinteServices.getTriagePacientes();

      // Validamos la estructura de la respuesta
      let rawPacientes = [];
      if (Array.isArray(response)) {
        rawPacientes = response;
      }
      else if (response && Array.isArray(response.data)) {
        rawPacientes = response.data;
      }
      else {
        console.warn('La respuesta del servidor no es un arreglo iterativo. Revisa el backend.');
        rawPacientes = [];
      }

      // Filtrar para mantener solo el registro más reciente por paciente (PACHIS)
      // Como vienen ordenados por REGCLIFEG DESC, el primero que encontremos es el más reciente
      const seenPACHIS = new Set();
      this.pacientes = rawPacientes.filter(paciente => {
        const pachisStr = String(paciente.PACHIS).trim();
        if (!seenPACHIS.has(pachisStr)) {
          seenPACHIS.add(pachisStr);
          return true;
        }
        return false;
      });

      // Ordenar pacientes por puntuación de mayor a menor
      this.pacientes.sort((a, b) => {
        const scoreA = Number(a.DETALLES_TRIAGE?.puntuacion) || 0;
        const scoreB = Number(b.DETALLES_TRIAGE?.puntuacion) || 0;
        return scoreB - scoreA;
      });

    } catch (error) {
      console.error('Error HTTP al cargar pacientes:', error);
      if (mostrarLoader) {
        this.pacientes = [];
      }
    } finally {
      if (mostrarLoader) {
        this.cargando = false;
      }
    }
  }

  abrirModal(paciente: any) {
    this.pacienteSeleccionado = paciente;
    this.displayModal = true;
  }

  calcularHace(fechaStr: string | null | undefined): string {
    if (!fechaStr) return '--';
    const fecha = new Date(fechaStr);
    if (isNaN(fecha.getTime())) return '--';

    const diffMs = this.now.getTime() - fecha.getTime();
    if (diffMs < 0) return 'Ahora';

    const segundos = Math.floor(diffMs / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias > 0) return `${dias}d ${horas % 24}h ${minutos % 60}m`;
    if (horas > 0) return `${horas}h ${minutos % 60}m ${segundos % 60}s`;
    if (minutos > 0) return `${minutos}m ${segundos % 60}s`;
    return `${segundos}s`;
  }

  getPrioridadCirugia(puntuacion: any) {
    const score = Number(puntuacion);
    if (isNaN(score)) return { texto: 'Sin Clasificar', bgColor: '#6c757d', textColor: '#ffffff' }; // Gris para los no definidos

    if (score > 10) return { texto: 'CIRUGÍA INMEDIATA', bgColor: '#dc3545', textColor: '#ffffff' }; // Rojo
    if (score > 8 && score <= 10) return { texto: 'CIRUGÍA EN 1 HORA', bgColor: '#fd7e14', textColor: '#ffffff' }; // Naranja
    if (score > 6 && score <= 8) return { texto: 'CIRUGÍA EN 6 HORAS', bgColor: '#ffc107', textColor: '#000000' }; // Amarillo
    if (score > 4 && score <= 6) return { texto: 'CIRUGÍA EN 12 HORAS', bgColor: '#198754', textColor: '#ffffff' }; // Verde
    if (score > 2 && score <= 4) return { texto: 'CIRUGÍA EN 24-48 HORAS', bgColor: '#0d6efd', textColor: '#ffffff' }; // Azul
    return { texto: 'CIRUGÍA EN 2-4 DÍAS', bgColor: '#6c757d', textColor: '#ffffff' }; // Gris
  }
}
