const db = require("../../../db");

const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

// Obtener todos los usuarios
const findAllUsers = async () => {
    const sql = "SELECT id, name, email, role, status, created_at FROM users ORDER BY id DESC";
    return await query(sql, []);
};

// Buscar usuario por ID
const findUserById = async (id) => {
    const sql = "SELECT id, name, email, role, status, created_at FROM users WHERE id = ?";
    const results = await query(sql, [id]);
    return results.length > 0 ? results[0] : null;
};

// Buscar usuario por email (sin password)
const findUserByEmail = async (email) => {
    const sql = "SELECT id, name, email, role, status, created_at FROM users WHERE email = ?";
    const results = await query(sql, [email]);
    return results.length > 0 ? results[0] : null;
};

// Buscar usuario por email (con password) - para autenticación
const findUserByEmailWithPassword = async (email) => {
    const sql = "SELECT id, name, email, password, role, status FROM users WHERE email = ?";
    const results = await query(sql, [email]);
    return results.length > 0 ? results[0] : null;
};

// Crear nuevo usuario
const createUser = async (userData) => {
    const { name, email, password, role, status } = userData;
    const sql = "INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)";
    
    try {
        const result = await query(sql, [name, email, password, role, status]);
        return result.insertId;
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            throw new Error("El email ya está registrado");
        }
        throw err;
    }
};

// Actualizar usuario
const updateUser = async (id, userData) => {
    const { name, email, password, status } = userData;
    
    let sql, params;
    
    if (password) {
        sql = "UPDATE users SET name=?, email=?, password=?, status=? WHERE id=?";
        params = [name, email, password, status, id];
    } else {
        sql = "UPDATE users SET name=?, email=?, status=? WHERE id=?";
        params = [name, email, status, id];
    }

    try {
        const result = await query(sql, params);
        return result.affectedRows;
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            throw new Error("El email ya está registrado");
        }
        throw err;
    }
};

// Eliminar usuario
const deleteUser = async (id) => {
    const sql = "DELETE FROM users WHERE id=?";
    const result = await query(sql, [id]);
    return result.affectedRows;
};

module.exports = {
    findAllUsers,
    findUserById,
    findUserByEmail,
    findUserByEmailWithPassword,
    createUser,
    updateUser,
    deleteUser
};