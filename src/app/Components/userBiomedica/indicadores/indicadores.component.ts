
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ReportesService } from '../../../Services/appServices/biomedicaServices/reportes/reportes.service';
import { IndicadoresService } from '../../../Services/appServices/biomedicaServices/indicadores/indicadores.service';
import { MeterGroupModule } from 'primeng/metergroup';
import { BiomedicausernavbarComponent } from '../../navbars/biomedicausernavbar/biomedicausernavbar.component';

type TipoMantenimiento = 'Correctivo' | 'Preventivo' | 'Predictivo' | 'Otro';
type TipoFalla =
  | 'Desgaste'
  | 'Operación Indebida'
  | 'Causa Externa'
  | 'Accesorios'
  | 'Desconocido'
  | 'Sin Falla'
  | 'Otros'
  | 'No Registra';

interface IEquipo { id: number; nombres?: string; nombre?: string; codigo?: string; tipoEquipos?: { nombres: string }; }
interface IServicio { id: number; nombre: string; }
interface IUsuario { id: number; nombres?: string; apellidos?: string; nombre?: string; email?: string; }
interface Reporte {
  id: number;
  fechaRealizado: string | null;
  horaTotal?: string | null;
  tipoMantenimiento?: TipoMantenimiento | null;
  tipoFalla?: TipoFalla | null;
  realizado?: boolean | null;
  servicioIdFk: number;
  equipoIdFk: number;
  usuarioIdFk: number | null;
  equipo?: IEquipo | null;
  servicio?: IServicio | null;
  usuario?: IUsuario | null;
}

@Component({
  selector: 'app-indicadores',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ChartModule,
    CardModule,
    ButtonModule,
    CalendarModule,
    ProgressSpinnerModule,
    TagModule,
    MeterGroupModule,
    DropdownModule,
    InputTextModule
  ],
  templateUrl: `./indicadores.component.html`,
})
export class IndicadoresComponent {

  // Paleta de colores vibrantes y modernos
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


  private srv = inject(ReportesService);
  private indicadoresSrv = inject(IndicadoresService);

  loading = signal(false);
  reportes = signal<Reporte[]>([]);
  indicadoresData = signal<any>(null);

  // Fechas (Rango)
  fechaActual = new Date();
  anio: number = this.fechaActual.getFullYear();
  mesInicio: number = this.fechaActual.getMonth() + 1;
  mesFin: number = this.fechaActual.getMonth() + 1;

  meses = [
    { label: 'Enero', value: 1 }, { label: 'Febrero', value: 2 }, { label: 'Marzo', value: 3 },
    { label: 'Abril', value: 4 }, { label: 'Mayo', value: 5 }, { label: 'Junio', value: 6 },
    { label: 'Julio', value: 7 }, { label: 'Agosto', value: 8 }, { label: 'Septiembre', value: 9 },
    { label: 'Octubre', value: 10 }, { label: 'Noviembre', value: 11 }, { label: 'Diciembre', value: 12 }
  ];

  totalReportesLabel = computed(() => `Total: ${this.reportes().length}`);

  constructor() { this.refrescar(); }

