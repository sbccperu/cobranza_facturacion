const db = require('../config/db');
const obtenerClientes = (req, res) => {
    const query = "CALL sp_obtener_directorio_clientes()";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
};

const obtenerClientesBasurero = (req, res) => {
    const query = "CALL sp_obtener_basurero_clientes()";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
};

const crearCliente = (req, res) => {
    const { nombre, telefono, ruc } = req.body;
    if (!nombre || !telefono || !ruc) return res.status(400).json({ error: "Faltan datos" });
    const query = "CALL sp_guardar_cliente_completo(?, ?, ?, NULL)";

    db.query(query, [nombre, telefono, ruc], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({
            mensaje: "Cliente creado exitosamente",
            id_cliente: results.insertId
        });
    });
};

const cambiarEstadoCliente = (req, res) => {
    const idUrl = req.params.id;
    const nuevoEstado = req.body.estado; // 'inactivo' o 'activo'

    const query = "UPDATE tb002_clientes SET E002ESTADO_CLIENTE = ? WHERE I002ID_CLIENTE = ?";
    db.query(query, [nuevoEstado, idUrl], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: `Cliente movido al estado: ${nuevoEstado}` });
    });
}

const cambiarEstadoMasivo = (req, res) => {
    const { ids, estado } = req.body;
    if (!ids || !ids.length) return res.status(400).json({ error: "No se proporcionaron IDs" });
    const query = "UPDATE tb002_clientes SET E002ESTADO_CLIENTE = ? WHERE I002ID_CLIENTE IN (?)";
    db.query(query, [estado, ids], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: `${results.affectedRows} clientes movidos al estado: ${estado}` });
    });
}

const eliminarClienteDefinitivo = async (req, res) => {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "No se proporcionó ID" });

    const util = require('util');
    const queryAsync = util.promisify(db.query).bind(db);

    try {
        // 1. Eliminación en cascada manual de datos vinculados
        await queryAsync("DELETE FROM tb007_detalle_cobranza WHERE I005ID_RUC IN (SELECT I005ID_RUC FROM tb005_rucs WHERE I002ID_CLIENTE = ?)", [id]);
        await queryAsync("DELETE FROM tb007_detalle_cobranza WHERE I006ID_COBRANZA IN (SELECT I006ID_COBRANZA FROM tb006_cobranzas WHERE I002ID_CLIENTE = ?)", [id]);

        await queryAsync("DELETE FROM tb006_cobranzas WHERE I002ID_CLIENTE = ?", [id]);
        await queryAsync("DELETE FROM tb004_telefonos WHERE I002ID_CLIENTE = ?", [id]);
        await queryAsync("DELETE FROM tb005_rucs WHERE I002ID_CLIENTE = ?", [id]);

        // 2. Finalmente eliminar el cliente
        const results = await queryAsync("DELETE FROM tb002_clientes WHERE I002ID_CLIENTE = ?", [id]);

        if (results.affectedRows === 0) return res.status(404).json({ error: "El cliente no existe o ya fue borrado." });

        res.json({ mensaje: "Cliente y todos sus datos vinculados borrados permanentemente." });
    } catch (err) {
        console.error("Error en eliminarClienteDefinitivo:", err);
        res.status(500).json({ error: "Error en base de datos al eliminar registros vinculados: " + err.message });
    }
};

