const db = require("../config/db");
const util = require('util');

const crearCobranza = (req, res) => {
    const { id_cliente, id_periodo, id_usuario, monto_total } = req.body;
    if (!id_cliente || !id_periodo || !id_usuario || !monto_total) {
        return res.status(400).json({ error: "El cliente, periodo, usuario y monto son necesarios" });
    };
    const query = "INSERT INTO tb006_cobranzas (I002ID_CLIENTE, I003ID_PERIODOS, I001ID_USUARIO, D006MONTO_TOTAL) VALUES (?, ?, ?, ?)";
    db.query(query, [id_cliente, id_periodo, id_usuario, monto_total], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({
            mensaje: "Exito al agregar cobranza",
            id_cobranza: results.insertId
        });
    });
};

const obtenerCobranza = (req, res) => {
    const query = `
        SELECT c.*, cli.V002NOMBRE_CLIENTE as nombre_cliente_base, cli.E002ESTADO_CLIENTE as estado_cliente,
               u.V001NOMBRE_USUARIO as nombre_operador,
               p.V003DESCRIPCION as nombre_periodo,
               (SELECT GROUP_CONCAT(DISTINCT t.V004NUMERO SEPARATOR ' / ')
                FROM tb004_telefonos t WHERE t.I002ID_CLIENTE = cli.I002ID_CLIENTE AND t.E004ESTADO_TELEFONO = 'activo') as telefonos,
               (SELECT GROUP_CONCAT(DISTINCT r.V005NUMERO_RUC SEPARATOR ' / ')
                FROM tb005_rucs r WHERE r.I002ID_CLIENTE = cli.I002ID_CLIENTE AND r.E005ESTADO_RUC = 'activo') as rucs,
               COALESCE(
                 (SELECT GROUP_CONCAT(DISTINCT r.V005RAZON_SOCIAL SEPARATOR ' / ')
                  FROM tb005_rucs r
                  WHERE r.I002ID_CLIENTE = cli.I002ID_CLIENTE
                    AND r.E005ESTADO_RUC = 'activo'
                    AND r.V005RAZON_SOCIAL NOT IN ('Desconocido', '')
                    AND r.V005RAZON_SOCIAL NOT LIKE '%DOCS EMITIDOS%'),
                 cli.V002NOMBRE_CLIENTE
               ) as nombres_rucs,
               (SELECT SUM(d.I007CANTIDAD_DOCUMENTOS) FROM tb007_detalle_cobranza d WHERE d.I006ID_COBRANZA = c.I006ID_COBRANZA) as total_comprobantes
        FROM tb006_cobranzas c
        INNER JOIN tb002_clientes cli ON c.I002ID_CLIENTE = cli.I002ID_CLIENTE
        LEFT JOIN tb001_usuarios u ON c.I001ID_USUARIO = u.I001ID_USUARIO
        LEFT JOIN tb003_periodos p ON c.I003ID_PERIODOS = p.I003ID_PERIODOS
        WHERE c.E006ESTADO_COBRANZA = 'activo' AND cli.E002ESTADO_CLIENTE = 'activo'
        ORDER BY c.I006ID_COBRANZA DESC
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        const cobranzaLimpieza = results.map(cobranza => {
            // Usar siempre nombres_rucs (ya filtrado), que cae a nombre_cliente_base si es basura
            const nombreFinal = cobranza.nombres_rucs || cobranza.nombre_cliente_base;
            return {
                id_cobranza: cobranza.I006ID_COBRANZA,
                id_cliente: cobranza.I002ID_CLIENTE,
                nombre_cliente: nombreFinal,
                estado_cliente: cobranza.estado_cliente,
                telefonos: cobranza.telefonos || 'Sin registrar',
                rucs: cobranza.rucs || 'Sin registrar',
                total_comprobantes: cobranza.total_comprobantes || 0,
                id_periodo: cobranza.I003ID_PERIODOS,
                nombre_periodo: cobranza.nombre_periodo || '',
                id_usuario: cobranza.I001ID_USUARIO,
                nombre_operador: cobranza.nombre_operador || 'Sin asignar',
                monto_total: cobranza.D006MONTO_TOTAL,
                fecha_pago: cobranza.F006FECHA_PAGO,
                estado_cobranza: cobranza.E006ESTADO_COBRANZA,
                metodo_pago: cobranza.V006METODO_PAGO,
                pendiente: cobranza.I006PENDIENTE || 0
            };
        });
        res.json(cobranzaLimpieza);
    });
};

const obtenerCobranzaInactiva = (req, res) => {
    const query = `
        SELECT c.*, cli.V002NOMBRE_CLIENTE as nombre_cliente_base, cli.E002ESTADO_CLIENTE as estado_cliente,
               u.V001NOMBRE_USUARIO as nombre_operador,
               p.V003DESCRIPCION as nombre_periodo,
               (SELECT GROUP_CONCAT(DISTINCT t.V004NUMERO SEPARATOR ' / ')
                FROM tb004_telefonos t WHERE t.I002ID_CLIENTE = cli.I002ID_CLIENTE AND t.E004ESTADO_TELEFONO = 'activo') as telefonos,
               (SELECT GROUP_CONCAT(DISTINCT r.V005NUMERO_RUC SEPARATOR ' / ')
                FROM tb005_rucs r WHERE r.I002ID_CLIENTE = cli.I002ID_CLIENTE AND r.E005ESTADO_RUC = 'activo') as rucs,
               COALESCE(
                 (SELECT GROUP_CONCAT(DISTINCT r.V005RAZON_SOCIAL SEPARATOR ' / ')
                  FROM tb005_rucs r
                  WHERE r.I002ID_CLIENTE = cli.I002ID_CLIENTE
                    AND r.E005ESTADO_RUC = 'activo'
                    AND r.V005RAZON_SOCIAL NOT IN ('Desconocido', '')
                    AND r.V005RAZON_SOCIAL NOT LIKE '%DOCS EMITIDOS%'),
                 cli.V002NOMBRE_CLIENTE
               ) as nombres_rucs,
               (SELECT SUM(d.I007CANTIDAD_DOCUMENTOS) FROM tb007_detalle_cobranza d WHERE d.I006ID_COBRANZA = c.I006ID_COBRANZA) as total_comprobantes
        FROM tb006_cobranzas c
        INNER JOIN tb002_clientes cli ON c.I002ID_CLIENTE = cli.I002ID_CLIENTE
        LEFT JOIN tb001_usuarios u ON c.I001ID_USUARIO = u.I001ID_USUARIO
        LEFT JOIN tb003_periodos p ON c.I003ID_PERIODOS = p.I003ID_PERIODOS
        WHERE c.E006ESTADO_COBRANZA = 'activo' AND cli.E002ESTADO_CLIENTE = 'inactivo'
        ORDER BY c.I006ID_COBRANZA DESC
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        const cobranzaLimpieza = results.map(cobranza => {
            const nombreFinal = cobranza.nombres_rucs || cobranza.nombre_cliente_base;
            return {
                id_cobranza: cobranza.I006ID_COBRANZA,
                id_cliente: cobranza.I002ID_CLIENTE,
                nombre_cliente: nombreFinal,
                estado_cliente: cobranza.estado_cliente,
                telefonos: cobranza.telefonos || 'Sin registrar',
                rucs: cobranza.rucs || 'Sin registrar',
                total_comprobantes: cobranza.total_comprobantes || 0,
                id_periodo: cobranza.I003ID_PERIODOS,
                nombre_periodo: cobranza.nombre_periodo || '',
                id_usuario: cobranza.I001ID_USUARIO,
                nombre_operador: cobranza.nombre_operador || 'Sin asignar',
                monto_total: cobranza.D006MONTO_TOTAL,
                fecha_pago: cobranza.F006FECHA_PAGO,
                estado_cobranza: cobranza.E006ESTADO_COBRANZA,
                metodo_pago: cobranza.V006METODO_PAGO,
                pendiente: cobranza.I006PENDIENTE || 0
            };
        });
        res.json(cobranzaLimpieza);
    });
};

const marcarComoPagado = async (req, res) => {
    const { id_cobranza } = req.params;
    const { metodo_pago } = req.body;
    if (!metodo_pago) {
        return res.status(400).json({ error: "Falta el método de pago (Yape, Plin)" });
    }
    const queryAsync = util.promisify(db.query).bind(db);
    const { enviarMensaje, generarMensajeAgradecimiento, obtenerEstado } = require('../config/whatsappClient');
    try {
        // 1. Obtener info de la cobranza ANTES de marcar como inactiva, osea, evita que el Bot lo registra antes
        const sqlInfo = `
            SELECT c.D006MONTO_TOTAL as monto, cli.V002NOMBRE_CLIENTE as nombre, cli.I002ID_CLIENTE,
                   COALESCE(p.V003DESCRIPCION, 'actual') as periodo,
                   (SELECT GROUP_CONCAT(DISTINCT t.V004NUMERO SEPARATOR ' / ') FROM tb004_telefonos t WHERE t.I002ID_CLIENTE = cli.I002ID_CLIENTE AND t.E004ESTADO_TELEFONO = 'activo') as telefono
            FROM tb006_cobranzas c
            INNER JOIN tb002_clientes cli ON c.I002ID_CLIENTE = cli.I002ID_CLIENTE
            LEFT JOIN tb003_periodos p ON c.I003ID_PERIODOS = p.I003ID_PERIODOS
            WHERE c.I006ID_COBRANZA = ?
        `;
        const resultsInfo = await queryAsync(sqlInfo, [id_cobranza]);
        // 2. Ejecutar la actualización a PAGADO usando la hora local del servidor
        const fechaPeru = new Date();
        const updateSql = `
            UPDATE tb006_cobranzas 
            SET F006FECHA_PAGO = ?, E006ESTADO_COBRANZA = 'inactivo', V006METODO_PAGO = ?, I006PENDIENTE = 0
            WHERE I006ID_COBRANZA = ? AND E006ESTADO_COBRANZA = 'activo'
        `;
        const updateRes = await queryAsync(updateSql, [fechaPeru, metodo_pago, id_cobranza]);

        if (updateRes.affectedRows === 0) {
            return res.status(400).json({ mensaje: "No se pudo marcar pago; verifique si ya existe o el ID." });
        }

        const data = resultsInfo[0];

        // Reactivar cliente en caso estuviera inactivo
        if (data && data.I002ID_CLIENTE) {
            await queryAsync("UPDATE tb002_clientes SET E002ESTADO_CLIENTE = 'activo' WHERE I002ID_CLIENTE = ?", [data.I002ID_CLIENTE]);
        }

        // 3. Si hay info de contacto y el bot está listo, enviar mensaje de agradecimiento
        const estadoWsp = obtenerEstado();

        if (data && data.telefono && estadoWsp.estado === 'conectado') {
            // Normalización simple para el bot (mismo código que notificarCobranza)
            const telStr = data.telefono.split(/[\/,]/)[0].trim().replace(/\D/g, '');
            if (telStr.length >= 9) {
                let telFinal = telStr.length >= 11 && telStr.startsWith('51') ? telStr : '51' + telStr.substring(0, 9);

                const mensajeAgradecimiento = generarMensajeAgradecimiento({
                    nombre: data.nombre,
                    monto: data.monto,
                    metodo: metodo_pago,
                    periodo: data.periodo
                });

                await enviarMensaje(telFinal, mensajeAgradecimiento);
            }
        }

        res.json({
            mensaje: `La cobranza ha sido marcada como pagada vía ${metodo_pago}`,
            id_cobranza: id_cobranza
        });

    } catch (error) {
        console.error("Error en marcarComoPagado:", error);
        res.status(500).json({ error: error.message });
    }
};

