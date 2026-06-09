import { Component, inject, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DividerModule } from 'primeng/divider';
import { SelectModule } from 'primeng/select';
import { MantenimientoadminnavbarComponent } from '../../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import { ReporteMantenimientoService } from '../../../../Services/appServices/areasFisicas/reporte-mantenimiento.service';
import { AreaElementoService } from '../../../../Services/appServices/areasFisicas/area-elemento.service';
import { UserService } from '../../../../Services/appServices/userServices/user.service';
import { MesaService } from '../../../../Services/mesa-servicios/mesa.service';
import { PdfGeneratorService } from '../../../../Services/appServices/biomedicaServices/pdf-generator/pdf-generator.service';
import { getDecodedAccessToken } from '../../../../utilidades';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-reporte-mantenimiento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, InputTextModule, ButtonModule, TextareaModule, CalendarModule, CheckboxModule, RadioButtonModule, DividerModule, SelectModule, MantenimientoadminnavbarComponent],
  templateUrl: './manage-reporte-mantenimiento.component.html',
  styleUrls: ['./manage-reporte-mantenimiento.component.css']
})
export class ManageReporteMantenimientoComponent implements OnInit {

  @Input() inputAreaElementoId: number | null = null;
  @Input() inputInspeccionId: number | null = null;
  @Input() isDialog: boolean = false;
  @Input() isReadonlyReport: boolean = false;
  @Input() inputFallasText: string = '';
  @Input() inputNombresElementos: string = '';
  @Output() onClose = new EventEmitter<boolean>();

