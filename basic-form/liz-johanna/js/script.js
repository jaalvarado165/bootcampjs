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

const form = document.querySelector("form");
const emailInput = document.querySelector('input[type="email"]');
const selectElement = document.querySelector("select");

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

  setTimeout(() => alerta.remove(), 3000);
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
  const existe = personas.some(persona => persona.email.toLowerCase() === correoIngresado.toLowerCase());
  if (existe) {
    mostrarAlerta("El correo está registrado.", "#90ee90");
  } else {
    mostrarAlerta(" correo no está registrado.", "#f08080");
  }
}

form.addEventListener("submit", validarFormulario);

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});