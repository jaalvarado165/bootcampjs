const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db");

// Configuración para encriptación
const saltRounds = 10;

// GET /users - Obtener todos los usuarios
router.get("/", (req, res) => {
    // No devolvemos las contraseñas por seguridad
    const sql = "SELECT id, name, email, role, status, created_at FROM users ORDER BY id DESC";
    
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                message: "Error al obtener los usuarios",
                data: null,
            });
        }
        
        return res.status(200).json({
            status: 200,
            message: "Usuarios obtenidos correctamente",
            data: results,
        });
    });
});

// GET /users/:id - Obtener un usuario específico
router.get("/:id", (req, res) => {
    const sql = "SELECT id, name, email, role, status, created_at FROM users WHERE id = ?";
    
    db.query(sql, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                message: "Error al obtener el usuario",
                data: null,
            });
        }
        
        if (results.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "Usuario no encontrado",
                data: null,
            });
        }
        
        return res.status(200).json({
            status: 200,
            message: "Usuario obtenido correctamente",
            data: results[0],
        });
    });
});

// GET /users/search - Buscar usuario por email
router.get("/search", (req, res) => {
    const { email } = req.query;
    
    if (!email) {
        return res.status(400).json({
            status: 400,
            message: "Email requerido",
        });
    }

    const sql = "SELECT id, name, email, role, status, created_at FROM users WHERE email = ?";
    
    db.query(sql, [email], (err, results) => {
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
            message: "Usuario encontrado",
            data: results[0],
        });
    });
});

// POST /users/register - Registrar nuevo usuario
router.post("/register", async (req, res) => {
    const { name, email, password, role, status } = req.body;

    // Validaciones básicas
    if (!name || !email || !password) {
        return res.status(400).json({
            status: 400,
            message: "Nombre, email y contraseña son requeridos",
        });
    }

    // Validar longitud mínima de contraseña
    if (password.length < 6) {
        return res.status(400).json({
            status: 400,
            message: "La contraseña debe tener al menos 6 caracteres",
        });
    }

    try {
        // Verificar si el email ya existe
        const checkEmailSql = "SELECT id FROM users WHERE email = ?";
        db.query(checkEmailSql, [email], async (err, existingUser) => {
            if (err) {
                return res.status(500).json({
                    status: 500,
                    message: "Error al verificar el email",
                });
            }

            if (existingUser.length > 0) {
                return res.status(409).json({
                    status: 409,
                    message: "El email ya está registrado",
                });
            }

            try {
                // Encriptar la contraseña
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                
                // Insertar usuario
                const insertSql = "INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)";
                
                db.query(insertSql, [name, email, hashedPassword, role || 'user', status || 'active'], (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            status: 500,
                            message: "Error al crear el usuario",
                        });
                    }

                    return res.status(201).json({
                        status: 201,
                        message: "Usuario registrado exitosamente",
                        data: { 
                            id: result.insertId, 
                            name, 
                            email, 
                            role: role || 'user',
                            status: status || 'active' 
                        },
                    });
                });
                
            } catch (hashError) {
                return res.status(500).json({
                    status: 500,
                    message: "Error al procesar la contraseña",
                });
            }
        });

    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Error interno del servidor",
        });
    }
});

// POST /users/login - Iniciar sesión
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Validaciones básicas
    if (!email || !password) {
        return res.status(400).json({
            status: 400,
            message: "Email y contraseña son requeridos",
        });
    }

    // Buscar usuario por email (incluyendo password para verificación)
    const sql = "SELECT id, name, email, password, role, status FROM users WHERE email = ?";
    
    db.query(sql, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                message: "Error al buscar el usuario",
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                status: 401,
                message: "Credenciales incorrectas",
            });
        }

        const user = results[0];

        // Verificar si el usuario está activo
        if (user.status !== 'active') {
            return res.status(401).json({
                status: 401,
                message: "Usuario inactivo",
            });
        }

        try {
            // Comparar contraseña encriptada
            const passwordMatch = await bcrypt.compare(password, user.password);
            
            if (!passwordMatch) {
                return res.status(401).json({
                    status: 401,
                    message: "Credenciales incorrectas",
                });
            }

            // Login exitoso - NO enviamos la contraseña
            return res.status(200).json({
                status: 200,
                message: "Login exitoso",
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    status: user.status
                },
            });

        } catch (compareError) {
            return res.status(500).json({
                status: 500,
                message: "Error al verificar la contraseña",
            });
        }
    });
});

// PUT /users/:id - Actualizar usuario
router.put("/:id", async (req, res) => {
    const { name, email, password, status } = req.body;
    const userId = req.params.id;

    if (!name || !email) {
        return res.status(400).json({
            status: 400,
            message: "Nombre y email son requeridos",
        });
    }

    try {
        let updateSql, updateValues;

        if (password) {
            // Si se proporciona nueva contraseña, encriptarla
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            updateSql = "UPDATE users SET name=?, email=?, password=?, status=? WHERE id=?";
            updateValues = [name, email, hashedPassword, status || 'active', userId];
        } else {
            // Si no se proporciona contraseña, no actualizarla
            updateSql = "UPDATE users SET name=?, email=?, status=? WHERE id=?";
            updateValues = [name, email, status || 'active', userId];
        }

        db.query(updateSql, updateValues, (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({
                        status: 409,
                        message: "El email ya está registrado",
                    });
                }

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
                data: { id: userId, name, email, status: status || 'active' },
            });
        });

    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Error al procesar la actualización",
        });
    }
});

// DELETE /users/:id - Eliminar usuario
router.delete("/:id", (req, res) => {
    const userId = req.params.id;

    db.query("DELETE FROM users WHERE id=?", [userId], (err, result) => {
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

module.exports = router;