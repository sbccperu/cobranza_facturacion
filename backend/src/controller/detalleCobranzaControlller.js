const { json } = require("express");
const db = require("../config/db");

const crearDetalleCobranza = (req, res) => {
    const { id_cobranza, id_ruc, cantidad_documentos, monto_pagar } = req.body;
    if (!id_cobranza || !id_ruc || !cantidad_documentos || !monto_pagar) {
        return res.status(500).json({ mensaje: "Se necesita la la conbranza, el ruc, el numero total de documento y el monto a pagra" });
    }
    const query = "INSERT INTO tb007_detalle_cobranza (I006ID_COBRANZA, I005ID_RUC, I007CANTIDAD_DOCUMENTOS, D007MONTO_PAGAR) VALUES (?, ?, ?, ?)";
    db.query(query, [id_cobranza, id_ruc, cantidad_documentos, monto_pagar], (err, results) => {
        if (err) return res.status(400).json({ error: err.message });
        res.status(201).json({
            mensaje: "Exito en los detalles",
            id_detalle_cobranza: results.insertId
        })
    });
}
const obtenerDetallesCobranza = (req, res) => {
    const query = "SELECT * FROM tb007_detalle_cobranza WHERE E007ESTADO_DETALLE != 'eliminado'";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        const detallesCobranzaLimpiar = results.map(detallesCobranza => ({
            id_detalle_cobranza: detallesCobranza.I007ID_DETALLE,
            id_cobranza: detallesCobranza.I006ID_COBRANZA,
            id_ruc: detallesCobranza.I005ID_RUC,
            cantidad_documentos: detallesCobranza.I007CANTIDAD_DOCUMENTOS,
            monto_pagar: detallesCobranza.D007MONTO_PAGAR,
            estado_detallesCobranza: detallesCobranza.E007ESTADO_DETALLE
        }));
        res.json(detallesCobranzaLimpiar);
    });
}

const eliminarCobranzaDetalle = (req, res) => {
    const { id_detalle_cobranza } = req.params;
    const query = "UPDATE tb007_detalle_cobranza SET E007ESTADO_DETALLE = 'eliminado' WHERE I007ID_DETALLE = ?";
    db.query(query, [id_detalle_cobranza], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) {
            return res.status(400).json({ mensaje: "Los detalles en cobranza no exiten" });
        }
        res.json({
            mensaje: "Los detalles en cobranza fueron enviados papelera correctamente",
            id_detalle_cobranza: id_detalle_cobranza
        });
    });
};
const restaurarCobranzaDetalle = (req, res) => {
    const { id_detalle_cobranza } = req.params;
    const query = "UPDATE tb007_detalle_cobranza SET E007ESTADO_DETALLE = 'activo' WHERE I007ID_DETALLE = ? AND E007ESTADO_DETALLE = 'eliminado'";
    db.query(query, [id_detalle_cobranza], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Los detalles en cobranza no estan en la papelera" });
        res.json({ mensaje: "Los detalles en cobranza fueron restaurados exitosamente" });
    });
};

const destruirCobranzaDetalle = (req, res) => {
    const { id_detalle_cobranza } = req.params;
    const query = "DELETE FROM tb007_detalle_cobranza WHERE I007ID_DETALLE = ? AND E007ESTADO_DETALLE = 'eliminado'";
    db.query(query, [id_detalle_cobranza], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: "No se puede borrar porque no está en la papelera o no existe" });
        res.json({ mensaje: "Los detalles en cobranza fueron eliminados de la base de datos para siempre" })
    });
};


module.exports = {
    crearDetalleCobranza,
    obtenerDetallesCobranza,
    eliminarCobranzaDetalle,
    restaurarCobranzaDetalle,
    destruirCobranzaDetalle
}