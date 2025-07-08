/* -----------------------------------------------------------
   VARIABLES Y ELEMENTOS
----------------------------------------------------------- */
const tipoSelect       = document.getElementById('tipo');
const mensajeCotizador = document.getElementById('mensaje-cotizador');
const formVehiculo     = document.getElementById('form-vehiculo');
const montoSelect      = document.getElementById('monto');
const plazoSelect      = document.getElementById('plazo');
const cotizarBtn       = document.getElementById('cotizarBtn');
const resultadoDiv     = document.getElementById('resultado');
const entregaSection   = document.getElementById('entrega-section');
const entregaSelect    = document.getElementById('entrega');
const entradaBox       = document.getElementById('entrada-box');

/* 🔹 NUEVO */
const promoBtn         = document.getElementById('promoBtn');
const promoForm        = document.getElementById('promo-form');
const nombreInput      = document.getElementById('nombre');
const apellidosInput   = document.getElementById('apellidos');
const cedulaInput      = document.getElementById('cedula');
const promoContinueBtn = document.getElementById('promoContinueBtn');

const promoCodeSection = document.getElementById('promo-code-section');
const mensajePromo     = document.getElementById('mensajePromo');
const countdownSpan    = document.getElementById('countdown');
const promoCodeInput   = document.getElementById('promoCodeInput');
const promoCodeBtn     = document.getElementById('promoCodeBtn');
const promoCodeMsg     = document.getElementById('promoCodeMsg');
const promoResult      = document.getElementById('promo-result');

/* -----------------------------------------------------------
   1. LLENAR MONTOS
----------------------------------------------------------- */
for (let m = 11000; m <= 50000; m += 1000) {
  const opt = document.createElement('option');
  opt.value = m;
  opt.textContent = `$${m.toLocaleString()}`;
  montoSelect.appendChild(opt);
}

/* -----------------------------------------------------------
   2. CAMBIO DE TIPO
----------------------------------------------------------- */
tipoSelect.addEventListener('change', () => {
  const tipo = tipoSelect.value;
  mensajeCotizador.textContent = '';
  // Reinicio de todas las secciones
  [
    formVehiculo, resultadoDiv, entregaSection, entradaBox,
    promoBtn, promoForm, promoCodeSection, promoResult
  ].forEach(el => el.classList.add('hidden'));

  if (tipo === 'vehiculo') {
    formVehiculo.classList.remove('hidden');
  } else if (tipo) {
    mensajeCotizador.textContent =
      'Cotizador en construcción. Espere a la siguiente versión.';
  }
});

/* -----------------------------------------------------------
   3. MOSTRAR BOTÓN COTIZAR
----------------------------------------------------------- */
[montoSelect, plazoSelect].forEach(el =>
  el.addEventListener('change', () => {
    cotizarBtn.classList.toggle(
      'hidden',
      !(montoSelect.value && plazoSelect.value)
    );
  })
);

