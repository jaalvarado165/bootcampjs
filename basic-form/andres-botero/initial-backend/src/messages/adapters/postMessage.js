const services = require("../services");

const postMessage = async (req, res) => {
    try {
        const messageData = req.body;
        const newMessage = await services.createMessage(messageData);

        return res.status(200).json({
            status: 200,
            message: "Mensaje creado correctamente",
            data: newMessage
        });
    } catch (error) {
        console.error("Error en postMessage:", error);

        if (error.message.includes("requeridos")) {
            return res.status(400).json({
                status: 400,
                message: error.message
            });
        }

        return res.status(500).json({
            status: 500,
            message: "Error al crear el mensaje"
        });
    }
};

module.exports = postMessage;