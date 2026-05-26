const db = require('../config/db');
const bcrypt = require('bcrypt');

const obtenerUsuarios = (req, res) => {
    const query = "SELECT I001ID_USUARIO, V001NOMBRE_USUARIO, V001CORREO, V001NOMBRE_COMPLETO, E001ESTADO_USUARIO FROM tb001_usuarios WHERE E001ESTADO_USUARIO != 'eliminado'";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        const usuarios = results.map(u => ({
            id: u.I001ID_USUARIO,
            nombre_usuario: u.V001NOMBRE_USUARIO,
            correo: u.V001CORREO,
            nombre_completo: u.V001NOMBRE_COMPLETO,
            estado: u.E001ESTADO_USUARIO
        }));
        res.json(usuarios);
    });
};

const editarUsuario = async (req, res) => {
    const { id, nombre_usuario, correo, nombre_completo, password } = req.body;
    if (!id || !nombre_usuario) return res.status(400).json({ error: "Faltan datos" });
    db.query(
        "UPDATE tb001_usuarios SET V001NOMBRE_USUARIO = ?, V001CORREO = ?, V001NOMBRE_COMPLETO = ? WHERE I001ID_USUARIO = ?",
        [nombre_usuario, correo, nombre_completo, id],
        async (err) => {
            if (err) return res.status(500).json({ error: err.message });
            if (password && password.trim() !== '') {
                const hashNuevo = await bcrypt.hash(password, 10);
                db.query("UPDATE tb001_usuarios SET V001PASSWORD = ? WHERE I001ID_USUARIO = ?",
                    [hashNuevo, id],
                    (err2) => {
                        if (err2) return res.status(500).json({ error: err2.message });
                        res.json({ mensaje: "Usuario editado con nueva contraseña" });
                    }
                );
            } else {
                res.json({ mensaje: "Usuario editado exitosamente" });
            }
        }
    );
};

const cambiarEstadoUsuario = (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    db.query("UPDATE tb001_usuarios SET E001ESTADO_USUARIO = ? WHERE I001ID_USUARIO = ?", [estado, id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: `Usuario cambiado a ${estado}` });
    });
};

const obtenerUsuariosBasurero = (req, res) => {
    const query = "SELECT I001ID_USUARIO, V001NOMBRE_USUARIO, V001CORREO, V001NOMBRE_COMPLETO FROM tb001_usuarios WHERE E001ESTADO_USUARIO = 'eliminado'";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        const usuarios = results.map(u => ({
            id: u.I001ID_USUARIO,
            nombre_usuario: u.V001NOMBRE_USUARIO,
            correo: u.V001CORREO,
            nombre_completo: u.V001NOMBRE_COMPLETO
        }));
        res.json(usuarios);
    });
};

const eliminarUsuarioDefinitivo = (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM tb001_usuarios WHERE I001ID_USUARIO = ? AND E001ESTADO_USUARIO = 'eliminado'",
        [id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ mensaje: "No se puede borrar porque no está en la papelera" });
            res.json({ mensaje: "Usuario eliminado permanentemente" });
        }
    );
};

module.exports = {
    obtenerUsuarios,
    editarUsuario,
    cambiarEstadoUsuario,
    obtenerUsuariosBasurero,
    eliminarUsuarioDefinitivo
}

