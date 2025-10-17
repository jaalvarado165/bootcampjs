const services = require("../services");

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        await services.deleteUser(userId);

        return res.status(200).json({
            status: 200,
            message: "Usuario eliminado correctamente"
        });
    } catch (error) {
        console.error("Error en deleteUser:", error);

        if (error.message === "Usuario no encontrado") {
            return res.status(404).json({
                status: 404,
                message: error.message
            });
        }

        return res.status(500).json({
            status: 500,
            message: "Error al eliminar el usuario"
        });
    }
};

module.exports = deleteUser;