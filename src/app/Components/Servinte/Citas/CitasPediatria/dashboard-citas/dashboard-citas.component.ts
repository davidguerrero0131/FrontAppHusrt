import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntidadService } from '../../../../../Services/Servinte/entidad.service';
import { ChartModule } from 'primeng/chart';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';
import { CitaspediatriaadminnavbarComponent } from '../../../../navbars/citaspediatriaadminnavbar/citaspediatriaadminnavbar.component';

@Component({
  selector: 'app-dashboard-citas',
  standalone: true,
  imports: [CitaspediatriaadminnavbarComponent, CommonModule, FormsModule, ChartModule, DatePickerModule, SelectModule, CardModule, ButtonModule, TableModule, DialogModule],
  templateUrl: './dashboard-citas.component.html',
  styleUrls: ['./dashboard-citas.component.css']
})
export class DashboardCitasComponent implements OnInit {
  private servinteService = inject(EntidadService);
  private router = inject(Router);

  loading: boolean = false;
  startDate: any = null;
  endDate: any = null;

  stats: any = {
    totals: { total: 0, validated: 0, pending: 0 },
    byStatus: [],
    byStage: []
  };

  statusChartData: any;
  statusChartOptions: any;
  stageChartData: any; // All appointments by stage
  stageChartOptions: any;
  
  // Nuevas gráficas
  atendidosChartData: any; // Only 'Realizada' by stage
  atendidosChartOptions: any;
  nuevosChartData: any; // Only 'Ingreso' trend (or simple number)
  nuevosChartOptions: any;
  especialidadChartData: any;
  especialidadChartOptions: any;
  medicoChartData: any;
  medicoChartOptions: any;

  // Variables para Drill-down
  displayDialog: boolean = false;
  selectedPatients: any[] = [];
  dialogHeader: string = '';
  allDetailedCitas: any[] = [];

  ngOnInit() {
    // Default range: current month
    const now = new Date();
    this.startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    this.endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    this.loadStats();
  }

  async loadStats() {
    this.loading = true;
    try {
      const startStr = this.startDate ? this.startDate.toISOString().split('T')[0] : '';
      const endStr = this.endDate ? this.endDate.toISOString().split('T')[0] : '';
      
      this.stats = await this.servinteService.getDashboardStats(startStr, endStr);
      this.allDetailedCitas = this.stats.detailedCitas || [];
      console.log('Stats recibidas en frontend:', this.stats);
      this.initCharts();
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      this.loading = false;
    }
  }

  initCharts() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    // Status Chart (Doughnut)
    const statusLabels = this.stats.byStatus?.map((s: any) => s.label) || [];
    const statusValues = this.stats.byStatus?.map((s: any) => Number(s.value)) || [];

    this.statusChartData = {
      labels: statusLabels,
      datasets: [
        {
          data: statusValues,
          backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#f97316', '#6366f1', '#14b8a6', '#64748b'],
          hoverBackgroundColor: ['#60a5fa', '#fbbf24', '#34d399', '#f87171', '#a78bfa', '#fb923c', '#818cf8', '#2dd4bf', '#94a3b8']
        }
      ]
    };

