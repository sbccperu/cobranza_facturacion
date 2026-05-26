const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'AutoCAT2000';

const login = (req, res) => {
    const { nombre_usuario, password } = req.body;
    if (!nombre_usuario || !password) {
        return res.status(400).json({ mensaje: 'Porfavor ingrese su nombre de usuario y contraseña' });
    }

    const query = "SELECT * FROM tb001_usuarios WHERE V001NOMBRE_USUARIO = ? AND E001ESTADO_USUARIO = 'activo'";
    db.query(query, [nombre_usuario], async (err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error en la consulta a la base de datos' });
        }
        if (results.length === 0) {
            return res.status(401).json({ mensaje: 'El nombre de usuario no existe' });
        }
        const usuarioDB = results[0];
        const passwordValida = await bcrypt.compare(password, usuarioDB.V001PASSWORD);
        if (!passwordValida) {
            return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }
        const token = jwt.sign(
            { id: usuarioDB.I001ID_USUARIO, usuario: usuarioDB.V001NOMBRE_USUARIO },
            SECRET_KEY,
            { expiresIn: '8h' }
        );
        return res.json({
            mensaje: 'Inicio de sesión exitoso',
            token: token,
            usuario: {
                id: usuarioDB.I001ID_USUARIO,
                nombre_usuario: usuarioDB.V001NOMBRE_USUARIO,
                nombre_completo: usuarioDB.V001NOMBRE_COMPLETO,
                correo: usuarioDB.V001CORREO
            }
        });
    });
};
const resgistrarAdmin = async (req, res) => {
    const { V001NOMBRE_USUARIO, V001PASSWORD, V001NOMBRE_COMPLETO, V001CORREO } = req.body;

    if (!V001NOMBRE_USUARIO || !V001PASSWORD) {
        return res.status(400).json({ mensaje: 'V001NOMBRE_USUARIO y V001PASSWORD son requeridos' });
    }

    try {
        const passwordEncriptada = await bcrypt.hash(V001PASSWORD, 10);

        const query = 'INSERT INTO tb001_usuarios (V001NOMBRE_USUARIO, V001PASSWORD, V001NOMBRE_COMPLETO, V001CORREO) VALUES (?, ?, ?, ?)';
        db.query(query, [V001NOMBRE_USUARIO, passwordEncriptada, V001NOMBRE_COMPLETO, V001CORREO || null], (err, results) => {
            if (err) return res.status(500).json({ message: err.message });
            return res.status(201).json({
                mensaje: 'Usuario registrado exitosamente',
                id_usuario: results.insertId
            });
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error al registrar el usuario' });
    }
}
module.exports = {
    login,
    resgistrarAdmin
};

