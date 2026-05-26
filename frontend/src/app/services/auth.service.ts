import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth/login';
  constructor(private http: HttpClient) { }
  login(nombre_usuario: string, password: string) {
    return this.http.post<any>(this.apiUrl, {
      nombre_usuario, password
    });
  }
  guardarSesion(token: string, usuario: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }
  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario')
  }
  estaLogueado(): boolean {
    return localStorage.getItem('token') != null;
  }
  obtenerUsuario() {
    const data = localStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }
  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }
}
