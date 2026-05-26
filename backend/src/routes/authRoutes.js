const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

router.post('/login', authController.login);
router.post('/registrar', authController.resgistrarAdmin);

module.exports = router;