const editarCliente = async (req, res) => {
    const { id, nombre, telefonos, rucs } = req.body;
    if (!id || !nombre) return res.status(400).json({ error: "Faltan datos obligatorios" });

    const util = require('util');
    const queryAsync = util.promisify(db.query).bind(db);

    try {
        // 1. Actualizar nombre de cliente
        await queryAsync("UPDATE tb002_clientes SET V002NOMBRE_CLIENTE = ? WHERE I002ID_CLIENTE = ?", [nombre, id]);

        // 2. Marcar telefonos viejos como eliminados (Soft Delete)
        await queryAsync("UPDATE tb004_telefonos SET E004ESTADO_TELEFONO = 'eliminado' WHERE I002ID_CLIENTE = ?", [id]);

        // 3. Marcar RUCs viejos como eliminados (Soft Delete) 
        await queryAsync("UPDATE tb005_rucs SET E005ESTADO_RUC = 'eliminado' WHERE I002ID_CLIENTE = ?", [id]);

        // 4. Preparar nuevos inserts / updates
        const phoneStr = (telefonos || '').toString().replace(/\s?\/\s?/g, ',');
        const rucStr = (rucs || '').toString().replace(/\s?\/\s?/g, ',');
        const phoneArray = phoneStr ? phoneStr.split(',').map(t => t.trim()).filter(t => t) : [];
        const rucArray = rucStr ? rucStr.split(',').map(r => r.trim()).filter(r => r) : [];

        // 5. Procesar Telefonos
        for (const phone of phoneArray) {
            const resPhone = await queryAsync("UPDATE tb004_telefonos SET E004ESTADO_TELEFONO = 'activo' WHERE I002ID_CLIENTE = ? AND V004NUMERO = ?", [id, phone]);
            if (resPhone.affectedRows === 0) {
                await queryAsync("INSERT INTO tb004_telefonos (I002ID_CLIENTE, V004NUMERO, E004ESTADO_TELEFONO) VALUES (?, ?, 'activo')", [id, phone]);
            }
        }

        // 6. Procesar RUCs
        for (const ruc of rucArray) {
            const resRuc = await queryAsync("UPDATE tb005_rucs SET E005ESTADO_RUC = 'activo', V005RAZON_SOCIAL = ? WHERE I002ID_CLIENTE = ? AND V005NUMERO_RUC = ?", [nombre, id, ruc]);
            if (resRuc.affectedRows === 0) {
                await queryAsync("INSERT INTO tb005_rucs (I002ID_CLIENTE, V005NUMERO_RUC, V005RAZON_SOCIAL, E005ESTADO_RUC) VALUES (?, ?, ?, 'activo')", [id, ruc, nombre]);
            }
        }

        res.status(200).json({ mensaje: "Cliente editado exitosamente" });
    } catch (err) {
        console.error("Error en editarCliente:", err);
        res.status(500).json({ error: err.message });
    }
};

const destruirClientesMasivo = async (req, res) => {
    const { ids } = req.body;
    if (!ids || !ids.length) return res.status(400).json({ error: "No se proporcionaron IDs" });

    const util = require('util');
    const queryAsync = util.promisify(db.query).bind(db);

    try {
        // IDs son un array [1,2,3...]
        // 1. Eliminar de tb007_detalle_cobranza (por RUC o por Cobranza)
        // Eliminamos detalles que referencian a RUCs del cliente a borrar
        await queryAsync("DELETE FROM tb007_detalle_cobranza WHERE I005ID_RUC IN (SELECT I005ID_RUC FROM tb005_rucs WHERE I002ID_CLIENTE IN (?))", [ids]);
        // Eliminamos detalles que referencian a cobranzas del cliente a borrar
        await queryAsync("DELETE FROM tb007_detalle_cobranza WHERE I006ID_COBRANZA IN (SELECT I006ID_COBRANZA FROM tb006_cobranzas WHERE I002ID_CLIENTE IN (?))", [ids]);

        // 2. Eliminar cobranzas (maestro) logicamente asocia al cliente
        await queryAsync("DELETE FROM tb006_cobranzas WHERE I002ID_CLIENTE IN (?)", [ids]);

        // 3. Eliminar teléfonos y RUCs
        await queryAsync("DELETE FROM tb004_telefonos WHERE I002ID_CLIENTE IN (?)", [ids]);
        await queryAsync("DELETE FROM tb005_rucs WHERE I002ID_CLIENTE IN (?)", [ids]);

        // 4. Finalmente eliminar los clientes
        const results = await queryAsync("DELETE FROM tb002_clientes WHERE I002ID_CLIENTE IN (?)", [ids]);

        res.json({ mensaje: `${results.affectedRows} clientes destruidos permanentemente con todo su historial.` });
    } catch (err) {
        console.error("Error en destruirClientesMasivo:", err);
        res.status(500).json({ error: "Error de base de datos (posible registro vinculado): " + err.message });
    }
};

module.exports = {
    obtenerClientes,
    obtenerClientesBasurero,
    crearCliente,
    cambiarEstadoCliente,
    eliminarClienteDefinitivo,
    destruirClientesMasivo,
    editarCliente,
    cambiarEstadoMasivo
};

