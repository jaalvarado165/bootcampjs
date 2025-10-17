const services = require("../services");

const getUserById = async (req, res) => {
    try {
        const user = await services.fetchUserById(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "Usuario no encontrado",
                data: null
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Usuario obtenido correctamente",
            data: user
        });
    } catch (error) {
        console.error("Error en getUserById:", error);
        return res.status(500).json({
            status: 500,
            message: "Error al obtener el usuario",
            data: null
        });
    }
};

module.exports = getUserById;