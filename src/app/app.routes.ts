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
  {path: 'imagenologia/citasCE', component: ReportceComponent, canActivate: [authGuard]},
  {path: 'servinte/reportepediatria', component: ReportspediatricsComponent},
  {path: 'servinte/news2', component: UsuariosServicioComponent},
  {path: 'acreditacion/aerolinea', component: AerolineaComponent},
  {path: 'admusuarios', component: GestionUsuariosComponent, canActivate: [authGuard]},

  {path: 'olvidocontraseña', component: OlvidoContrasenaComponent},
  {path: 'recuperarcontraseña', component: CambiarContrasenaComponent},

  // UsuarioBiomedica
  {path: 'biomedica/inventario', component: ClasificacionInventarioComponent, canActivate: [authGuard]},
  {path: 'biomedica/mantenimiento', component: ManteniminetoComponent, canActivate: [authGuard]},
  {path: 'biomedica/semaforizacion', component: SemaforizacionComponent, canActivate: [authGuard]},
  {path: 'biomedica/indicadores', component: IndicadoresComponent, canActivate: [authGuard]},
  {path: 'biomedica/calendario', component: CalendarioComponent, canActivate: [authGuard]},
  {path: 'biomedica/tiposequipo', component: ClasificacionTipoEquipoComponent, canActivate: [authGuard]},
  {path: 'biomedica/servicios', component: ClasificacionServicioComponent, canActivate: [authGuard]},
  {path: 'biomedica/empComodatos', component: ClasificacionComodatosComponent, canActivate: [authGuard]},
  {path: 'biomedica/equiposservicio', component: EquiposServicioComponent, canActivate: [authGuard]},
  {path: 'biomedica/equipostipo', component: EquiposTipoComponent, canActivate: [authGuard]},
  {path: 'biomedica/equiposcomodatos', component: EquiposComodatosComponent, canActivate: [authGuard]},
  {path: 'biomedica/nuevoreporte/:id', component: CrearReporteComponent, canActivate: [authGuard]},
  {path: 'biomedica/reportesequipos/:id', component: VerReporteComponent, canActivate: [authGuard]},
  {path: 'biomedica/hojavidaequipo/:id', component: HojavidaComponent, canActivate: [authGuard]}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
