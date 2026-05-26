import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OperacionesService } from '../../services/operaciones.service';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-cobranzas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cobranzas.html',
  styleUrl: './cobranzas.css',
})
export class CobranzasComponent implements OnInit {
  cobranzasActivas: any[] = [];
  paginaActual: number = 1;
  itemsPorPagina: number = 10;

  vistaActual: 'activas' | 'inactivas' = 'activas';

  constructor(private operacionesService: OperacionesService, private clientesService: ClientesService) { }

  ngOnInit(): void {
    this.cargarCobranzas();
  }

  get cobranzasFiltradas(): any[] {
    let filtradas = this.cobranzasActivas;
    if (this.terminoBusquedaDashboard) {
      const termino = this.terminoBusquedaDashboard.toLowerCase().trim();
      const terminoLimpio = termino.replace(/\D/g, ''); // Solo números para búsqueda de tel/ruc

      filtradas = this.cobranzasActivas.filter(cobranza => {
        const nombreMatches = cobranza.nombre_cliente && cobranza.nombre_cliente.toLowerCase().includes(termino);
        const rucMatches = cobranza.rucs && cobranza.rucs.toString().includes(termino);
        const idMatches = cobranza.id_cobranza && cobranza.id_cobranza.toString().includes(termino);

        // Búsqueda por teléfono (normalizada)
        let telMatches = false;
        if (cobranza.telefonos) {
          const telLimpio = cobranza.telefonos.toString().replace(/\D/g, '');
          telMatches = telLimpio.includes(terminoLimpio || termino);
        }

        return nombreMatches || idMatches || rucMatches || telMatches;
      });
    }
    return filtradas;
  }

  private _terminoBusqueda: string = '';
  get terminoBusquedaDashboard(): string { return this._terminoBusqueda; }
  set terminoBusquedaDashboard(val: string) {
    this._terminoBusqueda = val;
    this.paginaActual = 1;
    this.procesarVista();
  }

  listaVista: any[] = [];

  get totalPaginas(): number {
    return Math.ceil(this.cobranzasFiltradas.length / this.itemsPorPagina) || 1;
  }

  get sumaTotalCobranzas(): number {
    return this.cobranzasFiltradas.reduce((total, c) => total + (parseFloat(c.monto_total) || 0), 0);
  }

  private norm(t: string): string {
    return (t || '').toString().trim().replace(/\D/g, '');
  }

  private esTelefonoValido(t: string): boolean {
    const n = this.norm(t);
    // Permitir números internacionales (7 a 15 dígitos)
    return n.length >= 7 && n.length <= 15;
  }

  private getGroupKey(c: any): string {
    const primerTelRaw = (c.telefonos || '').split(/[,\/]/)[0];
    const telNorm = this.norm(primerTelRaw);
    return this.esTelefonoValido(telNorm) ? telNorm : `indiv_${c.id_cobranza}`;
  }

  // Estado de pendiente por grupo (clave: groupKey)
  private pendientesPorGrupo: { [key: string]: boolean } = {};

  procesarVista() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    const slice = this.cobranzasFiltradas.slice(inicio, fin);

    let lastKey = '';
    const conteoSumaGlobal: { [key: string]: number } = {};
    const conteoFilasPagina: { [key: string]: number } = {};
    const grupoTieneComprobantesPagina: { [key: string]: boolean } = {};

    // 1. Calcular totales GLOBALES del grupo (independiente de la página)
    this.cobranzasFiltradas.forEach(c => {
      const groupKey = this.getGroupKey(c);
      conteoSumaGlobal[groupKey] = (conteoSumaGlobal[groupKey] || 0) + (parseFloat(c.monto_total) || 0);
    });

    // 2. Calcular datos locales a la página actual (rowspans y visibilidad)
    slice.forEach(c => {
      const groupKey = this.getGroupKey(c);
      conteoFilasPagina[groupKey] = (conteoFilasPagina[groupKey] || 0) + 1;
      if ((parseInt(c.total_comprobantes, 10) || 0) > 0) {
        grupoTieneComprobantesPagina[groupKey] = true;
      }
    });

