const services = require("../services");

const getMessageById = async (req, res) => {
    try {
        const message = await services.fetchMessageById(req.params.id);
        
        if (!message) {
            return res.status(404).json({
                status: 404,
                message: "Mensaje no encontrado",
                data: null
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Mensaje obtenido correctamente",
            data: message
        });
    } catch (error) {
        console.error("Error en getMessageById:", error);
        return res.status(500).json({
            status: 500,
            message: "Error al obtener el mensaje",
            data: null
        });
    }
};

module.exports = getMessageById;