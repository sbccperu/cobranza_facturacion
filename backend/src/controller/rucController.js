const db = require('../config/db');

const obtenerRUCs = (req, res) => {
    const query = "SELECT * FROM tb005_rucs WHERE I002ID_CLIENTE = ? AND E005ESTADO_RUC != 'eliminado'";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        const rucsLimpios = results.map(rucs => ({
            id_ruc: rucs.I005ID_RUC,
            id_cliente: rucs.I002ID_CLIENTE,
            numero_ruc: rucs.V005NUMERO_RUC,
            razon_social: rucs.V005RAZON_SOCIAL,
            estado_ruc: rucs.E005ESTADO_RUC
        }));
        res.json(rucsLimpios);
    })
};
const crearRUC = (req, res) => {
    const { id_cliente, numero_ruc, razon_social } = req.body;
    if (!id_cliente || !numero_ruc) {
        return res.status(400).json({ error: 'El id del cliente y el número de RUC son requeridos' });
    }
    const query = "INSERT INTO tb005_rucs (I002ID_CLIENTE, V005NUMERO_RUC, V005RAZON_SOCIAL) VALUES (?, ?, ?)";
    db.query(query, [id_cliente, numero_ruc, razon_social], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({
            mensaje: "Ruc creado con exito",
            id_ruc: results.insertId
        });
    });
};

const eliminarRuc = (req, res) => {
    const { id_ruc } = req.params;
    const query = "UPDATE tb005_rucs SET E005ESTADO_RUC = 'eliminado' WHERE I005ID_RUC = ?";
    db.query(query, [id_ruc], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) {
            return res.status(400).json({ mensaje: "El ruc no exite" });
        }
        res.json({
            mensaje: "Ruc enviado a la papelera correctamente",
            id_ruc: id_ruc
        });
    });
};

const restaurarRuc = (req, res) => {
    const { id_ruc } = req.params;
    const query = "UPDATE tb005_rucs SET E005ESTADO_RUC = 'activo' WHERE I005ID_RUC = ? AND E005ESTADO_RUC = 'eliminado'";
    db.query(query, [id_ruc], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: "El ruc no esta en la papelera" });
        res.json({ mensaje: "Ruc restaurado exitosamente" });
    });
};

const destruirRuc = (req, res) => {
    const { id_ruc } = req.params;
    const query = "DELETE FROM tb005_rucs WHERE I005ID_RUC = ? AND E005ESTADO_RUC = 'eliminado'";
    db.query(query, [id_ruc], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: "No se puede borrar porque no está en la papelera o no existe" });
        res.json({ mensaje: "Ruc eliminado de la base de datos para siempre" })
    });
};

module.exports = {
    crearRUC,
    obtenerRUCs,
    eliminarRuc,
    restaurarRuc,
    destruirRuc
}