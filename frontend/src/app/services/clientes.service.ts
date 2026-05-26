import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ClientesService {
    private apiUrl = environment.apiUrl + '/clientes';

    constructor(private http: HttpClient) { }
    obtenerClientes() {
        return this.http.get<any[]>(`${this.apiUrl}/listar`);
    }
    crearClientes(data: any) {
        return this.http.post(`${this.apiUrl}/registrar`, data);
    }
    inactivarCliente(id: number) {
        return this.http.put(`${this.apiUrl}/eliminar/${id}`, { estado: 'inactivo' });
    }
    eliminarCliente(id: number) {
        return this.http.put(`${this.apiUrl}/eliminar/${id}`, { estado: 'eliminado' });
    }
    restaurarCliente(id: number) {
        return this.http.put(`${this.apiUrl}/restaurar/${id}`, { estado: 'activo' });
    }
    eliminarClienteDefinitivo(id: number) {
        return this.http.delete(`${this.apiUrl}/destruir/${id}`);
    }
    obtenerClientesBasurero() {
        return this.http.get<any[]>(`${this.apiUrl}/listar-basurero`);
    }
    editarCliente(data: any) {
        return this.http.put(`${this.apiUrl}/editar/${data.id}`, data);
    }
    destruirClientesMasivo(ids: number[]) {
        return this.http.post(`${this.apiUrl}/destruir-masivo`, { ids });
    }
    inactivarClientesMasivo(ids: number[]) {
        return this.http.post(`${this.apiUrl}/cambiar-estado-masivo`, { ids, estado: 'inactivo' });
    }
}
