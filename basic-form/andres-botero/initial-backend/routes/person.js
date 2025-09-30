const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /persons
router.get("/", (req, res) => {
    db.query("SELECT * FROM persons", (err, results) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                message: "Error al obtener las personas",
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Personas obtenidas correctamente",
            data: results,
        });
    });
});

// GET /persons/search 
router.get("/search", (req, res) => {
    const { email } = req.query;
    
    if (!email) {
        return res.status(400).json({
            status: 400,
            message: "Email requerido",
        });
    }

    db.query("SELECT * FROM persons WHERE email = ?", [email], (err, results) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                message: "Error al buscar la persona",
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "Persona no encontrada",
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Persona encontrada",
            data: results[0],
        });
    });
});

//GET /persons/:id 
router.get("/:id", (req, res) => {
    const personId = req.params.id;
    
    // Buscar por ID
    db.query("SELECT * FROM persons WHERE id = ?", [personId], (err, results) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                message: "Error al obtener la persona",
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "Persona no encontrada",
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Persona obtenida correctamente",
            data: results[0],
        });
    });
});

//POST /persons 
router.post("/", (req, res) => {
    const { name, email, status } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            status: 400,
            message: "Nombre y email son requeridos",
        });
    }

    db.query(
        "INSERT INTO persons (name, email, status) VALUES (?, ?, ?)",
        [name, email, status || 'active'],
        (err, result) => {
            if (err) {
                // Error de email duplicado
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({
                        status: 409,
                        message: "El email ya está registrado",
                    });
                }
                
                return res.status(500).json({
                    status: 500,
                    message: "Error al crear la persona",
                });
            }

            return res.status(201).json({
                status: 201,
                message: "Persona creada exitosamente",
                data: { id: result.insertId, name, email, status: status || 'active' },
            });
        }
    );
});

//PUT /persons/:id 
router.put("/:id", (req, res) => {
    const { name, email, status } = req.body;
    const personId = req.params.id;

    if (!name || !email) {
        return res.status(400).json({
            status: 400,
            message: "Nombre y email son requeridos",
        });
    }

    db.query(
        "UPDATE persons SET name=?, email=?, status=? WHERE id=?",
        [name, email, status || 'active', personId],
        (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({
                        status: 409,
                        message: "El email ya está registrado",
                    });
                }

                return res.status(500).json({
                    status: 500,
                    message: "Error al actualizar la persona",
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    status: 404,
                message: "Persona no encontrada",
                });
            }

            return res.status(200).json({
                status: 200,
                message: "Persona actualizada correctamente",
                data: { id: personId, name, email, status: status || 'active' },
            });
        }
    );
});

//DELETE /persons/:id 
router.delete("/:id", (req, res) => {
    const personId = req.params.id;

    db.query("DELETE FROM persons WHERE id=?", [personId], (err, result) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                message: "Error al eliminar la persona",
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 404,
                message: "Persona no encontrada",
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Persona eliminada correctamente",
        });
    });
});

module.exports = router;