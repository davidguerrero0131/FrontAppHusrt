import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ChartModule } from 'primeng/chart';
import { MantenimientoadminnavbarComponent } from '../../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import { InspeccionService } from '../../../../Services/appServices/areasFisicas/inspeccion.service';
import { ReporteMantenimientoService } from '../../../../Services/appServices/areasFisicas/reporte-mantenimiento.service';
import { ObservacionesService } from '../../../../Services/appServices/areasFisicas/observaciones.service';

@Component({
  selector: 'app-indicadores-areas-fisicas',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule, ChartModule, MantenimientoadminnavbarComponent],
  templateUrl: './indicadores-areas-fisicas.component.html',
  styleUrl: './indicadores-areas-fisicas.component.css'
})
export class IndicadoresAreasFisicasComponent implements OnInit {
  private router = inject(Router);
  private inspeccionService = inject(InspeccionService);
  private reporteService = inject(ReporteMantenimientoService);
  private observacionesService = inject(ObservacionesService);

  totalInspeccionesMes: number = 0;
  mantenimientosPreventivos: number = 0;
  mantenimientosCorrectivos: number = 0;
  tareasPendientes: number = 0;

  estadoData: any;
  estadoOptions: any;

  topAreasData: any;
  topElementosData: any;
  tendenciaMensualData: any;
  barOptions: any;
  lineOptions: any;

  async ngOnInit() {
    await this.cargarDatos();
  }

  async cargarDatos() {
    try {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      // 1. Cargar Inspecciones del Mes
      const inspecciones = await this.inspeccionService.getAllInspecciones();
      const inspeccionesMes = inspecciones.filter(i => {
        const d = new Date(i.fecha || i.createdAt);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });
      // Para evitar duplicación por cada elemento, contamos IDs únicos si vienen agrupados o simplemente el total de elementos chequeados.
      this.totalInspeccionesMes = inspeccionesMes.length;

      // 2. Cargar Mantenimientos
      const reportes = await this.reporteService.getAllReportes();
      
      this.mantenimientosPreventivos = reportes.filter((r: any) => 
        r.tipoMantenimiento === 'Preventivo' || r.tipoMantenimiento === 'preventivo' || r.planMantenimientoId != null
      ).length;

      this.mantenimientosCorrectivos = reportes.filter((r: any) => 
        r.tipoMantenimiento === 'Correctivo' || r.tipoMantenimiento === 'correctivo'
      ).length;

      // 3. Tareas Pendientes Operativas
      const resObs: any = await this.observacionesService.getAllObservaciones();
      const todasObs = Array.isArray(resObs) ? resObs : (resObs?.data || []);
      
      const legitimas = todasObs.filter((o: any) => {
        const desc = (o.descripcion || '').toLowerCase();
        return !desc.includes('elemento reportado en estado') && !desc.includes('sin observación técnica detallada');
      });

      this.tareasPendientes = legitimas.filter((o: any) => o.estado === 'Pendiente').length;

      // Preparar Gráfica Estado Infraestructura
      this.prepararGraficaEstado(inspeccionesMes);

      // Preparar Top 5 Áreas y Top 5 Elementos
      this.prepararTops(todasObs);

      // Preparar Tendencia Mensual
      this.prepararTendenciaMensual(reportes, currentYear);

    } catch (e) {
      console.error('Error cargando indicadores:', e);
    }
  }

  prepararGraficaEstado(inspeccionesDelMes: any[]) {
      let buenos = 0;
      let regulares = 0;
      let malos = 0;

      inspeccionesDelMes.forEach(i => {
          if (i.estado === 1) buenos++;
          else if (i.estado === 2) regulares++;
          else if (i.estado === 3) malos++;
      });

      this.estadoData = {
          labels: ['Bueno', 'Regular', 'Malo'],
          datasets: [
              {
                  data: [buenos, regulares, malos],
                  backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
                  hoverBackgroundColor: ['#16a34a', '#d97706', '#dc2626']
              }
          ]
      };

      this.estadoOptions = {
          plugins: {
              legend: {
                  labels: { color: '#495057' }
              }
          }
      };
      
      this.barOptions = {
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { precision: 0 } },
          x: { ticks: { maxRotation: 45, minRotation: 0 } }
        }
      };

      this.lineOptions = {
        plugins: { legend: { display: true, position: 'bottom' } },
        scales: {
          y: { beginAtZero: true, ticks: { precision: 0 } }
        }
      };
  }

  prepararTops(observaciones: any[]) {
      let areasCount: { [key: string]: number } = {};
      let elementosCount: { [key: string]: number } = {};

      observaciones.forEach((o: any) => {
          const areaName = o.areaElemento?.areas?.nombre || 'Desconocida';
          const elemName = o.areaElemento?.elemento?.nombre || 'General';

          areasCount[areaName] = (areasCount[areaName] || 0) + 1;
          elementosCount[elemName] = (elementosCount[elemName] || 0) + 1;
      });

      // Top 5 Áreas
      const sortedAreas = Object.keys(areasCount)
          .map(k => ({ name: k, count: areasCount[k] }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

      this.topAreasData = {
          labels: sortedAreas.map(a => a.name.length > 20 ? a.name.substring(0, 20) + '...' : a.name),
          datasets: [{
              label: 'Total Fallas/Reportes',
              backgroundColor: '#3B82F6',
              data: sortedAreas.map(a => a.count)
          }]
      };

      // Top 5 Elementos
      const sortedElems = Object.keys(elementosCount)
          .map(k => ({ name: k, count: elementosCount[k] }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

      this.topElementosData = {
          labels: sortedElems.map(a => a.name.length > 20 ? a.name.substring(0, 20) + '...' : a.name),
          datasets: [{
              label: 'Cantidad de Reportes',
              backgroundColor: '#F59E0B',
              data: sortedElems.map(a => a.count)
          }]
      };
  }

  prepararTendenciaMensual(reportes: any[], anioActual: number) {
      let prevMensual = new Array(12).fill(0);
      let corrMensual = new Array(12).fill(0);

      reportes.forEach((r: any) => {
          const d = new Date(r.fechaMantenimiento || r.createdAt);
          if (d.getFullYear() === anioActual) {
              const m = d.getMonth();
              if (r.tipoMantenimiento === 'Preventivo' || r.tipoMantenimiento === 'preventivo' || r.planMantenimientoId != null) {
                  prevMensual[m]++;
              } else {
                  corrMensual[m]++;
              }
          }
      });

      this.tendenciaMensualData = {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
          datasets: [
              {
                  label: 'Preventivos',
                  data: prevMensual,
                  borderColor: '#10B981',
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  fill: true,
                  tension: 0.4
              },
              {
                  label: 'Correctivos',
                  data: corrMensual,
                  borderColor: '#EF4444',
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  fill: true,
                  tension: 0.4
              }
          ]
      };
  }

  goBack() {
    this.router.navigate(['/adminmantenimiento/gestion-operativa']);
  }
}
