const services = require("../services");

const getAllMessages = async (req, res) => {
    try {
        const messages = await services.fetchAllMessages();
        
        return res.status(200).json({
            status: 200,
            message: "Mensajes obtenidos correctamente",
            data: messages
        });
    } catch (error) {
        console.error("Error en getAllMessages:", error);
        return res.status(500).json({
            status: 500,
            message: "Error al obtener los mensajes",
            data: null
        });
    }
};

module.exports = getAllMessages;