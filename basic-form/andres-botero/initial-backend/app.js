const express = require("express");
const cors = require("cors");
const config = require("./config");
const db = require("./db"); 


const app = express();

// Middleware para aceptar JSON
app.use(express.json());
app.use(cors()); 

// Configuración del puerto
app.set("port", config.app.port);


// Importar rutas 
const messagesRoutes = require("./routes/messages");
const usersRoutes = require("./routes/users"); 


//uso rutas
app.use("/messages", messagesRoutes); 
app.use("/users", usersRoutes); 


module.exports = app;
