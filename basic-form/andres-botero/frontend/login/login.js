    document.addEventListener("DOMContentLoaded", function () {
    const API_BASE = "http://localhost:5000";

    const formulario = document.querySelector("#formularioLogin");
    const emailInput = document.querySelector("#email");
    const passwordInput = document.querySelector("#password");

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
        document.getElementById("error-email").textContent = "";
        document.getElementById("error-password").textContent = "";

        // Obtener valores
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Validaciones básicas
        let valido = true;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
        document.getElementById("error-email").textContent =
            "Ingrese un correo electrónico válido.";
        valido = false;
        }

        if (!password) {
        document.getElementById("error-password").textContent =
            "La contraseña es requerida.";
        valido = false;
        }

        if (!valido) return;

        try {
        // Hacer login
        const response = await fetch(`${API_BASE}/users/login`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            email: email,
            password: password,
            }),
        });

        const result = await response.json();

        if (response.ok && result.status === 200) {
            // Guardar datos en sessionStorage
            sessionStorage.setItem("userEmail", result.data.email);
            sessionStorage.setItem("userId", result.data.id);
            sessionStorage.setItem("userName", result.data.name);
            sessionStorage.setItem("userRole", result.data.role);
            sessionStorage.setItem("isAuthenticated", "true");

            mostrarAlerta("Login exitoso", "exito");

            // Redirigir según el rol
            setTimeout(() => {
            if (result.data.role === "admin") {
                window.location.href = "../admin/admin.html";
            } else {
                window.location.href = "../usuario/usuario.html";
            }
            }, 1500);
        } else {
            mostrarAlerta(result.message || "Credenciales incorrectas", "error");
        }
        } catch (error) {
        console.error("Error:", error);
        mostrarAlerta("Error de conexión", "error");
        }
    });
    });