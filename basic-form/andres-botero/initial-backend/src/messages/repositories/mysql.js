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

// Obtener todos los mensajes con información del usuario
const findAllMessages = async () => {
    const sql = `
        SELECT  r.id, r.type, r.message, 
                u.id AS user_id, 
                u.name AS user_name, 
                u.email AS user_email
        FROM responses r
        INNER JOIN users u ON r.user_id = u.id
        ORDER BY r.id DESC
    `;
    return await query(sql, []);
};

// Buscar mensaje por ID con información del usuario
const findMessageById = async (id) => {
    const sql = `
        SELECT  r.id, r.type, r.message, 
                u.id AS user_id, 
                u.name AS user_name, 
                u.email AS user_email
        FROM responses r
        INNER JOIN users u ON r.user_id = u.id
        WHERE r.id = ?
    `;
    const results = await query(sql, [id]);
    return results.length > 0 ? results[0] : null;
};

// Crear nuevo mensaje
const createMessage = async (messageData) => {
    const { type, user_id, message } = messageData;
    const sql = "INSERT INTO responses (type, user_id, message) VALUES (?, ?, ?)";
    
    const result = await query(sql, [type, user_id, message]);
    return result.insertId;
};

// Actualizar mensaje
const updateMessage = async (id, messageData) => {
    const { type, message, user_id } = messageData;
    const sql = "UPDATE responses SET type = ?, message = ?, user_id = ? WHERE id = ?";
    
    const result = await query(sql, [type, message, user_id, id]);
    return result.affectedRows;
};

// Eliminar mensaje
const deleteMessage = async (id) => {
    const sql = "DELETE FROM responses WHERE id = ?";
    const result = await query(sql, [id]);
    return result.affectedRows;
};

module.exports = {
    findAllMessages,
    findMessageById,
    createMessage,
    updateMessage,
    deleteMessage
};