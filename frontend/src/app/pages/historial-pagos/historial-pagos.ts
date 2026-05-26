import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OperacionesService } from '../../services/operaciones.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
    selector: 'app-historial-pagos',
    standalone: true,
    templateUrl: './historial-pagos.html',
    imports: [CommonModule, FormsModule],
    styleUrl: './historial-pagos.css',
})
export class HistorialPagosComponent implements OnInit {
    mostrarPapeleraActual: boolean = false;
    historialPagos: any[] = [];
    basureroActual: any[] = [];
    lotesArchivados: any[] = [];
    loteActivoId: number | null = null;
    historialCompletoDetallado: any[] = [];
    reportesSeleccionados: number[] = [];
    todosSeleccionados: boolean = false;
    terminoBusquedaHistorial: string = '';
    cargando: boolean = true;
    error: string = '';
    get totalMontoPagado(): number {
        return this.historialFiltrado.reduce((acc, p) => acc + (parseFloat(p.monto_pagado) || 0), 0);
    }
    constructor(private operacionesService: OperacionesService) { }
    ngOnInit(): void {
        this.obtenerHistorial();
    }
    get historialFiltrado(): any[] {
        let fuente = [];
        if (this.loteActivoId === null) {
            fuente = this.historialPagos;
        } else {
            fuente = this.historialCompletoDetallado
                .filter(h => h.id_periodo === this.loteActivoId)
                .map(h => ({
                    id_cobranza: h.I009ID_DETALLE,
                    nombre_cliente: h.V009NOMBRE_CLIENTE,
                    ruc: h.V009RUC,
                    telefono: h.V009CELULAR,
                    monto_pagado: h.D009MONTO,
                    metodo: h.V009METODO,
                    fecha_pago: h.F009FECHA_PAGO,
                    operador: h.V009OPERADOR,
                    periodo: h.V009PERIODO,
                    total_comprobantes: h.I009CANTIDAD_DOCS,
                    estado_cliente: 'activo'
                }));
        }

        if (!this.terminoBusquedaHistorial) return fuente;
        const termino = this.terminoBusquedaHistorial.toLowerCase().trim();
        return fuente.filter((pago: any) => {
            const nombreMatches = (pago.nombre_cliente || '').toLowerCase().includes(termino);
            const rucMatches = (pago.ruc || '').toLowerCase().includes(termino);
            const periodoMatches = (pago.periodo || '').toLowerCase().includes(termino);
            return nombreMatches || rucMatches || periodoMatches;
        });
    }

    agruparYCalcularSuma(lista: any[]): any[] {
        if (!lista || lista.length === 0) return [];
        const norm = (t: string) => (t || '').toString().trim().replace(/\D/g, '');
        const grupos: { [key: string]: any[] } = {};
        
        lista.forEach(item => {
            const telNorm = norm(item.telefono || item.telefonos);
            const id = item.id_cobranza || item.I009ID_DETALLE || 0;
            const key = telNorm && telNorm.length >= 7 ? telNorm : `indiv_${id}`;
            if (!grupos[key]) grupos[key] = [];
            grupos[key].push(item);
        });

        const keysOrdenadas = Object.keys(grupos).sort((a, b) => {
            const maxA = Math.max(...grupos[a].map(x => parseInt(x.id_cobranza || x.I009ID_DETALLE) || 0));
            const maxB = Math.max(...grupos[b].map(x => parseInt(x.id_cobranza || x.I009ID_DETALLE) || 0));
            return maxB - maxA;
        });

        const listaFinal: any[] = [];
        let colorIdx = 0;
        
        keysOrdenadas.forEach(key => {
            const grupoItems = grupos[key];
            grupoItems.sort((a, b) => (parseInt(b.id_cobranza || b.I009ID_DETALLE) || 0) - (parseInt(a.id_cobranza || a.I009ID_DETALLE) || 0));
            
            const numFilas = grupoItems.length;
            const sumaMonto = grupoItems.reduce((acc, curr) => acc + (parseFloat(curr.monto_pagado || curr.monto_total || 0)), 0);
            
            let colorClase = '';
            if (numFilas > 1) {
                colorClase = `group-color-${colorIdx % 10}`;
                colorIdx++;
            }

            grupoItems.forEach((c, index) => {
                listaFinal.push({
                    ...c,
                    isFirstOfGroup: index === 0,
                    groupRows: index === 0 ? numFilas : 0,
                    groupMonto: index === 0 ? sumaMonto : 0,
                    colorClass: colorClase
                });
            });
        });
        return listaFinal;
    }

    get historialFinal(): any[] {
        return this.agruparYCalcularSuma(this.historialFiltrado);
    }

