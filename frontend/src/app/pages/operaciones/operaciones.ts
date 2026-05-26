import { Component, OnInit } from '@angular/core';
import { OperacionesService } from '../../services/operaciones.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Paleta de colores para grupos del mismo teléfono
const COLORES_GRUPO = [
  '#e3f2fd', '#e8f5e9', '#fff3e0', '#fce4ec', '#f3e5f5',
  '#e0f7fa', '#f9fbe7', '#ede7f6', '#fbe9e7', '#e0f2f1'
];

@Component({
  selector: 'app-operaciones',
  standalone: true,
  templateUrl: './operaciones.html',
  imports: [CommonModule, FormsModule],
  styleUrl: './operaciones.css',
})
export class OperacionesComponent implements OnInit {
  clientes: any[] = [];
  terminoBusqueda: string = '';
  periodos: any[] = [];
  idPeriodoSeleccionado: number = 0;
  cargando: boolean = false;

  // CSV - Nuevos clientes detectados
  mostrarModalNuevo: boolean = false;
  clientesNuevosDetectados: any[] = [];

  // Paginación
  paginaActual: number = 1;
  itemsPorPagina: number = 15;

  get clientesEnCobranza(): number {
    return this.clientes.filter(c => c.ya_en_cobranza).length;
  }

  get periodoNombre(): string {
    const p = this.periodos.find(p => p.id_periodo == this.idPeriodoSeleccionado);
    return p ? p.descripcion || p.nombre || `Periodo ${p.id_periodo}` : '';
  }

  get clientesFiltrados(): any[] {
    if (!this.terminoBusqueda.trim()) return this.clientes;
    const t = this.terminoBusqueda.toLowerCase();
    return this.clientes.filter(c =>
      (c.nombre || '').toLowerCase().includes(t) ||
      (c.telefono || '').includes(t) ||
      (c.rucs || '').includes(t) ||
      (c.razones_sociales || '').toLowerCase().includes(t)
    );
  }

  get totalPaginas(): number {
    return Math.ceil(this.clientesFiltrados.length / this.itemsPorPagina) || 1;
  }

  get clientesPaginados(): any[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.clientesFiltrados.slice(inicio, inicio + this.itemsPorPagina);
  }

  cambiarPagina(p: number) {
    if (p >= 1 && p <= this.totalPaginas) this.paginaActual = p;
  }

  constructor(
    private operacionesService: OperacionesService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.cargarPeriodos();
  }

  cargarPeriodos() {
    // Primero auto-create el periodo del mes actual si no existe
    this.operacionesService.autocrearPeriodoActual().subscribe({
      next: () => this.listarPeriodos(),
      error: () => this.listarPeriodos() // si falla, igual cargamos
    });
  }

  listarPeriodos() {
    this.operacionesService.obtenerPeriodos().subscribe({
      next: (data) => {
        this.periodos = data.slice().reverse(); // más reciente primero
        if (data.length > 0) {
          const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
          const hoy = new Date();
          const descActual = `${MESES[hoy.getMonth()]} ${hoy.getFullYear()}`;
          const pActual = data.find((p: any) => p.descripcion === descActual);
          this.idPeriodoSeleccionado = pActual ? pActual.id_periodo : data[data.length - 1].id_periodo;
          this.cargarDirectorio();
        }
      },
      error: (err) => console.error('Error al cargar periodos:', err)
    });
  }

  cargarDirectorio() {
    if (!this.idPeriodoSeleccionado) return;
    this.cargando = true;
    this.operacionesService.listarClientesDirectorio(this.idPeriodoSeleccionado).subscribe({
      next: (data) => {
        this.clientes = this.asignarColoresGrupo(data);
        this.paginaActual = 1;
        this.cargando = false;
      },
      error: (err) => { console.error(err); this.cargando = false; }
    });
  }
  asignarColoresGrupo(clientes: any[]): any[] {
    const mapaColores: { [tel: string]: string } = {};
    const formatoVisual: { [tel: string]: string } = {};
    let colorIdx = 0;
    // Validación de celular peruano (9 dígitos, empieza con 9)
    const norm = (t: string) => (t || '').toString().replace(/\D/g, '');
    const esCelular = (t: string) => { const n = norm(t); return n.length === 9 && n.startsWith('9'); };

    // 1. Contar cuántas veces aparece cada teléfono válido (SIN reordenar)
    const conteo: { [tel: string]: number } = {};
    clientes.forEach(c => {
      const tel = norm(c.telefono_grupo || c.telefono);
      if (esCelular(tel)) {
        conteo[tel] = (conteo[tel] || 0) + 1;
        if (!formatoVisual[tel]) formatoVisual[tel] = c.telefono_grupo || c.telefono;
      }
    });

    // 2. Asignar colores a cada grupo (sin cambiar el orden)
    const resultado = clientes.map(c => ({
      ...c,
      colorGrupo: '',
      editando: false,
      isFirstOfTelGroup: true,
      telGroupRows: 1
    }));

    // 3. Calcular rowspan CONSECUTIVO: solo agrupar filas que estén juntas
    for (let i = 0; i < resultado.length; i++) {
      const tel = norm(resultado[i].telefono_grupo || resultado[i].telefono);

      if (!esCelular(tel) || conteo[tel] <= 1) {
        // Fila individual, no agrupar
        continue;
      }

      // Asignar color
      if (!mapaColores[tel]) {
        mapaColores[tel] = COLORES_GRUPO[colorIdx % COLORES_GRUPO.length];
        colorIdx++;
      }
      resultado[i].colorGrupo = mapaColores[tel];
      resultado[i].telefono = formatoVisual[tel]; // Unificar formato visual

      // Contar filas consecutivas con el mismo teléfono
      let consecutivas = 1;
      for (let j = i + 1; j < resultado.length; j++) {
        const telJ = norm(resultado[j].telefono_grupo || resultado[j].telefono);
        if (telJ === tel) {
          consecutivas++;
          resultado[j].colorGrupo = mapaColores[tel];
          resultado[j].telefono = formatoVisual[tel];
          resultado[j].isFirstOfTelGroup = false;
          resultado[j].telGroupRows = 0;
        } else {
          break;
        }
      }

      resultado[i].isFirstOfTelGroup = true;
      resultado[i].telGroupRows = consecutivas;
      i += consecutivas - 1; // Saltar las filas ya procesadas
    }

    return resultado;
  }

