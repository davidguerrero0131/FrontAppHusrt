import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CasosService } from '../../../Services/mesaServicios/casos.service';
import { UsuariosService } from '../../../Services/mesaServicios/usuarios.service';
import { Caso } from '../../../models/mesaServicios/caso.model';
import { Usuario } from '../../../models/mesaServicios/usuario.model';

@Component({
  selector: 'app-asignar-caso-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="cerrarModal()">
      <div class="modal-contenido" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Asignar Caso: {{ caso?.numero_caso }}</h2>
          <button class="btn-cerrar" (click)="cerrarModal()">&times;</button>
        </div>

        <div class="modal-body">
          <div *ngIf="cargando" class="text-center py-4">
            <p>Cargando usuarios...</p>
          </div>

          <div *ngIf="error" class="alert alert-error mb-4">
            {{ error }}
          </div>

          <div *ngIf="!cargando && !error">
            <div class="info-caso mb-4">
              <p><strong>Título:</strong> {{ caso?.titulo || 'Sin título' }}</p>
              <p><strong>Estado actual:</strong>
                <span class="badge" [ngClass]="getEstadoColor(caso?.estado || '')">
                  {{ formatearEstado(caso?.estado || '') }}
                </span>
              </p>
              <p *ngIf="caso?.asignadoA">
                <strong>Actualmente asignado a:</strong> {{ getNombreCompleto(caso?.asignadoA) }}
              </p>
            </div>

            <div class="form-group">
              <label for="usuario-select">Asignar a:</label>
              <select
                id="usuario-select"
                [(ngModel)]="usuarioSeleccionadoId"
                class="form-control"
                [disabled]="procesando">
                <option [value]="null">-- Sin asignar --</option>
                <optgroup *ngFor="let grupo of usuariosAgrupados" [label]="grupo.label">
                  <option *ngFor="let usuario of grupo.usuarios" [value]="usuario.id">
                    {{ usuario.nombre_completo }} ({{ usuario.codigo }})
                  </option>
                </optgroup>
              </select>
            </div>

            <div *ngIf="usuarioSeleccionadoId" class="info-usuario mt-3">
              <div class="bg-blue-50 border border-blue-200 rounded p-3">
                <p class="text-sm">
                  <strong>Usuario seleccionado:</strong>
                  {{ getNombreCompleto(getUsuarioSeleccionado()) }}
                </p>
                <p class="text-sm">
                  <strong>Área:</strong>
                  {{ getUsuarioSeleccionado()?.area?.nombre || 'Sin área' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button
            class="btn btn-secondary"
            (click)="cerrarModal()"
            [disabled]="procesando">
            Cancelar
          </button>
          <button
            class="btn btn-primary"
            (click)="asignarCaso()"
            [disabled]="procesando || cargando">
            {{ procesando ? 'Asignando...' : 'Asignar' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-contenido {
      background: white;
      border-radius: 8px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
    }

    .btn-cerrar {
      background: none;
      border: none;
      font-size: 2rem;
      line-height: 1;
      color: #6b7280;
      cursor: pointer;
      padding: 0;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-cerrar:hover {
      color: #111827;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    .info-caso {
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 1rem;
    }

    .info-caso p {
      margin: 0.5rem 0;
      color: #374151;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
    }

    .form-control {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 1rem;
    }

    .form-control:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-control:disabled {
      background-color: #f3f4f6;
      cursor: not-allowed;
    }

    .btn {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background-color: #3b82f6;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #2563eb;
    }

    .btn-secondary {
      background-color: #6b7280;
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: #4b5563;
    }

    .alert {
      padding: 0.75rem 1rem;
      border-radius: 6px;
      margin-bottom: 1rem;
    }

    .alert-error {
      background-color: #fef2f2;
      border: 1px solid #fecaca;
      color: #991b1b;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .badge-nuevo {
      background-color: #dbeafe;
      color: #1e40af;
    }

    .badge-asignado {
      background-color: #fef3c7;
      color: #92400e;
    }

    .badge-en-curso {
      background-color: #fed7aa;
      color: #9a3412;
    }

    .badge-en-seguimiento {
      background-color: #e0e7ff;
      color: #3730a3;
    }

    .badge-cerrado {
      background-color: #f3f4f6;
      color: #1f2937;
    }

    .info-usuario {
      margin-top: 1rem;
    }

    .bg-blue-50 {
      background-color: #eff6ff;
    }

    .border {
      border-width: 1px;
    }

    .border-blue-200 {
      border-color: #bfdbfe;
    }

    .rounded {
      border-radius: 6px;
    }

    .p-3 {
      padding: 0.75rem;
    }

    .text-sm {
      font-size: 0.875rem;
    }

    .mt-3 {
      margin-top: 0.75rem;
    }
  `]
})
export class AsignarCasoModalComponent implements OnInit {
  @Input() caso: Caso | null = null;
  @Output() cerrar = new EventEmitter<void>();
  @Output() asignado = new EventEmitter<Caso>();

  usuariosTecnicos: Usuario[] = [];
  usuarioSeleccionadoId: number | null = null;
  cargando = false;
  procesando = false;
  error = '';

  constructor(
    private casosService: CasosService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    this.usuarioSeleccionadoId = this.caso?.asignado_a_id || null;
    this.cargarUsuariosTecnicos();
  }

  cargarUsuariosTecnicos(): void {
    this.cargando = true;
    this.error = '';

    this.usuariosService.obtenerTecnicos().subscribe({
      next: (response) => {
        if (response.exito && response.datos) {
          this.usuariosTecnicos = response.datos;
        }
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar usuarios técnicos';
        this.cargando = false;
        console.error('Error al cargar técnicos:', err);
      }
    });
  }

  get usuariosAgrupados() {
    const grupos: { [key: string]: Usuario[] } = {};

    this.usuariosTecnicos.forEach(usuario => {
      const areaNombre = usuario.area?.nombre || 'Sin área';
      if (!grupos[areaNombre]) {
        grupos[areaNombre] = [];
      }
      grupos[areaNombre].push(usuario);
    });

    return Object.keys(grupos).map(nombre => ({
      label: nombre,
      usuarios: grupos[nombre]
    }));
  }

  getUsuarioSeleccionado(): Usuario | undefined {
    return this.usuariosTecnicos.find(u => u.id === this.usuarioSeleccionadoId);
  }

  getNombreCompleto(usuario: any): string {
    if (!usuario) return '';
    if (usuario.nombre_completo) return usuario.nombre_completo;
    if (usuario.nombres && usuario.apellidos) return `${usuario.nombres} ${usuario.apellidos}`;
    return usuario.nombreUsuario || usuario.codigo || 'Usuario';
  }

  asignarCaso(): void {
    if (!this.caso) return;

    this.procesando = true;
    this.error = '';

    this.casosService.asignar(this.caso.id, {
      asignado_a_id: this.usuarioSeleccionadoId
    }).subscribe({
      next: (response) => {
        if (response.exito && response.datos) {
          this.asignado.emit(response.datos);
          this.cerrarModal();
        }
        this.procesando = false;
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al asignar caso';
        this.procesando = false;
        console.error('Error al asignar caso:', err);
      }
    });
  }

  cerrarModal(): void {
    this.cerrar.emit();
  }

  getEstadoColor(estado: string): string {
    const colores: { [key: string]: string } = {
      'nuevo': 'badge-nuevo',
      'asignado': 'badge-asignado',
      'en_curso': 'badge-en-curso',
      'en_seguimiento': 'badge-en-seguimiento',
      'cerrado': 'badge-cerrado'
    };
    return colores[estado] || 'badge-nuevo';
  }

  formatearEstado(estado: string): string {
    const estados: { [key: string]: string } = {
      'nuevo': 'Nuevo',
      'asignado': 'Asignado',
      'en_curso': 'En Curso',
      'en_seguimiento': 'En Seguimiento',
      'cerrado': 'Cerrado'
    };
    return estados[estado] || estado;
  }
}