    this.listaVista = slice.map(c => {
      const groupKey = this.getGroupKey(c);
      const isFirst = groupKey !== lastKey;
      lastKey = groupKey;
      const esPendiente = !!this.pendientesPorGrupo[groupKey] && !!grupoTieneComprobantesPagina[groupKey];
      return {
        ...c,
        isFirstOfPageGroup: isFirst,
        pageGroupRows: isFirst ? conteoFilasPagina[groupKey] : 0,
        pageGroupMonto: isFirst ? conteoSumaGlobal[groupKey] : 0,
        grupoPendiente: esPendiente
      };
    });
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.procesarVista();
    }
  }

  private COLORES_GRUPO = [
    '#bbdefb', '#c8e6c9', '#fff9c4', '#f8bbd0', '#e1bee7',
    '#b2ebf2', '#f0f4c3', '#d1c4e9', '#ffccbc', '#b2dfdb'
  ];

  cambiarVista(vista: 'activas' | 'inactivas') {
    this.vistaActual = vista;
    this.selecciones.clear();
    this.paginaActual = 1;
    this.cargarCobranzas();
  }

  pasarAInactivos() {
    const idsCob = Array.from(this.selecciones);
    if (idsCob.length === 0) return;

    const clientesIds = idsCob.map(idCob => {
      const c = this.cobranzasActivas.find(x => x.id_cobranza === idCob);
      return c ? c.id_cliente : null;
    }).filter(id => id !== null);

    const uniqueClientes = [...new Set(clientesIds)] as number[];

    if (!confirm(`¿Estás seguro de pasar ${uniqueClientes.length} cliente(s) a INACTIVOS? (Desaparecerán de Cobranzas Activas y Subir Órdenes)`)) return;

    this.clientesService.inactivarClientesMasivo(uniqueClientes).subscribe({
      next: (res: any) => {
        alert(res.mensaje);
        this.selecciones.clear();
        this.cargarCobranzas();
      },
      error: (err: any) => alert("Error: " + (err.error?.error || err.message))
    });
  }

  pasarAActivos() {
    const idsCob = Array.from(this.selecciones);
    if (idsCob.length === 0) return;

    const clientesIds = idsCob.map(idCob => {
      const c = this.cobranzasActivas.find(x => x.id_cobranza === idCob);
      return c ? c.id_cliente : null;
    }).filter(id => id !== null);

    const uniqueClientes = [...new Set(clientesIds)] as number[];

    if (!confirm(`¿Estás seguro de restaurar ${uniqueClientes.length} cliente(s) a ACTIVOS? (Volverán a aparecer en Cobranzas Activas)`)) return;

    // We can reuse the mass edit to set 'activo'
    // I need to add a method in ClientesService or just make a POST loop
    // But since I only created inactivarClientesMasivo, I should add reactivarClientesMasivo to backend too, or just use a loop
    // Let's just use the single endpoint in a loop since it's just a few usually
    Promise.all(uniqueClientes.map(id => this.clientesService.restaurarCliente(id).toPromise()))
      .then(() => {
        alert("Clientes restaurados a activos.");
        this.selecciones.clear();
        this.cargarCobranzas();
      })
      .catch(err => alert("Error al restaurar: " + err));
  }

  cargarCobranzas() {
    const request = this.vistaActual === 'activas'
      ? this.operacionesService.obtenerCobranzasActivas()
      : this.operacionesService.obtenerCobranzasInactivas();

    request.subscribe({
      next: (data) => {
        const grupos: { [key: string]: any[] } = {};
        data.forEach(item => {
          const key = this.getGroupKey(item);
          if (!grupos[key]) grupos[key] = [];
          grupos[key].push(item);
        });

        const keysOrdenadas = Object.keys(grupos).sort((a, b) => {
          const maxA = Math.max(...grupos[a].map(x => x.id_cobranza));
          const maxB = Math.max(...grupos[b].map(x => x.id_cobranza));
          return maxB - maxA;
        });

        const listaFinal: any[] = [];
        // Reconstruir pendientesPorGrupo basado en los datos que vienen del servidor
        this.pendientesPorGrupo = {};
        keysOrdenadas.forEach(key => {
          grupos[key].sort((a: any, b: any) => b.id_cobranza - a.id_cobranza);
          let algunPendiente = false;
          grupos[key].forEach(c => {
            if (!c.total_comprobantes || parseInt(c.total_comprobantes, 10) === 0) {
              c.monto_total = 0;
            }
            if (c.pendiente === 1) {
              algunPendiente = true;
            }
          });

          this.pendientesPorGrupo[key] = algunPendiente;
          listaFinal.push(...grupos[key]);
        });

        this.cobranzasActivas = listaFinal;
        this.asignarColoresPorGrupo();
        this.paginaActual = 1;
        this.procesarVista();
      },
      error: (err) => console.error("Error al cargar cobranzas:", err)
    });
  }

  asignarColoresPorGrupo() {
    const conteo: { [key: string]: number } = {};
    this.cobranzasActivas.forEach(c => {
      const groupKey = this.getGroupKey(c);
      conteo[groupKey] = (conteo[groupKey] || 0) + 1;
    });

    const mapaIdx: { [key: string]: number } = {};
    let colorIdx = 0;

    this.cobranzasActivas.forEach(c => {
      const groupKey = this.getGroupKey(c);
      if (conteo[groupKey] >= 2) {
        if (mapaIdx[groupKey] === undefined) {
          mapaIdx[groupKey] = colorIdx % 10;
          colorIdx++;
        }
        c.colorClass = `group-color-${mapaIdx[groupKey]}`;
      } else {
        c.colorClass = '';
      }
    });
  }

  actualizarComprobantes(cobranza: any) {
    const numComp = parseInt(cobranza.total_comprobantes) || 0;
    let monto = 0;
    if (numComp > 0) {
      monto = 55.00;
      if (numComp > 500) monto += (numComp - 500) * 0.025;
    }
    monto = Math.round(monto);
    cobranza.monto_total = monto;
    // Quitar pendiente del grupo si se editan comprobantes
    const groupKey = this.getGroupKey(cobranza);
    this.pendientesPorGrupo[groupKey] = false;
    this.asignarColoresPorGrupo();
    this.procesarVista();
    this.operacionesService.actualizarComprobantesCobranza(cobranza.id_cobranza, numComp).subscribe({
      next: () => { },
      error: (err: any) => console.error('Error al actualizar:', err)
    });
  }

  marcarMenos500(cobranza: any) {
    cobranza.total_comprobantes = 499;
    cobranza.monto_total = 55.00;
    const groupKey = this.getGroupKey(cobranza);
    this.pendientesPorGrupo[groupKey] = false;
    this.asignarColoresPorGrupo();
    this.procesarVista();
    this.operacionesService.actualizarComprobantesCobranza(cobranza.id_cobranza, 499).subscribe({
      next: () => { },
      error: (err: any) => console.error('Error al asignar <500:', err)
    });
  }

  // Marcar todo el grupo como pendiente y notificar (desde el modal)
  marcarGrupoPendienteConNotificar() {
    const conComprobantes = this.itemsGrupo.filter(i => (parseInt(i.total_comprobantes) || 0) > 0);
    if (conComprobantes.length === 0) {
      alert('Primero ingrese comprobantes a al menos un cliente del grupo.');
      return;
    }
    const ids = conComprobantes.map(c => c.id_cobranza);
    this.operacionesService.notificarCobranzas(ids).subscribe({
      next: (res: any) => {
        alert(res.mensaje);
        // Marcar todo el grupo como pendiente
        const groupKey = this.getGroupKey(conComprobantes[0]);
        this.pendientesPorGrupo[groupKey] = true;
        this.procesarVista();
      },
      error: (err: any) => alert("Error notificando: " + (err.error?.error || err.message))
    });
  }

  // Notificar a TODOS los grupos del dashboard
  notificarTodosDashboard() {
    const gruposYaNotificados = new Set<string>();
    const todosParaNotificar: any[] = [];

    this.cobranzasActivas.forEach(c => {
      const groupKey = this.getGroupKey(c);
      if (this.pendientesPorGrupo[groupKey]) return; // ya notificado
      if ((parseInt(c.total_comprobantes) || 0) > 0) {
        if (!gruposYaNotificados.has(groupKey)) {
          gruposYaNotificados.add(groupKey);
        }
        todosParaNotificar.push(c);
      }
    });

    if (todosParaNotificar.length === 0) {
      alert('No hay clientes con comprobantes pendientes de notificar en este momento.');
      return;
    }
    if (!confirm(`¿Estás seguro de que deseas notificar a ${gruposYaNotificados.size} grupo(s) con ${todosParaNotificar.length} cobranza(s)?`)) return;

    const ids = todosParaNotificar.map(c => c.id_cobranza);
    this.operacionesService.notificarCobranzas(ids).subscribe({
      next: (res: any) => {
        alert(res.mensaje);
        gruposYaNotificados.forEach(gk => this.pendientesPorGrupo[gk] = true);
        this.procesarVista();
      },
      error: (err: any) => alert("Error en notificación masiva: " + (err.error?.error || err.message))
    });
  }

  // Avisar de retraso a clientes seleccionados
  notificarRetrasoSeleccionados() {
    const ids = Array.from(this.selecciones);
    if (ids.length === 0) return;

    if (!confirm(`¿Estás seguro de enviar el aviso de retraso de pago a ${ids.length} clientes seleccionados?`)) return;

    this.operacionesService.notificarRetraso(ids).subscribe({
      next: (res: any) => {
        alert(res.mensaje);
        this.selecciones.clear();
      },
      error: (err: any) => alert("Error al notificar retraso: " + (err.error?.error || err.message))
    });
  }

  notificarSuspensionSeleccionados() {
    const ids = Array.from(this.selecciones);
    if (ids.length === 0) return;

    if (!confirm(`¿Estás seguro de enviar el aviso de suspensión de servicio a ${ids.length} clientes seleccionados?`)) return;

    this.operacionesService.notificarSuspension(ids).subscribe({
      next: (res: any) => {
        alert(res.mensaje);
        this.selecciones.clear();
      },
      error: (err: any) => alert("Error al notificar suspensión: " + (err.error?.error || err.message))
    });
  }

  // Getters para el modal
  get grupoYaPendiente(): boolean {
    if (this.itemsGrupo.length === 0) return false;
    const groupKey = this.getGroupKey(this.itemsGrupo[0]);
    return !!this.pendientesPorGrupo[groupKey];
  }

  get hayComprobantesEnGrupo(): boolean {
    return this.itemsGrupo.some(i => (parseInt(i.total_comprobantes) || 0) > 0);
  }

  get sumaGrupoModal(): number {
    return this.itemsGrupo.reduce((sum, i) => sum + (parseFloat(i.monto_total) || 0), 0);
  }

  eliminarCobranza(id_cobranza: number) {
    if (confirm("¿Estás seguro de que deseas descartar esta cobranza?")) {
      this.operacionesService.eliminarCobranzaActiva(id_cobranza).subscribe({
        next: () => this.cargarCobranzas(),
        error: (err: any) => { console.error("Error al eliminar cobranza", err); alert("Hubo un error al eliminar la cobranza."); }
      });
    }
  }

  selecciones: Set<number> = new Set();

  alternarSeleccion(id: number) {
    if (this.selecciones.has(id)) this.selecciones.delete(id);
    else this.selecciones.add(id);
  }

  // Marcar una cobranza individual como pagada
  marcarComoPagado(id: number) {
    const metodo = prompt("Ingrese el método de pago (ej: Yape, Plin, Efectivo, Transferencia):", "Yape");
    if (!metodo) return;

    this.operacionesService.marcarComoPagado(id, metodo).subscribe({
      next: () => {
        this.cargarCobranzas();
      },
      error: (err: any) => alert("Error al marcar pago: " + (err.error?.error || err.message))
    });
  }

  // Marcar todo el grupo del modal como pagado
  marcarGrupoComoPagado() {
    if (!confirm("¿Está seguro de marcar TODO el grupo como pagado? Se enviará una única confirmación de agradecimiento.")) return;

    const metodo = prompt("Ingrese el método de pago para el grupo:", "Yape");
    if (!metodo) return;

    const ids = this.itemsGrupo.map(i => i.id_cobranza);
    this.operacionesService.marcarPagoMasivo(ids, metodo).subscribe({
      next: (res: any) => {
        alert(res.mensaje);
        this.cerrarModal();
        this.cargarCobranzas();
      },
      error: (err: any) => alert("Error: " + (err.error?.error || err.message))
    });
  }

  seleccionarTodos(event: any) {
    const checked = event.target.checked;
    if (checked) {
      this.cobranzasFiltradas.forEach(c => this.selecciones.add(c.id_cobranza));
    } else {
      this.selecciones.clear();
    }
  }

  estaSeleccionado(id: number): boolean {
    return this.selecciones.has(id);
  }

  descartarSeleccionados() {
    const ids = Array.from(this.selecciones);
    if (ids.length === 0) return;

    if (confirm(`¿Estás seguro de que deseas descartar ${ids.length} cobranzas?`)) {
      this.operacionesService.eliminarMasivo(ids).subscribe({
        next: (res: any) => {
          alert(res.mensaje);
          this.selecciones.clear();
          this.cargarCobranzas();
        },
        error: (err: any) => alert("Error al eliminar masivamente: " + (err.error?.error || err.message))
      });
    }
  }

  marcarSeleccionadosComoPagados() {
    const ids = Array.from(this.selecciones);
    if (ids.length === 0) return;

    if (!confirm(`¿Estás seguro de marcar las ${ids.length} cobranzas seleccionadas como pagadas? Se notificará por WhatsApp a los clientes.`)) return;

    const metodo = prompt("Ingrese el método de pago para las cobranzas seleccionadas:", "Yape");
    if (!metodo) return;

    this.operacionesService.marcarPagoMasivo(ids, metodo).subscribe({
      next: (res: any) => {
        alert(res.mensaje);
        this.selecciones.clear();
        this.cargarCobranzas();
      },
      error: (err: any) => alert("Error al marcar como pagados: " + (err.error?.error || err.message))
    });
  }

  mostrarModal = false;
  itemsGrupo: any[] = [];
  idGrupoEdicion = '';

  abrirModalEdicionGrupo(cobranza: any) {
    const groupKey = this.getGroupKey(cobranza);
    this.idGrupoEdicion = cobranza.telefonos || 'Individual';
    this.itemsGrupo = this.cobranzasActivas.filter(c => this.getGroupKey(c) === groupKey);
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.itemsGrupo = [];
  }

  marcarComoPagadoManual(id: number) {
    const metodo = confirm("¿Deseas marcar como pagado vía YAPE / PLIN?") ? 'Yape / Plin' : prompt("Ingrese otro método de pago (Efectivo, etc.):", "Efectivo");
    if (!metodo) return;

    this.operacionesService.marcarComoPagado(id, metodo).subscribe({
      next: (res: any) => {
        alert(res.mensaje);
        this.cobranzasActivas = this.cobranzasActivas.filter(c => c.id_cobranza !== id);
        this.itemsGrupo = this.itemsGrupo.filter(c => c.id_cobranza !== id);
        if (this.itemsGrupo.length === 0) this.cerrarModal();
        this.asignarColoresPorGrupo();
        this.procesarVista();
      },
      error: (err: any) => alert("Error al registrar pago manual: " + (err.error?.error || err.message))
    });
  }

  soloGuardar() {
    this.cerrarModal();
  }

  copiarAlPortapapeles(texto: string) {
    if (!texto) return;
    // Solo tomamos el primer RUC si hay varios (separados por /)
    const rucLimpio = texto.toString().split('/')[0].trim();
    navigator.clipboard.writeText(rucLimpio).then(() => {
      // Éxito
    }).catch(err => {
      console.error('Error al copiar al portapapeles:', err);
    });
  }
}
