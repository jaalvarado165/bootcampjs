document.addEventListener("DOMContentLoaded", function () {

let listaClientes =[];

const objClientes = {
    id:"",
    nombre:"",
    correo:"",
    comentario:""
}

let editando = false;

const formulario = document.querySelector("#formulario");
const nombreInput = document.querySelector("#nombre");
const correoInput = document.querySelector("#correo");
const comentarioInput = document.querySelector("#comentario");
const btnAgregar = document.querySelector("#btnAgregar");


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
    {nombre: "Camila", email: "camila@gmail.com"},
    {nombre: "Valentina", email: "valentina@gmail.com"},
    {nombre: "Carlos", email: "carlos@gmail.com"},
    {nombre: "Ana", email: "ana@gmail.com"},
    {nombre: "María", email: "maria@gmail.com"},
    {nombre: "Juan", email: "juan@gmail.com"},
    {nombre: "Pedro", email: "pedro@gmail.com"},
    {nombre: "Sofía", email: "sofia@gmail.com"},
    {nombre: "Diego", email: "diego@gmail.com"},
    {nombre: "Laura", email: "laura@gmail.com"},
    {nombre: "Sebastián", email: "sebastian@gmail.com"},
    {nombre: "Paula", email: "paula@gmail.com"},
    {nombre: "Daniel", email: "daniel@gmail.com"},
    {nombre: "Sara", email: "sara@gmail.com"},
    {nombre: "Mateo", email: "mateo@gmail.com"},
    {nombre: "Isabella", email: "isabella@gmail.com"},
    {nombre: "Felipe", email: "felipe@gmail.com"},
    {nombre: "Lucía", email: "lucia@gmail.com"},
    {nombre: "Tomás", email: "tomas@gmail.com"},
    {nombre: "Martina", email: "martina@gmail.com"},
    {nombre: "David", email: "david@gmail.com"},
    {nombre: "Antonia", email: "antonia@gmail.com"},
    {nombre: "Emilio", email: "emilio@gmail.com"},
    {nombre: "Renata", email: "renata@gmail.com"},
    {nombre: "Samuel", email: "samuel@gmail.com"},
    {nombre: "Fernanda", email: "fernanda@gmail.com"},
    {nombre: "Gabriel", email: "gabriel@gmail.com"},
    {nombre: "Elena", email: "elena@gmail.com"},
    {nombre: "Ricardo", email: "ricardo@gmail.com"},
    {nombre: "Mónica", email: "monica@gmail.com"},
    {nombre: "Héctor", email: "hector@gmail.com"},
    {nombre: "Patricia", email: "patricia@gmail.com"},
    {nombre: "Roberto", email: "roberto@gmail.com"},
    {nombre: "Angela", email: "angela@gmail.com"},
    {nombre: "Mario", email: "mario@gmail.com"},
    {nombre: "Natalia", email: "natalia@gmail.com"},
    {nombre: "Oscar", email: "oscar@gmail.com"},
    {nombre: "Carmen", email: "carmen@gmail.com"},
    {nombre: "Eduardo", email: "eduardo@gmail.com"},
    {nombre: "Verónica", email: "veronica@gmail.com"},
    {nombre: "Francisco", email: "francisco@gmail.com"},
    {nombre: "Beatriz", email: "beatriz@gmail.com"},
    {nombre: "Santiago", email: "santiago@gmail.com"},
    {nombre: "Claudia", email: "claudia@gmail.com"},
    {nombre: "Alberto", email: "alberto@gmail.com"},
    {nombre: "Esteban", email: "esteban@gmail.com"}
];


    const personaEncontrada = personas.find(
        (persona) => 
            persona.nombre.toLowerCase() === nombre.toLowerCase() &&
            persona.email.toLowerCase() === correo.toLowerCase()
    );

    if (personaEncontrada) {
        mostrarAlerta(`Bienvenido ${personaEncontrada.nombre}`, "exito");

    
        if (editando) {
            editarCliente();
            editando = false;
        } else {
            objClientes.id = Date.now();
            objClientes.nombre = nombreInput.value;
            objClientes.correo = correoInput.value;
            objClientes.comentario = comentarioInput.value;

            agregarCliente(); 
        }

        this.reset();

    } else {
        mostrarAlerta("Nombre o correo no registrado", "error");
        return; 
    }

    }
});

//Agregar cliente
function agregarCliente(){
    listaClientes.push({...objClientes});

    mostrarCliente();

    formulario.reset();

    limpiarObjeto();
}

//Limpia los cajas donde se escribe
function limpiarObjeto(){
    objClientes.id = "";
    objClientes.nombre = "";
    objClientes.correo = "";
    objClientes.comentario = "";
}


