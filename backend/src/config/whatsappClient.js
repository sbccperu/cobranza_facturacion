const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const path = require('path');
const fs = require('fs');
let clienteWsp = null;
let estadoConexion = 'desconectado';
let ultimoQR = null;

const SESSION_PATH = path.join(__dirname, '..', '..', '.wwebjs_auth');

function inicializarWhatsApp() {
    if (clienteWsp) return clienteWsp;
    console.log('📱 Inicializando cliente de WhatsApp...');
    clienteWsp = new Client({
        authStrategy: new LocalAuth({
            dataPath: SESSION_PATH
        }),
        puppeteer: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    });
    clienteWsp.on('qr', (qr) => {
        estadoConexion = 'esperando_qr';
        ultimoQR = qr;
        console.log('\n📲 ¡Escanea este QR con tu WhatsApp Business!\n');
        qrcode.generate(qr, { small: true });
    });
    clienteWsp.on('ready', () => {
        estadoConexion = 'conectado';
        ultimoQR = null;
        console.log('✅ WhatsApp conectado exitosamente!');
    });
    clienteWsp.on('authenticated', () => {
        console.log('🔐 WhatsApp autenticado correctamente.');
    });
    clienteWsp.on('auth_failure', async (msg) => {
        estadoConexion = 'desconectado';
        console.error('❌ Error de autenticación:', msg);
        await limpiarSesion();
    });
    clienteWsp.on('disconnected', async (reason) => {
        estadoConexion = 'desconectado';
        ultimoQR = null;
        console.log('🔌 WhatsApp desconectado:', reason);
        await limpiarSesion();
    });
    async function limpiarSesion() {
        if (clienteWsp) {
            try {
                await clienteWsp.destroy();
                console.log('🛑 Cliente de WhatsApp destruido.');
            } catch (e) {
                console.error('⚠️ Error al destruir cliente:', e.message);
            }
        }
        clienteWsp = null;
        try {
            if (fs.existsSync(SESSION_PATH)) {
                await new Promise(r => setTimeout(r, 1000));
                fs.rmSync(SESSION_PATH, { recursive: true, force: true });
                console.log('🧹 Sesión antigua eliminada para permitir reconexión.');
            }
        } catch (e) {
            console.error('⚠️ No se pudo limpiar la carpeta de sesión:', e.message);
        }
    }
    clienteWsp.initialize().catch(async (err) => {
        console.error('⚠️ Error crítico en Puppeteer:', err.message);
        await limpiarSesion();
    });

    return clienteWsp;
}
/**
 * Envía un mensaje de WhatsApp a un número.
 * @param {string} numero - Número con código de país (ej: 51955709951)
 * @param {string} mensaje - Texto del mensaje (soporta *bold* y _italic_)
 * @returns {Promise<{ok: boolean, error?: string}>}
 */
async function enviarMensaje(numero, mensaje) {
    if (estadoConexion !== 'conectado' || !clienteWsp) {
        return { ok: false, error: 'WhatsApp no está conectado. Escanea el QR primero.' };
    }
    try {
        // whatsapp-web.js usa el formato: número@c.us
        const chatId = `${numero}@c.us`;
        await clienteWsp.sendMessage(chatId, mensaje);
        console.log(`📨 Mensaje enviado a ${numero}`);
        return { ok: true };
    } catch (error) {
        console.error(`❌ Error enviando a ${numero}:`, error.message);
        return { ok: false, error: error.message };
    }
}
/**
 * Genera el mensaje según el formato de la empresa.
 * @param {object} grupo - { telefono, nombres, total_global, detalles_items, periodo }
 * @returns {string} Mensaje formateado
 */
