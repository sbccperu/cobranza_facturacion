const express = require('express');
const router = express.Router();
const rucController = require('../controller/rucController');

router.post('/registrar', rucController.crearRUC);
router.get('/cliente/:id_cliente', rucController.obtenerRUCs);
router.put('/eliminar/:id_ruc', rucController.eliminarRuc);
router.put('/restaurar/:id_ruc', rucController.restaurarRuc);
router.delete('/destruir/:id_ruc', rucController.destruirRuc);

module.exports = router;