const marcarMasivoComoPagado = async (req, res) => {
    const { ids, metodo } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: "IDs no válidos" });

    const queryAsync = util.promisify(db.query).bind(db);
    try {
        const wsp = require('../config/whatsappClient');

        // 1. Obtener info de TODOS los clientes a marcar (antes de actualizar para saber sus periodos, nombres, telefonos y montos)
        const sqlInfo = `
            SELECT c.I006ID_COBRANZA, c.D006MONTO_TOTAL as monto, cli.V002NOMBRE_CLIENTE as nombre, cli.I002ID_CLIENTE,
                   COALESCE(p.V003DESCRIPCION, 'actual') as periodo,
                   (SELECT GROUP_CONCAT(DISTINCT t.V004NUMERO SEPARATOR ' / ') FROM tb004_telefonos t WHERE t.I002ID_CLIENTE = cli.I002ID_CLIENTE AND t.E004ESTADO_TELEFONO = 'activo') as telefono
            FROM tb006_cobranzas c
            INNER JOIN tb002_clientes cli ON c.I002ID_CLIENTE = cli.I002ID_CLIENTE
            LEFT JOIN tb003_periodos p ON c.I003ID_PERIODOS = p.I003ID_PERIODOS
            WHERE c.I006ID_COBRANZA IN (?)
        `;
        const resultsInfo = await queryAsync(sqlInfo, [ids]);

        const fechaPeru = new Date();

        // 2. Marcar todos como pagados usando la fecha local
        await queryAsync(`
            UPDATE tb006_cobranzas 
            SET E006ESTADO_COBRANZA = 'inactivo', F006FECHA_PAGO = ?, V006METODO_PAGO = ?, I006PENDIENTE = 0
            WHERE I006ID_COBRANZA IN (?)
        `, [fechaPeru, metodo, ids]);

        // Reactivar clientes
        const clientIds = [...new Set(resultsInfo.map(c => c.I002ID_CLIENTE).filter(Boolean))];
        if (clientIds.length > 0) {
            await queryAsync("UPDATE tb002_clientes SET E002ESTADO_CLIENTE = 'activo' WHERE I002ID_CLIENTE IN (?)", [clientIds]);
        }

        // 3. Agrupar por teléfono y enviar mensajes
        const estadoWsp = wsp.obtenerEstado();
        let enviados = 0;
        let errores = 0;

        if (estadoWsp.estado === 'conectado') {
            const notificacionesPorTelefono = {};

            resultsInfo.forEach(c => {
                const telStr = (c.telefono || '').toString().trim();
                if (!telStr || telStr === 'Sin registrar') return;

                const primerBloque = telStr.split(/[\/,-]/)[0].trim();
                let digits = primerBloque.replace(/\D/g, '');
                if (!digits) return;

                if (digits.length === 9 && digits.startsWith('9')) {
                    digits = '51' + digits;
                } else if (digits.length >= 11 && digits.startsWith('51')) {
                    digits = digits.substring(0, 11);
                }

                const individualTel = digits;

                if (!notificacionesPorTelefono[individualTel]) {
                    notificacionesPorTelefono[individualTel] = {
                        telefono: individualTel,
                        nombres: new Set(),
                        total_global: 0,
                        periodos: new Set()
                    };
                }
                notificacionesPorTelefono[individualTel].nombres.add(c.nombre);
                notificacionesPorTelefono[individualTel].total_global += parseFloat(c.monto) || 0;
                notificacionesPorTelefono[individualTel].periodos.add(c.periodo);
            });

            const grupos = Object.values(notificacionesPorTelefono);

            for (let i = 0; i < grupos.length; i++) {
                const grupo = grupos[i];
                const msg = wsp.generarMensajeAgradecimiento({
                    nombre: Array.from(grupo.nombres).join(' / '),
                    monto: grupo.total_global.toFixed(2),
                    metodo: metodo,
                    periodo: Array.from(grupo.periodos).join(', ')
                });

                const resultado = await wsp.enviarMensaje(grupo.telefono, msg);
                if (resultado.ok) {
                    enviados++;
                } else {
                    errores++;
                }

                if (i < grupos.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
        }

        res.json({ mensaje: `Se marcaron ${ids.length} pagos correctamente. Notificaciones WhatsApp: ${enviados} enviados, ${errores} fallidos.` });
    } catch (err) {
        console.error("Error en marcarMasivoComoPagado:", err);
        res.status(500).json({ error: err.message });
    }
};

const actualizarComprobantes = async (req, res) => {
    const { id_cobranza } = req.params;
    const { comprobantes } = req.body;
    const numComp = parseInt(comprobantes) || 0;
    const queryAsync = util.promisify(db.query).bind(db);
    let monto = 55.00;
    if (numComp > 500) monto += (numComp - 500) * 0.025;
    monto = Math.round(monto);

    try {
        // 1. Actualizar el monto total en la cobranza maestra (tb006) y quitar pendiente
        await queryAsync(
            "UPDATE tb006_cobranzas SET D006MONTO_TOTAL = ?, I006PENDIENTE = 0 WHERE I006ID_COBRANZA = ? AND E006ESTADO_COBRANZA = 'activo'",
            [monto, id_cobranza]
        );

        // 2. Intentar actualizar tb007 (detalle). Si no hay registros, crear uno.
        const detalles = await queryAsync("SELECT I007ID_DETALLE FROM tb007_detalle_cobranza WHERE I006ID_COBRANZA = ? LIMIT 1", [id_cobranza]);

        if (detalles && detalles.length > 0) {
            await queryAsync(
                "UPDATE tb007_detalle_cobranza SET I007CANTIDAD_DOCUMENTOS = ?, D007MONTO_PAGAR = ? WHERE I007ID_DETALLE = ?",
                [numComp, monto, detalles[0].I007ID_DETALLE]
            );
        } else {
            // Si no hay detalle, buscar el primer RUC del cliente para asociarlo
            const cliRuc = await queryAsync(`
                SELECT r.I005ID_RUC 
                FROM tb005_rucs r
                INNER JOIN tb006_cobranzas c ON r.I002ID_CLIENTE = c.I002ID_CLIENTE
                WHERE c.I006ID_COBRANZA = ? LIMIT 1
            `, [id_cobranza]);

            if (cliRuc && cliRuc.length > 0) {
                await queryAsync(`
                    INSERT INTO tb007_detalle_cobranza (I006ID_COBRANZA, I005ID_RUC, I007CANTIDAD_DOCUMENTOS, D007MONTO_PAGAR, E007ESTADO_DETALLE)
                    VALUES (?, ?, ?, ?, 'activo')
                `, [id_cobranza, cliRuc[0].I005ID_RUC, numComp, monto]);
            }
        }

        res.json({ mensaje: "Comprobantes y monto actualizados correctamente", nuevo_monto: monto });
    } catch (err) {
        console.error("Error al actualizar comprobantes:", err);
        res.status(500).json({ error: err.message });
    }
};

const eliminarCobranza = async (req, res) => {
    const { id_cobranza } = req.params;
    const queryAsync = util.promisify(db.query).bind(db);
    try {
        // 1. Borrar detalles primero (para integridad referencial)
        await queryAsync("DELETE FROM tb007_detalle_cobranza WHERE I006ID_COBRANZA = ?", [id_cobranza]);
        // 2. Borrar la cobranza activa
        const result = await queryAsync("DELETE FROM tb006_cobranzas WHERE I006ID_COBRANZA = ?", [id_cobranza]);

        if (result.affectedRows === 0) {
            return res.status(400).json({ mensaje: "La cobranza no existe o ya fue eliminada." });
        }
        res.json({
            mensaje: "Cobranza descartada y eliminada permanentemente.",
            id_cobranza: id_cobranza
        });
    } catch (err) {
        res.status(500).json({ error: "Error al descartar cobranza: " + err.message });
    }
};

const eliminarCobranzasMasivo = async (req, res) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: "No se proporcionaron IDs válidos" });
    }
    const queryAsync = util.promisify(db.query).bind(db);
    try {
        await queryAsync("DELETE FROM tb007_detalle_cobranza WHERE I006ID_COBRANZA IN (?)", [ids]);
        await queryAsync("DELETE FROM tb006_cobranzas WHERE I006ID_COBRANZA IN (?)", [ids]);
        res.json({ mensaje: `Se eliminaron permanentemente ${ids.length} cobranzas del dashboard.` });
    } catch (err) {
        res.status(500).json({ error: "Error en descarte masivo: " + err.message });
    }
};