  async refrescar() {
    if (!this.anio || !this.mesInicio || !this.mesFin) return;

    // Calcular fechas inicio y fin
    // Inicio: Día 1 del mesInicio
    // Fin: Último día del mesFin

    // Mes en Date es 0-indexed (mesInicio - 1)
    const firstDay = new Date(this.anio, this.mesInicio - 1, 1);

    // Para último día de mesFin: Usar mesFin (sin restar 1), día 0. 
    // Ejemplo: Si mesFin es 1 (Enero), new Date(2023, 1, 0) da 31 Enero.
    const lastDay = new Date(this.anio, this.mesFin, 0);

    const inicioStr = this.yyyyMMdd(firstDay);
    const finStr = this.yyyyMMdd(lastDay);

    this.loading.set(true);
    try {
      const data = await this.srv.getReportesPorRango(inicioStr, finStr, 10000, 0);
      this.reportes.set(Array.isArray(data) ? data : []);

      const ind = await this.indicadoresSrv.getIndicadoresCumplimiento(inicioStr, finStr);
      this.indicadoresData.set(ind);
    } catch (e) {
      console.error(e);
      this.reportes.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  private groupCount<K extends string | number>(arr: Reporte[], key: (r: Reporte) => K | null | undefined) {
    const m = new Map<K, number>();
    for (const r of arr) {
      const k = key(r);
      if (k == null) continue;
      m.set(k, (m.get(k) ?? 0) + 1);
    }
    return m;
  }
  private groupAvg<K extends string | number>(arr: Reporte[], key: (r: Reporte) => K | null | undefined, val: (r: Reporte) => number | null) {
    const sum = new Map<K, number>(), cnt = new Map<K, number>(), avg = new Map<K, number>();
    for (const r of arr) {
      const k = key(r); const v = val(r);
      if (k == null || v == null) continue;
      sum.set(k, (sum.get(k) ?? 0) + v);
      cnt.set(k, (cnt.get(k) ?? 0) + 1);
    }
    for (const [k, s] of sum.entries()) avg.set(k, s / (cnt.get(k) ?? 1));
    return avg;
  }

  chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { font: { size: 14 } } },
      tooltip: { mode: 'index', intersect: false }
    }
  }) as any);

  barOptions(title?: string) {
    return {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { font: { size: 14, family: "'Inter', sans-serif" }, usePointStyle: true, pointStyle: 'circle' } },
        title: title ? { display: true, text: title, font: { size: 18, weight: 'bold', family: "'Inter', sans-serif" }, padding: { bottom: 20 } } : undefined,
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#1f2937',
          bodyColor: '#4b5563',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          padding: 10,
          boxPadding: 4
        }
      },
      scales: {
        x: {
          ticks: { autoSkip: true, font: { size: 12, family: "'Inter', sans-serif" }, color: '#6b7280' },
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          ticks: { precision: 0, font: { size: 12, family: "'Inter', sans-serif" }, color: '#6b7280' },
          grid: { color: '#f3f4f6', borderDash: [5, 5] }
        }
      },
      layout: { padding: { top: 10, bottom: 10 } }
    } as any;
  }

  getResponsableOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { font: { size: 14, family: "'Inter', sans-serif" }, usePointStyle: true } },
        tooltip: {
          mode: 'index', intersect: false,
          backgroundColor: 'rgba(255, 255, 255, 0.9)', titleColor: '#1f2937', bodyColor: '#4b5563', borderColor: '#e5e7eb', borderWidth: 1
        }
      },
      scales: {
        x: { ticks: { autoSkip: true, font: { size: 12 } }, grid: { display: false } },
        y: {
          beginAtZero: true,
          suggestedMax: 120,
          ticks: { stepSize: 30, precision: 0, font: { size: 12 }, color: '#6b7280' },
          grid: { color: '#f3f4f6' }
        }
      }
    } as any;
  }
  lineOptions(title?: string) {
    return {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { font: { size: 14, family: "'Inter', sans-serif" }, usePointStyle: true } },
        title: title ? { display: true, text: title, font: { size: 18, weight: 'bold' }, padding: { bottom: 20 } } : undefined,
        tooltip: { mode: 'index', intersect: false, backgroundColor: 'rgba(255, 255, 255, 0.9)', titleColor: '#1f2937', bodyColor: '#4b5563', borderColor: '#e5e7eb', borderWidth: 1 }
      },
      scales: {
        x: { ticks: { autoSkip: true, font: { size: 12 } }, grid: { display: false } },
        y: { beginAtZero: true, ticks: { precision: 0, font: { size: 12 } }, grid: { color: '#f3f4f6', borderDash: [5, 5] } }
      },
      elements: {
        line: { tension: 0.4, borderWidth: 3 },
        point: { radius: 4, hoverRadius: 6, backgroundColor: '#ffffff', borderWidth: 2 }
      }
    } as any;
  }

  // --- Nuevos Computed para Indicadores Backend ---

  preventivoMeterData = computed(() => {
    const d = this.indicadoresData();
    if (!d || !d.preventivo) return [];
    const c = d.preventivo.cumplimiento || 0;
    return [
      { label: 'Realizados', value: c, color: '#34d399', icon: 'pi pi-check-circle' },
      { label: 'Pendientes', value: 100 - c, color: '#fbbf24', icon: 'pi pi-exclamation-circle' }
    ];
  });

  correctivoMeterData = computed(() => {
    const d = this.indicadoresData();
    if (!d || !d.correctivo) return [];
    const c = d.correctivo.cumplimiento || 0;
    return [
      { label: 'Atendidos', value: c, color: '#60a5fa', icon: 'pi pi-check-circle' },
      { label: 'Pendientes', value: 100 - c, color: '#f87171', icon: 'pi pi-exclamation-circle' }
    ];
  });

  duracionStats = computed(() => {
    const d = this.indicadoresData();
    if (!d) return { preventivo: '00:00:00', correctivo: '00:00:00' };
    return {
      preventivo: d.preventivo?.promedioDuracion || '00:00:00',
      correctivo: d.correctivo?.promedioDuracion || '00:00:00'
    };
  });

  preventivoInfo = computed(() => {
    const d = this.indicadoresData();
    return d?.preventivo || { programados: 0, realizados: 0, cumplimiento: 0 };
  });

  correctivoInfo = computed(() => {
    const d = this.indicadoresData();
    return d?.correctivo || { reportados: 0, realizados: 0, cumplimiento: 0 };
  });

  realizadosChartData = computed(() => {
    const rs = this.reportes();
    const hechos = rs.filter(r => r.realizado === true).length;
    const no = rs.length - hechos;
    return {
      labels: ['Realizados', 'No realizados'],
      datasets: [{
        data: [hechos, no],
        backgroundColor: ['#10b981', '#ef4444'],
        hoverBackgroundColor: ['#059669', '#dc2626'],
        borderColor: ['#ffffff', '#ffffff'],
        borderWidth: 2
      }]
    };
  });

  porTipoChartData = computed(() => {
    const rs = this.reportes();
    const orden: TipoMantenimiento[] = ['Preventivo', 'Correctivo', 'Predictivo', 'Otro'];
    const mapa = this.groupCount(rs, r => (r.tipoMantenimiento ?? 'Otro') as TipoMantenimiento);
    return {
      labels: orden,
      datasets: [{
        label: 'Cantidad',
        data: orden.map(k => mapa.get(k) ?? 0),
        backgroundColor: this.bgColors,
        borderColor: this.borderColors,
        borderWidth: 1,
        borderRadius: 8,
        barPercentage: 0.6
      }]
    };
  });

  porUsuarioChartData = computed(() => {
    const rs = this.reportes();
    const stats = new Map<string, { preventivo: number, correctivo: number }>();

    rs.forEach(r => {
      const u = r.usuario;
      const nom = (u?.nombres || u?.nombre || '').trim();
      const ap = (u?.apellidos || '').trim();
      const email = (u?.email || '').trim();
      const name = (nom || ap) ? `${nom} ${ap}`.trim() : (email || 'Sin usuario');

      const current = stats.get(name) || { preventivo: 0, correctivo: 0 };
      if (r.tipoMantenimiento === 'Preventivo') {
        current.preventivo++;
      } else if (r.tipoMantenimiento === 'Correctivo') {
        current.correctivo++;
      }
      stats.set(name, current);
    });

    const labels = Array.from(stats.keys());
    const dataPrev = labels.map(l => stats.get(l)?.preventivo ?? 0);
    const dataCorr = labels.map(l => stats.get(l)?.correctivo ?? 0);

    return {
      labels,
      datasets: [
        {
          label: 'Preventivo',
          data: dataPrev,
          backgroundColor: '#3b82f6', // blue-500
          borderColor: '#2563eb',
          borderWidth: 1,
          borderRadius: 4,
          barPercentage: 0.7
        },
        {
          label: 'Correctivo',
          data: dataCorr,
          backgroundColor: '#f97316', // orange-500
          borderColor: '#ea580c',
          borderWidth: 1,
          borderRadius: 4,
          barPercentage: 0.7
        }
      ]
    };
  });

  porServicioChartData = computed(() => {
    const rs = this.reportes().filter(r => r.tipoMantenimiento === 'Correctivo');
    const mapa = this.groupCount(rs, r => (r.equipo as any)?.servicios?.nombre || 'Sin servicio');

    const pares = Array.from(mapa.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const labels = pares.map(p => p[0]);
    const data = pares.map(p => p[1]);

    return {
      labels,
      datasets: [{
        label: 'Top 5 Correctivos por Servicio (Equipo)',
        data,
        backgroundColor: '#f97316', // orange-500
        borderColor: '#ea580c',
        borderWidth: 1,
        borderRadius: 8,
        barPercentage: 0.6
      }]
    };
  });

  porFallaChartData = computed(() => {
    const rs = this.reportes();
    const orden: TipoFalla[] = [
      'Desgaste', 'Operación Indebida', 'Causa Externa', 'Accesorios',
      'Desconocido', 'Sin Falla', 'Otros', 'No Registra'
    ];
    const mapa = this.groupCount(rs, r => (r.tipoFalla ?? 'No Registra') as TipoFalla);
    return {
      labels: orden,
      datasets: [{
        label: 'Reportes por Falla',
        data: orden.map(k => mapa.get(k) ?? 0),
        backgroundColor: this.bgColors,
        borderColor: this.borderColors,
        borderWidth: 1,
        borderRadius: 8,
        barPercentage: 0.6
      }]
    };
  });

  porMesChartData = computed(() => {
    const rs = this.reportes();
    const m = new Map<string, number>(); // YYYY-MM
    for (const r of rs) {
      if (!r.fechaRealizado) continue;
      const ym = r.fechaRealizado.slice(0, 7);
      m.set(ym, (m.get(ym) ?? 0) + 1);
    }
    const labels = Array.from(m.keys()).sort();
    const data = labels.map(l => m.get(l) ?? 0);
    return {
      labels,
      datasets: [{
        label: 'Tendencia Mensual',
        data,
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: '#3b82f6',
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#3b82f6',
        pointBorderWidth: 2,
        tension: 0.4
      }]
    };
  });

  topEquiposChartData = computed(() => {
    const rs = this.reportes();
    const mapa = this.groupCount(rs, r => r.equipo?.nombres || r.equipo?.nombre || r.equipo?.codigo || `Equipo ${r.equipoIdFk}`);
    const pares = Array.from(mapa.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const labels = pares.map(p => p[0] as string);
    const data = pares.map(p => p[1]);
    return {
      labels,
      datasets: [{
        label: 'Reportes',
        data,
        backgroundColor: this.bgColors,
        borderColor: this.borderColors,
        borderWidth: 1,
        borderRadius: 8,
        barPercentage: 0.6
      }]
    };
  });

  duracionPromedioPorTipoChartData = computed(() => {
    const rs = this.reportes();
    const avg = this.groupAvg(
      rs,
      r => (r.tipoMantenimiento ?? 'Otro') as TipoMantenimiento,
      r => this.hhmmssToMinutes(r.horaTotal)
    );
    const orden: TipoMantenimiento[] = ['Preventivo', 'Correctivo', 'Predictivo', 'Otro'];
    const labels = orden;
    const data = orden.map(k => Math.round((avg.get(k) ?? 0) * 10) / 10);
    return {
      labels,
      datasets: [{
        label: 'Minutos (prom.)',
        data,
        backgroundColor: 'rgba(99, 102, 241, 0.7)', // purple/indigo
        borderColor: '#4f46e5',
        borderWidth: 1,
        borderRadius: 8,
        barPercentage: 0.6
      }]
    };
  });


  private mesActual(): [Date, Date] {
    const now = new Date();
    return [new Date(now.getFullYear(), now.getMonth(), 1), new Date(now.getFullYear(), now.getMonth() + 1, 0)];
    // (el día fin es el último del mes; el backend interpreta inclusivo)
  }
  private yyyyMMdd(d: Date) {
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  private hhmmssToMinutes(v?: string | null): number | null {
    if (!v) return null;
    const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(v);
    if (!m) return null;
    const h = +m[1], min = +m[2], s = +(m[3] ?? 0);
    return h * 60 + min + s / 60;
  }



  // --- NUEVAS GRÁFICAS ---

  // 1. Preventivos por Tipo de Equipo
  preventivoPorTipoEquipoChartData = computed(() => {
    const reps = this.reportes().filter(r => r.tipoMantenimiento === 'Preventivo');
    const counts: Record<string, number> = {};

    reps.forEach(r => {
      const tipoName = r.equipo?.tipoEquipos?.nombres || 'Sin Clasificar';
      counts[tipoName] = (counts[tipoName] || 0) + 1;
    });

    const labels = Object.keys(counts);
    const data = Object.values(counts);

    return {
      labels,
      datasets: [
        {
          label: 'Preventivos por Tipo',
          data,
          backgroundColor: '#3b82f6', // blue-500
          borderColor: '#2563eb', // blue-600
          borderWidth: 1,
          borderRadius: 8,
          barPercentage: 0.6
        }
      ]
    };
  });

  // 2. Correctivos por Tipo de Equipo
  correctivoPorTipoEquipoChartData = computed(() => {
    const reps = this.reportes().filter(r => r.tipoMantenimiento === 'Correctivo');
    const counts: Record<string, number> = {};

    reps.forEach(r => {
      const tipoName = r.equipo?.tipoEquipos?.nombres || 'Sin Clasificar';
      counts[tipoName] = (counts[tipoName] || 0) + 1;
    });

    const labels = Object.keys(counts);
    const data = Object.values(counts);

    return {
      labels,
      datasets: [
        {
          label: 'Correctivos por Tipo',
          data,
          backgroundColor: '#ef4444', // red-500
          borderColor: '#dc2626', // red-600
          borderWidth: 1,
          borderRadius: 8,
          barPercentage: 0.6
        }
      ]
    };
  });

  // 3. Preventivos Pendientes por Responsable
  pendientesPorResponsableChartData = computed(() => {
    // Pendientes = Preventivos NO realizados
    const reps = this.reportes().filter(r => r.tipoMantenimiento === 'Preventivo' && !r.realizado);
    const counts: Record<string, number> = {};

    reps.forEach(r => {
      const nombreUsuario = r.usuario
        ? (r.usuario.nombres || r.usuario.nombre || r.usuario.email || 'Sin Asignar')
        : 'Sin Asignar';
      counts[nombreUsuario] = (counts[nombreUsuario] || 0) + 1;
    });

    const labels = Object.keys(counts);
    const data = Object.values(counts);

    return {
      labels,
      datasets: [
        {
          label: 'Pendientes por Responsable',
          data,
          backgroundColor: '#f59e0b', // amber-500
          borderColor: '#d97706', // amber-600
          borderWidth: 1
        }
      ]
    };
  });
}
