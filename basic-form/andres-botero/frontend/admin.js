    document.addEventListener("DOMContentLoaded", function () {
    // Verificar autenticación PRIMERO
    const isAuthenticated = sessionStorage.getItem("isAuthenticated");
    const userRole = sessionStorage.getItem("userRole");

    if (!isAuthenticated || isAuthenticated !== "true") {
        alert("Debe iniciar sesión para acceder a esta página");
        window.location.href = "login.html";
        return;
    }

    if (userRole !== "admin") {
        alert("No tiene permisos de administrador para acceder a esta página");
        window.location.href = "usuario.html";
        return;
    }

    const API_BASE = "http://localhost:5000";

    // Estado
    let editando = false;
    let currentMessageId = null;
    let currentPersonId = null;

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

    // Logout functionality
    document.getElementById("logout-btn").addEventListener("click", function (e) {
        e.preventDefault();
        if (confirm("¿Está seguro que desea cerrar sesión?")) {
        sessionStorage.clear();
        alert("Sesión cerrada exitosamente");
        window.location.href = "login.html";
        }
    });

    function limpiarHTML() {
        const datos = document.querySelector(".datos");
        while (datos.firstChild) datos.removeChild(datos.firstChild);
    }

    function mostrarAlerta(mensaje, tipo) {
        const alerta = document.getElementById("alerta");
        alerta.textContent = mensaje;
        alerta.className = "alerta";
        alerta.classList.add("mostrar");
        alerta.classList.add(tipo === "exito" ? "exito" : "error");
        setTimeout(() => alerta.classList.remove("mostrar"), 5000);
    }

    // listado desde API
    async function cargarListado() {
        try {
        const resp = await fetch(`${API_BASE}/messages`);
        const json = await resp.json();
        if (json.status !== 200) throw new Error(json.message || "Error");
        renderTabla(json.data);
        } catch (e) {
        console.error(e);
        mostrarAlerta("Error cargando listado", "error");
        }
    }

    function renderTabla(items) {
        limpiarHTML();
        const datos = document.querySelector(".datos");

        const tabla = document.createElement("table");
        tabla.classList.add("tabla-clientes");

        const thead = document.createElement("thead");
        thead.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Tipo</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Comentario</th>
            <th>Acciones</th>
        </tr>`;
        tabla.appendChild(thead);

        const tbody = document.createElement("tbody");

        items.forEach((item) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td data-label="ID">${item.id}</td>
            <td data-label="Tipo">${item.type}</td>
            <td data-label="Nombre">${item.person_name}</td>
            <td data-label="Correo">${item.person_email}</td>
            <td data-label="Comentario">${item.message}</td>
            <td data-label="Acciones"></td>
        `;

        const tdAcciones = tr.querySelector("td[data-label='Acciones']");

        // Botón Editar
        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.classList.add("btn", "btn-editar");
        btnEditar.onclick = () => cargarEdicion(item);

        // Botón Eliminar
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.classList.add("btn", "btn-eliminar");
        btnEliminar.onclick = () => eliminarMensaje(item.id);

        tdAcciones.appendChild(btnEditar);
        tdAcciones.appendChild(btnEliminar);

        tbody.appendChild(tr);
        });

        tabla.appendChild(tbody);
        datos.appendChild(tabla);
    }

    // CARGAR DATOS
    async function cargarEdicion(item) {
        try {
        const resp = await fetch(`${API_BASE}/messages/${item.id}`);

        if (!resp.ok) {
            throw new Error(`Error HTTP: ${resp.status}`);
        }

        const json = await resp.json();

        if (json.status !== 200) {
            throw new Error(json.message || "Error al obtener el mensaje");
        }

        const mensaje = json.data;

        // datos de la API
        nombreInput.value = mensaje.person_name;
        correoInput.value = mensaje.person_email;
        comentarioInput.value = mensaje.message;
        selecTipo.value = mensaje.type;

        // edición
        currentMessageId = mensaje.id;
        currentPersonId = mensaje.person_id;
        formulario.querySelector("button[type='submit']").textContent =
            "Actualizar";
        editando = true;

        formulario.scrollIntoView({ behavior: "smooth" });
        } catch (error) {
        console.error("Error", error);
        mostrarAlerta("Error al cargar el mensaje", "error");
        }
    }

    async function eliminarMensaje(id) {
        if (!confirm("¿Eliminar este mensaje?")) return;
        try {
        const resp = await fetch(`${API_BASE}/messages/${id}`, {
            method: "DELETE",
        });
        const json = await resp.json();
        if (json.status !== 200) throw new Error(json.message || "Error");
        mostrarAlerta("Mensaje eliminado", "exito");
        await cargarListado();
        } catch (e) {
        console.error(e);
        mostrarAlerta("No se pudo eliminar", "error");
        }
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
        // persona existe por email
        const resPerson = await fetch(
            `${API_BASE}/persons/search?email=${encodeURIComponent(correo)}`
        );

        if (!resPerson.ok) {
            if (resPerson.status === 404) {
            mostrarAlerta("Persona no encontrada.", "error");
            return;
            } else if (resPerson.status === 500) {
            mostrarAlerta("Error del servidor", "error");
            return;
            } else {
            mostrarAlerta(`Error inesperado: ${resPerson.status}`, "error");
            return;
            }
        }

        // Parsear respuesta JSON
        const personJson = await resPerson.json();

        if (personJson.status !== 200) {
            mostrarAlerta("Persona no encontrada", "error");
            return;
        }

        if (!personJson.data || !personJson.data.id) {
            mostrarAlerta("Respuesta inválida", "error");
            return;
        }

        const person = personJson.data;

        // Validar que el nombre coincida
        const nombreNormalizado = nombre.toLowerCase().trim();
        const nombrePersonaNormalizado = person.name.toLowerCase().trim();

        if (nombreNormalizado !== nombrePersonaNormalizado) {
            mostrarAlerta(`El nombre de la persona es incorrecto`, "error");
            return;
        }

        // Crear o actualizar mensaje
        let response;
        let messagePayload = {
            type: tipo,
            person_id: person.id,
            message: mensaje,
        };

        if (editando) {
            // ACTUALIZAR MENSAJE
            response = await fetch(`${API_BASE}/messages/${currentMessageId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(messagePayload),
            });
        } else {
            // CREAR NUEVO MENSAJE
            response = await fetch(`${API_BASE}/messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(messagePayload),
            });
        }

        // Validar respuesta del mensaje
        if (!response.ok) {
            throw new Error(
            `Error HTTP: ${response.status} - ${response.statusText}`
            );
        }

        const messageJson = await response.json();

        if (editando) {
            if (messageJson.status !== 200) {
            throw new Error(
                messageJson.message || "Error al actualizar el mensaje"
            );
            }
        } else {
            if (messageJson.status !== 201 && messageJson.status !== 200) {
            throw new Error(messageJson.message || "Error al crear el mensaje");
            }
        }

        // Mostrar éxito y limpiar formulario
        if (editando) {
            mostrarAlerta(`Mensaje actualizado exitosamente`, "exito");
        } else {
            mostrarAlerta(`Mensaje creado exitosamente`, "exito");
        }

        // Resetear formulario
        formulario.reset();
        formulario.querySelector("button[type='submit']").textContent = "Enviar";

        // Resetear variables de estado
        editando = false;
        currentMessageId = null;
        currentPersonId = null;

        // Recargar listado para mostrar cambios
        await cargarListado();
        } catch (err) {
        console.error("Error detallado:", err);
        mostrarAlerta(`Error: ${err.message}`, "error");
        }
    });

    cargarListado();
    });