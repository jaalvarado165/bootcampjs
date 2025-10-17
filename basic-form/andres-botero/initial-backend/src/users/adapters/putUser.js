const services = require("../services");

const putUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const userData = req.body;
        
        const updatedUser = await services.updateUser(userId, userData);

        return res.status(200).json({
            status: 200,
            message: "Usuario actualizado correctamente",
            data: updatedUser
        });
    } catch (error) {
        console.error("Error en putUser:", error);

        // Manejar errores específicos
        if (error.message === "Usuario no encontrado") {
            return res.status(404).json({
                status: 404,
                message: error.message
            });
        }

        if (error.message === "El email ya está registrado") {
            return res.status(409).json({
                status: 409,
                message: error.message
            });
        }

        if (error.message.includes("requeridos")) {
            return res.status(400).json({
                status: 400,
                message: error.message
            });
        }

        return res.status(500).json({
            status: 500,
            message: "Error al actualizar el usuario"
        });
    }
};

module.exports = putUser;