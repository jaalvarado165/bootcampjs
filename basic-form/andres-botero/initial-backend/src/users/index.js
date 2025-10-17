const express = require("express");
const router = express.Router();

// Importar adaptadores
const getAllUsers = require("./adapters/getAllUsers");
const getUserById = require("./adapters/getUserById");
const searchUserByEmail = require("./adapters/searchUserByEmail");
const postRegister = require("./adapters/postRegister");
const postLogin = require("./adapters/postLogin");
const putUser = require("./adapters/putUser");
const deleteUser = require("./adapters/deleteUser");

// Definición de rutas
router.get("/", getAllUsers);
router.get("/search", searchUserByEmail);
router.get("/:id", getUserById);
router.post("/register", postRegister);
router.post("/login", postLogin);
router.put("/:id", putUser);
router.delete("/:id", deleteUser);

module.exports = router;