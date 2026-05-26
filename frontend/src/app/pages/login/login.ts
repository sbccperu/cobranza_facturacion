import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  nombreUsuario: string = '';
  password: string = '';
  error: string = '';
  cargando: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    // Al llegar al login, limpiamos cualquier sesión vieja
    this.authService.cerrarSesion();
  }
  iniciarSesion() {
    this.error = '';
    this.cargando = true;
    this.authService.login(this.nombreUsuario, this.password).subscribe({
      next: (respuesta) => {
        this.authService.guardarSesion(respuesta.token, respuesta.usuario)
        this.router.navigate(['/operaciones']);
      },
      error: (respuesta) => {
        this.error = respuesta.error?.mensaje || 'Error al iniciar sesión';
        this.cargando = false;
      }
    });
  }
}
