const express = require('express');
const router = express.Router();
const { obtenerEstado } = require('../config/whatsappClient');

router.get('/estado', (req, res) => {
    const info = obtenerEstado();
    res.json(info);
});

module.exports = router;