function mostrarCliente() {
    limpiarHTML();

    const datos = document.querySelector(".datos");

    // Crear la tabla
    const tabla = document.createElement("table");
    tabla.classList.add("tabla-clientes");

    // Crear encabezados
    const thead = document.createElement("thead");
    const encabezado = document.createElement("tr");
    encabezado.innerHTML = `
        <th>ID</th>
        <th>Nombre</th>
        <th>Correo</th>
        <th>Comentario</th>
        <th>Acciones</th>
    `;
    thead.appendChild(encabezado);
    tabla.appendChild(thead);

    // Crear cuerpo de la tabla
    const tbody = document.createElement("tbody");

    // Filtrar solo correos registrados
    const personas = [
        {nombre: "Julian", email: "jnalvarado.28@gmail.com"},
        {nombre: "Luis", email: "luis@gmail.com"},
        {nombre: "Jorge", email: "jorge@gmail.com"},
        {nombre: "Andres", email: "andres@gmail.com"},
        {nombre: "Camila", email: "camila@gmail.com"},
        {nombre: "Valentina", email: "valentina@gmail.com"},
        {nombre: "Carlos", email: "carlos@gmail.com"},
        {nombre: "Ana", email: "ana@gmail.com"},
        {nombre: "María", email: "maria@gmail.com"},
        {nombre: "Juan", email: "juan@gmail.com"},
        {nombre: "Pedro", email: "pedro@gmail.com"},
        {nombre: "Sofía", email: "sofia@gmail.com"},
        {nombre: "Diego", email: "diego@gmail.com"},
        {nombre: "Laura", email: "laura@gmail.com"},
        {nombre: "Sebastián", email: "sebastian@gmail.com"},
        {nombre: "Paula", email: "paula@gmail.com"},
        {nombre: "Daniel", email: "daniel@gmail.com"},
        {nombre: "Sara", email: "sara@gmail.com"},
        {nombre: "Mateo", email: "mateo@gmail.com"},
        {nombre: "Isabella", email: "isabella@gmail.com"},
        {nombre: "Felipe", email: "felipe@gmail.com"},
        {nombre: "Lucía", email: "lucia@gmail.com"},
        {nombre: "Tomás", email: "tomas@gmail.com"},
        {nombre: "Martina", email: "martina@gmail.com"},
        {nombre: "David", email: "david@gmail.com"},
        {nombre: "Antonia", email: "antonia@gmail.com"},
        {nombre: "Emilio", email: "emilio@gmail.com"},
        {nombre: "Renata", email: "renata@gmail.com"},
        {nombre: "Samuel", email: "samuel@gmail.com"},
        {nombre: "Fernanda", email: "fernanda@gmail.com"},
        {nombre: "Gabriel", email: "gabriel@gmail.com"},
        {nombre: "Elena", email: "elena@gmail.com"},
        {nombre: "Ricardo", email: "ricardo@gmail.com"},
        {nombre: "Mónica", email: "monica@gmail.com"},
        {nombre: "Héctor", email: "hector@gmail.com"},
        {nombre: "Patricia", email: "patricia@gmail.com"},
        {nombre: "Roberto", email: "roberto@gmail.com"},
        {nombre: "Angela", email: "angela@gmail.com"},
        {nombre: "Mario", email: "mario@gmail.com"},
        {nombre: "Natalia", email: "natalia@gmail.com"},
        {nombre: "Oscar", email: "oscar@gmail.com"},
        {nombre: "Carmen", email: "carmen@gmail.com"},
        {nombre: "Eduardo", email: "eduardo@gmail.com"},
        {nombre: "Verónica", email: "veronica@gmail.com"},
        {nombre: "Francisco", email: "francisco@gmail.com"},
        {nombre: "Beatriz", email: "beatriz@gmail.com"},
        {nombre: "Santiago", email: "santiago@gmail.com"},
        {nombre: "Claudia", email: "claudia@gmail.com"},
        {nombre: "Alberto", email: "alberto@gmail.com"},
        {nombre: "Esteban", email: "esteban@gmail.com"}
    ];

    const listaFiltrada = listaClientes.filter(cliente =>
        personas.some(persona => persona.email.toLowerCase() === cliente.correo.toLowerCase())
    );

    listaFiltrada.forEach(cliente => {
        const { id, nombre, correo, comentario } = cliente;

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td data-label="ID">${id}</td>
            <td data-label="Nombre">${nombre}</td>
            <td data-label="Correo">${correo}</td>
            <td data-label="Comentario">${comentario}</td>
        `;

        // Celda de acciones
        const celdaAcciones = document.createElement("td");

        // Botón Editar
        const editarBoton = document.createElement('button');
        editarBoton.textContent = 'Editar';
        editarBoton.classList.add('btn', 'btn-editar');
        editarBoton.onclick = () => cargarCliente(cliente);

        // Botón Eliminar
        const eliminarBoton = document.createElement('button');
        eliminarBoton.textContent = 'Eliminar';
        eliminarBoton.classList.add('btn', 'btn-eliminar');
        eliminarBoton.onclick = () => eliminarCliente(id);

        celdaAcciones.appendChild(editarBoton);
        celdaAcciones.appendChild(eliminarBoton);

        fila.appendChild(celdaAcciones);
        tbody.appendChild(fila);
    });

    tabla.appendChild(tbody);
    datos.appendChild(tabla);
}


function cargarCliente(cliente){

    const {id, nombre, correo, comentario} = cliente;

    nombreInput.value = nombre;
    correoInput.value = correo;
    comentarioInput.value = comentario;

    objClientes.id = id;

    formulario.querySelector("button[type='submit']").textContent = 'Actualizar';

    editando = true;
}


function editarCliente() {
    
    objClientes.nombre = nombreInput.value.trim();
    objClientes.correo = correoInput.value.trim();
    objClientes.comentario = comentarioInput.value.trim();

    // Buscar cliente por id y actualizarlo
    const clienteEncontrado = listaClientes.find(c => c.id === objClientes.id);
    if (clienteEncontrado) {
        clienteEncontrado.nombre = objClientes.nombre;
        clienteEncontrado.correo = objClientes.correo;
        clienteEncontrado.comentario = objClientes.comentario;
    }

    
    limpiarHTML();
    mostrarCliente();

    // Reset del formulario y estados
    formulario.reset();
    formulario.querySelector("button[type='submit']").textContent = 'Agregar';
    editando = false;
}


function eliminarCliente(id){

    listaClientes = listaClientes.filter(cliente => cliente.id !== id );

    limpiarHTML();
    mostrarCliente();
}

function limpiarHTML() {
    const datos = document.querySelector(".datos");
    while(datos.firstChild) {
        datos.removeChild(datos.firstChild);
    }
}

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
        option.value = opcion.value;
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