/* -----------------------------------------------------------
   4. COTIZAR (SIN ENTRADA)
----------------------------------------------------------- */
let inscripcion = 0, cuota = 0; // Guardamos global para la promo
cotizarBtn.addEventListener('click', () => {
  const monto = +montoSelect.value;
  const plazo = +plazoSelect.value;

  /* 4.1 Cálculos principales */
  inscripcion = Math.ceil(monto * 0.045 * 1.15);

  const cuotaBase = monto / plazo;
  const años      = plazo / 12;
  const cuotaAdm  = cuotaBase * (3.5 * años / 100) * 1.15;
  cuota           = Math.ceil(cuotaBase + cuotaAdm);

  const inscMasCuota = Math.ceil(inscripcion + 2*cuota);
  const final        = Math.ceil(cuota * plazo + inscripcion);

  /* 4.2 Tabla */
  resultadoDiv.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Cuota</th>
          <th>Primer Pago</th>
          <th>Final</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td data-label="Cuota">$${cuota.toLocaleString()}</td>
          <td data-label="Primer Pago">$${inscMasCuota.toLocaleString()}</td>
          <td data-label="Final">$${final.toLocaleString()}</td>
        </tr>
      </tbody>
    </table>
  `;
  resultadoDiv.classList.remove('hidden');

  /* 4.3 Mostrar entrega */
  entregaSection.classList.remove('hidden');
});

/* -----------------------------------------------------------
   5. CALCULAR ENTRADA
----------------------------------------------------------- */
entregaSelect.addEventListener('change', () => {
  const plazo   = +plazoSelect.value;
  const entrega = +entregaSelect.value;
  if (!plazo || !entrega) return;

  const cuotasEntrega = {
    '72': { 4: 21, 7: 18, 10: 15 },
    '60': { 4: 17, 7: 14, 10: 11 }
  };
  const entrada = Math.ceil(cuota * cuotasEntrega[plazo][entrega]);

  const mensajeExtra =
    plazo === 72
      ? 'En caso de no tener entrada debe esperar al mes 25 de haber iniciado su financiamiento'
      : 'En caso de no tener entrada debe esperar al mes 21 de haber iniciado su financiamiento';

  entradaBox.innerHTML = `
      <p>Entrada para entrega al <strong>${entrega}º mes</strong>:</p>
      <p style="font-size:1.4rem">$${entrada.toLocaleString()}</p>
      <p class="mensaje" style="margin-top:1rem">${mensajeExtra}</p>
  `;
  entradaBox.classList.remove('hidden');

  /* 🔹 Mostrar botón de promo */
  promoBtn.classList.remove('hidden');
});

/* -----------------------------------------------------------
   6. FLUJO DE LA PROMO
----------------------------------------------------------- */
/* 6.1 Mostrar formulario de datos */
promoBtn.addEventListener('click', () => {
  promoForm.classList.remove('hidden');
  promoBtn.classList.add('hidden');
});

/* 6.2 Continuar tras validar nombre y apellidos */
promoContinueBtn.addEventListener('click', () => {
  const nombre    = nombreInput.value.trim();
  const apellidos = apellidosInput.value.trim();

  if (!nombre || !apellidos) {
    alert('Nombre y Apellidos son obligatorios.');
    return;
  }

  // Mensaje personalizado
  mensajePromo.innerHTML = `
    ¡Gracias <strong>${nombre}</strong> por aplicar a la promo!
    En un momento un asesor recibirá un mensaje con un código que será válido
    solo para usted durante las próximas <strong>72&nbsp;horas</strong>.
  `;

  promoForm.classList.add('hidden');
  promoCodeSection.classList.remove('hidden');

  /* 6.2.1 Iniciar countdown 72 h */
  iniciarCountdown(72 * 60 * 60); // segundos
});

/* 6.3 Validar código */
const promoCodes = ['Plan777'];   // 🔹 Agrega más códigos aquí en el futuro
promoCodeBtn.addEventListener('click', () => {
  const code = promoCodeInput.value.trim();
  if (promoCodes.includes(code)) {
    promoCodeMsg.textContent = '¡Código correcto! 😎';
    promoCodeMsg.style.color = 'green';
    mostrarPagoPromocional();
  } else {
    // Mensajes aleatorios
    const msgs = ['Código caducado', 'Código incorrecto'];
    promoCodeMsg.textContent = msgs[Math.floor(Math.random() * msgs.length)];
    promoCodeMsg.style.color = '#8B0000';
  }
});

/* -----------------------------------------------------------
   7. CONTADOR REGRESIVO
----------------------------------------------------------- */
let countdownInterval;
function iniciarCountdown(segundos) {
  clearInterval(countdownInterval);
  let restante = segundos;

  function actualizar() {
    const h = Math.floor(restante / 3600);
    const m = Math.floor((restante % 3600) / 60);
    const s = restante % 60;
    countdownSpan.textContent =
      `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;

    if (restante <= 0) {
      clearInterval(countdownInterval);
      promoCodeMsg.textContent = 'Tiempo agotado 😔';
      promoCodeMsg.style.color = '#8B0000';
      promoCodeBtn.disabled = true;
    }
    restante--;
  }
  actualizar();
  countdownInterval = setInterval(actualizar, 1000);
}

/* -----------------------------------------------------------
   8. CÁLCULO DEL PAGO PROMOCIONAL
----------------------------------------------------------- */
function mostrarPagoPromocional() {
  const pagoPromo = Math.ceil(inscripcion * 0.9 + cuota); // (inscripción-10%) + cuota

  promoResult.innerHTML = `
    <h3>¡Felicidades! 🎉</h3>
    <p>Tu primer pago promocional será:</p>
    <p style="font-size:1.6rem; color:#8B0000; font-weight:bold">
      $${pagoPromo.toLocaleString()}
    </p>
    <p>¡Estás a un paso más de obtener tu vehículo!</p>
  `;
  promoResult.classList.remove('hidden');
}
// Fin del script
// -----------------------------------------------------------