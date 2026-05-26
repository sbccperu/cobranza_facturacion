import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estaLogueado()) {
    return true; //Hay token en localStorage y si puede entrar
  }
  //No hay token asi que es redirigido al login
  router.navigate(['/login']);
  return false;
};
