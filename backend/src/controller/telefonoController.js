const db = require('../config/db');

const obtenerTelefonos = (req, res) => {
    const query = "SELECT * FROM tb004_telefonos WHERE I002ID_CLIENTE = ? AND E004ESTADO_TELEFONO != 'eliminado'";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        const telefonoLimpiar = results.map(telefono => ({
            id_telefono: telefono.I004ID_TELEFONO,
            id_cliente: telefono.I002ID_CLIENTE,
            numero: telefono.V004NUMERO,
            estado_telefono: telefono.E004ESTADO_TELEFONO
        }));
        res.json(telefonoLimpiar);
    });
};
const crearTelefono = (req, res) => {
    const { id_cliente, numero } = req.body;
    if (!id_cliente || !numero) {
        return res.status(400).json({ error: 'El id del cliente y el número de teléfono son requeridos' });
    }
    const query = "INSERT INTO tb004_telefonos (I002ID_CLIENTE, V004NUMERO) VALUES (?, ?)";
    db.query(query, [id_cliente, numero], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({
            mensaje: "Telefono creado de manera exitosa",
            id_telefono: results.insertId
        });
    });
}

const eliminarTelefono = (req, res) => {
    const { id_telefono } = req.params;
    const query = "UPDATE tb004_telefonos SET E004ESTADO_TELEFONO = 'eliminado' WHERE I004ID_TELEFONO = ?";
    db.query(query, [id_telefono], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) {
            return res.status(400).json({ mensaje: "El telefono no exite" });
        }
        res.json({
            mensaje: "Telefono enviado a la papelera correctamente",
            id_telefono: id_telefono
        });
    });
};

const restaurarTelefono = (req, res) => {
    const { id_telefono } = req.params;
    const query = "UPDATE tb004_telefonos SET E004ESTADO_TELEFONO = 'activo' WHERE I004ID_TELEFONO = ? AND E004ESTADO_TELEFONO = 'eliminado'";
    db.query(query, [id_telefono], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: "El telefono no esta en la papelera" });
        res.json({ mensaje: "Telefono restaurado exitosamente" });
    });
};

const destruirTelefono = (req, res) => {
    const { id_telefono } = req.params;
    const query = "DELETE FROM tb004_telefonos WHERE I004ID_TELEFONO = ? AND E004ESTADO_TELEFONO = 'eliminado'";
    db.query(query, [id_telefono], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: "No se puede borrar porque no está en la papelera o no existe" });
        res.json({ mensaje: "Telefono eliminado de la base de datos para siempre" })
    });
};

module.exports = {
    obtenerTelefonos,
    crearTelefono,
    eliminarTelefono,
    restaurarTelefono,
    destruirTelefono
}