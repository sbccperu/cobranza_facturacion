import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientesService } from '../../services/clientes.service';

declare var bootstrap: any;

@Component({
    selector: 'app-clientes',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './clientes.html',
    styleUrls: ['./clientes.css']
})
export class ClientesComponent implements OnInit {
    clientes: any[] = [];
    nuevoNombre: string = '';
    nuevoTelefono: string = '';
    nuevoRuc: string = '';
    terminoBusqueda: string = '';
    paginaActual: number = 1;
    itemsPorPagina: number = 8;
    modalClienteId: number | null = null;
    modalClienteNombre: string = '';
    modalClienteTelefonos: string = '';
    modalClienteRucs: string = '';
    modalInstance: any = null;
    vistaActual: 'activos' | 'basurero' = 'activos';

    constructor(private clientesService: ClientesService) { }
    get clientesFiltrados(): any[] {
        if (!this.terminoBusqueda) {
            return this.clientes;
        }
        const termino = this.terminoBusqueda.toLowerCase().trim();
        return this.clientes.filter(cliente => {
            const nombreMatches = cliente.nombre_cliente && cliente.nombre_cliente.toLowerCase().includes(termino);
            const telefonosMatches = cliente.telefonos && cliente.telefonos.toLowerCase().includes(termino);
            const rucsMatches = cliente.rucs && cliente.rucs.toLowerCase().includes(termino);
            return nombreMatches || telefonosMatches || rucsMatches;
        });
    }

    get clientesPaginados(): any[] {
        const filtrados = this.clientesFiltrados;
        const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
        const fin = inicio + this.itemsPorPagina;
        return filtrados.slice(inicio, fin);
    }

    get totalPaginas(): number {
        return Math.ceil(this.clientesFiltrados.length / this.itemsPorPagina);
    }

    cambiarPagina(pagina: number) {
        if (pagina >= 1 && pagina <= this.totalPaginas) {
            this.paginaActual = pagina;
        }
    }

    cambiarVista(vista: 'activos' | 'basurero') {
        this.vistaActual = vista;
        this.paginaActual = 1;
        this.cargarClientes();
    }

    ngOnInit() {
        this.cargarClientes();
    }

    cargarClientes() {
        const peticion: import('rxjs').Observable<any> = this.vistaActual === 'activos'
            ? this.clientesService.obtenerClientes()
            : this.clientesService.obtenerClientesBasurero();

        peticion.subscribe({
            next: (data: any[]) => {
                const COLORES = ['#e3f2fd', '#e8f5e9', '#fff3e0', '#fce4ec', '#f3e5f5', '#e0f7fa', '#f9fbe7', '#ede7f6', '#fbe9e7', '#e0f2f1'];
                const norm = (t: string) => (t || '').toString().trim().replace(/\D/g, '');
                const esCelular = (t: string) => { const n = norm(t); return n.length === 9 && n.startsWith('9'); };

                const conteo: { [tel: string]: number } = {};
                const formatoVisual: { [tel: string]: string } = {};

                // 1. Ordenar para que los del mismo número estén juntos
                const ordenados = [...data].sort((a, b) => {
                    const telA = norm(a.telefonos);
                    const telB = norm(b.telefonos);
                    const eA = esCelular(telA);
                    const eB = esCelular(telB);
                    if (eA && !eB) return -1;
                    if (!eA && eB) return 1;
                    return telA.localeCompare(telB);
                });

                // 2. Contar
                ordenados.forEach(c => {
                    const tel = norm(c.telefonos);
                    if (esCelular(tel)) {
                        conteo[tel] = (conteo[tel] || 0) + 1;
                        if (!formatoVisual[tel]) formatoVisual[tel] = c.telefonos;
                    }
                });

                // 3. Asignar colores y rowspan
                const mapaColores: { [tel: string]: string } = {};
                let colorIdx = 0;
                const telVistos: { [tel: string]: boolean } = {};

                this.clientes = ordenados.map(c => {
                    const tel = norm(c.telefonos);
                    let color = '';
                    let isFirst = true;
                    let rows = 1;

                    if (esCelular(tel) && conteo[tel] > 1) {
                        c.telefonoVisual = formatoVisual[tel];
                        if (!mapaColores[tel]) {
                            mapaColores[tel] = COLORES[colorIdx % COLORES.length];
                            colorIdx++;
                        }
                        color = mapaColores[tel];
                        isFirst = !telVistos[tel];
                        rows = isFirst ? conteo[tel] : 0;
                        telVistos[tel] = true;
                    } else {
                        c.telefonoVisual = c.telefonos;
                    }

                    return {
                        ...c,
                        colorFila: color,
                        isFirstOfTelGroup: isFirst,
                        telGroupRows: rows,
                        listaTelefonos: c.telefonos ? c.telefonos.split(/[,\/]/).map((t: string) => ({ numero: t.trim() })) : [],
                        listaRucs: c.rucs ? c.rucs.split('|').map((r: string) => ({ texto: r.trim() })) : []
                    };
                });
                this.paginaActual = 1;
            },
            error: (err: any) => console.error("Error al obtener clientes", err)
        });
    }
    generarColor(str: string): string {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = Math.abs(hash % 360);
        return `hsl(${hue}, 80%, 80%)`;
    }
    guardarCliente() {
        if (!this.nuevoNombre || (!this.nuevoTelefono || !this.nuevoRuc)) {
            alert("Completa los datos obligatorios.");
            return;
        }

        const dataNueva = {
            nombre: this.nuevoNombre,
            telefono: this.nuevoTelefono,
            ruc: this.nuevoRuc
        };
        this.clientesService.crearClientes(dataNueva).subscribe({
            next: (respuesta: any) => {
                alert("Cliente guardado correctamente!");
                this.nuevoNombre = '';
                this.nuevoTelefono = '';
                this.nuevoRuc = '';
                this.cargarClientes();
            },
            error: (err: any) => {
                console.error("Hubo un error al guardar", err);
                alert("Error al intentar guardar el cliente.");
            }
        });
    }

