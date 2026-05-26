const db = require('./src/config/db');
db.query("DESCRIBE tb006_cobranzas", (err, res) => {
    if (err) { console.error(err); process.exit(1); }
    console.log(JSON.stringify(res, null, 2));
    process.exit(0);
});
