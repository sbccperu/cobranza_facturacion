const db = require("../config/db");

const crearPeriodo = (req, res) => {
    const { fecha_inicio, fecha_fin, descripcion } = req.body;
    if (!fecha_inicio || !fecha_fin || !descripcion) {
        return res.status(400).json({ error: "Se necesita una fecha de inico, fin y una descripcon, son requeridos" })
    }
    const query = "INSERT INTO tb003_periodos (D003FECHA_INICIO, D003FECHA_FIN, V003DESCRIPCION) VALUES (?, ?, ?)";
    db.query(query, [fecha_inicio, fecha_fin, descripcion], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({
            menaje: "Periodo creado con exito",
            id_periodo: results.insertId
        })
    });
};

const obtenerPeriodo = (req, res) => {
    const query = "SELECT * FROM tb003_periodos WHERE E003ESTADO_PERIODO != 'eliminado'";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        const periodoLimpiar = results.map(periodo => ({
            id_periodo: periodo.I003ID_PERIODOS,
            fecha_inicio: periodo.D003FECHA_INICIO,
            fecha_fin: periodo.D003FECHA_FIN,
            descripcion: periodo.V003DESCRIPCION
        }));
        res.json(periodoLimpiar);
    });
}

const eliminarPeriodo = (req, res) => {
    const { id_periodo } = req.params;
    const query = "UPDATE tb003_periodos SET E003ESTADO_PERIODO = 'eliminado' WHERE I003ID_PERIODOS = ?";
    db.query(query, [id_periodo], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) {
            return res.status(400).json({ mensaje: "El periodo no exite" });
        }
        res.json({
            mensaje: "Periodo enviado a la papelera correctamente",
            id_periodo: id_periodo
        });
    });
};

const restaurarPeriodo = (req, res) => {
    const { id_periodo } = req.params;
    const query = "UPDATE tb003_periodos SET E003ESTADO_PERIODO = 'activo' WHERE I003ID_PERIODOS = ? AND E003ESTADO_PERIODO = 'eliminado'";
    db.query(query, [id_periodo], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: "El periodo no esta en la papelera" });
        res.json({ mensaje: "Periodo restaurado exitosamente" });
    });
};

const destruirPeriodo = (req, res) => {
    const { id_periodo } = req.params;
    const query = "DELETE FROM tb003_periodos WHERE I003ID_PERIODOS = ? AND E003ESTADO_PERIODO = 'eliminado'";
    db.query(query, [id_periodo], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: "No se puede borrar porque no está en la papelera o no existe" });
        res.json({ mensaje: "Perido eliminado de la base de datos para siempre" })
    });
};

// Auto-crear el periodo del mes actual si no existe
const autocrearPeriodoActual = async (req, res) => {
    const queryAsync = require('util').promisify(db.query).bind(db);
    const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                   'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const hoy = new Date();
    const mes = hoy.getMonth();
    const anio = hoy.getFullYear();
    const descripcion = `${MESES[mes]} ${anio}`;
    const primero = `${anio}-${String(mes + 1).padStart(2,'0')}-01`;
    const ultimoDia = new Date(anio, mes + 1, 0).getDate();
    const ultimoStr = `${anio}-${String(mes + 1).padStart(2,'0')}-${String(ultimoDia).padStart(2,'0')}`;

    try {
        const existente = await queryAsync(
            "SELECT I003ID_PERIODOS as id_periodo FROM tb003_periodos WHERE V003DESCRIPCION = ? LIMIT 1",
            [descripcion]
        );
        if (existente.length > 0) {
            return res.json({ mensaje: `El periodo "${descripcion}" ya existe.`, id_periodo: existente[0].id_periodo, creado: false });
        }
        const result = await queryAsync(
            "INSERT INTO tb003_periodos (D003FECHA_INICIO, D003FECHA_FIN, V003DESCRIPCION) VALUES (?, ?, ?)",
            [primero, ultimoStr, descripcion]
        );
        res.status(201).json({ mensaje: `Periodo "${descripcion}" creado automáticamente.`, id_periodo: result.insertId, creado: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    crearPeriodo,
    obtenerPeriodo,
    eliminarPeriodo,
    restaurarPeriodo,
    destruirPeriodo,
    autocrearPeriodoActual
}