    editarCliente(cliente: any) {
        this.modalClienteId = cliente.id_cliente;
        this.modalClienteNombre = cliente.nombre_cliente;
        this.modalClienteTelefonos = cliente.telefonos ? cliente.telefonos : '';
        if (cliente.rucs) {
            const rucsBrutos = cliente.rucs.split(' | ');
            const rucsLimpios = rucsBrutos.map((r: string) => r.trim().split(' ')[0]);
            this.modalClienteRucs = rucsLimpios.join(', ');
        } else {
            this.modalClienteRucs = '';
        }

        const modalElement = document.getElementById('editarClienteModal');
        if (modalElement) {
            this.modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
            this.modalInstance.show();
        }
    }

    actualizarClienteModal() {
        if (!this.modalClienteNombre) {
            alert("El nombre es obligatorio");
            return;
        }

        const dataEditada = {
            id: this.modalClienteId,
            nombre: this.modalClienteNombre,
            telefonos: this.modalClienteTelefonos,
            rucs: this.modalClienteRucs
        };

        this.clientesService.editarCliente(dataEditada).subscribe({
            next: (respuesta: any) => {
                alert("Cliente editado correctamente!");
                if (this.modalInstance) {
                    this.modalInstance.hide();
                }
                this.cargarClientes();
            },
            error: (err: any) => {
                console.error("Hubo un error al editar modal", err);
                alert("Error al intentar editar el cliente.");
            }
        });
    }

    cancelarEdicion() {
        this.nuevoNombre = '';
        this.nuevoTelefono = '';
        this.nuevoRuc = '';
    }

    eliminarCliente(id: number) {
        if (confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
            this.clientesService.eliminarCliente(id).subscribe({
                next: (respuesta: any) => {
                    alert("Cliente eliminado exitosamente!");
                    this.cargarClientes();
                },
                error: (err: any) => {
                    console.error("Hubo un error al eliminar", err);
                    alert("Error al intentar eliminar el cliente.");
                }
            });
        }
    }

    inactivarCliente(id: number) {
        if (confirm("¿Estás seguro de que deseas INACTIVAR este cliente? Esto también inactivará sus teléfonos y RUCs asociados.")) {
            this.clientesService.inactivarCliente(id).subscribe({
                next: (respuesta: any) => {
                    alert("Cliente inactivado exitosamente!");
                    this.cargarClientes();
                },
                error: (err: any) => {
                    console.error("Hubo un error al inactivar", err);
                    alert("Error al intentar inactivar el cliente.");
                }
            });
        }
    }

    restaurarCliente(id: number) {
        this.clientesService.restaurarCliente(id).subscribe({
            next: (respuesta: any) => {
                alert("Cliente restaurado correctamente!");
                this.cargarClientes();
            },
            error: (err: any) => {
                console.error("Hubo un error al restaurar", err);
                alert("Error al intentar restaurar el cliente.");
            }
        });
    }

    eliminarClienteDefinitivo(id: number) {
        if (confirm("¿Estás seguro de que deseas eliminar definitivamente este cliente?")) {
            this.clientesService.eliminarClienteDefinitivo(id).subscribe({
                next: (respuesta: any) => {
                    alert("Cliente eliminado definitivamente!");
                    this.cargarClientes();
                },
                error: (err: any) => {
                    console.error("Hubo un error al eliminar definitivamente", err);
                    alert("Error al intentar eliminar el cliente definitivamente.");
                }
            });
        }
    }
    // Toma de seleccion masiva
    seleccionados: number[] = [];
    todosSeleccionados: boolean = false;

    toggleSeleccion(id: number) {
        if (this.seleccionados.includes(id)) {
            this.seleccionados = this.seleccionados.filter(i => i !== id);
        } else {
            this.seleccionados.push(id);
        }
        this.todosSeleccionados = this.seleccionados.length === this.clientesPaginados.length && this.clientesPaginados.length > 0;
    }

    toggleTodos() {
        if (this.todosSeleccionados) {
            this.seleccionados = [];
            this.todosSeleccionados = false;
        } else {
            this.seleccionados = this.clientesPaginados.map(c => c.id_cliente);
            this.todosSeleccionados = true;
        }
    }

    destruirMasivo() {
        if (this.seleccionados.length === 0) return;
        if (confirm(`¿Estás seguro de que deseas ELIMINAR PERMANENTEMENTE los ${this.seleccionados.length} clientes seleccionados? Esta acción es irreversible.`)) {
            this.clientesService.destruirClientesMasivo(this.seleccionados).subscribe({
                next: (resp: any) => {
                    alert(resp.mensaje);
                    this.seleccionados = [];
                    this.todosSeleccionados = false;
                    this.cargarClientes();
                },
                    error: (err: any) => {
                        console.error("Error en destrucción masiva:", err);
                        alert("Error al destruir masivamente: " + (err.error?.error || err.message));
                    }
            });
        }
    }
}
