import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HojaDeVidaIndustrialService } from '../../../../../Services/appServices/industrialesServices/HojaDeVida/HojaDeVidaIndustrial.service';
import { EquiposIndustrialesService } from '../../../../../Services/appServices/industrialesServices/equipos/equiposIndustriales.service';
import Swal from 'sweetalert2';
import { UppercaseDirective } from '../../../../../Directives/uppercase.directive';


@Component({
    selector: 'app-editar-hoja-de-vida-equipo',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, UppercaseDirective],
    templateUrl: './editar-hoja-de-vida-equipo.component.html',
    styleUrls: ['./editar-hoja-de-vida-equipo.component.css']
})
export class EditarHojaDeVidaEquipoComponent implements OnInit {

    hojaVidaForm: FormGroup;
    datosTecnicosForm: FormGroup;
    proveedorForm: FormGroup;
    registroApoyoForm: FormGroup;
    fabricanteForm: FormGroup;

    idEquipo: any;
    equipoInfo: any;
    loading: boolean = false;

    // Variables para almacenar IDs si ya existen registros
    idHojaVida: number | null = null;
    idDatosTecnicos: number | null = null;
    idProveedor: number | null = null;
    idRegistroApoyo: number | null = null;

    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private hojaVidaService = inject(HojaDeVidaIndustrialService);
    private equipoService = inject(EquiposIndustrialesService);

    constructor() {
        this.hojaVidaForm = this.fb.group({
            adquisicion: ['', Validators.required],
            fechaCompra: [''],
            fechaInstalacion: [''],
            fechaInicioOperacion: [''],
            vencimientoGarantia: [''],
            referencia: [''],
            fabricacion: [''],
            activo: [true]
        });

        this.datosTecnicosForm = this.fb.group({
            volMaxOperacion: [''],
            volMinOperacion: [''],
            corrienteMaxOperacion: [''],
            corrienteMinOperacion: [''],
            potenciaConsumida: [''],
            frecuencia: [''],
            presion: [''],
            velocidad: [''],
            temperatura: [''],
            peso: [''],
            capacidad: [''],
            agua: [false],
            aire: [false],
            vapor: [false],
            derivadoPetroleo: [false],
            electricidad: [false],
            energiaSolar: [false],
            otros: [''],
            accesorios: [''],
            marcaAccesorio: [''],
            modeloSerieAccesorio: [''],
            activo: [true]
        });

        this.proveedorForm = this.fb.group({
            codigoEquipo: [''],
            codigoInternacional: [''],
            fabricante: [''],
            ciudadFabricante: [''],
            representante: [''],
            telefonoRepresentante: [''],
            distribuidor: [''],
            ciudadDistribuidor: [''],
            telefonoDistribuidor: [''],
            activo: [true]
        });

        this.registroApoyoForm = this.fb.group({
            manualUsuario: [false],
            manualTecnico: [false],
            equipoFijo: [false],
            uso: ['', Validators.required],
            riesgo: ['', Validators.required],
            tecnologiaPredominante: ['', Validators.required],
            clasificacion: ['', Validators.required],
            estado: ['bueno', Validators.required],
            mantenimiento: ['', Validators.required],
            propiedad: ['', Validators.required],
            activo: [true]
        });

        this.fabricanteForm = this.fb.group({
            nombres: ['', Validators.required],
            pais: [''],
            estado: [true]
        });
    }

    // Listas para dropdowns
    listaFabricantes: any[] = [];
    listaProveedores: any[] = [];
    fabricanteSeleccionado: any = null; // Para controlar si es uno existente o nuevo

    async ngOnInit() {
        this.idEquipo = this.route.snapshot.paramMap.get('id');
        this.cargarListas();
        if (this.idEquipo) {
            await this.cargarInfoEquipo(this.idEquipo);
            await this.cargarDatosExistentes();
        }
    }

    async cargarListas() {
        try {
            this.listaFabricantes = await this.hojaVidaService.getAllFabricantes();
            this.listaProveedores = await this.hojaVidaService.getAllProveedores();
        } catch (error) {
            console.error('Error cargando listas:', error);
        }
    }

    async cargarInfoEquipo(id: any) {
        try {
            this.equipoInfo = await this.equipoService.getEquipoById(id);
            // Auto-llenar código de equipo con la placa
            if (this.equipoInfo && this.equipoInfo.placa) {
                this.proveedorForm.patchValue({ codigoEquipo: this.equipoInfo.placa });
            }
        } catch (error) {
            console.error('Error cargando equipo:', error);
            Swal.fire('Error', 'No se pudo cargar la información del equipo', 'error');
        }
    }