    this.statusChartOptions = {
      cutout: '60%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#4b5563',
            usePointStyle: true
          }
        }
      }
    };

    // Stage Chart (Bar)
    const stageLabels = this.stats.byStage?.map((s: any) => s.label) || [];
    const stageValues = this.stats.byStage?.map((s: any) => Number(s.value)) || [];

    this.stageChartData = {
      labels: stageLabels,
      datasets: [
        {
          label: 'Citas por Etapa',
          data: stageValues,
          backgroundColor: '#3b82f6',
          borderRadius: 6
        }
      ]
    };

    this.stageChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          ticks: { color: '#4b5563' },
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          ticks: { color: '#4b5563' },
          grid: { color: '#e5e7eb', drawBorder: false }
        }
      }
    };

    // Atendidos por Etapa Chart (Only 'Realizada')
    const atendidosFiltered = this.allDetailedCitas.filter(c => c.estadoCita === 'Realizada');
    const atendidosByStageMap: any = {};
    atendidosFiltered.forEach(c => {
      atendidosByStageMap[c.control] = (atendidosByStageMap[c.control] || 0) + 1;
    });
    
    const atendidosLabels = Object.keys(atendidosByStageMap);
    const atendidosValues = Object.values(atendidosByStageMap);

    this.atendidosChartData = {
      labels: atendidosLabels,
      datasets: [
        {
          label: 'Pacientes Atendidos por Etapa',
          data: atendidosValues,
          backgroundColor: '#10b981', // green for success
          borderRadius: 6
        }
      ]
    };

    this.atendidosChartOptions = { ...this.stageChartOptions }; // Clone basic options

    // Nuevos Ingresos (Only 'Ingreso')
    const nuevosFiltered = this.allDetailedCitas.filter(c => c.control === 'Ingreso');
    const nuevosByDateMap: any = {};
    nuevosFiltered.forEach(c => {
      const dateKey = c.fechaCita.split('T')[0];
      nuevosByDateMap[dateKey] = (nuevosByDateMap[dateKey] || 0) + 1;
    });

    const nuevosLabels = Object.keys(nuevosByDateMap).sort();
    const nuevosValues = nuevosLabels.map(k => nuevosByDateMap[k]);

    this.nuevosChartData = {
      labels: nuevosLabels,
      datasets: [
        {
          label: 'Nuevos Ingresos',
          data: nuevosValues,
          fill: true,
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.2)',
          tension: 0.4
        }
      ]
    };

    this.nuevosChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { ticks: { color: '#4b5563' }, grid: { display: false } },
        y: { beginAtZero: true, ticks: { color: '#4b5563', stepSize: 1 }, grid: { color: '#e5e7eb', drawBorder: false } }
      }
    };

    // Especialidad Chart (Doughnut or Bar)
    const especialidadLabels = this.stats.byEspecialidad?.map((s: any) => s.label) || [];
    const especialidadValues = this.stats.byEspecialidad?.map((s: any) => Number(s.value)) || [];

    this.especialidadChartData = {
      labels: especialidadLabels,
      datasets: [
        {
          data: especialidadValues,
          backgroundColor: ['#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#3b82f6'],
          hoverBackgroundColor: ['#a78bfa', '#f472b6', '#2dd4bf', '#fbbf24', '#60a5fa']
        }
      ]
    };
    this.especialidadChartOptions = { ...this.statusChartOptions }; // Reusing doughnut options

    // Medico Chart (Bar)
    const medicoLabels = this.stats.byMedico?.map((s: any) => s.label) || [];
    const medicoValues = this.stats.byMedico?.map((s: any) => Number(s.value)) || [];

    this.medicoChartData = {
      labels: medicoLabels,
      datasets: [
        {
          label: 'Citas por Médico',
          data: medicoValues,
          backgroundColor: '#06b6d4',
          borderRadius: 6
        }
      ]
    };
    this.medicoChartOptions = { ...this.stageChartOptions };
  }

  // Handle Chart Clicks
  onStatusClick(event: any) {
    const label = this.statusChartData.labels[event.element.index];
    this.selectedPatients = this.allDetailedCitas.filter(c => c.estadoCita === label).map(c => c.paciente);
    this.dialogHeader = `Pacientes: ${label}`;
    this.displayDialog = true;
  }

  onStageClick(event: any) {
    const label = this.stageChartData.labels[event.element.index];
    this.selectedPatients = this.allDetailedCitas.filter(c => c.control === label).map(c => c.paciente);
    this.dialogHeader = `Pacientes en Etapa: ${label}`;
    this.displayDialog = true;
  }

  onAtendidosClick(event: any) {
    const label = this.atendidosChartData.labels[event.element.index];
    this.selectedPatients = this.allDetailedCitas.filter(c => c.estadoCita === 'Realizada' && c.control === label).map(c => c.paciente);
    this.dialogHeader = `Pacientes Atendidos en Etapa: ${label}`;
    this.displayDialog = true;
  }

  onNuevosClick(event: any) {
    const dateLabel = this.nuevosChartData.labels[event.element.index];
    this.selectedPatients = this.allDetailedCitas.filter(c => c.control === 'Ingreso' && c.fechaCita.startsWith(dateLabel)).map(c => c.paciente);
    this.dialogHeader = `Nuevos Ingresos el ${dateLabel}`;
    this.displayDialog = true;
  }

  onEspecialidadClick(event: any) {
    const label = this.especialidadChartData.labels[event.element.index];
    this.selectedPatients = this.allDetailedCitas.filter(c => c.especialidad && c.especialidad.nombre === label).map(c => c.paciente);
    this.dialogHeader = `Pacientes en Especialidad: ${label}`;
    this.displayDialog = true;
  }

  onMedicoClick(event: any) {
    const label = this.medicoChartData.labels[event.element.index];
    this.selectedPatients = this.allDetailedCitas.filter(c => c.medico && (c.medico.nombre + ' ' + c.medico.apellido).trim() === label).map(c => c.paciente);
    this.dialogHeader = `Pacientes de Médico: ${label}`;
    this.displayDialog = true;
  }

  goBack() {
    this.router.navigate(['/servinte/citasmadrecanguro']);
  }
}
