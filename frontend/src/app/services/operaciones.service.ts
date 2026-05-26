import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OperacionesService {
  private base = 'http://localhost:3000/api/cobranzas';

  constructor(private http: HttpClient) { }
  autocrearPeriodoActual() {
    return this.http.post('http://localhost:3000/api/periodos/autocreate', {});
  }
  listarClientesDirectorio(idPeriodo: number) {
    return this.http.get<any[]>(`${this.base}/directorio?id_periodo=${idPeriodo}`);
  }

  pasarTodosACobranzas(idPeriodo: number, idUsuario: number) {
    return this.http.post(`${this.base}/pasar-todos`, { id_periodo: idPeriodo, id_usuario: idUsuario });
  }
  pasarIndividualACobranza(idCliente: number, idPeriodo: number, idUsuario: number) {
    return this.http.post(`${this.base}/pasar-uno`, { id_cliente: idCliente, id_periodo: idPeriodo, id_usuario: idUsuario });
  }
  actualizarCliente(idCliente: number, datos: any) {
    return this.http.put(`http://localhost:3000/api/clientes/editar/${idCliente}`, datos);
  }
  obtenerVistaPrevia(datosBase: any[]) {
    return this.http.post(`${this.base}/previa-masivo`, datosBase);
  }
  guardarCobranzaEnDB(datosAgrupados: any) {
    return this.http.post(`${this.base}/masivo`, datosAgrupados);
  }
  obtenerCobranzasActivas() {
    return this.http.get<any[]>(`${this.base}/listar`);
  }
  obtenerCobranzasInactivas() {
    return this.http.get<any[]>(`${this.base}/listar-inactivas`);
  }
  eliminarCobranzaActiva(id: number) {
    return this.http.put(`${this.base}/eliminar/${id}`, {});
  }
  eliminarMasivo(ids: number[]) {
    return this.http.post(`${this.base}/eliminar-masivo`, { ids });
  }
  restaurarCobranza(id: number) {
    return this.http.put(`${this.base}/restaurar/${id}`, {});
  }
  actualizarComprobantesCobranza(idCobranza: number, comprobantes: number) {
    return this.http.put(`${this.base}/comprobantes/${idCobranza}`, { comprobantes });
  }
  marcarComoPagado(id: number, metodo: string) {
    return this.http.put(`${this.base}/pagar/${id}`, { metodo_pago: metodo });
  }
  marcarPagoMasivo(ids: number[], metodo: string) {
    return this.http.post(`${this.base}/marcar-masivo`, { ids, metodo });
  }
  obtenerHistorialPagos() {
    return this.http.get<any[]>(`${this.base}/historial`);
  }
  obtenerBasureroActual() {
    return this.http.get<any[]>(`${this.base}/basurero-actual`);
  }
  vaciarHistorial() {
    return this.http.post(`${this.base}/historial/vaciar`, {});
  }
  eliminarRegistroHistorial(id: number) {
    return this.http.delete(`${this.base}/historial/eliminar/${id}`);
  }
  limpiarHistorialCompleto() {
    return this.http.delete(`${this.base}/historial/limpiar`);
  }
  archivarHistorial(idUsuario: number, idPeriodo: number) {
    return this.http.post(`${this.base}/historial/archivar`, { id_usuario: idUsuario, id_periodo: idPeriodo });
  }
  obtenerLotesArchivados() {
    return this.http.get<any[]>(`${this.base}/lotes`);
  }
  obtenerBasureroDetallado() {
    return this.http.get<any[]>(`${this.base}/historial-basurero`);
  }
  eliminarLote(id: number) {
    return this.http.delete(`${this.base}/lotes/${id}`);
  }
  eliminarLotesMasivos(ids: number[]) {
    return this.http.post(`${this.base}/lotes/eliminar-masivo`, { ids_reportes: ids });
  }
  enviarLoteAPapelera(idPeriodo: number) {
    return this.http.post(`${this.base}/lotes/enviar-papelera`, { id_periodo: idPeriodo });
  }
  destruirCobranzasMasivo(ids: number[]) {
    return this.http.post(`${this.base}/destruir-masivo`, { ids });
  }
  notificarCobranzas(ids: number[]) {
    return this.http.post(`${this.base}/notificar`, { ids });
  }
  notificarRetraso(ids: number[]) {
    return this.http.post(`${this.base}/notificar-retraso`, { ids });
  }
  notificarSuspension(ids: number[]) {
    return this.http.post(`${this.base}/notificar-suspension`, { ids });
  }
  obtenerPeriodos() {
    return this.http.get<any[]>('http://localhost:3000/api/periodos/listar');
  }
  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') { inQuotes = !inQuotes; }
      else if ((char === ',' || char === ';') && !inQuotes) {
        result.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else { current += char; }
    }
    result.push(current.trim().replace(/^"|"$/g, ''));
    return result;
  }

  procesarArchivoCSV(contenidoCSV: string) {
    const lineas = contenidoCSV.split('\n').filter(l => l.trim());
    const resultados: any[] = [];
    for (let i = 1; i < lineas.length; i++) {
      const columnas = this.parseCSVLine(lineas[i]);
      if (columnas.length >= 2) {
        let ruc = (columnas[0] || '').replace(/["\s-]/g, '');
        if (!ruc || ruc.length < 8) {
          const matchRuc = (columnas[1] || '').match(/\b\d{8,11}\b/);
          if (matchRuc) ruc = matchRuc[0];
        }
        if (ruc && ruc.length >= 8) {
          resultados.push({ ruc, comprobantes: 0, descripcion: '' });
        }
      }
    }
    return resultados;
  }
}