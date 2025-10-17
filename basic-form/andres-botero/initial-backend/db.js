const mysql = require("mysql2");

// Configuración conexión
const connection = mysql.createConnection({
    host: "localhost",          
    user: "bootcamp_user",       
    password: "bootcamp", 
    database: "bootcamp_db"      
});



// Probar conexión
connection.connect(err => {
    if (err) {
        console.error("Error de conexion:", err);
        return;
    }
    console.log("Conectado a la base de datos");
});

module.exports = connection;
