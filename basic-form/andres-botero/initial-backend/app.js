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

// Importar rutas desde los microservicios
const messagesRoutes = require("./src/messages");
const usersRoutes = require("./src/users"); 

// Uso de rutas
app.use("/messages", messagesRoutes); 
app.use("/users", usersRoutes); 

// Ruta de prueba
app.get("/", (req, res) => {
    res.json({
        message: "API de Reclamos funcionando correctamente",
        version: "2.0.0 - Arquitectura Hexagonal",
        endpoints: {
            users: "/users",
            messages: "/messages"
        }
    });
});

module.exports = app;