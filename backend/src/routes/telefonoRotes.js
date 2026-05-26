const express = require('express');
const router = express.Router();
const telefonoController = require('../controller/telefonoController');

router.post('/registrar', telefonoController.crearTelefono);
router.get('/cliente/:id_cliente', telefonoController.obtenerTelefonos);
router.put('/eliminar/:id_telefono', telefonoController.eliminarTelefono);
router.put('/restaurar/:id_telefono', telefonoController.restaurarTelefono);
router.delete('/destruir/:id_telefono', telefonoController.destruirTelefono);

module.exports = router;