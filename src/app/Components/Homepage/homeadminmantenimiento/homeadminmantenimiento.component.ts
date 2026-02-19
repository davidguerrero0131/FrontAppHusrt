import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MantenimientoadminnavbarComponent } from '../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import { PlanMantenimientoService } from '../../../Services/appServices/areasFisicas/plan-mantenimiento.service';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { ScrollerModule } from 'primeng/scroller';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MantenimientoadminnavbarComponent } from '../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';

@Component({
  selector: 'app-homeadminmantenimiento',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MantenimientoadminnavbarComponent,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    IconFieldModule,
    InputIconModule,
    TooltipModule,
    ScrollerModule
  ],
  imports: [MantenimientoadminnavbarComponent, CommonModule, CardModule, ButtonModule],
  templateUrl: './homeadminmantenimiento.component.html',
  styleUrl: './homeadminmantenimiento.component.css'
})
export class HomeadminmantenimientoComponent implements OnInit {
  private router = inject(Router);
  private planService = inject(PlanMantenimientoService);

  // Data
  planes: any[] = [];
  filteredPlanes: any[] = [];
  loading: boolean = true;

  // Filters
  anio: number = new Date().getFullYear();
  mesInicio: number = new Date().getMonth() + 1;
  mesFin: number = new Date().getMonth() + 1;

  meses = [
    { label: 'Enero', value: 1 }, { label: 'Febrero', value: 2 },
    { label: 'Marzo', value: 3 }, { label: 'Abril', value: 4 },
    { label: 'Mayo', value: 5 }, { label: 'Junio', value: 6 },
    { label: 'Julio', value: 7 }, { label: 'Agosto', value: 8 },
    { label: 'Septiembre', value: 9 }, { label: 'Octubre', value: 10 },
    { label: 'Noviembre', value: 11 }, { label: 'Diciembre', value: 12 }
  ];

  // UI State
  panelPreventivos: boolean = true;
  panelMetas: boolean = false;
  panelCorrectivos: boolean = false;

  // Sub-panels for Metas
  panelRealizados: boolean = false;
  panelPendientes: boolean = true; // Default to pending

  // Dashboard Toggle
  showDashboard: boolean = true;

  // Inventario Data
  equipos: any[] = [];
  selectedEquipo: any;
  showCreateEquipmentButton: boolean = false;

  // Areas Data (Mock for UI structure)
  searchText: string = '';
  servicioSeleccionado: any = null;

  // Mapping 'TiposEquipos' structure from request to 'Services/Areas' context
  servicios: any[] = [
    { id: 1, nombres: 'Urgencias', total: 15 },
    { id: 2, nombres: 'Hospitalización', total: 30 },
    { id: 3, nombres: 'Cirugía', total: 10 },
    { id: 4, nombres: 'Laboratorio', total: 5 },
    { id: 5, nombres: 'Imágenes Diagnósticas', total: 8 }
  ];
  cantidadesEquipos: { [key: number]: number } = { 1: 15, 2: 30, 3: 10, 4: 5, 5: 8 };

  // Level 4 Data (Mock Areas Fisicas per Service)
  areasFisicas: any[] = [];
  // Mock Data
  allAreasFisicas = [
    { id: 101, nombre: 'Consultorio 1', servicioId: 1, ubicacion: 'Piso 1' },
    { id: 102, nombre: 'Sala de Espera', servicioId: 1, ubicacion: 'Piso 1' },
    { id: 103, nombre: 'Triage', servicioId: 1, ubicacion: 'Piso 1' },
    { id: 201, nombre: 'Habitación 201', servicioId: 2, ubicacion: 'Piso 2' },
    { id: 202, nombre: 'Habitación 202', servicioId: 2, ubicacion: 'Piso 2' },
    { id: 301, nombre: 'Quirófano 1', servicioId: 3, ubicacion: 'sótano' },
  ];

  // Navigation is now handled by routing to specific components
  showViewGestionOperativa() {
    this.router.navigate(['/adminmantenimiento/gestion-operativa']);
  }

  showViewParametrizacion() {
    console.log("Parametrizacion clicked");
  }

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    this.loading = true;
    try {
      // Fetch all plans (or filter by year if service supports it)
      // For now, fetch all and filter client-side as per previous pattern
      const data = await this.planService.getAllPlanes();

      this.planes = data.map((p: any) => ({
        ...p,
        mesNombre: this.obtenerNombreMes(p.mes)
      }));

      this.applyFilters();

    } catch (error) {
      console.error('Error loading plans', error);
    } finally {
      this.loading = false;
    }
  }

  setDate() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredPlanes = this.planes.filter(p => {
      const yearMatch = p.anio === this.anio;
      const monthMatch = p.mes >= this.mesInicio && p.mes <= this.mesFin;
      return yearMatch && monthMatch;
    });
  }

  // View Switchers
  viewPreventivos() {
    this.panelPreventivos = true;
    this.panelMetas = false;
    this.panelCorrectivos = false;
  }

  viewMetas() {
    this.panelPreventivos = false;
    this.panelMetas = true;
    this.panelCorrectivos = false;
    // Reset sub-panels
    this.panelRealizados = false;
    this.panelPendientes = true;
  }

  viewCorrectivos() {
    this.panelPreventivos = false;
    this.panelMetas = false;
    this.panelCorrectivos = true;
  }

  panelRealizadosView() {
    this.panelRealizados = true;
    this.panelPendientes = false;
  }

  panelPendientesView() {
    this.panelRealizados = false;
    this.panelPendientes = true;
  }

  // Helpers
  obtenerNombreMes(mes: number): string {
    const found = this.meses.find(m => m.value === mes);
    return found ? found.label : mes.toString();
  }

  // Getters for filtered views
  get preventivos() {
    return this.filteredPlanes;
  }

  get realizados() {
    return this.filteredPlanes.filter(p => p.estado === 3); // 3 = Completado
  }

  get pendientes() {
    return this.filteredPlanes.filter(p => p.estado === 1 || p.estado === 2); // 1 = Pendiente, 2 = En Proceso
  }
}
