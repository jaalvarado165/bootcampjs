const services = require("../services");

const deleteMessage = async (req, res) => {
    try {
        const messageId = req.params.id;
        await services.deleteMessage(messageId);

        return res.status(200).json({
            status: 200,
            message: "Mensaje eliminado correctamente"
        });
    } catch (error) {
        console.error("Error en deleteMessage:", error);

        if (error.message === "Mensaje no encontrado") {
            return res.status(404).json({
                status: 404,
                message: error.message
            });
        }

        return res.status(500).json({
            status: 500,
            message: "Error al eliminar el mensaje"
        });
    }
};

module.exports = deleteMessage;