    get cantidadBasureroActivo(): number {
        if (this.loteActivoId !== null) {
            return this.basureroActual.filter(b => b.id_periodo === this.loteActivoId).length;
        }
        return this.basureroActual.length;
    }

    get basureroAgrupado(): any[] {
        let fuente = this.basureroActual;
        if (this.loteActivoId !== null) {
            fuente = this.basureroActual.filter(b => b.id_periodo === this.loteActivoId);
        } else {
            // Si es mes actual, podríamos querer no mostrar archivados... pero el botón solo sale si hay lote activo
            fuente = this.basureroActual;
        }
        return this.agruparYCalcularSuma(fuente);
    }
    obtenerHistorial() {
        this.cargando = true;
        this.error = '';
        // 1. Obtener Mes Actual
        this.operacionesService.obtenerHistorialPagos().subscribe({
            next: (data: any) => {
                this.historialPagos = data;
                this.cargando = false;
            },
            error: (err: any) => {
                console.error('Error al obtener el historial:', err);
                this.error = 'No se pudo cargar el historial.';
                this.cargando = false;
            }
        });
        // 2. Obtener Lotes (Tabs)
        this.operacionesService.obtenerLotesArchivados().subscribe({
            next: (data: any) => { this.lotesArchivados = data; },
            error: (err: any) => console.error('Error al cargar lotes:', err)
        });

        // 3. Obtener Detalle Histórico (para ver lotes pasados)
        this.operacionesService.obtenerBasureroDetallado().subscribe({
            next: (data: any) => { this.historialCompletoDetallado = data; },
            error: (err: any) => console.error('Error al cargar detalle histórico:', err)
        });

        this.operacionesService.obtenerBasureroActual().subscribe({
            next: (data: any) => { this.basureroActual = data; },
            error: (err: any) => console.error('Error al cargar papelera:', err)
        });
    }
    seleccionarTab(id: number | null) {
        this.loteActivoId = id;
        this.terminoBusquedaHistorial = '';
    }
    obtenerNombreLoteActivo(): string {
        if (this.loteActivoId === null) return 'Mes Actual';
        const lote = this.lotesArchivados.find(l => l.id_periodo === this.loteActivoId);
        return lote ? (lote.periodo || 'Reporte') : 'Reporte';
    }
    vaciarHistorialMes() {
        if (confirm("¿Estás seguro de que deseas enviar TODO el historial del mes actual a la papelera?")) {
            this.operacionesService.vaciarHistorial().subscribe({
                next: (res: any) => {
                    alert(res.mensaje);
                    this.obtenerHistorial();
                },
                error: (err: any) => alert("Error al vaciar: " + err.message)
            });
        }
    }
    archivarMesActual() {
        if (confirm('¿Deseas archivar y cerrar el periodo actual? Las cobranzas se moverán a una nueva pestaña y el dashboard quedará vacío (mes nuevo).')) {
            const idUsuario = parseInt(localStorage.getItem('idUsuario') || '1');
            const idPeriodo = 0; // Usar el actual por defecto en el backend
            this.operacionesService.archivarHistorial(idUsuario, idPeriodo).subscribe({
                next: (res: any) => {
                    alert(res.mensaje);
                    this.loteActivoId = null;
                    this.obtenerHistorial();
                },
                error: (err: any) => alert('Error al archivar: ' + (err.error?.mensaje || err.message))
            });
        }
    }

    enviarArchivoAPapelera() {
        if (!this.loteActivoId) return;
        const nombreLote = this.obtenerNombreLoteActivo();
        if (confirm(`¿Enviar todos los registros del cierre "${nombreLote}" a la papelera? Podrás restaurarlos después.`)) {
            this.operacionesService.enviarLoteAPapelera(this.loteActivoId).subscribe({
                next: (res: any) => {
                    alert(res.mensaje);
                    this.loteActivoId = null;
                    this.obtenerHistorial();
                },
                error: (err: any) => alert('Error: ' + (err.error?.mensaje || err.message))
            });
        }
    }

    restaurar(id: number) {
        this.operacionesService.restaurarCobranza(id).subscribe({
            next: (res: any) => { alert(res.mensaje); this.obtenerHistorial(); },
            error: () => alert('Error al restaurar cobranza')
        });
    }

    eliminarRegistro(id: number) {
        if (confirm('¿Estás seguro de eliminar este registro permanentemente?')) {
            this.operacionesService.eliminarRegistroHistorial(id).subscribe({
                next: (res: any) => { alert(res.mensaje); this.obtenerHistorial(); },
                error: () => alert('Error al eliminar el registro')
            });
        }
    }

    eliminarLote(id: number) {
        if (confirm('¿Deseas eliminar este REPORTE completo y todo su detalle histórico? Esta acción es irreversible.')) {
            this.operacionesService.eliminarLote(id).subscribe({
                next: (res: any) => { alert(res.mensaje); this.obtenerHistorial(); },
                error: (err: any) => alert('Error al eliminar lote: ' + err.error?.mensaje)
            });
        }
    }

