const services = require("../services");

const postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await services.authenticateUser(email, password);

        return res.status(200).json({
            status: 200,
            message: "Login exitoso",
            data: user
        });
    } catch (error) {
        console.error("Error en postLogin:", error);

        // Manejar errores específicos
        if (error.message === "Usuario inactivo") {
            return res.status(401).json({
                status: 401,
                message: error.message
            });
        }

        if (error.message === "Credenciales incorrectas" || error.message.includes("requeridos")) {
            return res.status(401).json({
                status: 401,
                message: "Credenciales incorrectas"
            });
        }

        return res.status(500).json({
            status: 500,
            message: "Error al verificar la contraseña"
        });
    }
};

module.exports = postLogin;