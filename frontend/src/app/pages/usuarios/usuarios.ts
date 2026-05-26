import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  verBasurero: boolean = false;
  editando: boolean = false;
  usuarioEditando: any = {};

  constructor(private usuariosService: UsuariosService) { }

  ngOnInit() { this.cargarUsuarios(); }

  cargarUsuarios() {
    this.usuariosService.obtenerUsuarios().subscribe({
      next: (data: any) => this.usuarios = data,
      error: (err: any) => console.error(err)
    });
  }

  verActivos() {
    this.verBasurero = false;
    this.cargarUsuarios();
  }

  verPapelera() {
    this.verBasurero = true;
    this.usuariosService.obtenerBasurero().subscribe({
      next: (data: any) => this.usuarios = data,
      error: (err: any) => console.error(err)
    });
  }

  abrirEditar(usuario: any) {
    this.usuarioEditando = { ...usuario, password: '' };
    this.editando = true;
  }

  guardarEdicion() {
    this.usuariosService.editarUsuario(this.usuarioEditando).subscribe({
      next: () => {
        this.editando = false;
        this.cargarUsuarios();
      },
      error: (err: any) => console.error(err)
    });
  }

  cambiarEstado(id: number, estado: string) {
    this.usuariosService.cambiarEstado(id, estado).subscribe({
      next: () => this.verBasurero ? this.verPapelera() : this.cargarUsuarios(),
      error: (err: any) => console.error(err)
    });
  }

  destruir(id: number) {
    if (confirm('¿Estás seguro? Se eliminará PARA SIEMPRE')) {
      this.usuariosService.eliminarDefinitivo(id).subscribe({
        next: () => this.verPapelera(),
        error: (err: any) => console.error(err)
      });
    }
  }
}
