// --- 1. CONFIGURACIÓN DEL MOTOR ---
// Generamos el número secreto (Math.random da un decimal, floor lo redondea)
let numeroSecreto = Math.floor(Math.random() * 100) + 1;
let tiempo = 40;
let listaDeIntentos = []; // Aquí guardaremos los números fallidos (un Array/Vector)
let juegoTerminado = false;

// --- 2. CAPTURAR LOS ELEMENTOS DEL HTML ---
// Usamos 'document.getElementById' para que JS pueda "tocar" las cosas del HTML
const input = document.getElementById("entrada");
const boton = document.getElementById("boton-probar");
const mensaje = document.getElementById("feedback");
const displayTiempo = document.getElementById("segundos");
const displayHistorial = document.getElementById("intentos-vistos");
const tarjeta = document.getElementById("contenedor");
const cuerpo = document.getElementById("cuerpo-sitio");

// --- 3. EL CRONÓMETRO ---
// setInterval repite un código cada 1000 milisegundos (1 segundo)
const reloj = setInterval(() => {
    if (juegoTerminado) return; // Si el usuario ya ganó, detenemos la lógica interna

    tiempo--; // Bajamos el tiempo de 1 en 1
    displayTiempo.innerText = tiempo;

    if (tiempo <= 0) {
        terminarJuego("¡TIEMPO AGOTADO! ☠️", false);
    }
}, 1000);

// --- 4. LA LÓGICA DE LAS TEMPERATURAS ---
function procesarJugada() {
    const valorUsuario = parseInt(input.value); // Convertimos el texto del input a número

    // Verificamos si el número es válido
    if (isNaN(valorUsuario) || valorUsuario < 1 || valorUsuario > 100) {
        mensaje.innerText = "Error: Número inválido";
        return;
    }

    // MATH.ABS: Es clave. Si restas 50 - 60, da -10. Math.abs lo convierte en 10 (distancia real).
    const distancia = Math.abs(valorUsuario - numeroSecreto);

    if (distancia === 0) {
        terminarJuego("¡ACCESO CONCEDIDO! 🏆", true);
    } else {
        // Guardamos el número en nuestro vector (Array)
        listaDeIntentos.push(valorUsuario);
        // El comando .join hace que el vector [1, 2] se vea como "1 - 2"
        displayHistorial.innerText = listaDeIntentos.join(" - ");

        // Decidimos la temperatura
        if (distancia <= 5) {
            cambiarEstilos("¡CALIENTE! 🔥", "#ff0055"); // Rojo
        } else if (distancia <= 15) {
            cambiarEstilos("TIBIO... 🟡", "#ffcc00"); // Amarillo
        } else {
            cambiarEstilos("FRÍO ❄️", "#00f2ff");    // Azul
        }
    }

    // Limpiamos el cuadro para que el usuario escriba rápido el siguiente
    input.value = "";
    input.focus();
}

// --- 5. FUNCIONES DE APOYO (Para no repetir código) ---

function cambiarEstilos(texto, color) {
    mensaje.innerText = texto;
    mensaje.style.color = color;
    tarjeta.style.borderColor = color;
    tarjeta.style.boxShadow = `0 0 30px ${color}`;
}

function terminarJuego(textoFinal, victoria) {
    juegoTerminado = true;
    clearInterval(reloj); // Apagamos el cronómetro definitivamente

    input.disabled = true; // Bloqueamos el input
    boton.disabled = true; // Bloqueamos el botón

    if (victoria) {
        cambiarEstilos(textoFinal, "#00ff66");
        cuerpo.style.backgroundColor = "#00ff6622"; // Fondo verde suave
    } else {
        cambiarEstilos(`${textoFinal} El número era: ${numeroSecreto}`, "#ff0055");
        cuerpo.style.backgroundColor = "#ff005522"; // Fondo rojo suave
    }
}

// --- 6. LOS "ESCUCHADORES" DE EVENTOS ---
// Hacemos que el botón reaccione al hacer click
boton.addEventListener("click", procesarJugada);

// Hacemos que el teclado reaccione al presionar la tecla "Enter"
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        procesarJugada();
    }
});
