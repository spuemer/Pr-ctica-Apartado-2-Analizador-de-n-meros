"use strict";

const form = document.getElementById("form");
const entrada = document.getElementById("entrada");
const mensaje = document.getElementById("mensaje");
const salida = document.getElementById("salida");

let timerMensaje = null;

function mostrarError(texto) {
  // Limpia cualquier temporizador anterior
  if (timerMensaje) clearTimeout(timerMensaje);

  mensaje.textContent = texto;
  mensaje.classList.add("error");
  mensaje.classList.remove("ok");

  // Ocultar a los 2 segundos
  timerMensaje = setTimeout(() => {
    mensaje.textContent = "";
    mensaje.classList.remove("error");
  }, 2000);
}

function limpiarResultados() {
  salida.innerHTML = "";
}

function analizarNumeros(numeros) {
  // numeros ya es array de Number válido
  let positivos = 0;
  let negativos = 0;
  let ceros = 0;

  let mayor = numeros[0];
  let menor = numeros[0];

  // Bucle obligatorio
  for (let i = 0; i < numeros.length; i++) {
    const n = numeros[i];

    if (n > 0) positivos++;
    else if (n < 0) negativos++;
    else ceros++;

    if (n > mayor) mayor = n;
    if (n < menor) menor = n;
  }

  return {
    total: numeros.length,
    positivos,
    negativos,
    ceros,
    mayor,
    menor
  };
}

function renderResultados(numeros, resumen) {
  salida.innerHTML = `
    <p><strong>Números introducidos:</strong> ${numeros.join(", ")}</p>
    <ul>
      <li><strong>Cantidad total:</strong> ${resumen.total}</li>
      <li><strong>Positivos:</strong> ${resumen.positivos}</li>
      <li><strong>Negativos:</strong> ${resumen.negativos}</li>
      <li><strong>Ceros:</strong> ${resumen.ceros}</li>
      <li><strong>Mayor:</strong> ${resumen.mayor}</li>
      <li><strong>Menor:</strong> ${resumen.menor}</li>
    </ul>
  `;
}

function convertirYValidar(texto) {
  // 1) split(",")
  const partes = texto.split(",");

  // Validación: que no esté vacío (sin números reales)
  // Caso: "" => [""] o " , " => [" ", " "]
  // Recorremos y construimos el array final de números.
  const numeros = [];

  for (let i = 0; i < partes.length; i++) {
    const trozo = partes[i].trim();

    // Si hay un elemento vacío (por ejemplo "3, ,5") => error
    if (trozo.length === 0) {
      return { ok: false, error: "Error: hay valores vacíos entre comas." };
    }

    // Number() + isNaN()
    const n = Number(trozo);
    if (isNaN(n)) {
      return { ok: false, error: `Error: "${trozo}" no es un número válido.` };
    }

    numeros.push(n);
  }

  // Si el usuario no puso nada (texto vacío), números no debería tener valores útiles
  if (texto.trim().length === 0 || numeros.length === 0) {
    return { ok: false, error: "Error: la entrada está vacía." };
  }

  return { ok: true, numeros };
}

form.addEventListener("submit", (e) => {
  e.preventDefault(); // no recargar

  limpiarResultados();

  const texto = entrada.value;

  const validacion = convertirYValidar(texto);

  if (!validacion.ok) {
    mostrarError(validacion.error);
    return; // no continuar con el análisis
  }

  const numeros = validacion.numeros;
  const resumen = analizarNumeros(numeros);
  renderResultados(numeros, resumen);
});