    async cargarDatosExistentes() {
        try {
            // Cargar Hoja de Vida
            try {
                const hojaVida = await this.hojaVidaService.getHojaVidaByEquipo(this.idEquipo);
                if (hojaVida) {
                    this.idHojaVida = hojaVida.id;
                    this.hojaVidaForm.patchValue(hojaVida);
                }
            } catch (e) { console.log('No existe hoja de vida aun'); }

            // Cargar Datos Técnicos
            try {
                const datosTecnicos = await this.hojaVidaService.getDatosTecnicosByEquipo(this.idEquipo);
                if (datosTecnicos) {
                    this.idDatosTecnicos = datosTecnicos.id;
                    this.datosTecnicosForm.patchValue(datosTecnicos);
                }
            } catch (e) { console.log('No existen datos técnicos aun'); }

            // Cargar Proveedor
            try {
                const proveedor = await this.hojaVidaService.getProveedorByEquipo(this.idEquipo);
                if (proveedor) {
                    this.idProveedor = proveedor.id;
                    this.proveedorForm.patchValue(proveedor);
                }
            } catch (e) { console.log('No existe proveedor aun'); }

            // Cargar Registro de Apoyo
            try {
                const registroApoyo = await this.hojaVidaService.getRegistroApoyoByEquipo(this.idEquipo);
                if (registroApoyo) {
                    this.idRegistroApoyo = registroApoyo.id;
                    this.registroApoyoForm.patchValue(registroApoyo);
                }
            } catch (e) { console.log('No existe registro de apoyo aun'); }

        } catch (error) {
            console.error('Error general cargando datos existentes:', error);
        }
    }

    // Helper para limpiar strings vacíos y convertirlos a null
    cleanData(data: any): any {
        const cleaned = { ...data };
        Object.keys(cleaned).forEach(key => {
            // Si es un string vacío, convertir a null
            if (typeof cleaned[key] === 'string' && cleaned[key].trim() === '') {
                cleaned[key] = null;
            }
        });
        return cleaned;
    }

    // Método para copiar datos de un proveedor existente
    seleccionarProveedor(event: any) {
        const idProveedor = event.target.value;
        if (!idProveedor) return;

        const proveedor = this.listaProveedores.find(p => p.id == idProveedor);
        if (proveedor) {
            // Copiamos campos útiles (excepto IDs únicos del equipo anterior)
            this.proveedorForm.patchValue({
                fabricante: proveedor.fabricante,
                ciudadFabricante: proveedor.ciudadFabricante,
                representante: proveedor.representante,
                telefonoRepresentante: proveedor.telefonoRepresentante,
                distribuidor: proveedor.distribuidor,
                ciudadDistribuidor: proveedor.ciudadDistribuidor,
                telefonoDistribuidor: proveedor.telefonoDistribuidor
            });
            Swal.fire({
                icon: 'success',
                title: 'Datos copiados',
                text: 'Se han cargado los datos del proveedor seleccionado.',
                timer: 1500,
                showConfirmButton: false
            });
        }
    }

    // Método para manejar selección de fabricante
    seleccionarFabricante(event: any) {
        const idFabricante = event.target.value;
        if (idFabricante === 'nuevo') {
            this.fabricanteSeleccionado = null;
            this.fabricanteForm.reset({ estado: true });
            this.hojaVidaForm.patchValue({ fabricacion: '' });
            this.proveedorForm.patchValue({ fabricante: '' });
        } else {
            this.fabricanteSeleccionado = this.listaFabricantes.find(f => f.id == idFabricante);
            if (this.fabricanteSeleccionado) {
                // Auto-llenar nombres en otros formularios para consistencia
                this.hojaVidaForm.patchValue({ fabricacion: this.fabricanteSeleccionado.nombres });
                this.proveedorForm.patchValue({ fabricante: this.fabricanteSeleccionado.nombres });

                // Llenar el form de fabricante pero deshabilitarlo visualmente o ignorarlo al guardar
                this.fabricanteForm.patchValue(this.fabricanteSeleccionado);
            }
        }
    }

