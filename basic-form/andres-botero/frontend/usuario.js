    document.addEventListener("DOMContentLoaded", function () {
    // Verificar autenticación
    const isAuthenticated = sessionStorage.getItem("isAuthenticated");
    if (!isAuthenticated || isAuthenticated !== "true") {
        alert("Debe iniciar sesión para acceder a esta página");
        window.location.href = "login.html";
        return;
    }

    // Cargar información del usuario
    const userName = sessionStorage.getItem("userName") || "No disponible";
    const userEmail = sessionStorage.getItem("userEmail") || "No disponible";
    const userRole = sessionStorage.getItem("userRole") || "user";

    // Mostrar información
    document.getElementById("userName").textContent = userName;
    document.getElementById("userEmail").textContent = userEmail;
    document.getElementById("userRole").textContent =
        userRole === "admin" ? "Administrador" : "Usuario";

    // Estado del usuario (activo por defecto si está logueado)
    const statusContainer = document.getElementById("statusContainer");
    const userStatus = document.getElementById("userStatus");
    userStatus.textContent = "Activo";
    statusContainer.style.backgroundColor = "#d4edda";

    // Logout
    document.getElementById("logout-btn").addEventListener("click", function (e) {
        e.preventDefault();
        if (confirm("¿Está seguro que desea cerrar sesión?")) {
        // Limpiar sessionStorage
        sessionStorage.clear();

        // Mostrar mensaje y redirigir
        alert("Sesión cerrada exitosamente");
        window.location.href = "login.html";
        }
    });

    function mostrarAlerta(mensaje, tipo) {
        const alerta = document.getElementById("alerta");
        alerta.textContent = mensaje;
        alerta.className = "alerta";
        alerta.classList.add("mostrar");
        alerta.classList.add(tipo === "exito" ? "exito" : "error");
        setTimeout(() => alerta.classList.remove("mostrar"), 5000);
    }
    });