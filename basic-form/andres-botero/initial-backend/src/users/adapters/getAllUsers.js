const services = require("../services");

const getAllUsers = async (req, res) => {
    try {
        const users = await services.fetchAllUsers();
        
        return res.status(200).json({
            status: 200,
            message: "Usuarios obtenidos correctamente",
            data: users
        });
    } catch (error) {
        console.error("Error en getAllUsers:", error);
        return res.status(500).json({
            status: 500,
            message: "Error al obtener los usuarios",
            data: null
        });
    }
};

module.exports = getAllUsers;