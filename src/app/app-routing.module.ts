import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes, CanLoad } from '@angular/router';
import { LoginGuard } from './login/login.guard';
import { ConfiguracionNotificacionesPageModule } from './UI/configuracion-notificaciones/configuracion-notificaciones.module';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'perfil/:id',
    loadChildren: () => import('./perfil/perfil.module').then( m => m.PerfilPageModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'evento',
    loadChildren: () => import('./alta-evento/alta-evento.module').then( m => m.AltaEventoPageModule),
    canLoad: [LoginGuard]
  },
  {
    path: 'alta-evento',
    loadChildren: () => import('./alta-evento/alta-evento.module').then( m => m.AltaEventoPageModule),
    canLoad: [LoginGuard]
  },
  {
    path: 'editar-evento',
    loadChildren: () => import('./alta-evento/alta-evento.module').then( m => m.AltaEventoPageModule),
    canLoad: [LoginGuard]
  },
  // {
  //   path: 'baja-evento',
  //   loadChildren: () => import('./baja-evento/baja-evento.module').then( m => m.BajaEventoPageModule),
  //   canLoad: [LoginGuard]
  // },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule),
    canLoad: [LoginGuard]
  },
  {
    path: 'estadisticas',
    loadChildren: () => import('./estadisticas/estadisticas.module').then( m => m.EstadisticasPageModule)
    // canLoad: [LoginGuard]
  },
  {
    path: 'chat/:nickname',
    loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule),
    canLoad: [LoginGuard]
  },
  {
    path: 'interes',
    loadChildren: () => import('./interes/interes.module').then( m => m.InteresPageModule)
  },
  {
    path: 'eventos',
    loadChildren: () => import('./eventos/eventos.module').then( m => m.EventosPageModule)
  },
  {
    path: 'visualizar-ubicaciones/:id',
    loadChildren: () => import('./visualizar-ubicaciones/visualizar-ubicaciones.module').then( m => m.VisualizarUbicacionesPageModule)
  },
  {
    path: 'alta-administrador',
    loadChildren: () => import('./alta-administrador/alta-administrador.module').then( m => m.AltaAdministradorPageModule)
  },
  {
    path: 'sugerir-amigos',
    loadChildren: () => import('./UI/sugerir-amigos/sugerir-amigos.module').then( m => m.SugerirAmigosPageModule)
  },
  {
    path: 'admin-page',
    loadChildren: () => import('./admin-page/admin-page.module').then( m => m.AdminPagePageModule)
  },
  {
    path: 'tab-medallas',
    loadChildren: () => import('./tab-medallas/tab-medallas.module').then( m => m.TabMedallasPageModule)
  },
  {
    path: 'tab-gestion-usuarios',
    loadChildren: () => import('./tab-gestion-usuarios/tab-gestion-usuarios.module').then( m => m.TabGestionUsuariosPageModule)
  },
  {
    path: 'listar-contactos',
    loadChildren: () => import('./listar-contactos/listar-contactos.module').then( m => m.ListarContactosPageModule)
  },
  {
    path: 'intereses-usuario-comun',
    loadChildren: () => import('./intereses-usuario-comun/intereses-usuario-comun.module').then( m => m.InteresesUsuarioComunPageModule)
  },
  {
    path: 'recuperar-password',
    loadChildren: () => import('./recuperar-password/recuperar-password.module').then( m => m.RecuperarPasswordPageModule)
  },
  {
    path: 'visualizar-contactos',
    loadChildren: () => import('./UI/visualizar-contactos/visualizar-contactos.module').then( m => m.VisualizarContactosPageModule)
  },
  {
    path: 'tab-perfil-admin',
    loadChildren: () => import('./tab-perfil-admin/tab-perfil-admin.module').then( m => m.TabPerfilAdminPageModule)
  },
  {
    path: 'modificar-perfil',
    loadChildren: () => import('./modificar-perfil/modificar-perfil.module').then( m => m.ModificarPerfilPageModule)
  },
  {
    path: 'configuracion-notificaciones',
    loadChildren: () => import('./UI/configuracion-notificaciones/configuracion-notificaciones.module').then(c => c.ConfiguracionNotificacionesPageModule)
  },
  {
    path: 'solicitudes-pendientes',
    loadChildren: () => import('./UI/solicitudes-pendientes/solicitudes-pendientes.module').then( m => m.SolicitudesPendientesPageModule)
  },
  {
    path: 'galeria/:id',
    loadChildren: () => import('./galeria/galeria.module').then( m => m.GaleriaPageModule)
  },
  {
    path: 'galeria-modal',
    loadChildren: () => import('./galeria-modal/galeria-modal.module').then( m => m.GaleriaModalPageModule)
  }





];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
