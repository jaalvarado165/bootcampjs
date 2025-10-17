const express = require("express");
const router = express.Router();

// Importar adaptadores
const getAllMessages = require("./adapters/getAllMessages");
const getMessageById = require("./adapters/getMessageById");
const postMessage = require("./adapters/postMessage");
const putMessage = require("./adapters/putMessage");
const deleteMessage = require("./adapters/deleteMessage");

// Definición de rutas
router.get("/", getAllMessages);
router.get("/:id", getMessageById);
router.post("/", postMessage);
router.put("/:id", putMessage);
router.delete("/:id", deleteMessage);

module.exports = router;