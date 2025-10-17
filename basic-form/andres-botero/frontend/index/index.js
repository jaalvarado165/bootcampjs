    document.addEventListener("DOMContentLoaded", function () {
    const API_BASE = "http://localhost:5000";

    // Form + inputs
    const formulario = document.querySelector("#formulario");
    const nombreInput = document.querySelector("#nombre");
    const correoInput = document.querySelector("#correo");
    const comentarioInput = document.querySelector("#comentario");
    const selecTipo = document.getElementById("tipo");

    // opciones del select
    const opciones = [
        { value: "Peticiones", text: "Peticiones" },
        { value: "Quejas", text: "Quejas" },
        { value: "Reclamos", text: "Reclamos" },
        { value: "Sugerencias", text: "Sugerencias" },
    ];
    
    opciones.forEach((op) => {
        const option = document.createElement("option");
        option.value = op.value;
        option.textContent = op.text;
        selecTipo.appendChild(option);
    });

    function mostrarAlerta(mensaje, tipo) {
        const alerta = document.getElementById("alerta");
        alerta.textContent = mensaje;
        alerta.className = "alerta";
        alerta.classList.add("mostrar");
        alerta.classList.add(tipo === "exito" ? "exito" : "error");
        setTimeout(() => alerta.classList.remove("mostrar"), 5000);
    }

    // Submit del formulario
    formulario.addEventListener("submit", async function (e) {
        e.preventDefault();

        // Limpia errores
        document.getElementById("error-nombre").textContent = "";
        document.getElementById("error-correo").textContent = "";
        document.getElementById("error-mensaje").textContent = "";

        // Lee valores
        const nombre = nombreInput.value.trim();
        const correo = correoInput.value.trim();
        const mensaje = comentarioInput.value.trim();
        const tipo = selecTipo.value;

        // Validaciones
        let valido = true;

        if (nombre.length < 2) {
        document.getElementById("error-nombre").textContent =
            "El nombre debe tener al menos 2 caracteres.";
        valido = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
        document.getElementById("error-correo").textContent =
            "Ingrese un correo electrónico válido.";
        valido = false;
        }

        if (!mensaje) {
        document.getElementById("error-mensaje").textContent =
            "El mensaje no puede estar vacío.";
        valido = false;
        }

        if (!tipo) {
        mostrarAlerta("Debe seleccionar un tipo de mensaje", "error");
        valido = false;
        }

        if (!valido) return;

        try {
        // Buscar si el usuario existe por email 
        const resUser = await fetch(
            `${API_BASE}/users/search?email=${encodeURIComponent(correo)}`
        );

        if (!resUser.ok) {
            if (resUser.status === 404) {
            mostrarAlerta(
                "Usuario no encontrado. Debe estar registrado en el sistema.",
                "error"
            );
            return;
            } else if (resUser.status === 500) {
            mostrarAlerta("Error del servidor", "error");
            return;
            } else {
            mostrarAlerta(`Error inesperado: ${resUser.status}`, "error");
            return;
            }
        }

        // Parsear respuesta JSON
        const userJson = await resUser.json();

        if (userJson.status !== 200) {
            mostrarAlerta("Usuario no encontrado", "error");
            return;
        }

        if (!userJson.data || !userJson.data.id) {
            mostrarAlerta("Respuesta inválida", "error");
            return;
        }

        const user = userJson.data;

        // Validar que el nombre coincida
        const nombreNormalizado = nombre.toLowerCase().trim();
        const nombreUsuarioNormalizado = user.name.toLowerCase().trim();

        if (nombreNormalizado !== nombreUsuarioNormalizado) {
            mostrarAlerta(`El nombre del usuario es incorrecto`, "error");
            return;
        }

        // Crear mensaje con user_id 
        let messagePayload = {
            type: tipo,
            user_id: user.id,
            message: mensaje,
        };

        const response = await fetch(`${API_BASE}/messages`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(messagePayload),
        });

        // Validar respuesta del mensaje
        if (!response.ok) {
            throw new Error(
            `Error HTTP: ${response.status} - ${response.statusText}`
            );
        }

        const messageJson = await response.json();

        if (messageJson.status !== 201 && messageJson.status !== 200) {
            throw new Error(messageJson.message || "Error al crear el mensaje");
        }

        // Mostrar éxito 
        mostrarAlerta(`Mensaje creado exitosamente`, "exito");

        // Resetear formulario
        formulario.reset();
        } catch (err) {
        console.error("Error detallado:", err);
        mostrarAlerta(`Error: ${err.message}`, "error");
        }
    });
    });