  fb = inject(FormBuilder);
  reporteService = inject(ReporteMantenimientoService);
  areaElementoService = inject(AreaElementoService);
  userService = inject(UserService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  mesaService = inject(MesaService);
  pdfGeneratorService = inject(PdfGeneratorService);

  form: FormGroup;
  isEditMode: boolean = false;
  idToEdit: number | null = null;
  loading: boolean = false;
  location = inject(Location);

  tipoReporteOptions = [
    { label: 'Equipo Industrial', value: 'Equipo Industrial' },
    { label: 'Infraestructura', value: 'Infraestructura' },
    { label: 'Mobiliario', value: 'Mobiliario' }
  ];

  tipoMantenimientoOptions = [
    { label: 'Preventivo', value: 'Preventivo' },
    { label: 'Correctivo', value: 'Correctivo' }
  ];

  areaNombre: string = '';
  elementoNombre: string = '';
  usuariosList: any[] = [];
  filteredUsuarios: any[] = [];
  selectedRecibidorId: number | null = null;

  constructor() {
    this.form = this.fb.group({
      fecha: [new Date(), Validators.required],
      tipoReporte: ['Mobiliario', Validators.required],
      tipoMantenimiento: ['Preventivo', Validators.required],
      fallasEncontradas: ['', Validators.required],
      reporte: [''],
      observaciones: [''],
      realizadoPor: [{ value: '', disabled: true }, Validators.required],
      recibidoPor: [''],
      cargo: [ { value: '', disabled: true } ],
      recibidoPorId: [null, Validators.required],
      areaElementoId: [null, Validators.required],
      inspeccionId: [null],
      usuarioId: [null]
    });
  }

  async ngOnInit() {
    // 1. Manejar modo edición por parámetros de ruta
    this.route.params.subscribe(async params => {
      if (params['id']) {
        this.isEditMode = true;
        this.idToEdit = +params['id'];
        await this.loadReporte(this.idToEdit);
        this.form.disable();
      }
    });

    // 2. Manejar parámetros de inicialización (Input o QueryParams)
    this.route.queryParams.subscribe(async queryParams => {
      this.resolveInitialData(queryParams);
    });

    // 3. Si se usa como diálogo, invocar resolución manualmente por si los queryParams no cambian
    if (this.isDialog) {
      this.resolveInitialData(this.route.snapshot.queryParams);
    }
    
    // Cargar la lista de usuarios para "Recibido Por"
    try {
        const allUsers = await this.userService.getAllUsers();
        this.usuariosList = allUsers.map((u: any) => ({
            id: u.id,
            nombreCompleto: `${u.nombres} ${u.apellidos}`,
            servicioId: u.servicioId || u.servicio?.id,
            cargoNombre: u.cargo?.nombre || 'Usuario'
        }));
        this.filteredUsuarios = [...this.usuariosList]; 
    } catch (e) {
        console.error('Error fetching users for recibidor dropdown:', e);
    }
  }

  async resolveInitialData(queryParams: any) {
    // Riverside: Improved initialization logic for Inputs and QueryParams.
    const tm = sessionStorage.getItem('TipoMantenimiento');
    if (tm === 'C') {
        this.tipoMantenimientoOptions = [{ label: 'Correctivo', value: 'Correctivo' }];
        this.form.patchValue({ tipoMantenimiento: 'Correctivo' });
    }

    if (queryParams['nombreArea']) {
        this.areaNombre = queryParams['nombreArea'];
    }
    if (queryParams['nombreElemento']) {
        this.elementoNombre = queryParams['nombreElemento'];
    }

    // Detectar si venimos de Mesa de Servicios (Áreas o Mobiliario)
    const reqAreaId = queryParams['areaId'];
    const reqElementoIdFromParams = queryParams['elementoId'];
    const explicitTipoReporte = queryParams['tipoReporte'];
    let hasExplicitTipoReporte = false;

    if (explicitTipoReporte) {
       this.form.patchValue({ tipoReporte: explicitTipoReporte });
       hasExplicitTipoReporte = true;
    } else if (reqAreaId) {
       this.form.patchValue({ tipoReporte: reqElementoIdFromParams ? 'Mobiliario' : 'Infraestructura' });
       hasExplicitTipoReporte = true;
    }

    let aeId = this.inputAreaElementoId || (queryParams['areaElementoId'] ? +queryParams['areaElementoId'] : null);
    const reqAreaIdParam = queryParams['areaId'] ? +queryParams['areaId'] : null;
    const reqElementoId = queryParams['elementoId'] ? +queryParams['elementoId'] : null;

    if (!aeId && (reqAreaIdParam || reqElementoId)) {
        try {
            const data: any = await this.areaElementoService.getAllAsignaciones();
            const found = data.find((x: any) => {
                const aId = x.areasId || x.areaId || x.areas?.id || x.area?.id;
                const eId = x.elementoId || x.elementosId || x.elemento?.id;
                return (reqAreaIdParam ? aId == reqAreaIdParam : true) && (reqElementoId ? eId == reqElementoId : true);
            });
            if (found) {
                aeId = found.id;
            } else if (reqAreaIdParam && !reqElementoId) {
                const fallback = data.find((x: any) => (x.areasId || x.areaId || x.areas?.id || x.area?.id) == reqAreaIdParam);
                if (fallback) aeId = fallback.id;
            }
        } catch (e) {
            console.error("Error auto-resolving areaElementoId", e);
        }
    }

    if (aeId && !this.form.get('areaElementoId')?.value) {
      this.form.patchValue({ areaElementoId: aeId });
      await this.loadElementoData(aeId, hasExplicitTipoReporte);
    } else if (reqAreaId || reqElementoId) {
       // If no exact match but we got context, make form valid allowing manual backend handling
       this.form.get('areaElementoId')?.clearValidators();
       this.form.get('areaElementoId')?.updateValueAndValidity();
    }

    const insId = this.inputInspeccionId || (queryParams['inspeccionId'] ? +queryParams['inspeccionId'] : null);
    if (insId && !this.form.get('inspeccionId')?.value) {
      this.form.patchValue({ inspeccionId: insId });
    }

    if (this.inputFallasText) {
      this.form.get('fallasEncontradas')?.setValue(this.inputFallasText);
    }

    if (this.inputNombresElementos) {
      this.elementoNombre = this.inputNombresElementos;
    }

    // Pre-fill user data from token if empty
    if (!this.form.get('realizadoPor')?.value) {
      const tokenData = getDecodedAccessToken();
      if (tokenData && tokenData.id) {
        try {
          const userResponse = await this.userService.getNameUSer(tokenData.id);
          if (userResponse && userResponse.nombreCompleto) {
            this.form.patchValue({ 
              realizadoPor: userResponse.nombreCompleto,
              usuarioId: tokenData.id
            });
          }
        } catch (error) {
          console.error('Error fetching user name', error);
          this.form.patchValue({ 
            realizadoPor: tokenData.nombres || tokenData.name || tokenData.username || 'Usuario Actual',
            usuarioId: tokenData.id
          });
        }
      }
    }

    if (this.isReadonlyReport) {
      this.isEditMode = true;
      this.form.disable();
      if (insId) {
        this.loadReporteByInspeccionId(insId);
      }
    }
  }

  async loadReporteByInspeccionId(insId: number) {
    try {
      const allReportes: any = await this.reporteService.getAllReportes();
      const found = allReportes.find((r: any) => r.inspeccionId === insId || r.inspeccion?.id === insId);
      if (found) {
        this.idToEdit = found.id;
        await this.loadReporte(found.id);
      }
    } catch (error) {
      console.error('Error loading historic report', error);
    }
  }

  async loadElementoData(id: number, hasExplicitTipoReporte: boolean = false) {
    if (!id) return;
    try {
      const found = await this.areaElementoService.getAsignacionById(id);
      if (found) {
        if (!this.inputNombresElementos) {
          this.elementoNombre = found.elemento?.nombre || found.elemento?.name || found.nombreElemento || '';
        }
        const areaObj = found.areas || found.area || found.areasFisica;
        this.areaNombre = areaObj?.nombre || areaObj?.name || found.nombreArea || '';
        const servId = areaObj?.servicioId || areaObj?.servicio?.id;
        if (servId && this.usuariosList.length > 0) {
            this.filteredUsuarios = this.usuariosList.filter(u => u.servicioId === servId || u.servicioId === null);
        }

        // Si no se pasó un tipoReporte explícito por queryParams, intentamos deducirlo del elemento
        if (!hasExplicitTipoReporte && found.elemento) {
          const tipoElem = (found.elemento.tipo || '').toLowerCase();
          if (tipoElem === 'infraestructura') {
            this.form.patchValue({ tipoReporte: 'Infraestructura' });
          } else if (tipoElem === 'mobiliario') {
            this.form.patchValue({ tipoReporte: 'Mobiliario' });
          }
        }
      }
    } catch (error) {
      console.error("Error loading element data", error);
      try {
        const data: any = await this.areaElementoService.getAllAsignaciones();
        const found = data.find((x: any) => x.id === id);
        if (found) {
          if (!this.inputNombresElementos) {
            this.elementoNombre = found.elemento?.nombre || found.elemento?.name || '';
          }
          const areaObj = found.areas || found.area;
          this.areaNombre = areaObj?.nombre || areaObj?.name || '';
          const servId = areaObj?.servicioId || areaObj?.servicio?.id;
          if (servId && this.usuariosList.length > 0) {
              this.filteredUsuarios = this.usuariosList.filter(u => u.servicioId === servId || u.servicioId === null);
          }

          // Si no se pasó un tipoReporte explícito por queryParams, intentamos deducirlo del elemento
          if (!hasExplicitTipoReporte && found.elemento) {
            const tipoElem = (found.elemento.tipo || '').toLowerCase();
            if (tipoElem === 'infraestructura') {
              this.form.patchValue({ tipoReporte: 'Infraestructura' });
            } else if (tipoElem === 'mobiliario') {
              this.form.patchValue({ tipoReporte: 'Mobiliario' });
            }
          }
        }
      } catch (innerError) {
        console.error("Fallback failed", innerError);
      }
    }
  }

  onRecibidorChange(event: any) {
     const val = event.value;
     if (!val) {
        this.form.patchValue({ recibidoPor: '', cargo: '' });
        return;
     }
     const user = this.usuariosList.find(u => u.id === val);
     if (user) {
         this.form.patchValue({ recibidoPor: user.nombreCompleto, cargo: user.cargoNombre });
     }
  }

  async loadReporte(id: number) {
    try {
      const data = await this.reporteService.getReporteById(id);
      data.fecha = new Date(data.fecha);
      this.form.patchValue(data);

      const ae = data.areaElemento || data;
      this.elementoNombre = ae.elemento?.nombre || ae.elementoNombre || ae.nombre || '';
      const areaObj = ae.areas || ae.area || (ae.areaElemento?.areas) || (ae.areaElemento?.area);
      this.areaNombre = areaObj?.nombre || ae.areaNombre || ae.ubicacion || '';

      if (!this.elementoNombre || !this.areaNombre) {
        const aeId = data.areaElementoId || data.areaElementoIdFk;
        if (aeId) await this.loadElementoData(aeId, true);
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo cargar el reporte', 'error');
    }
  }
  async guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Swal.fire('Error', 'Complete los campos obligatorios', 'warning');
      return;
    }

    if (this.loading) return;
    this.loading = true;

    try {
      // Usar getRawValue para incluir campos disabled como realizadoPor
      const value = this.form.getRawValue();

      // Formatear fecha para el backend (DATEONLY)
      if (value.fecha) {
        const d = new Date(value.fecha);
        value.fecha = d.toISOString().split('T')[0];
      }

      if (this.isEditMode && this.idToEdit) {
        // En modo vista ya no se guarda nada, pero se deja por si acaso
        await this.reporteService.updateReporte(this.idToEdit, value);
        Swal.fire('Éxito', 'Reporte actualizado', 'success');
      } else {
        const response = await this.reporteService.createReporte(value);
        
        // --- VINCULACIÓN Y CIERRE CON MESA DE SERVICIOS ---
        const casoIdPendiente = sessionStorage.getItem('casoIdPendiente');
        if (casoIdPendiente) {
          try {
            const userId = getDecodedAccessToken().id;
            const mensajeCierre = sessionStorage.getItem('MotivoFalloIndustrial') || 'Reporte de mantenimiento finalizado';
            
            // 1. Vincular el reporte al caso
            await this.mesaService.updateEquipoCaso(Number(casoIdPendiente), {
              reporteId: response.id,
              usuarioId: userId
            }).toPromise();

            // 2. Cerrar el caso definitivamente
            const formData = new FormData();
            formData.append('usuarioId', userId.toString());
            formData.append('mensajeFinal', mensajeCierre);
            
            await this.mesaService.closeCaso(Number(casoIdPendiente), formData).toPromise();

            sessionStorage.removeItem('casoIdPendiente');
            sessionStorage.removeItem('MotivoFalloIndustrial');
          } catch (err) {
            console.error('Error vinculando o cerrando caso en Mesa de Servicios', err);
          }
        }

        // --- GENERACIÓN DE PDF ---
        try {
          // Cargamos el reporte completo con relaciones para el PDF
          const reporteCompleto = await this.reporteService.getReporteById(response.id);
          this.pdfGeneratorService.generateReporteIndustrialCorrectivo(reporteCompleto, true);
        } catch (pdfErr) {
          console.error('Error generando PDF', pdfErr);
        }

        Swal.fire('Éxito', 'Reporte creado y certificado correctamente', 'success');
      }
      this.back(true);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo guardar el reporte', 'error');
    } finally {
      this.loading = false;
    }
  }

  back(success: boolean = false) {
    if (this.isDialog) {
      this.onClose.emit(success);
      return;
    }

    // --- REVERTIR ESTADO DEL CASO SI SE CANCELA ---
    if (!success) {
      const casoIdPendiente = sessionStorage.getItem('casoIdPendiente');
      if (casoIdPendiente) {
        try {
          const userId = getDecodedAccessToken().id;
          this.mesaService.changeState(Number(casoIdPendiente), { nuevoEstado: 'EN_CURSO', usuarioId: userId }).subscribe();
        } catch (e) {
          console.error('Error revirtiendo el estado del caso:', e);
        }
        sessionStorage.removeItem('casoIdPendiente');
      }
    }

    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
    } else {
      this.router.navigate(['/adminmantenimiento/reportes-general']);
    }
  }

  cancelar() {
    this.back(false);
  }
}
