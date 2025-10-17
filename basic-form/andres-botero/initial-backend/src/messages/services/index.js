const repository = require("../repositories/mysql");

// Obtener todos los mensajes
const fetchAllMessages = async () => {
    return await repository.findAllMessages();
};

// Obtener mensaje por ID
const fetchMessageById = async (id) => {
    return await repository.findMessageById(id);
};

// Crear nuevo mensaje
const createMessage = async (messageData) => {
    const { type, user_id, message } = messageData;

    // Validaciones
    if (!type || !user_id || !message) {
        throw new Error("Tipo, usuario y mensaje son requeridos");
    }

    // Crear mensaje en la base de datos
    const messageId = await repository.createMessage({
        type,
        user_id,
        message
    });

    return {
        id: messageId,
        type,
        user_id,
        message
    };
};

// Actualizar mensaje
const updateMessage = async (id, messageData) => {
    const { type, message, user_id } = messageData;

    if (!type || !message || !user_id) {
        throw new Error("Faltan datos para actualizar");
    }

    const affectedRows = await repository.updateMessage(id, {
        type,
        message,
        user_id
    });

    if (affectedRows === 0) {
        throw new Error("Mensaje no encontrado");
    }

    return {
        id,
        type,
        message,
        user_id
    };
};

// Eliminar mensaje
const deleteMessage = async (id) => {
    const affectedRows = await repository.deleteMessage(id);
    
    if (affectedRows === 0) {
        throw new Error("Mensaje no encontrado");
    }

    return true;
};

module.exports = {
    fetchAllMessages,
    fetchMessageById,
    createMessage,
    updateMessage,
    deleteMessage
};