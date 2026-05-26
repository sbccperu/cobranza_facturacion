const express = require('express');
const router = express.Router();
const clienteController = require('../controller/clienteController');

router.post('/registrar', clienteController.crearCliente);
router.get('/listar', clienteController.obtenerClientes);
router.get('/listar-basurero', clienteController.obtenerClientesBasurero);
router.put('/editar/:id', clienteController.editarCliente);
router.put('/eliminar/:id', clienteController.cambiarEstadoCliente);
router.put('/restaurar/:id', clienteController.cambiarEstadoCliente);
router.delete('/destruir/:id', clienteController.eliminarClienteDefinitivo);
router.post('/destruir-masivo', clienteController.destruirClientesMasivo);
router.post('/cambiar-estado-masivo', clienteController.cambiarEstadoMasivo);

module.exports = router;