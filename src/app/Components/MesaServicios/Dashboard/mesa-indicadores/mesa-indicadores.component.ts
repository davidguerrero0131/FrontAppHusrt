import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MesaService } from '../../../../Services/mesa-servicios/mesa.service';
import { ServicioService } from '../../../../Services/appServices/general/servicio/servicio.service';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-mesa-indicadores',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ChartModule, CardModule,
    CalendarModule, DropdownModule, ButtonModule, ToastModule
  ],
  providers: [MessageService],
  templateUrl: './mesa-indicadores.component.html',
  styleUrl: './mesa-indicadores.component.css'
})
export class MesaIndicadoresComponent implements OnInit {

  // Data
  estadisticas: any = null;
  servicios: any[] = [];
  serviciosDestino: any[] = [];
  
  // Filters
  filterFechas: Date[] | null = null;
  selectedServicioId: number | null = null;
  selectedServicioSolicitanteId: number | null = null;
  loading: boolean = false;

  // Chart Options & Datasets
  chartOptionsPie: any;
  chartOptionsBar: any;
  chartOptionsBarHorizontal: any;

  dataEstado: any;
  dataServicio: any;
  dataTiempoCategoria: any;
  dataTiempoPrioridad: any;

  constructor(
    private mesaService: MesaService,
    private servicioService: ServicioService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.initChartOptions();
    this.loadServicios();
    this.loadEstadisticas(); // Load initially 
  }

  initChartOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.chartOptionsPie = {
      plugins: {
        legend: {
          labels: { color: textColor }
        }
      }
    };

    this.chartOptionsBar = {
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder, drawBorder: false }
        },
        y: {
          ticks: { color: textColorSecondary, precision: 0 },
          grid: { color: surfaceBorder, drawBorder: false }
        }
      }
    };

    this.chartOptionsBarHorizontal = {
      indexAxis: 'y',
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder, drawBorder: false }
        },
        y: {
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder, drawBorder: false }
        }
      }
    };
  }

  loadServicios() {
    this.servicioService.getAllServiciosActivos().then(data => {
      this.servicios = data.map((s: any) => {
        let limpio = s.nombres.replace(/SERVICIO\s+HOSPITALARIO\s+DE\s+/i, '').replace(/SERVICIO\s+HOSPITALARIO\s+/i, '').trim();
        return { label: limpio, value: s.id, requiereMesa: s.requiereMesaServicios };
      });
      // Filtro para el destino
      this.serviciosDestino = this.servicios.filter(s => s.requiereMesa === true);
    });
  }

  loadEstadisticas() {
    this.loading = true;
    let params: any = {};
    
    if (this.filterFechas && this.filterFechas.length > 0) {
      if (this.filterFechas[0]) params.fechaInicio = this.filterFechas[0].toISOString();
      if (this.filterFechas[1]) params.fechaFin = this.filterFechas[1].toISOString();
    }
    
    if (this.selectedServicioId) {
      params.servicioId = this.selectedServicioId;
    }
    
    if (this.selectedServicioSolicitanteId) {
      params.servicioSolicitanteId = this.selectedServicioSolicitanteId;
    }

    this.mesaService.getMesaEstadisticas(params).subscribe({
      next: (res) => {
        this.estadisticas = res;
        this.buildCharts(res);
        this.loading = false;
        this.messageService.add({ severity: 'success', summary: 'Cargado', detail: 'Estadísticas actualizadas.' });
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Fallo al cargar las estadísticas.' });
      }
    });
  }

  clearFilters() {
    this.filterFechas = null;
    this.selectedServicioId = null;
    this.selectedServicioSolicitanteId = null;
    this.loadEstadisticas();
  }

  buildCharts(data: any) {
    const documentStyle = getComputedStyle(document.documentElement);

    // Grafico de Donas - ESTADOS
    const estadosKeys = Object.keys(data.porEstado);
    const estadosValues = Object.values(data.porEstado);
    this.dataEstado = {
      labels: estadosKeys,
      datasets: [
        {
          data: estadosValues,
          backgroundColor: [
            documentStyle.getPropertyValue('--blue-500'),
            documentStyle.getPropertyValue('--orange-500'),
            documentStyle.getPropertyValue('--yellow-500'),
            documentStyle.getPropertyValue('--green-500'),
            documentStyle.getPropertyValue('--gray-500')
          ]
        }
      ]
    };

    // Grafico de Barras - SERVICIOS
    // Convert object to array, sort by count descending, pick top 10
    const servArr = Object.keys(data.porServicio).map(k => ({ label: k, count: data.porServicio[k] }));
    servArr.sort((a, b) => b.count - a.count);
    const topServs = servArr.slice(0, 10);

    this.dataServicio = {
      labels: topServs.map(s => s.label.substring(0, 20) + (s.label.length > 20 ? '...' : '')),
      datasets: [
        {
          label: 'Casos',
          backgroundColor: documentStyle.getPropertyValue('--indigo-500'),
          data: topServs.map(s => s.count)
        }
      ]
    };

    // Tiempos por Categoría (Horizontal Bar)
    const catKeys = Object.keys(data.tiemposPorCategoria);
    const catValues = Object.values(data.tiemposPorCategoria);
    
    this.dataTiempoCategoria = {
      labels: catKeys,
      datasets: [
        {
          label: 'Horas Promedio',
          backgroundColor: documentStyle.getPropertyValue('--cyan-500'),
          data: catValues
        }
      ]
    };

    // Tiempos por Prioridad (Vertical Bar)
    const prioKeys = Object.keys(data.tiemposPorPrioridad);
    const prioValues = Object.values(data.tiemposPorPrioridad);
    
    this.dataTiempoPrioridad = {
      labels: prioKeys,
      datasets: [
        {
          label: 'Horas Promedio',
          backgroundColor: documentStyle.getPropertyValue('--pink-500'),
          data: prioValues
        }
      ]
    };

  }
}
