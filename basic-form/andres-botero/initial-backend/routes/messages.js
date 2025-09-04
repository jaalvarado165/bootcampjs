const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /messages 
router.get("/", (req, res) => {
const sql = `
    SELECT  r.id, r.type, r.message, 
            u.id AS user_id, 
            u.name AS user_name, 
            u.email AS user_email
    FROM responses r
    INNER JOIN users u ON r.user_id = u.id
    ORDER BY r.id DESC
`;

db.query(sql, (err, results) => {
    if (err) {
        return res.status(500).json({
            status: 500,
            message: "Error al obtener los mensajes",
            data: null,
        });
    }
        return res.status(200).json({
            status: 200,
        message: "Mensajes obtenidos correctamente",
        data: results,
        });
    });
});

// GET /messages/:id 
router.get("/:id", (req, res) => {
const sql = `
    SELECT  r.id, r.type, r.message, 
            u.id AS user_id, 
            u.name AS user_name, 
            u.email AS user_email
    FROM responses r
    INNER JOIN users u ON r.user_id = u.id
    WHERE r.id = ?
`;

db.query(sql, [req.params.id], (err, results) => {
    if (err) {
        return res.status(500).json({
            status: 500,
            message: "Error al obtener el mensaje",
            data: null,
        });
    }
        if (results.length === 0) {
        return res.status(404).json({
            status: 404,
            message: "Mensaje no encontrado",
            data: null,
        });
    }
        return res.status(200).json({
            status: 200,
            message: "Mensaje obtenido correctamente",
            data: results[0],
        });
    });
});

// POST /messages 
router.post("/", (req, res) => {
const { type, user_id, message } = req.body;

    db.query(
        "INSERT INTO responses (type, user_id, message) VALUES (?, ?, ?)",
        [type, user_id, message],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                status: 500,
                message: "Error al crear el mensaje",
                data: null,
                });
            }
            return res.status(201).json({
                status: 201,
                message: "Mensaje creado correctamente",
                data: { id: result.insertId, type, user_id, message },
            });
        }
    );
});


// PUT 
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { type, message, user_id } = req.body;

    console.log("📩 Datos recibidos en PUT:", req.body, "ID:", id);

    if (!type || !message || !user_id) {
        return res.status(400).json({ status: 400, message: "Faltan datos para actualizar" });
    }

    db.query(
        "UPDATE responses SET type = ?, message = ?, user_id = ? WHERE id = ?",
        [type, message, user_id, id],
        (err, result) => {
        if (err) {
            console.error("❌ Error en BD al actualizar:", err);
            return res.status(500).json({ status: 500, message: "Error en la base de datos" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: 404, message: "Mensaje no encontrado" });
        }

        res.json({ status: 200, message: "✅ Mensaje actualizado correctamente" });
        }
    );
});

// DELETE /messages/:id 
router.delete("/:id", (req, res) => {
    db.query("DELETE FROM responses WHERE id=?", [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({
            status: 500,
            message: "Error al eliminar el mensaje",
            data: null,
        });
    }
        if (result.affectedRows === 0) {
            return res.status(404).json({
            status: 404,
            message: "Mensaje no encontrado",
            data: null,
        });
    }
        return res.status(200).json({
            status: 200,
            message: "Mensaje eliminado correctamente",
            data: null,
        });
    });
});

module.exports = router;
