import { OlvidoContrasenaComponent } from './Components/gestionarContraseña/olvido-contrasena/olvido-contrasena.component';
import { NgModule } from '@angular/core';
import { authGuard } from './auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { ReportceComponent } from './Components/Imaging/ReportCE/reportce/reportce.component';
import { ReportspediatricsComponent } from './Components/Servinte/Reports/reportspediatrics/reportspediatrics.component';
import { UsuariosServicioComponent } from './Components/News2/usuarios-servicio/usuarios-servicio.component';
import { AerolineaComponent } from './Components/Aerolinea/aerolinea/aerolinea.component';
import { LoginComponent } from './Components/login/login.component'
import { HomesuperadminComponent} from './Components/Homepage/homesuperadmin/homesuperadmin.component'
import { HomeadminsistemasComponent} from './Components/Homepage/homeadminsistemas/homeadminsistemas.component'
import { HomeadminbiomedicaComponent } from './Components/Homepage/homeadminbiomedica/homeadminbiomedica.component';
import { HomeadminmantenimientoComponent } from './Components/Homepage/homeadminmantenimiento/homeadminmantenimiento.component';
import { RegistroComponent } from './Components/registro/registro.component';
import { GestionUsuariosComponent } from './Components/gestion-usuarios/gestion-usuarios.component';
import { HomeusermantenimientoComponent } from './Components/Homepage/homeusermantenimiento/homeusermantenimiento.component';
import { HomeusersistemasComponent } from './Components/Homepage/homeusersistemas/homeusersistemas.component';
import { HomeuserbiomedicaComponent } from './Components/Homepage/homeuserbiomedica/homeuserbiomedica.component';
import { HomeadminmesaserviciosComponent } from './Components/Homepage/homeadminmesaservicios/homeadminmesaservicios.component';
import { ClasificacionInventarioComponent } from './Components/userBiomedica/clasificacion-inventario/clasificacion-inventario.component';
import { ManteniminetoComponent } from './Components/userBiomedica/mantenimineto/mantenimineto.component';
import { SemaforizacionComponent } from './Components/userBiomedica/semaforizacion/semaforizacion.component';
import { IndicadoresComponent } from './Components/userBiomedica/indicadores/indicadores.component';
import { CalendarioComponent } from './Components/userBiomedica/calendario/calendario.component';
import { ClasificacionTipoEquipoComponent } from './Components/userBiomedica/clasificacion-tipo-equipo/clasificacion-tipo-equipo.component';
import { ClasificacionServicioComponent } from './Components/userBiomedica/clasificacion-servicio/clasificacion-servicio.component';
import { ClasificacionComodatosComponent } from './Components/userBiomedica/clasificacion-comodatos/clasificacion-comodatos.component';
import { EquiposServicioComponent } from './Components/userBiomedica/vista-Equipos/equipos-servicio/equipos-servicio.component';
import { EquiposTipoComponent } from './Components/userBiomedica/vista-Equipos/equipos-tipo/equipos-tipo.component';
import { EquiposComodatosComponent } from './Components/userBiomedica/vista-Equipos/equipos-comodatos/equipos-comodatos.component';
import { EditarUsuarioComponent } from './Components/editar-usuario/editar-usuario.component';
import { CambiarContrasenaComponent } from './Components/gestionarContraseña/cambiar-contrasena/cambiar-contrasena.component';
import { CrearReporteComponent } from './Components/userBiomedica/Reportes/crear-reporte/crear-reporte.component';
import { HojavidaComponent } from './Components/userBiomedica/vista-Equipos/hojavida/hojavida.component';
import { VerReporteComponent } from './Components/userBiomedica/Reportes/ver-reporte/ver-reporte.component';
import { ActividadesMetrologicasComponent } from './Components/userBiomedica/actividades-metrologicas/actividades-metrologicas.component';
import { IntranetComponent } from './Components/intranet/intranet.component';
import { ValidadorQRComponent } from './Components/userBiomedica/Reportes/validador-qr/validador-qr.component';
import { CrearEquipoComponent } from './Components/userBiomedica/vista-Equipos/crear-equipo/crear-equipo.component';
import { CirugiaComponent } from './Components/cirugia/cirugia.component';
import { AdmtiposequipoComponent } from './Components/administracion/admtiposequipo/admtiposequipo.component';
import { AdmserviciosComponent } from './Components/administracion/admservicios/admservicios.component';

//industriales
import { homeadminindustrialescomponent} from './Components/Homepage/homeadminindustriales/homesadminindustriales.component'
import {CrearEquipoIndustrialComponent} from './Components/Industriales/userIndustriales/vista-Equipos/crear-equipo/crear-equipo-industrial.component'
import { GestionEquiposIndustrialesComponent } from './Components/Industriales/gestion-equipos-industriales/gestion-equipos-industriales.component';
import { EditarEquipoIndustrialComponent } from './Components/Industriales/userIndustriales/vista-Equipos/editar-equipo/editar-equipo-industrial.component';
import { DetalleEquipoIndustrialComponent } from './Components/Industriales/userIndustriales/vista-Equipos/detalle-equipo/detalle-equipo-industrial.component';

