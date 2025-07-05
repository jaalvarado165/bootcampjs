document.addEventListener("DOMContentLoaded", function () {

document.getElementById("formulario").addEventListener("submit", function(e) {
    e.preventDefault();

    document.getElementById("error-nombre").textContent = "";
    document.getElementById("error-correo").textContent = "";
    document.getElementById("error-mensaje").textContent = "";

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const mensaje = document.getElementById("comentario").value.trim();

    let valido = true;

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

    if (valido) {
        // Arreglo de correos existentes
        const personas = [
            {nombre: "Julian", email: "jnalvarado.28@gmail.com"},
            {nombre: "Luis", email: "luis@gmail.com"},
            {nombre: "Jorge", email: "jorge@gmail.com"},
            {nombre: "Andres", email: "andres@gmail.com"},
        ];

        const personaEncontrada = personas.find(
            (persona) => persona.email.toLowerCase() === correo.toLowerCase()
        );

        if (personaEncontrada) {
            mostrarAlerta(`Bienvenido ${personaEncontrada.nombre}`, "exito");
        } else {
            mostrarAlerta("Correo no registrado", "error");
        }

        this.reset();
    }
});

    //MENU DE OPCIONES
    const opciones = [
        {value: 1, text: "Peticiones"},
        {value: 2, text: "Quejas"},
        {value: 3, text: "Reclamos"},
        {value: 4, text: "Suguerencias"},
    ];

    //Insercion menu de opciones
    const selectTipo = document.getElementById("tipo")

    opciones.forEach(opcion => {
        const option = document.createElement("option");
        option.value = option.value;
        option.textContent = opcion.text;
        selectTipo.appendChild(option);
    });


    //Alerta
    function mostrarAlerta(mensaje, tipo) {
    const alerta = document.getElementById("alerta");
    alerta.textContent = mensaje;

    alerta.className = "alerta"; // Reset
    alerta.classList.add("mostrar");

    if (tipo === "exito") {
        alerta.classList.add("exito");
    } else {
        alerta.classList.add("error");
    }

    setTimeout(() => {
        alerta.classList.remove("mostrar");
    }, 3000);
}


});

