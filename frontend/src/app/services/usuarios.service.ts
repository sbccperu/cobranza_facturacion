import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private apiUrl = 'http://localhost:3000/api/usuarios';
  constructor(private http: HttpClient) { }
  obtenerUsuarios() {
    return this.http.get<any[]>(`${this.apiUrl}/listar`);
  }
  obtenerBasurero() {
    return this.http.get<any[]>(`${this.apiUrl}/basurero`);
  }
  editarUsuario(datos: any) {
    return this.http.put(`${this.apiUrl}/editar`, datos);
  }
  cambiarEstado(id: number, estado: string) {
    return this.http.put(`${this.apiUrl}/estado/${id}`, { estado });
  }
  eliminarDefinitivo(id: number) {
    return this.http.delete(`${this.apiUrl}/destruir/${id}`);
  }
}
