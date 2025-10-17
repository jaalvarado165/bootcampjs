const services = require("../services");

const putMessage = async (req, res) => {
    try {
        const messageId = req.params.id;
        const messageData = req.body;
        
        const updatedMessage = await services.updateMessage(messageId, messageData);

        return res.status(200).json({
            status: 200,
            message: "Mensaje actualizado correctamente",
            data: updatedMessage
        });
    } catch (error) {
        console.error("Error en putMessage:", error);

        if (error.message === "Mensaje no encontrado") {
            return res.status(404).json({
                status: 404,
                message: error.message
            });
        }

        if (error.message.includes("Faltan datos")) {
            return res.status(400).json({
                status: 400,
                message: error.message
            });
        }

        return res.status(500).json({
            status: 500,
            message: "Error en la base de datos"
        });
    }
};

module.exports = putMessage;