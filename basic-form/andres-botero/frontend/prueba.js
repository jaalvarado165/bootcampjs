document.addEventListener("DOMContentLoaded", function () {
  const API_BASE = "http://localhost:5000"; 

  // Estado
  let editando = false;
  let currentMessageId = null; 
  let currentUserId = null;    

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
  opciones.forEach(op => {
    const option = document.createElement("option");
    option.value = op.value;
    option.textContent = op.text;
    selecTipo.appendChild(option);
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

    items.forEach(item => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td data-label="ID">${item.id}</td>
        <td data-label="Tipo">${item.type}</td>
        <td data-label="Nombre">${item.user_name}</td>
        <td data-label="Correo">${item.user_email}</td>
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

  // carga de usuarios
  function cargarEdicion(item) {
    nombreInput.value = item.user_name;
    correoInput.value = item.user_email;
    comentarioInput.value = item.message;
    selecTipo.value = item.type;

    currentMessageId = item.id; 
    currentUserId = item.user_id;
    formulario.querySelector("button[type='submit']").textContent = "Actualizar";
    editando = true;
  }

  async function eliminarMensaje(id) {
    if (!confirm("¿Eliminar este mensaje?")) return;
    try {
      const resp = await fetch(`${API_BASE}/messages/${id}`, { method: "DELETE" });
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
      document.getElementById("error-nombre").textContent = "El nombre debe tener al menos 2 caracteres.";
      valido = false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      document.getElementById("error-correo").textContent = "Ingrese un correo electrónico válido.";
      valido = false;
    }
    
    if (!mensaje) {
      document.getElementById("error-mensaje").textContent = "El mensaje no puede estar vacío.";
      valido = false;
    }
    
    if (!tipo) {
      mostrarAlerta("Debe seleccionar un tipo de mensaje", "error");
      valido = false;
    }
    
    if (!valido) return;

    try {

      // Busca usuario por email
      const resUser = await fetch(`${API_BASE}/users/by-email/${encodeURIComponent(correo)}`);
      
    
      if (!resUser.ok) {
        if (resUser.status === 404) {
          mostrarAlerta("Usuario no encontrado", "error");
        } else {
          mostrarAlerta("Error del servidor al buscar usuario", "error");
        }
        return;
      }
      
      const userJson = await resUser.json();
      if (userJson.status !== 200) {
        mostrarAlerta("Usuario no encontrado", "error");
        return;
      }
      
      const user = userJson.data;

      // Validación nombre
      const nombreNormalizado = normalizarTexto(nombre);
      const nombreUsuarioNormalizado = normalizarTexto(user.name);
      
      if (nombreNormalizado !== nombreUsuarioNormalizado) {
        mostrarAlerta(`El nombre no coincide. `, "error");
        return;
      }

      // edicion 
      if (editando) {
        // PUT /messages/:id
        const resp = await fetch(`${API_BASE}/messages/${currentMessageId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: tipo, user_id: user.id, message: mensaje }),
        });
        
        if (!resp.ok) {
          throw new Error(`Error HTTP: ${resp.status}`);
        }
        
        const json = await resp.json();
        if (json.status !== 200) throw new Error(json.message || "Error al actualizar");
        mostrarAlerta("Mensaje actualizado", "exito");
        
      } else {
        // POST /messages
        const resp = await fetch(`${API_BASE}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: tipo, user_id: user.id, message: mensaje }),
        });
        
        if (!resp.ok) {
          throw new Error(`Error HTTP: ${resp.status}`);
        }
        
        const json = await resp.json();
        if (json.status !== 201) throw new Error(json.message || "Error al crear");
        mostrarAlerta(`Mensaje creado para ${user.name}`, "exito");
      }

      // Reset y recarga
      formulario.reset();
      formulario.querySelector("button[type='submit']").textContent = "Enviar";
      editando = false;
      currentMessageId = null; 
      currentUserId = null;

      await cargarListado();
      
    } catch (err) {
      console.error("Error detallado:", err);
      mostrarAlerta(`Error: ${err.message}`, "error");
    }
  });


  cargarListado();
});
