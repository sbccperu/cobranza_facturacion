import { Routes } from '@angular/router';
import { OperacionesComponent } from './pages/operaciones/operaciones';
import { HistorialPagosComponent } from './pages/historial-pagos/historial-pagos';
import { ClientesComponent } from './pages/clientes/clientes';
import { CobranzasComponent } from './pages/cobranzas/cobranzas';
import { LoginComponent } from './pages/login/login';
import { UsuariosComponent } from './pages/usuarios/usuarios';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'operaciones', component: OperacionesComponent, canActivate: [authGuard] },
  { path: 'historial-pagos', component: HistorialPagosComponent, canActivate: [authGuard] },
  { path: 'clientes', component: ClientesComponent, canActivate: [authGuard] },
  { path: 'cobranzas', component: CobranzasComponent, canActivate: [authGuard] },
  { path: 'usuarios', component: UsuariosComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];