    async guardar() {
        if (!this.idEquipo) {
            Swal.fire('Error', 'No se ha identificado el equipo', 'error');
            return;
        }

        if (this.hojaVidaForm.invalid || this.registroApoyoForm.invalid) {
            Swal.fire('Atención', 'Por favor complete los campos obligatorios de Hoja de Vida y Registro de Apoyo', 'warning');
            this.hojaVidaForm.markAllAsTouched();
            this.registroApoyoForm.markAllAsTouched();
            return;
        }

        this.loading = true;

        try {
            // 1. Fabricante (Si es nuevo)
            let fabricanteId = this.fabricanteSeleccionado?.id || null;
            if (!this.fabricanteSeleccionado && this.fabricanteForm.value.nombres) {
                // Si hay datos en el form de fabricante y no se seleccionó uno existente, crearlo.
                // Validación simple para no crear vacíos si el usuario no tocó nada
                const fabricanteData = this.cleanData(this.fabricanteForm.value);
                if (fabricanteData.nombres) {
                    const resFab = await this.hojaVidaService.createFabricante(fabricanteData);
                    fabricanteId = resFab.id;
                    await this.cargarListas(); // Recargar listas
                }
            }
            if (!fabricanteId && this.hojaVidaForm.value.fabricacion) {
                // Intentar buscar por nombre si no se tiene ID (fallback)
                const match = this.listaFabricantes.find(f => f.nombres === this.hojaVidaForm.value.fabricacion);
                if (match) fabricanteId = match.id;
            }


            // 2. Guardar o Actualizar Proveedor
            const rawProveedor = { ...this.proveedorForm.value, equipoIndustrialIdFk: Number(this.idEquipo) };
            const proveedorData = this.cleanData(rawProveedor);
            let proveedorId = this.idProveedor;

            if (this.idProveedor) {
                await this.hojaVidaService.updateProveedor(this.idProveedor, proveedorData);
            } else if (Object.values(proveedorData).some(v => v !== null && v !== false && v !== '')) {
                // Solo crear si hay algún dato relevante
                const resProv = await this.hojaVidaService.createProveedor(proveedorData);
                proveedorId = resProv.id;
                this.idProveedor = proveedorId;
            }


            // 3. Guardar o Actualizar Datos Técnicos
            const rawDatosTecnicos = { ...this.datosTecnicosForm.value, equipoIndustrialIdFk: Number(this.idEquipo) };
            const datosTecnicosData = this.cleanData(rawDatosTecnicos);
            let datosTecnicosId = this.idDatosTecnicos;

            if (this.idDatosTecnicos) {
                await this.hojaVidaService.updateDatosTecnicos(this.idDatosTecnicos, datosTecnicosData);
            } else {
                const resDatos = await this.hojaVidaService.createDatosTecnicos(datosTecnicosData);
                datosTecnicosId = resDatos.id;
                this.idDatosTecnicos = datosTecnicosId;
            }


            // 4. Guardar o Actualizar Hoja de Vida (Con los IDs recolectados)
            const rawHojaVida = {
                ...this.hojaVidaForm.value,
                equipoIndustrialIdFk: Number(this.idEquipo),
                fabricanteIdFk: fabricanteId,
                proveedorIdFk: proveedorId,
                datosTecnicosIdFk: datosTecnicosId
            };
            const hojaVidaData = this.cleanData(rawHojaVida);

            if (this.idHojaVida) {
                await this.hojaVidaService.updateHojaVida(this.idHojaVida, hojaVidaData);
            } else {
                const resHV = await this.hojaVidaService.createHojaVida(hojaVidaData);
                this.idHojaVida = resHV.id;
            }


            // 5. Guardar o Actualizar Registro de Apoyo
            const rawRegistroApoyo = { ...this.registroApoyoForm.value, equipoIndustrialIdFk: Number(this.idEquipo) };
            const registroApoyoData = this.cleanData(rawRegistroApoyo);

            if (this.idRegistroApoyo) {
                await this.hojaVidaService.updateRegistroApoyo(this.idRegistroApoyo, registroApoyoData);
            } else {
                const resApoyo = await this.hojaVidaService.createRegistroApoyo(registroApoyoData);
                this.idRegistroApoyo = resApoyo.id;
            }


            this.loading = false;
            Swal.fire({
                title: 'Éxito',
                text: 'La Hoja de Vida ha sido actualizada exitosamente.',
                icon: 'success'
            }).then(() => {
                this.regresar();
            });


        } catch (error: any) {
            this.loading = false;
            console.error('Error al guardar:', error);
            const errorMessage = error.error?.detalle || error.error?.error || 'Ocurrió un error al guardar. Verifique los datos o intente nuevamente.';
            Swal.fire('Error', errorMessage, 'error');
        }
    }

    regresar() {
        this.router.navigate(['/adminequipos']);
    }
}

