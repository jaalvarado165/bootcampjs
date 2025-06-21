document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const button = document.querySelector("button");

    button.addEventListener("click", function () {
        const nombre = form.elements["nombre"].value.trim();
        const correo = form.elements["correo"].value.trim();
        const comentario = form.elements["comentario"].value.trim();

        // Validación HTML5
        if (nombre && correo && comentario && form.checkValidity()) {
            alert(`Los datos enviados son correctos:\n\nNOMBRE: ${nombre.toUpperCase()}\nCORREO: ${correo.toUpperCase()}\nCOMENTARIO: ${comentario.toUpperCase()}`);
        } else {
            alert("Por favor completa todos los campos correctamente.");
        }
    });
});

document.getElementById("formulario").addEventListener("submit", function(e) {
    e.preventDefault(); // evita el envío del formulario

    // Limpia 
    document.getElementById("error-nombre").textContent = "";
    document.getElementById("error-correo").textContent = "";
    document.getElementById("error-mensaje").textContent = "";

    // Captura valores
    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const mensaje = document.getElementById("comentario").value.trim();

    let valido = true;

    // Validaciones
    if (nombre.length < 2) {
        document.getElementById("error-nombre").textContent = "El nombre debe tener al menos 2 caracteres.";
        valido = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        document.getElementById("error-correo").textContent = "Ingrese un correo electrónico válido.";
        valido = false;
    }

    if (mensaje === "") {
        document.getElementById("error-mensaje").textContent = "El mensaje no puede estar vacío.";
        valido = false;
    }

    // alerta
    if (valido) {
        alert(`Los datos enviados son correctos:\n\nNOMBRE: ${nombre.toUpperCase()}\nCORREO: ${correo.toUpperCase()}\nMENSAJE: ${mensaje.toUpperCase()}`);
        this.reset();
    }
});
