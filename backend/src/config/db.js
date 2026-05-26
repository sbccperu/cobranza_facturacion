const mysql2 = require("mysql2");

const connection = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "sistema_cobranzas",
    port: 3306,
    timezone: "-05:00"
});
connection.connect((err) => {
    if (err) {
        console.error("No se encontor conexion con la mysql2: ", err.message);
        return;
    }
    console.log("conexion exitosa");
});
module.exports = connection;