const restaurarCobranza = async (req, res) => {
    const { id_cobranza } = req.params;
    const queryAsync = util.promisify(db.query).bind(db);

    try {
        // Verificar si existe y si viene de un reporte archivado
        const info = await queryAsync("SELECT I008ID_REPORTE, F006FECHA_PAGO FROM tb006_cobranzas WHERE I006ID_COBRANZA = ? AND E006ESTADO_COBRANZA = 'eliminado'", [id_cobranza]);
        if (!info || info.length === 0) {
            return res.status(404).json({ mensaje: "La cobranza no esta en la papelera" });
        }

        const esHistorial = info[0].F006FECHA_PAGO !== null;
        const idReporte = info[0].I008ID_REPORTE;
        const nuevoEstado = esHistorial ? 'inactivo' : 'activo';

        await queryAsync("UPDATE tb006_cobranzas SET E006ESTADO_COBRANZA = ? WHERE I006ID_COBRANZA = ?", [nuevoEstado, id_cobranza]);

        // Si era de un reporte archivado, debemos volver a insertarlo en el detalle de ese reporte (tb009)
        if (idReporte) {
            await queryAsync(`
                INSERT INTO tb009_lotes_detallado (I008ID_REPORTE, V009NOMBRE_CLIENTE, V009RUC, V009CELULAR, I009CANTIDAD_DOCS, D009MONTO, V009METODO, F009FECHA_PAGO, V009OPERADOR, V009PERIODO, F009FECHA_ARCHIVO)
                SELECT ?,
                       cli.V002NOMBRE_CLIENTE,
                       IFNULL((SELECT GROUP_CONCAT(DISTINCT r.V005NUMERO_RUC SEPARATOR ' / ') FROM tb005_rucs r WHERE r.I002ID_CLIENTE = cli.I002ID_CLIENTE), 'S/N'),
                       IFNULL((SELECT GROUP_CONCAT(DISTINCT t.V004NUMERO SEPARATOR ' / ') FROM tb004_telefonos t WHERE t.I002ID_CLIENTE = cli.I002ID_CLIENTE), 'Sin Tel'),
                       IFNULL((SELECT SUM(d.I007CANTIDAD_DOCUMENTOS) FROM tb007_detalle_cobranza d WHERE d.I006ID_COBRANZA = c.I006ID_COBRANZA), 0),
                       c.D006MONTO_TOTAL, IFNULL(c.V006METODO_PAGO, 'PDC'), c.F006FECHA_PAGO, IFNULL(u.V001NOMBRE_USUARIO, 'N/A'),
                       IFNULL((SELECT V003DESCRIPCION FROM tb003_periodos WHERE I003ID_PERIODOS = c.I003ID_PERIODOS), 'Sin Periodo'),
                       CURRENT_TIMESTAMP
                FROM tb006_cobranzas c
                INNER JOIN tb002_clientes cli ON c.I002ID_CLIENTE = cli.I002ID_CLIENTE
                LEFT JOIN tb001_usuarios u ON c.I001ID_USUARIO = u.I001ID_USUARIO
                WHERE c.I006ID_COBRANZA = ?
            `, [idReporte, id_cobranza]);
        }

        res.json({ mensaje: "Cobranza restaurada exitosamente a su lugar de origen" });
    } catch (err) {
        console.error("Error al restaurar cobranza:", err);
        res.status(500).json({ error: err.message });
    }
};

const eliminarPermanentementeCobranza = (req, res) => {
    const { id_cobranza } = req.params;
    const query = "DELETE FROM tb006_cobranzas WHERE I006ID_COBRANZA = ? AND E006ESTADO_COBRANZA = 'eliminado'";
    db.query(query, [id_cobranza], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ mensaje: "No se puede borrar porque no está en la papelera o no existe" });
        res.json({ mensaje: "Cobranza eliminada de la base de datos para siempre" })
    });
};
const destruirCobranzasMasivo = async (req, res) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || !ids.length) {
        return res.status(400).json({ error: "No se proporcionaron IDs válidos." });
    }
    const queryAsync = util.promisify(db.query).bind(db);
    try {
        // 1. Primero eliminar el detalle en tb007 para no violar restricciones de clave foránea
        await queryAsync("DELETE FROM tb007_detalle_cobranza WHERE I006ID_COBRANZA IN (?)", [ids]);

        // 2. Luego eliminar definitivamente de tb006
        const results = await queryAsync("DELETE FROM tb006_cobranzas WHERE I006ID_COBRANZA IN (?) AND E006ESTADO_COBRANZA = 'eliminado'", [ids]);

        res.json({ mensaje: `${results.affectedRows} registros eliminados permanentemente.` });
    } catch (err) {
        console.error("Error en destruirCobranzasMasivo:", err);
        res.status(500).json({ error: "Error al destruir registros: " + err.message });
    }
};

const guardarCobranzasMasivas = async (req, res) => {
    const clientesAgrupados = req.body.clientes || req.body;
    const idPeriodo = req.body.id_periodo;
    const idUsuario = req.body.id_usuario;
    const soloClientes = req.body.solo_clientes === true;

    if (!Array.isArray(clientesAgrupados) || clientesAgrupados.length === 0) {
        return res.status(400).json({ error: "No se encontraron clientes para procesar" });
    }
    const queryAsync = util.promisify(db.query).bind(db);
    let errores = [];
    let idPeriodoFinal = idPeriodo;
    if (!idPeriodoFinal || idPeriodoFinal == 0) {
        idPeriodoFinal = await getOrCreateCurrentPeriod(queryAsync, req.body.fecha_simulada);
    }
    try {
        for (const cliente of clientesAgrupados) {
            let idClienteFinal = null;
            const telefonoAgrupador = (cliente.telefono || '').trim();

            if (telefonoAgrupador) {
                const resCli = await queryAsync(`
                    SELECT c.I002ID_CLIENTE 
                    FROM tb002_clientes c
                    INNER JOIN tb004_telefonos t ON c.I002ID_CLIENTE = t.I002ID_CLIENTE
                    WHERE t.V004NUMERO = ? 
                      AND (c.V002NOMBRE_CLIENTE = ? OR c.V002NOMBRE_CLIENTE = 'EMPRESA SIN REGISTRAR')
                    LIMIT 1
                `, [telefonoAgrupador, cliente.nombre_cliente]);

                if (resCli && resCli.length > 0) {
                    idClienteFinal = resCli[0].I002ID_CLIENTE;
                    // Ya no sobreescribimos el nombre automáticamente para evitar arruinar el directorio
                }
            }
            // Si no existe por teléfono, verificar si tenemos id_cliente
            if (!idClienteFinal && cliente.id_cliente) {
                idClienteFinal = cliente.id_cliente;
                await queryAsync("UPDATE tb002_clientes SET V002NOMBRE_CLIENTE = ? WHERE I002ID_CLIENTE = ?", [cliente.nombre_cliente, idClienteFinal]);
            }
            // Si aún no existe, crear un cliente nuevo
            if (!idClienteFinal) {
                const nombreEmpresa = cliente.nombre_cliente || 'EMPRESA NUEVA';
                const resultCliente = await queryAsync(
                    "INSERT INTO tb002_clientes (V002NOMBRE_CLIENTE, E002ESTADO_CLIENTE) VALUES (?, 'activo')",
                    [nombreEmpresa]
                );
                idClienteFinal = resultCliente.insertId;

                if (telefonoAgrupador) {
                    await queryAsync("INSERT INTO tb004_telefonos (V004NUMERO, I002ID_CLIENTE, E004ESTADO_TELEFONO) VALUES (?, ?, 'activo')", [telefonoAgrupador, idClienteFinal]);
                }
            }
            let idCobranza = null;
            if (!soloClientes) {
                const resultMaestro = await queryAsync(`
                    INSERT INTO tb006_cobranzas (I002ID_CLIENTE, I003ID_PERIODOS, I001ID_USUARIO, D006MONTO_TOTAL, E006ESTADO_COBRANZA)
                    VALUES (?, ?, ?, ?, 'activo')
                `, [idClienteFinal, idPeriodoFinal, idUsuario, cliente.total_pagar]);
                idCobranza = resultMaestro.insertId;
            }

            if (cliente.detalles && cliente.detalles.length > 0) {
                for (const detalle of cliente.detalles) {
                    try {
                        const rucLimpio = (detalle.ruc || '').trim();
                        if (!rucLimpio) continue;
                        const resRuc = await queryAsync("SELECT I005ID_RUC, I002ID_CLIENTE, E005ESTADO_RUC FROM tb005_rucs WHERE V005NUMERO_RUC = ?", [rucLimpio]);
                        let idRucFinal = null;
                        if (resRuc && resRuc.length > 0) {
                            idRucFinal = resRuc[0].I005ID_RUC;
                            const razonSocialFinal = (!detalle.razon_social ||
                                detalle.razon_social === 'Desconocido' ||
                                detalle.razon_social.toUpperCase().includes('DOCS EMITIDOS'))
                                ? cliente.nombre_cliente : detalle.razon_social;

                            await queryAsync(
                                "UPDATE tb005_rucs SET I002ID_CLIENTE = ?, V005RAZON_SOCIAL = ?, E005ESTADO_RUC = 'activo' WHERE I005ID_RUC = ?",
                                [idClienteFinal, razonSocialFinal, idRucFinal]
                            );
                        } else {
                            const razonSocialFinal = (!detalle.razon_social ||
                                detalle.razon_social === 'Desconocido' ||
                                detalle.razon_social.toUpperCase().includes('DOCS EMITIDOS'))
                                ? cliente.nombre_cliente : detalle.razon_social;

                            const resultRuc = await queryAsync(
                                "INSERT INTO tb005_rucs (V005NUMERO_RUC, V005RAZON_SOCIAL, I002ID_CLIENTE, E005ESTADO_RUC) VALUES (?, ?, ?, 'activo')",
                                [rucLimpio, razonSocialFinal, idClienteFinal]
                            );
                            idRucFinal = resultRuc.insertId;
                        }

                        if (idCobranza) {
                            await queryAsync(`
                                INSERT INTO tb007_detalle_cobranza (I006ID_COBRANZA, I005ID_RUC, I007CANTIDAD_DOCUMENTOS, D007MONTO_PAGAR, E007ESTADO_DETALLE)
                                VALUES (?, ?, ?, ?, 'activo')
                            `, [idCobranza, idRucFinal, detalle.comprobantes, detalle.monto_individual]);
                        }
                    } catch (errDet) {
                        errores.push({ ruc: detalle.ruc, error: "Detalle: " + errDet.message });
                    }
                }
            }
        }
        const notificacionesPorTelefono = {};
        clientesAgrupados.forEach(c => {
            const tel = (c.telefono || '').toString().trim();
            if (!tel || tel === 'Sin registrar') return;

            if (!notificacionesPorTelefono[tel]) {
                notificacionesPorTelefono[tel] = {
                    telefono: tel,
                    nombres: new Set(),
                    total_global: 0,
                    detalles_items: []
                };
            }
            notificacionesPorTelefono[tel].nombres.add(c.nombre_cliente);
            notificacionesPorTelefono[tel].total_global += parseFloat(c.total_pagar) || 0;
            if (c.detalles) {
                c.detalles.forEach(d => {
                    notificacionesPorTelefono[tel].detalles_items.push({
                        ruc: d.ruc,
                        monto: d.monto_individual
                    });
                });
            }
        });
        if (!soloClientes) {
            const N8N_WEBHOOK_URL = 'https://admin12.app.n8n.cloud/webhook/4cfa554d-7eba-415e-9ea3-49b69695171f';

            for (const notif of Object.values(notificacionesPorTelefono)) {
                const payload = {
                    telefono: notif.telefono,
                    propietario: Array.from(notif.nombres).join(' / '),
                    nombre: Array.from(notif.nombres).join(' / '),
                    total: notif.total_global.toFixed(2), // Alias para n8n antiguo
                    total_pagar: notif.total_global.toFixed(2),
                    detalles_formateados: notif.detalles_items.map(d => `${d.ruc}.  ${Number(d.monto).toFixed(2)}`).join('\n'), // Alias para n8n antiguo
                    resumen_detallado: notif.detalles_items.map(d => `${d.ruc}.  ${Number(d.monto).toFixed(2)}`).join('\n')
                };

                fetch(N8N_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                }).then(() => { })
                    .catch(err => console.error("Error notificando a n8n:", err.message));
            }
        }

        res.status(200).json({
            mensaje: "Proceso completado exitosamente",
            notificacion_n8n: true,
            detalles: "Se agruparon las cobranzas por teléfono para enviar un único mensaje consolidado."
        });
    } catch (errorGlobal) {
        console.error("Error global en guardar masivo:", errorGlobal);
        res.status(500).json({ error: "Error en el guardado masivo: " + errorGlobal.message });
    }
};

