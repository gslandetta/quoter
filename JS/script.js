const tipoSelect = document.getElementById('tipo');
const mensajeCotizador = document.getElementById('mensaje-cotizador');
const formVehiculo = document.getElementById('form-vehiculo');
const montoSelect = document.getElementById('monto');
const plazoSelect = document.getElementById('plazo');
const entregaSelect = document.getElementById('entrega');
const cotizarBtn = document.getElementById('cotizarBtn');
const resultadoDiv = document.getElementById('resultado');

// Llenar montos del 11000 al 50000
for (let monto = 11000; monto <= 50000; monto += 1000) {
  const option = document.createElement('option');
  option.value = monto;
  option.textContent = `$${monto.toLocaleString()}`;
  montoSelect.appendChild(option);
}

tipoSelect.addEventListener('change', () => {
  const tipo = tipoSelect.value;
  mensajeCotizador.textContent = '';
  resultadoDiv.classList.add('hidden');
  cotizarBtn.classList.add('hidden');

  if (tipo === 'vehiculo') {
    formVehiculo.classList.remove('hidden');
  } else {
    formVehiculo.classList.add('hidden');
    mensajeCotizador.textContent = 'Cotizador en construcción. Espere a la siguiente versión.';
  }
});

[montoSelect, plazoSelect, entregaSelect].forEach(el => {
  el.addEventListener('change', () => {
    if (montoSelect.value && plazoSelect.value && entregaSelect.value) {
      cotizarBtn.classList.remove('hidden');
    }
  });
});

cotizarBtn.addEventListener('click', () => {
  const monto = parseFloat(montoSelect.value);
  const plazo = parseInt(plazoSelect.value);
  const entrega = parseInt(entregaSelect.value);

  const inscripcion = Math.ceil(monto * 0.045 * 1.15);
  const meses = plazo;
  const años = meses / 12;
  const cuotaBase = monto / meses;
  const cuotaAdm = cuotaBase * (3.5 * años / 100) * 1.15;
  const cuota = Math.ceil(cuotaBase + cuotaAdm);
  const inscripcionMasCuota = Math.ceil(inscripcion + cuota);
  const final = Math.ceil(cuota * plazo + inscripcion);

  const cuotasEntrega = {
    '72': { '4': 21, '7': 18, '10': 15 },
    '60': { '4': 17, '7': 14, '10': 11 }
  };
  const entrada = Math.ceil(cuota * cuotasEntrega[plazo][entrega]);

  const mensajeExtra = plazo === 72
    ? 'En caso de no tener entrada debe esperar al mes 25 de haber iniciado su financiamiento'
    : 'En caso de no tener entrada debe esperar al mes 21 de haber iniciado su financiamiento';

  resultadoDiv.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Inscripción</th>
          <th>Cuota</th>
          <th>Inscripción + Cuota Inicial</th>
          <th>Final</th>
          <th>Entrada</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td data-label="Inscripción">$${inscripcion.toLocaleString()}</td>
          <td data-label="Cuota">$${cuota.toLocaleString()}</td>
          <td data-label="Inscripción + Cuota Inicial">$${inscripcionMasCuota.toLocaleString()}</td>
          <td data-label="Final">$${final.toLocaleString()}</td>
          <td data-label="Entrada">$${entrada.toLocaleString()}</td>
        </tr>
      </tbody>
    </table>
    <p class="mensaje">${mensajeExtra}</p>
  `;

  resultadoDiv.classList.remove('hidden');
});
