const services = require("../services");

const searchUserByEmail = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({
                status: 400,
                message: "Email requerido"
            });
        }

        const user = await services.searchUserByEmail(email);

        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "Usuario no encontrado"
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Usuario encontrado",
            data: user
        });
    } catch (error) {
        console.error("Error en searchUserByEmail:", error);
        return res.status(500).json({
            status: 500,
            message: "Error al buscar el usuario"
        });
    }
};

module.exports = searchUserByEmail;