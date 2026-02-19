import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { MantenimientoadminnavbarComponent } from '../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, ButtonModule, DropdownModule, FormsModule, MantenimientoadminnavbarComponent],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent {
  private router = inject(Router);

  // Inventario Data
  equipos: any[] = [];
  selectedEquipo: any;
  showCreateEquipmentButton: boolean = false;

  backToDashboard() {
    this.router.navigate(['/adminmantenimiento/gestion-operativa']);
  }

  showViewServicios() { // Mapped to Areas
    this.router.navigate(['/adminmantenimiento/servicios']);
  }

  showViewTiposEquipoBio() {
    this.router.navigate(['/elementos/listado']);
  }
  showViewEmpComodatos() {
    this.router.navigate(['/areas/asignar-elementos']);
  }
  showViewRiesgos() { }

  buscarEquipo() { }
  goToCreateEquipment() { }
}