  onCambiarPeriodo() {
    this.cargarDirectorio();
  }

  pasarTodos() {
    if (!this.idPeriodoSeleccionado) { alert('Selecciona un periodo primero.'); return; }
    const sinCobranza = this.clientes.filter(c => !c.ya_en_cobranza).length;
    if (sinCobranza === 0) { alert('Todos los clientes ya tienen cobranza activa en este periodo.'); return; }
    if (!confirm(`Se crearán ${sinCobranza} cobranzas activas. ¿Continuar?`)) return;

    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const idUsuario = usuario.I001ID_USUARIO || 1;
    this.cargando = true;
    this.operacionesService.pasarTodosACobranzas(this.idPeriodoSeleccionado, idUsuario).subscribe({
      next: (res: any) => { alert(res.mensaje); this.cargarDirectorio(); },
      error: (err: any) => { alert('Error: ' + err.error?.error); this.cargando = false; }
    });
  }
  pasarIndividual(cliente: any) {
    if (!this.idPeriodoSeleccionado) { alert('Selecciona un periodo primero.'); return; }
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const idUsuario = usuario.I001ID_USUARIO || 1;
    this.cargando = true;
    this.operacionesService.pasarIndividualACobranza(cliente.id_cliente, this.idPeriodoSeleccionado, idUsuario).subscribe({
      next: (res: any) => { alert(res.mensaje); this.cargarDirectorio(); },
      error: (err: any) => { alert('Error: ' + (err.error?.error || err.message)); this.cargando = false; }
    });
  }
  habilitarEdicion(cliente: any) { cliente.editando = true; }
  cancelarEdicion(cliente: any) { cliente.editando = false; this.cargarDirectorio(); }
  guardarEdicion(cliente: any) {
    this.operacionesService.actualizarCliente(cliente.id_cliente, {
      id: cliente.id_cliente,
      nombre: cliente.nombre,
      telefonos: cliente.telefono,
      rucs: cliente.rucs
    }).subscribe({
      next: () => { cliente.editando = false; this.cargarDirectorio(); },
      error: (err: any) => alert('Error al guardar: ' + err.error?.error)
    });
  }
  examinarCSV(event: any) {
    const archivo = event.target.files[0];
    if (!archivo) return;
    this.cargando = true;
    const lector = new FileReader();
    lector.onload = (e: any) => {
      const contenido = e.target.result;
      const datosCSV = this.operacionesService.procesarArchivoCSV(contenido);
      this.operacionesService.obtenerVistaPrevia(datosCSV).subscribe({
        next: (response: any) => {
          this.cargando = false;
          const nuevos = (response.clientes || []).filter((c: any) => c.es_nuevo);
          if (nuevos.length === 0) {
            alert('No se detectaron clientes nuevos. Todos los RUCs ya están registrados.');
          } else {
            this.clientesNuevosDetectados = nuevos.map((c: any) => ({
              ...c,
              telefono: c.telefono || '',
              nombre_cliente: '',
              guardar: true
            }));
            this.mostrarModalNuevo = true;
          }
          event.target.value = '';
        },
        error: (err: any) => { console.error(err); this.cargando = false; }
      });
    };
    lector.readAsText(archivo);
  }

  guardarNuevos() {
    const aGuardar = this.clientesNuevosDetectados.filter(c => c.guardar);
    if (aGuardar.length === 0) { this.mostrarModalNuevo = false; return; }
    const sinNombre = aGuardar.filter(c => !c.nombre_cliente.trim());
    if (sinNombre.length > 0) { alert('Por favor completa el nombre de todos los clientes seleccionados.'); return; }

    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const idUsuario = usuario.I001ID_USUARIO || 1;
    const payload = {
      clientes: aGuardar,
      id_periodo: this.idPeriodoSeleccionado,
      id_usuario: idUsuario,
      solo_clientes: true
    };

    this.operacionesService.guardarCobranzaEnDB(payload).subscribe({
      next: () => { alert('Clientes nuevos guardados correctamente.'); this.mostrarModalNuevo = false; this.cargarDirectorio(); },
      error: (err: any) => alert('Error al guardar: ' + err.error?.error)
    });
  }

  cerrarModal() {
    this.mostrarModalNuevo = false;
    this.clientesNuevosDetectados = [];
  }
}
