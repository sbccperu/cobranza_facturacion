const express = require('express');
const router = express.Router();
const periodoController = require('../controller/periodoController');

router.post("/registrar", periodoController.crearPeriodo);
router.get("/", periodoController.obtenerPeriodo);
router.get("/listar", periodoController.obtenerPeriodo);
router.put('/eliminar/:id_periodo', periodoController.eliminarPeriodo);
router.put('/restaurar/:id_periodo', periodoController.restaurarPeriodo);
router.delete('/destruir/:id_periodo', periodoController.destruirPeriodo);
router.post('/autocreate', periodoController.autocrearPeriodoActual);

module.exports = router;