function generarMensaje(grupo) {
    const totalRedondeado = Math.round(grupo.total_global);
    const esVarios = grupo.detalles_items.length > 1;

    if (!esVarios) {
        // CASO 1: UN SOLO RUC (Diseño Elegante)
        return [
            `*SBCC PERÚ - NOTIFICACIÓN* 📄`,
            ``,
            `Estimado cliente buenos días, el monto de su facturación electrónica es de *${totalRedondeado} soles*.`,
            ``,
            `⚠️ _Evite cortes de servicio y realice el pago a la brevedad posible._`,
            ``,
            `*Yape / Plin:*`,
            `👉 *994 908 135*`,
            ``,
            `Quedamos atentos a su confirmación de pago. ¡Gracias! 🙏`
        ].join('\n');
    } else {
        // CASO 2: VARIOS RUCS (Diseño de Estado de Cuenta Elegante)
        const lineasRucMonto = grupo.detalles_items.map(d => {
            const montoItem = Math.round(parseFloat(d.monto) || 0);
            return `🔹 *${d.ruc}*: S/ ${montoItem}`;
        });

        return [
            `*SBCC PERÚ - RESUMEN DE CONSUMO DE FACTURACIÓN ELECTRÓNICA* 📑`,
            ``,
            `Estimado cliente buenos días, el detalle de su facturación electrónica es:`,
            ``,
            ...lineasRucMonto,
            `━━━━━━━━━━━━━━`,
            `💰 *TOTAL A PAGAR: S/ ${totalRedondeado}*`,
            ``,
            `⚠️ _Evite cortes de servicio y realice el pago a la brevedad posible._`,
            ``,
            `*MÉTODOS DE PAGO:*`,
            `Yape / Plin: *994 908 135*`,
            ``,
            `Quedamos atentos a su confirmación. ¡Gracias! 🙏`
        ].join('\n');
    }
}
function obtenerEstado() {
    return {
        estado: estadoConexion,
        qr: ultimoQR
    };
}
function obtenerMesAnterior(periodoStr) {
    if (!periodoStr) return periodoStr;
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    return periodoStr.split(',').map(p => {
        let pTrim = p.trim();
        const parts = pTrim.split(/\s+/);
        let mesStr = parts[0];
        let year = parts.length > 1 ? parseInt(parts[1]) : null;

        const idx = meses.findIndex(m => m.toLowerCase() === mesStr.toLowerCase());
        if (idx === -1) return pTrim;

        let prevIdx = idx - 1;
        if (prevIdx < 0) {
            prevIdx = 11;
            if (year) year -= 1;
        }

        let res = meses[prevIdx];
        if (year) res += " " + year;
        return res;
    }).join(', ');
}

/**
 * Genera el mensaje de agradecimiento por el pago.
 * @param {object} info - { nombre, monto, metodo, periodo }
 * @returns {string} Mensaje formateado
 */
function generarMensajeAgradecimiento(info) {
    const totalRedondeado = Math.round(info.monto);
    const periodoAnterior = obtenerMesAnterior(info.periodo);
    return [
        `✅ *¡Gracias!*`,
        `Hemos recibido con éxito tu pago de *S/ ${totalRedondeado}* vía *${info.metodo}*.`,
        `Confirmamos que tu cobranza del periodo *${periodoAnterior}* ha sido cancelada correctamente.`,
        `Te saludamos de *SBCC Perú*. ¡Que tengas un excelente día! 🙌`
    ].join('\n');
}

function generarMensajeRetraso() {
    return [
        `Estimado cliente, hoy es el corte de servicio por favor ponerse al día con los pagos, gracias.`,
        `Saludos.`
    ].join('\n');
}

function generarMensajeSuspension() {
    return [
        `Estimado cliente, se le informa que su servicio ha sido suspendido. Por favor, regularice su pago a la brevedad posible.`,
        `Saludos.`
    ].join('\n');
}

module.exports = {
    inicializarWhatsApp,
    enviarMensaje,
    generarMensaje,
    generarMensajeAgradecimiento,
    generarMensajeRetraso,
    generarMensajeSuspension,
    obtenerEstado
};
