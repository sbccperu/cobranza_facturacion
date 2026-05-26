const db = require('./src/config/db');
db.query("ALTER TABLE tb006_cobranzas ADD COLUMN I006PENDIENTE TINYINT(1) DEFAULT 0", (err, res) => {
    if (err) { console.error(err); process.exit(1); }
    console.log("Columna I006PENDIENTE agregada con éxito");
    process.exit(0);
});
