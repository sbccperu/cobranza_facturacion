const express = require('express');
const router = express.Router();
const usuarioController = require('../controller/usuarioController');

router.get('/listar', usuarioController.obtenerUsuarios);
router.get('/basurero', usuarioController.obtenerUsuariosBasurero);
router.put('/editar', usuarioController.editarUsuario);
router.put('/estado/:id', usuarioController.cambiarEstadoUsuario);
router.delete('/destruir/:id', usuarioController.eliminarUsuarioDefinitivo);

module.exports = router;