const notificarCobranza = async (req, res) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: "No se proporcionaron IDs válidos" });
    }
    const queryAsync = util.promisify(db.query).bind(db);
    const { enviarMensaje, generarMensaje, obtenerEstado } = require('../config/whatsappClient');

    // Verificar que WhatsApp esté conectado
    const estadoWsp = obtenerEstado();
    if (estadoWsp.estado !== 'conectado') {
        return res.status(400).json({
            error: "WhatsApp no está conectado. Revisa la consola del servidor para escanear el código QR.",
            estado_whatsapp: estadoWsp.estado
        });
    }

    try {
        const sql = `
            SELECT c.I006ID_COBRANZA, c.D006MONTO_TOTAL as total_pagar, cli.V002NOMBRE_CLIENTE as nombre_cliente,
                   (SELECT GROUP_CONCAT(DISTINCT t.V004NUMERO SEPARATOR ' / ') FROM tb004_telefonos t WHERE t.I002ID_CLIENTE = cli.I002ID_CLIENTE AND t.E004ESTADO_TELEFONO = 'activo') as telefono,
                   (SELECT SUM(d.I007CANTIDAD_DOCUMENTOS) FROM tb007_detalle_cobranza d WHERE d.I006ID_COBRANZA = c.I006ID_COBRANZA) as total_comprobantes,
                   (SELECT GROUP_CONCAT(DISTINCT r.V005NUMERO_RUC SEPARATOR ' / ') FROM tb005_rucs r WHERE r.I002ID_CLIENTE = cli.I002ID_CLIENTE AND r.E005ESTADO_RUC = 'activo') as rucs,
                   COALESCE(p.V003DESCRIPCION, 'actual') as nombre_periodo
            FROM tb006_cobranzas c
            INNER JOIN tb002_clientes cli ON c.I002ID_CLIENTE = cli.I002ID_CLIENTE
            LEFT JOIN tb003_periodos p ON c.I003ID_PERIODOS = p.I003ID_PERIODOS
            WHERE c.I006ID_COBRANZA IN (?)
        `;
        const results = await queryAsync(sql, [ids]);
        const notificacionesPorTelefono = {};

        results.forEach(c => {
            const telStr = (c.telefono || '').toString().trim();
            if (!telStr || telStr === 'Sin registrar') return;

            // 1. Tomar solo el primer bloque de texto (antes de una '/', ',' o '-')
            const primerBloque = telStr.split(/[\/,-]/)[0].trim();

            // 2. Extraer solo los dígitos
            let digits = primerBloque.replace(/\D/g, '');
            if (!digits) return;

            // 3. Normalizar inteligentemente
            if (digits.length === 9 && digits.startsWith('9')) {
                // Celular peruano estándar (9 dígitos empezando por 9)
                digits = '51' + digits;
            } else if (digits.length >= 11 && digits.startsWith('51')) {
                // Ya tiene el código de Perú
                digits = digits.substring(0, 11);
            } else if (digits.length === 10 && !digits.startsWith('51')) {
                // Posible número de EE.UU./internacional sin el código de país '1'
                // Probamos enviarlo tal cual o podrías añadir '1' si sabes que siempre es USA
                // Por ahora lo dejamos tal cual, pero nos aseguramos de que no se trunque a 9
            }

            console.log(`Intentando enviar a: ${digits} (Original: ${primerBloque})`);

            const individualTel = digits;

            if (!notificacionesPorTelefono[individualTel]) {
                notificacionesPorTelefono[individualTel] = {
                    telefono: individualTel,
                    nombres: new Set(),
                    total_global: 0,
                    detalles_items: [],
                    periodo: c.nombre_periodo
                };
            }
            notificacionesPorTelefono[individualTel].nombres.add(c.nombre_cliente);
            notificacionesPorTelefono[individualTel].total_global += parseFloat(c.total_pagar) || 0;
            notificacionesPorTelefono[individualTel].detalles_items.push({
                ruc: c.rucs || 'S/N',
                monto: c.total_pagar,
                comprobantes: c.total_comprobantes || 0
            });
        });

        // Enviar mensajes por WhatsApp con delay entre cada uno
        const grupos = Object.values(notificacionesPorTelefono);
        let enviados = 0;
        let errores = 0;

        for (let i = 0; i < grupos.length; i++) {
            const grupo = grupos[i];
            const mensaje = generarMensaje(grupo);

            console.log(`\n--- Enviando a ${grupo.telefono} ---`);
            console.log(mensaje);
            console.log('---\n');

            const resultado = await enviarMensaje(grupo.telefono, mensaje);

            if (resultado.ok) {
                enviados++;
            } else {
                errores++;
                console.error(`Error con ${grupo.telefono}: ${resultado.error}`);
            }

            // Delay de 2 segundos entre mensajes para evitar bloqueos
            if (i < grupos.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        // PERSISTENCIA: Marcar en BD como pendientes para que no se pierda al navegar
        await queryAsync("UPDATE tb006_cobranzas SET I006PENDIENTE = 1 WHERE I006ID_COBRANZA IN (?)", [ids]);

        const resumen = enviados > 0
            ? `✅ Se enviaron ${enviados} mensaje(s) por WhatsApp.${errores > 0 ? ` ⚠️ ${errores} fallaron.` : ''}`
            : `❌ No se pudo enviar ningún mensaje. Verifica la conexión de WhatsApp.`;

        res.status(200).json({ mensaje: resumen, enviados, errores });

    } catch (error) {
        console.error("Error en notificarCobranza:", error);
        res.status(500).json({ error: "Error notificando: " + error.message });
    }
};

const notificarRetrasoCobranza = async (req, res) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: "No se proporcionaron IDs válidos" });
    }
    const queryAsync = util.promisify(db.query).bind(db);
    const { enviarMensaje, generarMensajeRetraso, obtenerEstado } = require('../config/whatsappClient');

    const estadoWsp = obtenerEstado();
    if (estadoWsp.estado !== 'conectado') {
        return res.status(400).json({
            error: "WhatsApp no está conectado. Revisa la consola del servidor para escanear el código QR.",
            estado_whatsapp: estadoWsp.estado
        });
    }

    try {
        const sql = `
            SELECT c.I006ID_COBRANZA, cli.V002NOMBRE_CLIENTE as nombre_cliente,
                   (SELECT GROUP_CONCAT(DISTINCT t.V004NUMERO SEPARATOR ' / ') FROM tb004_telefonos t WHERE t.I002ID_CLIENTE = cli.I002ID_CLIENTE AND t.E004ESTADO_TELEFONO = 'activo') as telefono
            FROM tb006_cobranzas c
            INNER JOIN tb002_clientes cli ON c.I002ID_CLIENTE = cli.I002ID_CLIENTE
            WHERE c.I006ID_COBRANZA IN (?)
        `;
        const results = await queryAsync(sql, [ids]);
        const notificacionesPorTelefono = {};

        results.forEach(c => {
            const telStr = (c.telefono || '').toString().trim();
            if (!telStr || telStr === 'Sin registrar') return;

            const primerBloque = telStr.split(/[\/,-]/)[0].trim();
            let digits = primerBloque.replace(/\D/g, '');
            if (!digits) return;

            if (digits.length === 9 && digits.startsWith('9')) {
                digits = '51' + digits;
            } else if (digits.length >= 11 && digits.startsWith('51')) {
                digits = digits.substring(0, 11);
            }

            const individualTel = digits;

            if (!notificacionesPorTelefono[individualTel]) {
                notificacionesPorTelefono[individualTel] = {
                    telefono: individualTel
                };
            }
        });

        const grupos = Object.values(notificacionesPorTelefono);
        let enviados = 0;
        let errores = 0;

        for (let i = 0; i < grupos.length; i++) {
            const grupo = grupos[i];
            const mensaje = generarMensajeRetraso();

            console.log(`\n--- Enviando Aviso de Retraso a ${grupo.telefono} ---`);
            console.log(mensaje);
            console.log('---\n');

            const resultado = await enviarMensaje(grupo.telefono, mensaje);

            if (resultado.ok) {
                enviados++;
            } else {
                errores++;
                console.error(`Error con ${grupo.telefono}: ${resultado.error}`);
            }

            if (i < grupos.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        const resumen = enviados > 0
            ? `✅ Se enviaron ${enviados} aviso(s) de retraso por WhatsApp.${errores > 0 ? ` ⚠️ ${errores} fallaron.` : ''}`
            : `❌ No se pudo enviar ningún aviso. Verifica la conexión de WhatsApp.`;

        res.status(200).json({ mensaje: resumen, enviados, errores });

    } catch (error) {
        console.error("Error en notificarRetrasoCobranza:", error);
        res.status(500).json({ error: "Error notificando retrasos: " + error.message });
    }
};

const notificarSuspensionCobranza = async (req, res) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: "No se proporcionaron IDs válidos" });
    }
    const queryAsync = util.promisify(db.query).bind(db);
    const { enviarMensaje, generarMensajeSuspension, obtenerEstado } = require('../config/whatsappClient');

    const estadoWsp = obtenerEstado();
    if (estadoWsp.estado !== 'conectado') {
        return res.status(400).json({
            error: "WhatsApp no está conectado. Revisa la consola del servidor para escanear el código QR.",
            estado_whatsapp: estadoWsp.estado
        });
    }

    try {
        const sql = `
            SELECT c.I006ID_COBRANZA, cli.V002NOMBRE_CLIENTE as nombre_cliente,
                   (SELECT GROUP_CONCAT(DISTINCT t.V004NUMERO SEPARATOR ' / ') FROM tb004_telefonos t WHERE t.I002ID_CLIENTE = cli.I002ID_CLIENTE AND t.E004ESTADO_TELEFONO = 'activo') as telefono
            FROM tb006_cobranzas c
            INNER JOIN tb002_clientes cli ON c.I002ID_CLIENTE = cli.I002ID_CLIENTE
            WHERE c.I006ID_COBRANZA IN (?)
        `;
        const results = await queryAsync(sql, [ids]);
        const notificacionesPorTelefono = {};

        results.forEach(c => {
            const telStr = (c.telefono || '').toString().trim();
            if (!telStr || telStr === 'Sin registrar') return;

            const primerBloque = telStr.split(/[\/,-]/)[0].trim();
            let digits = primerBloque.replace(/\D/g, '');
            if (!digits) return;

            if (digits.length === 9 && digits.startsWith('9')) {
                digits = '51' + digits;
            } else if (digits.length >= 11 && digits.startsWith('51')) {
                digits = digits.substring(0, 11);
            }

            const individualTel = digits;

            if (!notificacionesPorTelefono[individualTel]) {
                notificacionesPorTelefono[individualTel] = {
                    telefono: individualTel
                };
            }
        });

        const grupos = Object.values(notificacionesPorTelefono);
        let enviados = 0;
        let errores = 0;

        for (let i = 0; i < grupos.length; i++) {
            const grupo = grupos[i];
            const mensaje = generarMensajeSuspension();

            console.log(`\n--- Enviando Aviso de Suspensión a ${grupo.telefono} ---`);
            console.log(mensaje);
            console.log('---\n');

            const resultado = await enviarMensaje(grupo.telefono, mensaje);

            if (resultado.ok) {
                enviados++;
            } else {
                errores++;
                console.error(`Error con ${grupo.telefono}: ${resultado.error}`);
            }

            if (i < grupos.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        const resumen = enviados > 0
            ? `✅ Se enviaron ${enviados} aviso(s) de suspensión por WhatsApp.${errores > 0 ? ` ⚠️ ${errores} fallaron.` : ''}`
            : `❌ No se pudo enviar ningún aviso. Verifica la conexión de WhatsApp.`;

        res.status(200).json({ mensaje: resumen, enviados, errores });

    } catch (error) {
        console.error("Error en notificarSuspensionCobranza:", error);
        res.status(500).json({ error: "Error notificando suspensión: " + error.message });
    }
};

const listarClientesDirectorio = async (req, res) => {
    const { id_periodo } = req.query;
    const queryAsync = util.promisify(db.query).bind(db);

    try {
        // Listar clientes activos E inactivos (no eliminados/basurero)
        const clientes = await queryAsync(`
            SELECT 
                c.I002ID_CLIENTE as id_cliente,
                c.V002NOMBRE_CLIENTE as nombre,
                c.E002ESTADO_CLIENTE as estado,
                (SELECT GROUP_CONCAT(DISTINCT t.V004NUMERO ORDER BY t.I004ID_TELEFONO SEPARATOR ' / ') 
                 FROM tb004_telefonos t WHERE t.I002ID_CLIENTE = c.I002ID_CLIENTE AND t.E004ESTADO_TELEFONO = 'activo') as telefono,
                (SELECT t.V004NUMERO FROM tb004_telefonos t WHERE t.I002ID_CLIENTE = c.I002ID_CLIENTE AND t.E004ESTADO_TELEFONO = 'activo' ORDER BY t.I004ID_TELEFONO LIMIT 1) as telefono_grupo,
                (SELECT GROUP_CONCAT(DISTINCT r.V005NUMERO_RUC SEPARATOR ' / ') FROM tb005_rucs r WHERE r.I002ID_CLIENTE = c.I002ID_CLIENTE AND r.E005ESTADO_RUC = 'activo') as rucs,
                (SELECT GROUP_CONCAT(DISTINCT CONCAT(r.V005NUMERO_RUC, ' (', 
                    CASE WHEN r.V005RAZON_SOCIAL IN ('Desconocido', '') OR r.V005RAZON_SOCIAL IS NULL 
                         THEN c.V002NOMBRE_CLIENTE 
                         ELSE r.V005RAZON_SOCIAL END, ')') SEPARATOR ' / ') 
                 FROM tb005_rucs r WHERE r.I002ID_CLIENTE = c.I002ID_CLIENTE AND r.E005ESTADO_RUC = 'activo') as razones_sociales,
                (SELECT I006ID_COBRANZA FROM tb006_cobranzas WHERE I002ID_CLIENTE = c.I002ID_CLIENTE AND I003ID_PERIODOS = ? AND E006ESTADO_COBRANZA = 'activo' LIMIT 1) as ya_en_cobranza,
                (SELECT MAX(c2.I002ID_CLIENTE) FROM tb002_clientes c2 
                 JOIN tb004_telefonos t2 ON c2.I002ID_CLIENTE = t2.I002ID_CLIENTE 
                 WHERE t2.E004ESTADO_TELEFONO = 'activo' AND t2.V004NUMERO = (SELECT t3.V004NUMERO FROM tb004_telefonos t3 WHERE t3.I002ID_CLIENTE = c.I002ID_CLIENTE AND t3.E004ESTADO_TELEFONO = 'activo' ORDER BY t3.I004ID_TELEFONO LIMIT 1)
                ) as max_id_grupo
            FROM tb002_clientes c
            WHERE c.E002ESTADO_CLIENTE IN ('activo', 'inactivo')
            ORDER BY COALESCE(max_id_grupo, c.I002ID_CLIENTE) DESC, telefono_grupo ASC, c.V002NOMBRE_CLIENTE ASC
        `, [id_periodo || 0]);

        res.status(200).json(clientes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const pasarTodosACobranzas = async (req, res) => {
    const { id_periodo, id_usuario } = req.body;
    const queryAsync = util.promisify(db.query).bind(db);

    try {
        let idPeriodoFinal = id_periodo;
        if (!idPeriodoFinal || idPeriodoFinal == 0) {
            idPeriodoFinal = await getOrCreateCurrentPeriod(queryAsync);
        }
        // Obtener clientes activos e inactivos (no eliminados) que AÚN no tienen cobranza en este periodo
        const clientesPendientes = await queryAsync(`
            SELECT DISTINCT c.I002ID_CLIENTE, c.V002NOMBRE_CLIENTE
            FROM tb002_clientes c
            WHERE c.E002ESTADO_CLIENTE IN ('activo', 'inactivo')
              AND NOT EXISTS (
                SELECT 1 FROM tb006_cobranzas co 
                WHERE co.I002ID_CLIENTE = c.I002ID_CLIENTE 
                  AND co.I003ID_PERIODOS = ? 
                  AND co.E006ESTADO_COBRANZA = 'activo'
              )
        `, [idPeriodoFinal]);

        if (clientesPendientes.length === 0) {
            return res.status(200).json({ mensaje: 'Todos los clientes ya tienen cobranza en este periodo.', creados: 0 });
        }

        let creados = 0;
        for (const c of clientesPendientes) {
            await queryAsync(`
                INSERT INTO tb006_cobranzas (I002ID_CLIENTE, I003ID_PERIODOS, I001ID_USUARIO, D006MONTO_TOTAL, E006ESTADO_COBRANZA)
                VALUES (?, ?, ?, 55.00, 'activo')
            `, [c.I002ID_CLIENTE, idPeriodoFinal, id_usuario || 1]);
            creados++;
        }

        res.status(200).json({ mensaje: `Se crearon ${creados} cobranzas activas correctamente.`, creados });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const pasarIndividualACobranza = async (req, res) => {
    const { id_cliente, id_periodo, id_usuario } = req.body;
    const queryAsync = util.promisify(db.query).bind(db);

    try {
        // Verificar si ya existe cobranza activa para este cliente y periodo
        const existe = await queryAsync(`
            SELECT 1 FROM tb006_cobranzas 
            WHERE I002ID_CLIENTE = ? AND I003ID_PERIODOS = ? AND E006ESTADO_COBRANZA = 'activo'
            LIMIT 1
        `, [id_cliente, id_periodo]);

        if (existe.length > 0) {
            return res.status(400).json({ error: 'El cliente ya tiene una cobranza activa en este periodo.' });
        }

        // Crear la cobranza individual (Monto por defecto 55.00)
        await queryAsync(`
            INSERT INTO tb006_cobranzas (I002ID_CLIENTE, I003ID_PERIODOS, I001ID_USUARIO, D006MONTO_TOTAL, E006ESTADO_COBRANZA)
            VALUES (?, ?, ?, 55.00, 'activo')
        `, [id_cliente, id_periodo, id_usuario || 1]);

        res.status(200).json({ mensaje: 'Cliente pasado a cobranzas activas correctamente.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const obtenerPendientesN8N = (req, res) => {
    const query = "CALL sp_obtener_pendientes_n8n()";

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const pendientes = results[0];
        const pendientesFormateados = pendientes.map(p => {
            const numeroUser = "999999999";
            const textoRucs = p.rucs_detalle ? p.rucs_detalle : "(Sin detalles)";

            const mensajeAmigable = `[${p.nombre_cliente}]
Estimado cliente buenos días, el monto de la facturación electrónica es: 

${textoRucs}

[Teléfono] [Monto]
-------------------
Total: S/ ${p.monto_total}

Evite cortes de servicio y realice el pago a la brevedad posible.
yape/plin ${numeroUser}`;

            return {
                id_cobranza: p.id_cobranza,
                nombre_cliente: p.nombre_cliente,
                // Normalizar para n8n: solo dígitos y prefijo 51
                numero_whatsapp: (p.numero_whatsapp || '').toString().replace(/\D/g, '').length === 9
                    ? '51' + p.numero_whatsapp.toString().replace(/\D/g, '')
                    : (p.numero_whatsapp || '').toString().replace(/\D/g, ''),
                monto_total: p.monto_total,
                periodo: p.periodo,
                mensaje_listo_para_enviar: mensajeAmigable
            };
        });

        res.status(200).json(pendientesFormateados);
    });
};

// Helper para obtener o crear el periodo actual automáticamente
const getOrCreateCurrentPeriod = async (queryAsync, fechaManual = null) => {
    const hoy = fechaManual ? new Date(fechaManual) : new Date();
    const mesNombres = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const nombreMes = mesNombres[hoy.getMonth()];
    const anio = hoy.getFullYear();
    const descripcionBuscada = `${nombreMes} ${anio}`;
    const existe = await queryAsync("SELECT I003ID_PERIODOS FROM tb003_periodos WHERE V003DESCRIPCION = ? AND E003ESTADO_PERIODO != 'eliminado' LIMIT 1", [descripcionBuscada]);
    if (existe && existe.length > 0) return existe[0].I003ID_PERIODOS;
    const primerDia = new Date(anio, hoy.getMonth(), 1).toISOString().split('T')[0];
    const ultimoDia = new Date(anio, hoy.getMonth() + 1, 0).toISOString().split('T')[0];

    const insert = await queryAsync(
        "INSERT INTO tb003_periodos (D003FECHA_INICIO, D003FECHA_FIN, V003DESCRIPCION, E003ESTADO_PERIODO) VALUES (?, ?, ?, 'activo')",
        [primerDia, ultimoDia, descripcionBuscada]
    );
    // Auto-creado periodo, sin emitir mensaje a consola
    return insert.insertId;
};

const registrarPagoN8N = async (req, res) => {
    // Datos de n8n recibidos
    const { numero_telefono, monto, metodo_pago } = req.body;

    if (!numero_telefono || !monto || !metodo_pago) {
        return res.status(400).json({ error: "El número de teléfono, monto y método de pago son necesarios" });
    }

    // Normalizar teléfono: eliminar espacios, guiones, etc.
    const telLimpio = String(numero_telefono).replace(/\D/g, '');
    const queryAsync = util.promisify(db.query).bind(db);

    try {
        // Asegurar que el periodo actual exista
        await getOrCreateCurrentPeriod(queryAsync);
        const querySp = "CALL sp_registrar_pago_inteligente(?, ?, ?)";
        db.query(querySp, [telLimpio, monto, metodo_pago], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            const data = results && results[0] && results[0][0] ? results[0][0] : null;
            if (data && data.codigo_error && data.codigo_error !== 200) {
                return res.status(data.codigo_error).json({ error: data.mensaje });
            }
            res.status(200).json({
                mensaje: data ? data.mensaje : "Pago procesado",
                sistema: "Periodo verificado/creado automáticamente"
            });
        });
    } catch (error) {
        console.error("Error en registrarPagoN8N:", error);
        res.status(500).json({ error: "Error interno: " + error.message });
    }
};

const obtenerHistorialPagos = (req, res) => {
    const sql = `
        SELECT
            c.I006ID_COBRANZA   AS id_cobranza,
            CASE 
                WHEN cli.V002NOMBRE_CLIENTE = 'Desconocido' THEN 
                    IFNULL((SELECT r.V005RAZON_SOCIAL FROM tb005_rucs r WHERE r.I002ID_CLIENTE = cli.I002ID_CLIENTE AND r.V005RAZON_SOCIAL != 'Desconocido' LIMIT 1), cli.V002NOMBRE_CLIENTE)
                ELSE cli.V002NOMBRE_CLIENTE
            END AS nombre_cliente,
            cli.E002ESTADO_CLIENTE AS estado_cliente,
            (SELECT GROUP_CONCAT(DISTINCT CONCAT(r.V005NUMERO_RUC, ' (', IFNULL(r.V005RAZON_SOCIAL,'?'), ')') SEPARATOR ' / ')
             FROM tb005_rucs r WHERE r.I002ID_CLIENTE = cli.I002ID_CLIENTE AND r.E005ESTADO_RUC = 'activo') AS ruc,
            (SELECT GROUP_CONCAT(DISTINCT t.V004NUMERO SEPARATOR ' / ')
             FROM tb004_telefonos t WHERE t.I002ID_CLIENTE = cli.I002ID_CLIENTE AND t.E004ESTADO_TELEFONO = 'activo') AS telefono,
            (SELECT SUM(d.I007CANTIDAD_DOCUMENTOS) FROM tb007_detalle_cobranza d WHERE d.I006ID_COBRANZA = c.I006ID_COBRANZA) AS total_comprobantes,
            c.D006MONTO_TOTAL    AS monto_pagado,
            c.V006METODO_PAGO    AS metodo,
            c.F006FECHA_PAGO     AS fecha_pago,
            u.V001NOMBRE_USUARIO AS operador,
            p.V003DESCRIPCION    AS periodo
        FROM tb006_cobranzas c
        INNER JOIN tb002_clientes cli ON c.I002ID_CLIENTE = cli.I002ID_CLIENTE
        LEFT JOIN tb001_usuarios u ON c.I001ID_USUARIO = u.I001ID_USUARIO
        LEFT JOIN tb003_periodos p ON c.I003ID_PERIODOS = p.I003ID_PERIODOS
        WHERE c.E006ESTADO_COBRANZA = 'inactivo' AND c.I008ID_REPORTE IS NULL
        ORDER BY c.F006FECHA_PAGO DESC, c.I006ID_COBRANZA DESC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const resultadosModificados = results.map(row => {
            const per = row.periodo || '';
            if (per) {
                const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
                const parts = per.trim().split(/\s+/);
                let mesStr = parts[0];

                const idx = meses.findIndex(m => m.toLowerCase() === mesStr.toLowerCase());
                if (idx !== -1) {
                    let prevIdx = idx - 1;
                    if (prevIdx < 0) {
                        prevIdx = 11;
                    }
                    let anterior = meses[prevIdx];

                    row.periodo = `${mesStr}(${anterior})`;
                }
            }
            return row;
        });

        res.status(200).json(resultadosModificados);
    });
};

const previaMasivo = (req, res) => {
    const datosAngular = req.body;
    if (!Array.isArray(datosAngular) || datosAngular.length === 0) {
        return res.status(400).json({ error: "No se encontraron datos válidos del frontend" });
    }
    const rucsRecibidos = datosAngular.map(d => d.ruc);

    if (rucsRecibidos.length === 0) {
        return res.status(400).json({ error: "No se encontraron rucs" });
    }
    // Buscamos los rucs en la base de datos
    const placeholders = rucsRecibidos.map(() => '?').join(',');
    const query = `
        SELECT r.I005ID_RUC as id_ruc, r.V005NUMERO_RUC as ruc, r.V005RAZON_SOCIAL as razon_social, 
               c.I002ID_CLIENTE as id_cliente, c.V002NOMBRE_CLIENTE as nombre_cliente, c.E002ESTADO_CLIENTE as estado_cliente,
               (SELECT GROUP_CONCAT(V004NUMERO SEPARATOR ' / ') FROM tb004_telefonos WHERE I002ID_CLIENTE = c.I002ID_CLIENTE AND E004ESTADO_TELEFONO = 'activo') as telefonos
        FROM tb005_rucs r
        INNER JOIN tb002_clientes c ON r.I002ID_CLIENTE = c.I002ID_CLIENTE
        WHERE r.V005NUMERO_RUC IN (${placeholders}) AND r.E005ESTADO_RUC = 'activo'
    `;
    db.query(query, rucsRecibidos, (err, resultsRucs) => {
        if (err) return res.status(500).json({ error: err.message });
        const queryTels = `
            SELECT t.V004NUMERO as ruc, 
                   c.I002ID_CLIENTE as id_cliente, c.V002NOMBRE_CLIENTE as nombre_cliente, c.E002ESTADO_CLIENTE as estado_cliente,
                   (SELECT GROUP_CONCAT(V004NUMERO SEPARATOR ' / ') FROM tb004_telefonos WHERE I002ID_CLIENTE = c.I002ID_CLIENTE AND E004ESTADO_TELEFONO = 'activo') as telefonos
            FROM tb004_telefonos t
            INNER JOIN tb002_clientes c ON t.I002ID_CLIENTE = c.I002ID_CLIENTE
            WHERE t.V004NUMERO IN (${placeholders}) AND t.E004ESTADO_TELEFONO = 'activo'
        `;
        db.query(queryTels, rucsRecibidos, (errTels, resultsTels) => {
            if (errTels) return res.status(500).json({ error: errTels.message });
            const clientesPorTelefono = {};
            resultsTels.forEach(row => {
                if (!clientesPorTelefono[row.ruc]) clientesPorTelefono[row.ruc] = [];
                clientesPorTelefono[row.ruc].push({
                    id_cliente: row.id_cliente,
                    nombre_cliente: row.nombre_cliente,
                    estado_cliente: row.estado_cliente,
                    telefono: row.telefonos
                });
            });

            const dbRucs = {};

            // Luego sobreescribimos/añadimos los encontrados por RUC real (tienen prioridad)
            resultsRucs.forEach(row => {
                dbRucs[row.ruc] = {
                    id_ruc: row.id_ruc,
                    id_cliente: row.id_cliente,
                    nombre_cliente: row.nombre_cliente,
                    estado_cliente: row.estado_cliente,
                    razon_social: row.razon_social,
                    telefono: row.telefonos
                };
            });
            const clientesAgrupados = {};
            const rucsDesconocidos = [];

            datosAngular.forEach(item => {
                const { ruc, comprobantes, descripcion } = item;
                // Calculo de regla de cobranza
                let montoPagar = 55.00;
                const numComprobantes = parseInt(comprobantes) || 0;
                if (numComprobantes > 500) {
                    const excedente = numComprobantes - 500;
                    montoPagar += excedente * 0.025;
                }
                let dbInfo = dbRucs[ruc];
                let razon_social_tmp = '';
                if (descripcion) {
                    const parts = descripcion.split('-');
                    if (parts.length >= 2) razon_social_tmp = parts[1].trim();
                }
                // Si no hay match por RUC, buscamos si el "RUC" (teléfono) pertenece a un cliente con el mismo nombre
                if (!dbInfo && clientesPorTelefono[ruc]) {
                    const match = clientesPorTelefono[ruc].find(c =>
                        c.nombre_cliente.toLowerCase() === razon_social_tmp.toLowerCase()
                    );
                    if (match) {
                        dbInfo = {
                            id_ruc: null,
                            id_cliente: match.id_cliente,
                            nombre_cliente: match.nombre_cliente,
                            estado_cliente: match.estado_cliente,
                            razon_social: match.nombre_cliente,
                            telefono: match.telefono
                        };
                    }
                }

                if (dbInfo) {
                    const idCliente = dbInfo.id_cliente;

                    if (!clientesAgrupados[idCliente]) {
                        clientesAgrupados[idCliente] = {
                            id_cliente: idCliente,
                            nombre_cliente: dbInfo.nombre_cliente,
                            estado_cliente: dbInfo.estado_cliente,
                            telefono: dbInfo.telefono || '',
                            total_comprobantes: 0,
                            total_pagar: 0,
                            detalles: []
                        };
                    }
                    clientesAgrupados[idCliente].total_comprobantes += numComprobantes;
                    clientesAgrupados[idCliente].total_pagar += montoPagar;
                    clientesAgrupados[idCliente].detalles.push({
                        id_ruc: dbInfo.id_ruc,
                        ruc: ruc,
                        razon_social: dbInfo.razon_social || razon_social_tmp,
                        comprobantes: numComprobantes,
                        monto_individual: Number(montoPagar.toFixed(2))
                    });
                } else {
                    const tempId = 'nuevo_' + ruc;
                    if (!clientesAgrupados[tempId]) {
                        clientesAgrupados[tempId] = {
                            id_cliente: null,
                            nombre_cliente: razon_social_tmp || 'EMPRESA SIN REGISTRAR',
                            telefono: '',
                            total_comprobantes: 0,
                            total_pagar: 0,
                            detalles: [],
                            es_nuevo: true
                        };
                    }
                    clientesAgrupados[tempId].total_comprobantes += numComprobantes;
                    clientesAgrupados[tempId].total_pagar += montoPagar;
                    clientesAgrupados[tempId].detalles.push({
                        ruc: ruc,
                        razon_social: razon_social_tmp || 'Desconocido',
                        comprobantes: numComprobantes,
                        monto_individual: Number(montoPagar.toFixed(2))
                    });
                }
            });

            const clientesArray = Object.values(clientesAgrupados).map(c => ({
                ...c,
                total_pagar: Number(c.total_pagar.toFixed(2))
            }));

            res.status(200).json({
                clientes: clientesArray,
                desconocidos: []
            });
        });
    });
};
const limpiarHistorialCompleto = (req, res) => {
    const subquery = "SELECT I006ID_COBRANZA FROM tb006_cobranzas WHERE E006ESTADO_COBRANZA IN ('inactivo', 'eliminado')";
    const queryDetalle = `DELETE FROM tb007_detalle_cobranza WHERE I006ID_COBRANZA IN (${subquery})`;

    db.query(queryDetalle, (errDet) => {
        if (errDet) return res.status(500).json({ error: "Detalle: " + errDet.message });

        const queryMaestro = "DELETE FROM tb006_cobranzas WHERE E006ESTADO_COBRANZA IN ('inactivo', 'eliminado')";
        db.query(queryMaestro, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({
                mensaje: `Historial vaciado correctamente. ${results.affectedRows} registros eliminados.`,
                eliminados: results.affectedRows
            });
        });
    });
};

const eliminarCobranzaPermanente = (req, res) => {
    const { id_cobranza } = req.params;
    const queryDetalle = "DELETE FROM tb007_detalle_cobranza WHERE I006ID_COBRANZA = ?";
    db.query(queryDetalle, [id_cobranza], (errDet) => {
        if (errDet) return res.status(500).json({ error: "No se pudo borrar el detalle: " + errDet.message });

        const queryMaestro = "DELETE FROM tb006_cobranzas WHERE I006ID_COBRANZA = ?";
        db.query(queryMaestro, [id_cobranza], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.affectedRows === 0) return res.status(404).json({ mensaje: "No se encontró el registro" });
            res.json({ mensaje: "Registro eliminado permanentemente del historial" });
        });
    });
};
const archivarHistorial = async (req, res) => {
    const { id_usuario } = req.body;
    const queryAsync = util.promisify(db.query).bind(db);

    try {
        const periodosActivos = await queryAsync(`
            SELECT I003ID_PERIODOS, COUNT(*) as cantidad, SUM(D006MONTO_TOTAL) as monto_total 
            FROM tb006_cobranzas 
            WHERE E006ESTADO_COBRANZA IN ('inactivo', 'eliminado') AND I008ID_REPORTE IS NULL
            GROUP BY I003ID_PERIODOS
        `);

        if (!periodosActivos || periodosActivos.length === 0) {
            return res.status(400).json({ mensaje: "No hay registros pagados para archivar en este momento." });
        }

        let reportesCreados = 0;

        for (const p of periodosActivos) {
            const idPeriodo = p.I003ID_PERIODOS;
            if (!idPeriodo) continue;

            const montoFinal = Number(p.monto_total) || 0;
            const resultReporte = await queryAsync(`
                INSERT INTO tb008_lotes_archivados (I003ID_PERIODOS, D008MONTO_TOTAL, I008CANTIDAD_REGISTROS, V008OPERADOR, V008PERIODO_TEXTO)
                VALUES (?, ?, ?, (SELECT V001NOMBRE_USUARIO FROM tb001_usuarios WHERE I001ID_USUARIO = ?), 
                       (SELECT V003DESCRIPCION FROM tb003_periodos WHERE I003ID_PERIODOS = ?))
            `, [idPeriodo, montoFinal, p.cantidad, id_usuario || 1, idPeriodo]);

            const idReporte = resultReporte.insertId;

            // Reporte creado, insertar detalles
            await queryAsync(`
                INSERT INTO tb009_lotes_detallado (I008ID_REPORTE, V009NOMBRE_CLIENTE, V009RUC, V009CELULAR, I009CANTIDAD_DOCS, D009MONTO, V009METODO, F009FECHA_PAGO, V009OPERADOR, V009PERIODO, F009FECHA_ARCHIVO)
                SELECT ?,
                       cli.V002NOMBRE_CLIENTE,
                       IFNULL((SELECT GROUP_CONCAT(DISTINCT r.V005NUMERO_RUC SEPARATOR ' / ') FROM tb005_rucs r WHERE r.I002ID_CLIENTE = cli.I002ID_CLIENTE AND r.E005ESTADO_RUC = 'activo'), 'S/N'),
                       IFNULL((SELECT GROUP_CONCAT(DISTINCT t.V004NUMERO SEPARATOR ' / ') FROM tb004_telefonos t WHERE t.I002ID_CLIENTE = cli.I002ID_CLIENTE AND t.E004ESTADO_TELEFONO = 'activo'), 'Sin Tel'),
                       IFNULL((SELECT SUM(d.I007CANTIDAD_DOCUMENTOS) FROM tb007_detalle_cobranza d WHERE d.I006ID_COBRANZA = c.I006ID_COBRANZA), 0),
                       c.D006MONTO_TOTAL, IFNULL(c.V006METODO_PAGO, 'PDC'), c.F006FECHA_PAGO, IFNULL(u.V001NOMBRE_USUARIO, 'N/A'),
                       IFNULL((SELECT V003DESCRIPCION FROM tb003_periodos WHERE I003ID_PERIODOS = c.I003ID_PERIODOS), 'Sin Periodo'),
                       CURRENT_TIMESTAMP
                FROM tb006_cobranzas c
                INNER JOIN tb002_clientes cli ON c.I002ID_CLIENTE = cli.I002ID_CLIENTE
                LEFT JOIN tb001_usuarios u ON c.I001ID_USUARIO = u.I001ID_USUARIO
                WHERE c.E006ESTADO_COBRANZA IN ('inactivo', 'eliminado') AND c.I008ID_REPORTE IS NULL AND c.I003ID_PERIODOS = ?
            `, [idReporte, idPeriodo]);

            await queryAsync(`
                UPDATE tb006_cobranzas 
                SET I008ID_REPORTE = ?
                WHERE E006ESTADO_COBRANZA IN ('inactivo', 'eliminado') AND I008ID_REPORTE IS NULL AND I003ID_PERIODOS = ?
            `, [idReporte, idPeriodo]);

            reportesCreados++;
        }

        res.status(200).json({
            mensaje: `Historial archivado correctamente. Se crearon ${reportesCreados} cierres por los periodos finalizados.`,
        });
    } catch (error) {
        console.error("CRASH en archivarHistorial:", error);
        res.status(500).json({
            error: "Error interno al archivar: " + error.message,
            stack: error.stack
        });
    }
};
const obtenerReportes = (req, res) => {
    const sql = `
        SELECT MAX(r.I008ID_REPORTE) as id_reporte, 
               p.V003DESCRIPCION as periodo, 
               MAX(r.F008FECHA_REPORTE) as fecha, 
               SUM(r.D008MONTO_TOTAL) as monto, 
               SUM(r.I008CANTIDAD_REGISTROS) as cantidad,
               p.I003ID_PERIODOS as id_periodo
        FROM tb008_lotes_archivados r
        LEFT JOIN tb003_periodos p ON r.I003ID_PERIODOS = p.I003ID_PERIODOS
        GROUP BY p.I003ID_PERIODOS, p.V003DESCRIPCION
        ORDER BY MAX(r.F008FECHA_REPORTE) DESC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const resultadosModificados = results.map(row => {
            const per = row.periodo || '';
            if (per) {
                const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
                const parts = per.trim().split(/\s+/);
                let mesStr = parts[0];

                const idx = meses.findIndex(m => m.toLowerCase() === mesStr.toLowerCase());
                if (idx !== -1) {
                    let prevIdx = idx - 1;
                    if (prevIdx < 0) prevIdx = 11;
                    let anterior = meses[prevIdx];
                    row.periodo = `${mesStr}(${anterior})`;
                }
            }
            return row;
        });

        res.status(200).json(resultadosModificados);
    });
};

const eliminarReporteDefinitivo = async (req, res) => {
    const { id_reporte } = req.params;
    const queryAsync = util.promisify(db.query).bind(db);
    try {
        await queryAsync("DELETE FROM tb009_lotes_detallado WHERE I008ID_REPORTE = ?", [id_reporte]);
        await queryAsync(`
            DELETE FROM tb007_detalle_cobranza 
            WHERE I006ID_COBRANZA IN (SELECT I006ID_COBRANZA FROM tb006_cobranzas WHERE I008ID_REPORTE = ?)
        `, [id_reporte]);
        await queryAsync("DELETE FROM tb006_cobranzas WHERE I008ID_REPORTE = ?", [id_reporte]);
        await queryAsync("DELETE FROM tb008_lotes_archivados WHERE I008ID_REPORTE = ?", [id_reporte]);

        res.status(200).json({ mensaje: "Reporte y su historial asociado eliminados para siempre del sistema." });
    } catch (error) {
        console.error("Error al destruir reporte:", error);
        res.status(500).json({ error: "No se pudo destruir el reporte por un error interno: " + error.message });
    }
};

const vaciarHistorialMesActual = (req, res) => {
    const sql = `
        UPDATE tb006_cobranzas 
        SET E006ESTADO_COBRANZA = 'eliminado' 
        WHERE E006ESTADO_COBRANZA = 'inactivo' AND I008ID_REPORTE IS NULL
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: "Todo el historial del mes ha sido movido a la papelera", afectados: result.affectedRows });
    });
};

const obtenerBasureroDetallado = (req, res) => {
    const sql = `
        SELECT h.*, r.F008FECHA_REPORTE as fecha_archivo_reporte, 
               COALESCE(p.I003ID_PERIODOS, r.I003ID_PERIODOS) as id_periodo
        FROM tb009_lotes_detallado h
        INNER JOIN tb008_lotes_archivados r ON h.I008ID_REPORTE = r.I008ID_REPORTE
        LEFT JOIN tb003_periodos p ON h.V009PERIODO = p.V003DESCRIPCION
        ORDER BY r.F008FECHA_REPORTE DESC, h.V009NOMBRE_CLIENTE ASC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const resultadosModificados = results.map(row => {
            const per = row.V009PERIODO || '';
            if (per) {
                const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
                const parts = per.trim().split(/\s+/);
                let mesStr = parts[0];

                const idx = meses.findIndex(m => m.toLowerCase() === mesStr.toLowerCase());
                if (idx !== -1) {
                    let prevIdx = idx - 1;
                    if (prevIdx < 0) prevIdx = 11;
                    let anterior = meses[prevIdx];
                    row.V009PERIODO = `${mesStr}(${anterior})`;
                }
            }
            return row;
        });

        res.status(200).json(resultadosModificados);
    });
};

const obtenerBasureroActual = (req, res) => {
    const sql = `
        SELECT
            c.I006ID_COBRANZA   AS id_cobranza,
            CASE 
                WHEN cli.V002NOMBRE_CLIENTE = 'Desconocido' THEN 
                    IFNULL((SELECT r.V005RAZON_SOCIAL FROM tb005_rucs r WHERE r.I002ID_CLIENTE = cli.I002ID_CLIENTE AND r.V005RAZON_SOCIAL != 'Desconocido' LIMIT 1), cli.V002NOMBRE_CLIENTE)
                ELSE cli.V002NOMBRE_CLIENTE
            END AS nombre_cliente,
            cli.E002ESTADO_CLIENTE AS estado_cliente,
            (SELECT GROUP_CONCAT(DISTINCT r.V005NUMERO_RUC SEPARATOR ' / ')
             FROM tb005_rucs r WHERE r.I002ID_CLIENTE = cli.I002ID_CLIENTE AND r.E005ESTADO_RUC = 'activo') AS ruc,
            (SELECT GROUP_CONCAT(DISTINCT t.V004NUMERO SEPARATOR ' / ')
             FROM tb004_telefonos t WHERE t.I002ID_CLIENTE = cli.I002ID_CLIENTE AND t.E004ESTADO_TELEFONO = 'activo') AS telefono,
            (SELECT SUM(d.I007CANTIDAD_DOCUMENTOS) FROM tb007_detalle_cobranza d WHERE d.I006ID_COBRANZA = c.I006ID_COBRANZA) AS total_comprobantes,
            c.D006MONTO_TOTAL    AS monto_pagado,
            c.V006METODO_PAGO    AS metodo,
            c.F006FECHA_PAGO     AS fecha_pago,
            u.V001NOMBRE_USUARIO AS operador,
            p.V003DESCRIPCION    AS periodo,
            c.I003ID_PERIODOS    AS id_periodo
        FROM tb006_cobranzas c
        INNER JOIN tb002_clientes cli ON c.I002ID_CLIENTE = cli.I002ID_CLIENTE
        LEFT JOIN tb001_usuarios u ON c.I001ID_USUARIO = u.I001ID_USUARIO
        LEFT JOIN tb003_periodos p ON c.I003ID_PERIODOS = p.I003ID_PERIODOS
        WHERE c.E006ESTADO_COBRANZA = 'eliminado'
        ORDER BY c.I006ID_COBRANZA DESC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const resultadosModificados = results.map(row => {
            const per = row.periodo || '';
            if (per) {
                const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
                const parts = per.trim().split(/\s+/);
                let mesStr = parts[0];

                const idx = meses.findIndex(m => m.toLowerCase() === mesStr.toLowerCase());
                if (idx !== -1) {
                    let prevIdx = idx - 1;
                    if (prevIdx < 0) prevIdx = 11;
                    let anterior = meses[prevIdx];
                    row.periodo = `${mesStr}(${anterior})`;
                }
            }
            return row;
        });

        res.status(200).json(resultadosModificados);
    });
};

const eliminarReportesMasivos = async (req, res) => {
    const { ids_reportes } = req.body;
    if (!ids_reportes || !Array.isArray(ids_reportes) || ids_reportes.length === 0) {
        return res.status(400).json({ error: "No se proporcionaron IDs válidos para eliminar." });
    }
    const queryAsync = util.promisify(db.query).bind(db);
    try {
        await queryAsync("DELETE FROM tb009_lotes_detallado WHERE I008ID_REPORTE IN (?)", [ids_reportes]);
        await queryAsync("DELETE FROM tb007_detalle_cobranza WHERE I006ID_COBRANZA IN (SELECT I006ID_COBRANZA FROM tb006_cobranzas WHERE I008ID_REPORTE IN (?))", [ids_reportes]);
        await queryAsync("DELETE FROM tb006_cobranzas WHERE I008ID_REPORTE IN (?)", [ids_reportes]);
        await queryAsync("DELETE FROM tb008_lotes_archivados WHERE I008ID_REPORTE IN (?)", [ids_reportes]);

        res.status(200).json({ mensaje: `Se eliminaron ${ids_reportes.length} reportes y todo su historial correctamente.` });
    } catch (error) {
        console.error("Error en eliminación masiva:", error);
        res.status(500).json({ error: "Error interno al procesar la eliminación masiva: " + error.message });
    }
};

const enviarLoteAPapelera = async (req, res) => {
    const { id_periodo } = req.body; // Cambiado de id_reporte a id_periodo
    if (!id_periodo) {
        return res.status(400).json({ error: "No se proporcionó el ID del periodo." });
    }
    const queryAsync = util.promisify(db.query).bind(db);
    try {
        // 1. Mover las cobranzas de TODOS los reportes de ese periodo a estado 'eliminado'
        await queryAsync(`
            UPDATE tb006_cobranzas 
            SET E006ESTADO_COBRANZA = 'eliminado'
            WHERE I003ID_PERIODOS = ? AND I008ID_REPORTE IS NOT NULL
        `, [id_periodo]);

        // 2. Eliminar de tb009_lotes_detallado los registros que pertenecen a reportes de ese periodo
        await queryAsync(`
            DELETE FROM tb009_lotes_detallado 
            WHERE I008ID_REPORTE IN (SELECT I008ID_REPORTE FROM tb008_lotes_archivados WHERE I003ID_PERIODOS = ?)
        `, [id_periodo]);

        // Nota: NO eliminamos tb008_lotes_archivados para que el mes no desaparezca del menú.

        res.status(200).json({ mensaje: "Los registros de este periodo fueron enviados a la papelera." });
    } catch (error) {
        console.error("Error en enviarLoteAPapelera:", error);
        res.status(500).json({ error: "Error interno: " + error.message });
    }
};
module.exports = {
    crearCobranza,
    obtenerCobranza,
    obtenerCobranzaInactiva,
    marcarComoPagado,
    actualizarComprobantes,
    eliminarCobranza,
    restaurarCobranza,
    eliminarPermanentementeCobranza,
    guardarCobranzasMasivas,
    obtenerPendientesN8N,
    registrarPagoN8N,
    obtenerHistorialPagos,
    previaMasivo,
    limpiarHistorialCompleto,
    eliminarCobranzaPermanente,
    archivarHistorial,
    obtenerReportes,
    vaciarHistorialMesActual,
    obtenerBasureroDetallado,
    eliminarReporteDefinitivo,
    eliminarReportesMasivos,
    obtenerBasureroActual,
    listarClientesDirectorio,
    pasarTodosACobranzas,
    eliminarCobranzasMasivo,
    destruirCobranzasMasivo,
    enviarLoteAPapelera,
    marcarMasivoComoPagado,
    notificarCobranza,
    notificarRetrasoCobranza,
    notificarSuspensionCobranza,
    pasarIndividualACobranza
}