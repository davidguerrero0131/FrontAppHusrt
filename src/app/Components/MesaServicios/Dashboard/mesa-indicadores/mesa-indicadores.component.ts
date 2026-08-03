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
  dataTipoEquipo: any;
  chartOptionsPolarArea: any;

  // Paleta de colores vibrantes y modernos (Biomedica)
  readonly colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6', '#f97316', '#06b6d4'
  ];
  readonly bgColors = [
    'rgba(59, 130, 246, 0.7)', 'rgba(16, 185, 129, 0.7)', 'rgba(245, 158, 11, 0.7)', 'rgba(239, 68, 68, 0.7)',
    'rgba(139, 92, 246, 0.7)', 'rgba(236, 72, 153, 0.7)', 'rgba(99, 102, 241, 0.7)', 'rgba(20, 184, 166, 0.7)',
    'rgba(249, 115, 22, 0.7)', 'rgba(6, 182, 212, 0.7)'
  ];
  readonly borderColors = [
    '#2563eb', '#059669', '#d97706', '#dc2626', '#7c3aed', '#db2777', '#4f46e5', '#0d9488', '#ea580c', '#0891b2'
  ];

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
        legend: { display: false },
        tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#333',
            bodyColor: '#333',
            borderColor: '#ddd',
            borderWidth: 1,
            padding: 10,
            boxPadding: 4,
            usePointStyle: true
        }
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
      },
      animation: {
          duration: 1200,
          easing: 'easeOutQuart'
      }
    };

    this.chartOptionsPolarArea = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: textColor },
          position: 'right'
        },
        tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#333',
            bodyColor: '#333',
            borderColor: '#ddd',
            borderWidth: 1,
            padding: 10,
            boxPadding: 4,
            usePointStyle: true
        }
      },
      scales: {
        r: {
          grid: { color: surfaceBorder }
        }
      },
      animation: {
          duration: 1200,
          easing: 'easeOutQuart'
      }
    };

    // Improve Pie/Donut options
    this.chartOptionsPie.plugins.tooltip = {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#333',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        usePointStyle: true
    };
    this.chartOptionsPie.animation = { duration: 1200, easing: 'easeOutQuart' };

    // Improve Bar options
    this.chartOptionsBar.plugins.tooltip = {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#333',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        usePointStyle: true
    };
    this.chartOptionsBar.animation = { duration: 1200, easing: 'easeOutQuart' };
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
            this.colors[0], this.colors[1], this.colors[2], this.colors[3], this.colors[4], this.colors[5]
          ],
          borderWidth: 0
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
          backgroundColor: this.colors[0],
          borderRadius: 8,
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
          backgroundColor: this.colors[1],
          borderRadius: 8,
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
          backgroundColor: this.colors[2],
          borderRadius: 8,
          data: prioValues
        }
      ]
    };

    // Casos por Tipo de Equipo (Polar Area)
    const equipoKeys = Object.keys(data.porTipoEquipo || {});
    const equipoValues = Object.values(data.porTipoEquipo || {});
    this.dataTipoEquipo = {
      labels: equipoKeys,
      datasets: [
        {
          data: equipoValues,
          backgroundColor: this.colors,
          borderRadius: 8,
          label: 'Casos por Tipo de Equipo'
        }
      ]
    };

  }
}
