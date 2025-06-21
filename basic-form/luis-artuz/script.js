/*
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
  
    document.getElementById("boton").addEventListener("click", function (event) {
    event.preventDefault(); // Evita el envío por defecto
  
    
    if (form.checkValidity()) {
    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const mensaje = document.getElementById("mensaje").value;
  
    const datos = {
    nombre: nombre,
    correo: correo,
    mensaje: mensaje
};
  
    alert("LOS DATOS ENVIADOS SON CORRECTOS:\n\n" + JSON.stringify(datos, null, 2));
} else {
     form.reportValidity();
 }
    });
  });
*/



/*
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
  
    const nombreInput = document.getElementById("nombre");
    const correoInput = document.getElementById("correo");
    const mensajeInput = document.getElementById("mensaje");
  
    const errorNombre = document.getElementById("error-nombre");
    const errorCorreo = document.getElementById("error-correo");
    const errorMensaje = document.getElementById("error-mensaje");
    const resultado = document.getElementById("resultado");
  
    document.getElementById("boton").addEventListener("click", function (event) {
      event.preventDefault();
  
      // Limpiar errores anteriores
      errorNombre.textContent = "";
      errorCorreo.textContent = "";
      errorMensaje.textContent = "";
      resultado.textContent = "";
  
      let esValido = true;
  
      // Validar nombre
      if (nombreInput.value.trim().length < 2) {
        errorNombre.textContent = "El nombre debe tener al menos 2 caracteres.";
        esValido = false;
      }
  
      // Validar correo
      const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!correoRegex.test(correoInput.value.trim())) {
        errorCorreo.textContent = "Ingrese un correo electrónico válido.";
        esValido = false;
      }
  
      // Validar mensaje
      if (mensajeInput.value.trim() === "") {
        errorMensaje.textContent = "El mensaje no puede estar vacío.";
        esValido = false;
      }
  
      // Si todo es válido, mostrar resumen
      if (esValido) {
        const datos = {
          nombre: nombreInput.value,
          correo: correoInput.value,
          mensaje: mensajeInput.value
        };
  
        resultado.textContent =
          "LOS DATOS ENVIADOS SON CORRECTOS:\n\n" +
          JSON.stringify(datos, null, 2);
      }
    });
  });
  */
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
  
    const nombreInput = document.getElementById("nombre");
    const correoInput = document.getElementById("correo");
    const mensajeInput = document.getElementById("mensaje");
  
    const errorNombre = document.getElementById("error-nombre");
    const errorCorreo = document.getElementById("error-correo");
    const errorMensaje = document.getElementById("error-mensaje");
  
    const modal = document.getElementById("modal");
    const cerrarModal = document.getElementById("cerrar-modal");
  
    document.getElementById("boton").addEventListener("click", function (event) {
      event.preventDefault();
  
      // Limpiar errores anteriores
      errorNombre.textContent = "";
      errorCorreo.textContent = "";
      errorMensaje.textContent = "";
  
      let esValido = true;
  
      // Validar nombre
      if (nombreInput.value.trim().length < 2) {
        errorNombre.textContent = "El nombre debe tener al menos 2 caracteres.";
        esValido = false;
      }
  
      // Validar correo
      const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!correoRegex.test(correoInput.value.trim())) {
        errorCorreo.textContent = "Ingrese un correo electrónico válido.";
        esValido = false;
      }
  
      // Validar mensaje
      if (mensajeInput.value.trim() === "") {
        errorMensaje.textContent = "El mensaje no puede estar vacío.";
        esValido = false;
      }
  
      // Si es válido, mostrar modal
      if (esValido) {
        modal.style.display = "block";
      }
    });
  
    // Cerrar el modal
    cerrarModal.addEventListener("click", function () {
      modal.style.display = "none";
      form.reset();
    });
  
    // Cerrar modal al hacer clic fuera de él
    window.addEventListener("click", function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
        form.reset();
      }
    });
  });
  