import { GestionPlanMantenimientoComponent } from './Components/Industriales/userIndustriales/vista-PlanMantenimiento/gestion-plan-mantenimiento/gestion-plan-mantenimiento.component';
import { CrearPlanMantenimientoComponent } from './Components/Industriales/userIndustriales/vista-PlanMantenimiento/crear-plan-mantenimiento/crear-plan-mantenimiento.component';
import { EditarPlanMantenimientoComponent } from './Components/Industriales/userIndustriales/vista-PlanMantenimiento/editar-plan-mantenimiento/editar-plan-mantenimiento.component';
import { DetallePlanMantenimientoComponent } from './Components/Industriales/userIndustriales/vista-PlanMantenimiento/detalle-plan-mantenimiento/detalle-plan-mantenimiento.component';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {path: 'login', component: LoginComponent},
  {path: 'updateprofil', component: EditarUsuarioComponent, canActivate: [authGuard]},
  {path: 'superadmin', component: HomesuperadminComponent, canActivate: [authGuard]},
  {path: 'registro', component: RegistroComponent, canActivate: [authGuard]},
  {path: 'adminsistemas', component: HomeadminsistemasComponent, canActivate: [authGuard]},
  {path: 'adminbiomedica', component: HomeadminbiomedicaComponent, canActivate: [authGuard]},
  {path: 'adminmantenimineto', component: HomeadminmantenimientoComponent, canActivate: [authGuard]},
  {path: 'adminmesaservicios', component: HomeadminmesaserviciosComponent, canActivate: [authGuard]},
  {path: 'usermantenimiento', component: HomeusermantenimientoComponent, canActivate: [authGuard]},
  {path: 'usersistemas', component: HomeusersistemasComponent, canActivate: [authGuard]},
  {path: 'userbiomedica', component: HomeuserbiomedicaComponent, canActivate: [authGuard]},
  {path: 'imagenologia/citasCE', component: ReportceComponent},
  {path: 'servinte/reportepediatria', component: ReportspediatricsComponent},
  {path: 'servinte/news2', component: UsuariosServicioComponent},
  {path: 'servinte/cirugia', component: CirugiaComponent},
  {path: 'acreditacion/aerolinea', component: AerolineaComponent},
  {path: 'admusuarios', component: GestionUsuariosComponent, canActivate: [authGuard]},

  {path: 'olvidocontraseña', component: OlvidoContrasenaComponent},
  {path: 'recuperarcontraseña', component: CambiarContrasenaComponent},

  // UsuarioBiomedica

  {path: 'biomedica/nuevoequipo', component: CrearEquipoComponent, canActivate: [authGuard]},
  {path: 'biomedica/inventario', component: ClasificacionInventarioComponent, canActivate: [authGuard]},
  {path: 'biomedica/mantenimiento', component: ManteniminetoComponent, canActivate: [authGuard]},
  {path: 'biomedica/semaforizacion', component: SemaforizacionComponent, canActivate: [authGuard]},
  {path: 'biomedica/indicadores', component: IndicadoresComponent, canActivate: [authGuard]},
  {path: 'biomedica/calendario', component: CalendarioComponent, canActivate: [authGuard]},
  {path: 'biomedica/actividadesmetrologicas', component: ActividadesMetrologicasComponent, canActivate: [authGuard]},
  {path: 'biomedica/tiposequipo', component: ClasificacionTipoEquipoComponent, canActivate: [authGuard]},
  {path: 'biomedica/servicios', component: ClasificacionServicioComponent, canActivate: [authGuard]},
  {path: 'biomedica/empComodatos', component: ClasificacionComodatosComponent, canActivate: [authGuard]},
  {path: 'biomedica/equiposservicio', component: EquiposServicioComponent, canActivate: [authGuard]},
  {path: 'biomedica/equipostipo', component: EquiposTipoComponent, canActivate: [authGuard]},
  {path: 'biomedica/equiposcomodatos', component: EquiposComodatosComponent, canActivate: [authGuard]},
  {path: 'biomedica/nuevoreporte/:id', component: CrearReporteComponent, canActivate: [authGuard]},
  {path: 'biomedica/reportesequipo/:id', component: VerReporteComponent, canActivate: [authGuard]},
  {path: 'biomedica/hojavidaequipo/:id', component: HojavidaComponent, canActivate: [authGuard]},
  {path: 'biomedica/validarqr', component: ValidadorQRComponent, canActivate: [authGuard]},
  {path: 'admin/tiposequipo', component: AdmtiposequipoComponent, canActivate: [authGuard]},
  {path: 'admin/servicios', component: AdmserviciosComponent, canActivate: [authGuard]},

  {path: 'intranet', component: IntranetComponent},

  //industriales
  {path: 'adminindustriales', component: homeadminindustrialescomponent, canActivate: [authGuard]},

  {path: 'Industriales/nuevoequipoindustrial', component: CrearEquipoIndustrialComponent, canActivate: [authGuard]},
  {path: 'adminequipos', component: GestionEquiposIndustrialesComponent, canActivate: [authGuard]},
  {path: 'editar-equipo-industrial/:id', component: EditarEquipoIndustrialComponent, canActivate: [authGuard]},
  {path: 'detalle-equipo-industrial/:id', component: DetalleEquipoIndustrialComponent, canActivate: [authGuard]},

  {path: 'industriales/gestion-plan-mantenimiento', component: GestionPlanMantenimientoComponent, canActivate: [authGuard]},
  {path: 'industriales/crear-plan-mantenimiento', component: CrearPlanMantenimientoComponent, canActivate: [authGuard]},
  {path: 'industriales/editar-plan-mantenimiento/:id', component: EditarPlanMantenimientoComponent, canActivate: [authGuard]},
  {path: 'industriales/detalle-plan-mantenimiento/:id', component: DetallePlanMantenimientoComponent, canActivate: [authGuard]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