    toggleSeleccionReporte(id: number) {
        const idx = this.reportesSeleccionados.indexOf(id);
        if (idx > -1) this.reportesSeleccionados.splice(idx, 1);
        else this.reportesSeleccionados.push(id);
        this.todosSeleccionados = this.reportesSeleccionados.length === this.lotesArchivados.length;
    }

    toggleSeleccionTodos(checked: boolean) {
        this.todosSeleccionados = checked;
        if (checked) {
            this.reportesSeleccionados = this.lotesArchivados.map(l => l.id_reporte);
        } else {
            this.reportesSeleccionados = [];
        }
    }

    eliminarReportesMasivos() {
        if (this.reportesSeleccionados.length === 0) return;
        if (confirm(`¿Estás seguro de eliminar los ${this.reportesSeleccionados.length} reportes seleccionados para siempre?`)) {
            this.operacionesService.eliminarLotesMasivos(this.reportesSeleccionados).subscribe({
                next: (res: any) => {
                    alert(res.mensaje);
                    this.reportesSeleccionados = [];
                    this.obtenerHistorial();
                },
                error: (err: any) => alert('Error al eliminar reportes')
            });
        }
    }
    eliminarRegistroDetallado(idDetalle: number) {
        if (confirm('¿Eliminar este registro específico del archivo histórico?')) {
            alert('Funcionalidad de borrado granular histórico en desarrollo. Por ahora borra el reporte completo.');
        }
    }

    vaciarHistorial() {
        if (confirm('¿Deseas vaciar DEFINITIVAMENTE todo el historial de pagos? Esta acción no se puede deshacer.')) {
            this.operacionesService.limpiarHistorialCompleto().subscribe({
                next: (res: any) => { alert(res.mensaje); this.obtenerHistorial(); },
                error: (err: any) => alert('Error al vaciar historial')
            });
        }
    }

    generarPDF() {
        const doc = new jsPDF({ orientation: 'landscape' });
        doc.setFontSize(14);
        doc.text('Historial de Pagos Confirmados', 14, 15);
        doc.setFontSize(10);
        doc.text(`Generado: ${new Date().toLocaleString('es-PE')}`, 14, 22);
        doc.text(`Total Recaudado: S/ ${this.totalMontoPagado.toFixed(0)}`, 14, 28);

        autoTable(doc, {
            startY: 33,
            head: [['N°', 'Cliente', 'RUC(s)', 'Telf.', 'Docs', 'Monto', 'Método', 'Fecha Pago', 'Operador']],
            body: this.historialFiltrado.map((p, i) => [
                i + 1,
                p.nombre_cliente || '',
                p.ruc || '',
                p.telefono || '',
                p.total_comprobantes || 0,
                `S/ ${parseFloat(p.monto_pagado).toFixed(0)}`,
                p.metodo || '',
                p.fecha_pago ? new Date(p.fecha_pago).toLocaleDateString('es-PE') : '',
                p.operador || ''
            ]),
            styles: { fontSize: 8 },
            headStyles: { fillColor: [41, 128, 185] }
        });

        doc.save('historial_pagos.pdf');
    }

    seleccionadosPapelera: number[] = [];
    todosPapelera: boolean = false;

    toggleSeleccionPapelera(id: number) {
        if (this.seleccionadosPapelera.includes(id)) {
            this.seleccionadosPapelera = this.seleccionadosPapelera.filter(i => i !== id);
        } else {
            this.seleccionadosPapelera.push(id);
        }
        this.todosPapelera = this.seleccionadosPapelera.length === this.basureroActual.length && this.basureroActual.length > 0;
    }

    toggleTodosPapelera() {
        if (this.todosPapelera) {
            this.seleccionadosPapelera = [];
            this.todosPapelera = false;
        } else {
            this.seleccionadosPapelera = this.basureroActual.map(item => item.id_cobranza);
            this.todosPapelera = true;
        }
    }

    destruirSeleccionadosPapelera() {
        if (this.seleccionadosPapelera.length === 0) return;
        if (confirm(`¿Estás seguro de que deseas ELIMINAR PERMANENTEMENTE los ${this.seleccionadosPapelera.length} registros seleccionados? Esta acción no se puede deshacer.`)) {
            this.operacionesService.destruirCobranzasMasivo(this.seleccionadosPapelera).subscribe({
                next: (res: any) => {
                    alert(res.mensaje);
                    this.seleccionadosPapelera = [];
                    this.todosPapelera = false;
                    this.obtenerHistorial();
                },
                error: (err: any) => alert("Error al eliminar masivamente: " + err.message)
            });
        }
    }
}
