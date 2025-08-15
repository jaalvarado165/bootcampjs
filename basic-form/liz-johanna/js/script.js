

const opciones = [
    { value:"", text:"Seleccione una opcion" },
    { value: 1, text: "Peticiones" },
    { value: 2, text: "Quejas" },
    { value: 3, text: "Reclamos" },
    { value: 4, text: "Sugerencias" }
  ];
  
  
  const personas = [
    { nombre: "Julian", email: "jnalvarado.28@gmail.com" },
    { nombre: "Luis", email: "luis@gmail.com" },
    { nombre: "Jorge", email: "jorge@gmail.com" },
    { nombre: "Andres", email: "andres@gmail.com" },
    { nombre: "Camila", email: "camila@example.com" },
    { nombre: "Sofia", email: "sofia@example.com" },
    { nombre: "Daniel", email: "daniel@example.com" },
    { nombre: "Valentina", email: "valentina@example.com" },
    { nombre: "Carlos", email: "carlos@example.com" },
    { nombre: "Ana", email: "ana@example.com" }
  ];
  
  
  const selectElement = document.querySelector(".custom-select");
  const form = document.querySelector("form");
  const emailInput = document.querySelector('input[type="email"]');
  
  
  opciones.forEach(opcion => {
    const option = document.createElement("option");
    option.value = opcion.value;
    option.textContent = opcion.text;
    selectElement.appendChild(option);
  });
  
  
  function mostrarAlerta(mensaje, color) {
    const alerta = document.createElement("div");
    alerta.textContent = mensaje;
    alerta.style.backgroundColor = color;
    alerta.style.color = "#000";
    alerta.style.padding = "10px";
    alerta.style.marginTop = "15px";
    alerta.style.borderRadius = "10px";
    alerta.style.textAlign = "center";
    form.appendChild(alerta);
  
    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
  
  
  function validarFormulario(e) {
    e.preventDefault();
    const correoIngresado = emailInput.value.trim();
    const selectValue = selectElement.value;
    if (selectValue === "") {
      mostrarAlerta("Por favor seleccione un tipo de solicitud.", "#f08080");
      return;
    }
    if (correoIngresado === "") {
      mostrarAlerta("El campo de correo es obligatorio.", "#f08080");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correoIngresado)) {
      mostrarAlerta("Por favor ingrese un correo válido.", "#f08080");
      return;
    }
    const existe = personas.some(persona => persona.email === correoIngresado);
    if (existe) {
      mostrarAlerta("El correo está registrado.", "#90ee90");
    } else {
      mostrarAlerta("El correo no está registrado.", "#f08080");
    }
  }
  
  form.addEventListener("submit", validarFormulario);