// Elementos del DOM
const agregarJugadorBtn = document.getElementById('agregarJugadorBtn');
const nombreInput = document.getElementById('nombre');
const listaJugadores = document.getElementById('listaJugadores');
const tablaCuerpo = document.getElementById('tabla-cuerpo');
const guardarPuntosBtn = document.getElementById('guardarPuntosBtn');
const tablaEncabezado = document.getElementById('tabla-encabezado'); // Elemento del encabezado

// Lista de jugadores con sus puntajes
let jugadores = [];
let puntajes = {}; // Objeto para almacenar los puntajes por jugador
let rondaActual = 1; // Variable para controlar la ronda

// Función para agregar jugador
function agregarJugador() {
    const nombre = nombreInput.value.trim();
    if (nombre !== '') {
        const jugador = {
            nombre: nombre,
            escobas: 0,
            cartas: 0,
            oros: 0,
            primera: 0,
            sieteVelo: 0
        };
        jugadores.push(jugador);
        nombreInput.value = ''; // Limpiar el campo de nombre

        // Crear la tarjeta del jugador
        crearCardJugador(jugador, jugadores.length - 1);

        // Mostrar el botón de guardar puntos si hay al menos un jugador
        guardarPuntosBtn.style.display = 'block';
    }
}

// Función para crear la tarjeta del jugador
function crearCardJugador(jugador, index) {
    const cardJugador = document.createElement('div');
    cardJugador.classList.add('jugador-card');

    cardJugador.innerHTML = `
        <h3>${jugador.nombre}</h3>
        <div>
            <div class="form primary">
                <input type="number" class="puntaje" data-tipo="escobas" data-index="${index}" required>
                <label class="lbl primary"><span>Escobas</span></label>
            </div>
        </div>
        <div>
            <label>Cartas: </label>
            <input type="radio" value="1" data-tipo="cartas" name="cartas" data-index="${index}">
        </div>
        <div>
            <label>Oros: </label>
            <input type="radio" value="1" data-tipo="oros" name="oros" data-index="${index}">
        </div>
        <div>
            <label>Primera: </label>
            <input type="radio" value="1" data-tipo="primera" name="primera" data-index="${index}">
        </div>
        <div>
            <label>7 velo: </label>
            <input type="radio" value="1" data-tipo="sieteVelo" name="sieteVelo" data-index="${index}">
        </div>
    `;

    listaJugadores.appendChild(cardJugador);

    // Agregar eventos a los inputs de puntajes y radios
    cardJugador.querySelectorAll('.puntaje').forEach(input => {
        input.addEventListener('input', actualizarPuntaje);
    });
    cardJugador.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', actualizarRadio);
    });
}

// Función para actualizar los puntajes de escobas
function actualizarPuntaje(event) {
    const index = event.target.dataset.index;
    const tipo = event.target.dataset.tipo;
    const valor = parseInt(event.target.value);

    if (!isNaN(valor)) {
        jugadores[index][tipo] = valor;
    }
}

// Función para manejar los radios y guardar su selección
function actualizarRadio(event) {
    const index = event.target.dataset.index;
    const tipo = event.target.dataset.tipo;

    // Guardar la selección de los radios
    jugadores[index][tipo] = parseInt(event.target.value) || 0; // Se asegura de que tenga un valor
}

// Función para guardar los puntajes en la tabla
function guardarPuntos() {
    jugadores.forEach(jugador => {
        const puntosRonda = jugador.escobas; // Usa el puntaje de escobas
        const puntosExtras = jugador.cartas + jugador.oros + jugador.primera + jugador.sieteVelo; // Suma los puntajes extras
        agregarRonda(jugador.nombre, puntosRonda + puntosExtras); // Agrega el puntaje total por ronda
    });

    // Resetea los puntajes para la próxima ronda
    jugadores.forEach(jugador => {
        jugador.escobas = 0; 
        jugador.cartas = 0;
        jugador.oros = 0;
        jugador.primera = 0;
        jugador.sieteVelo = 0;

        // Deselecciona los radios
        const radios = document.querySelectorAll(`input[data-index="${jugadores.indexOf(jugador)}"]`);
        radios.forEach(radio => {
            radio.checked = false;
        });
    });

    // Actualiza la tabla
    actualizarTabla();
    rondaActual++; // Incrementa la ronda
    actualizarEncabezado(); // Actualiza el encabezado
}

// Agregar una ronda y sumar puntos
function agregarRonda(nombreJugador, puntosRonda) {
    if (!puntajes[nombreJugador]) {
        puntajes[nombreJugador] = []; // Inicializa la lista de puntajes para el jugador
    }
    
    // Calcula el puntaje acumulado
    let puntosAcumulados = (puntajes[nombreJugador].length > 0 ? puntajes[nombreJugador][puntajes[nombreJugador].length - 1] : 0) + puntosRonda;
    puntajes[nombreJugador].push(puntosAcumulados); // Agrega el puntaje acumulado a la lista
}

// Actualiza la tabla con los puntajes
function actualizarTabla() {
    tablaCuerpo.innerHTML = ''; // Limpia el contenido anterior

    const jugadoresNombres = Object.keys(puntajes); // Obtiene la lista de jugadores

    // Genera las filas de la tabla
    for (const jugador of jugadoresNombres) {
        const nuevaFila = document.createElement('tr');
        nuevaFila.innerHTML = `<td>${jugador}</td>`;

        // Agrega las celdas de puntajes de cada ronda
        puntajes[jugador].forEach(puntos => {
            nuevaFila.innerHTML += `<td>${puntos}</td>`;
        });

        tablaCuerpo.appendChild(nuevaFila); // Añade la fila a la tabla
    }
}

// Actualiza el encabezado de la tabla
function actualizarEncabezado() {
    const nuevaCelda = document.createElement('th');
    nuevaCelda.innerText = `Ronda ${rondaActual}`; // Asegúrate de mostrar correctamente el número de ronda
    tablaEncabezado.querySelector('tr').appendChild(nuevaCelda); // Añade la nueva celda a la fila existente en el encabezado
}

// Eventos
agregarJugadorBtn.addEventListener('click', agregarJugador);
guardarPuntosBtn.addEventListener('click', guardarPuntos);
