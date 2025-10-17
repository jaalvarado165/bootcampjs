    document.addEventListener("DOMContentLoaded", function () {
    const API_BASE = "http://localhost:5000";

    const formulario = document.querySelector("#formularioRegistro");
    const nombreInput = document.querySelector("#nombre");
    const emailInput = document.querySelector("#email");
    const passwordInput = document.querySelector("#password");
    const confirmPasswordInput = document.querySelector("#confirmPassword");

    function mostrarAlerta(mensaje, tipo) {
        const alerta = document.getElementById("alerta");
        alerta.textContent = mensaje;
        alerta.className = "alerta";
        alerta.classList.add("mostrar");
        alerta.classList.add(tipo === "exito" ? "exito" : "error");
        setTimeout(() => alerta.classList.remove("mostrar"), 5000);
    }

    formulario.addEventListener("submit", async function (e) {
        e.preventDefault();

        // Limpiar errores
        document.getElementById("error-nombre").textContent = "";
        document.getElementById("error-email").textContent = "";
        document.getElementById("error-password").textContent = "";
        document.getElementById("error-confirm").textContent = "";

        // Obtener valores
        const nombre = nombreInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Validaciones
        let valido = true;

        if (nombre.length < 2) {
        document.getElementById("error-nombre").textContent =
            "El nombre debe tener al menos 2 caracteres.";
        valido = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
        document.getElementById("error-email").textContent =
            "Ingrese un correo electrónico válido.";
        valido = false;
        }

        if (password.length < 6) {
        document.getElementById("error-password").textContent =
            "La contraseña debe tener al menos 6 caracteres.";
        valido = false;
        }

        if (password !== confirmPassword) {
        document.getElementById("error-confirm").textContent =
            "Las contraseñas no coinciden.";
        valido = false;
        }

        if (!valido) return;

        try {
        // Verificar si el email ya existe
        try {
            const checkResponse = await fetch(
            `${API_BASE}/users/search?email=${encodeURIComponent(email)}`
            );
            if (checkResponse.status === 200) {
            mostrarAlerta("El email ya está registrado", "error");
            return;
            }
        } catch (err) {
            // Si no existe el usuario, continuamos
        }

        // Registrar usuario
        const response = await fetch(`${API_BASE}/users/register`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            name: nombre,
            email: email,
            password: password,
            status: "active",
            }),
        });

        const result = await response.json();

        if (response.ok && (result.status === 201 || result.status === 200)) {

            try {
            const personResponse = await fetch(`${API_BASE}/persons`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                name: nombre,
                email: email,
                status: "active",
                }),
            });

            
            if (!personResponse.ok) {
                console.warn("No se pudo crear el registro, pero el usuario fue creado exitosamente");
            }
            } catch (personError) {
            console.error("Error al crear persona:", personError);
            }

            mostrarAlerta("Usuario registrado exitosamente", "exito");
            setTimeout(() => {
            window.location.href = "../login/login.html";
            }, 2000);
        } else {
            mostrarAlerta(result.message || "Error al registrar usuario", "error");
        }
        } catch (error) {
        console.error("Error:", error);
        mostrarAlerta("Error de conexión", "error");
        }
    });
    });