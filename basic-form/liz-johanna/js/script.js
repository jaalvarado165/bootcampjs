
const opciones = [
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
  
  
  form.addEventListener("submit", function (e) {
    e.preventDefault(); 
    const correoIngresado = emailInput.value.trim();
    const existe = personas.some(persona => persona.email === correoIngresado);
  
    if (existe) {
      mostrarAlerta("El correo está registrado.", "#90ee90"); 
    } else {
      mostrarAlerta(" El correo no está registrado.", "#f08080"); 
    }
  });