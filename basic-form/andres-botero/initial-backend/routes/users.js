const express = require("express");
const router = express.Router();
const db = require("../db");

//GET /users
router.get("/", (req, res) => {
    db.query("SELECT * FROM users", (err, results) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                message: "Error al obtener usuarios",
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Usuarios obtenidos correctamente",
            data: results,
        });
    });
});

//GET /users/:id 
router.get("/:id", (req, res) => {
    db.query("SELECT * FROM users WHERE id = ?", [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                message: "Error al obtener el usuario",
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "Usuario no encontrado",
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Usuario obtenido correctamente",
            data: results[0],
        });
    });
});

//POST /users 
router.post("/", (req, res) => {
    const { name, email, status } = req.body;

    db.query(
        "INSERT INTO users (name, email, status) VALUES (?, ?, ?)",
        [name, email, status],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    status: 500,
                    message: "Error al crear el usuario",
                });
            }

            return res.status(201).json({
                status: 201,
                message: "Usuario creado correctamente",
                data: { id: result.insertId, name, email, status },
            });
        }
    );
});

//PUT /users/:id 
router.put("/:id", (req, res) => {
    const { name, email, status } = req.body;

    db.query(
        "UPDATE users SET name=?, email=?, status=? WHERE id=?",
        [name, email, status, req.params.id],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    status: 500,
                    message: "Error al actualizar el usuario",
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    status: 404,
                    message: "Usuario no encontrado",
                });
            }

            return res.status(200).json({
                status: 200,
                message: "Usuario actualizado correctamente",
                data: { id: req.params.id, name, email, status },
            });
        }
    );
});

//DELETE /users/:id 
router.delete("/:id", (req, res) => {
    db.query("DELETE FROM users WHERE id=?", [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                message: "Error al eliminar el usuario",
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 404,
                message: "Usuario no encontrado",
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Usuario eliminado correctamente",
        });
    });
});

// GET /users/by-email/:email
router.get("/by-email/:email", (req, res) => {
    const { email } = req.params;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                message: "Error al buscar el usuario",
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "Usuario no encontrado",
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Usuario encontrado correctamente",
            data: results[0],
        });
    });
});


module.exports = router;
