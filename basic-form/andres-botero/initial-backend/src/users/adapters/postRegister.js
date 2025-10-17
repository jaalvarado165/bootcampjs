const services = require("../services");

const postRegister = async (req, res) => {
    try {
        const userData = req.body;
        const newUser = await services.createUser(userData);

        return res.status(201).json({
            status: 201,
            message: "Usuario registrado exitosamente",
            data: newUser
        });
    } catch (error) {
        console.error("Error en postRegister:", error);

        // Manejar errores específicos
        if (error.message === "El email ya está registrado") {
            return res.status(409).json({
                status: 409,
                message: error.message
            });
        }

        if (error.message.includes("requeridos") || error.message.includes("caracteres")) {
            return res.status(400).json({
                status: 400,
                message: error.message
            });
        }

        return res.status(500).json({
            status: 500,
            message: "Error al crear el usuario"
        });
    }
};

module.exports = postRegister;