const express = require('express');
const router = express.Router();
const detalleCobranzaController = require('../controller/detalleCobranzaControlller');

router.post("/registrar", detalleCobranzaController.crearDetalleCobranza),
router.get("/cobranza/:id_cobranza", detalleCobranzaController.obtenerDetallesCobranza)
router.put('/eliminar/:id_detalle_cobranza', detalleCobranzaController.eliminarCobranzaDetalle);
router.put('/restaurar/:id_detalle_cobranza', detalleCobranzaController.restaurarCobranzaDetalle);
router.delete('/destruir/:id_detalle_cobranza', detalleCobranzaController.destruirCobranzaDetalle);

module.exports = router;