const bcrypt = require("bcrypt");
const repository = require("../repositories/mysql");

const saltRounds = 10;

// Obtener todos los usuarios
const fetchAllUsers = async () => {
    return await repository.findAllUsers();
};

// Obtener usuario por ID
const fetchUserById = async (id) => {
    return await repository.findUserById(id);
};

// Buscar usuario por email
const searchUserByEmail = async (email) => {
    return await repository.findUserByEmail(email);
};

// Crear nuevo usuario
const createUser = async (userData) => {
    const { name, email, password, role, status } = userData;

    // Validaciones
    if (!name || !email || !password) {
        throw new Error("Nombre, email y contraseña son requeridos");
    }

    if (password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
    }

    // Verificar si el email ya existe
    const existingUser = await repository.findUserByEmail(email);
    if (existingUser) {
        throw new Error("El email ya está registrado");
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear usuario en la base de datos
    const userId = await repository.createUser({
        name,
        email,
        password: hashedPassword,
        role: role || "user",
        status: status || "active"
    });

    return {
        id: userId,
        name,
        email,
        role: role || "user",
        status: status || "active"
    };
};

// Autenticar usuario
const authenticateUser = async (email, password) => {
    if (!email || !password) {
        throw new Error("Email y contraseña son requeridos");
    }

    // Buscar usuario
    const user = await repository.findUserByEmailWithPassword(email);
    
    if (!user) {
        throw new Error("Credenciales incorrectas");
    }

    if (user.status !== "active") {
        throw new Error("Usuario inactivo");
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
        throw new Error("Credenciales incorrectas");
    }

    // Retornar datos del usuario sin la contraseña
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
    };
};

// Actualizar usuario
const updateUser = async (id, userData) => {
    const { name, email, password, status } = userData;

    if (!name || !email) {
        throw new Error("Nombre y email son requeridos");
    }

    let updateData = { name, email, status: status || "active" };

    // Si se proporciona nueva contraseña, encriptarla
    if (password) {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        updateData.password = hashedPassword;
    }

    const affectedRows = await repository.updateUser(id, updateData);

    if (affectedRows === 0) {
        throw new Error("Usuario no encontrado");
    }

    return {
        id,
        name,
        email,
        status: status || "active"
    };
};

// Eliminar usuario
const deleteUser = async (id) => {
    const affectedRows = await repository.deleteUser(id);
    
    if (affectedRows === 0) {
        throw new Error("Usuario no encontrado");
    }

    return true;
};

module.exports = {
    fetchAllUsers,
    fetchUserById,
    searchUserByEmail,
    createUser,
    authenticateUser,
    updateUser,
    deleteUser
};