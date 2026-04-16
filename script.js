const form = document.getElementById("converter-form");
const amountUsdInput = document.getElementById("amountUsd");
const exchangeRateInput = document.getElementById("exchangeRate");
const fixedChargeInput = document.getElementById("fixedCharge");
const phoneNumberInput = document.getElementById("phoneNumber");
const whatsappButton = document.getElementById("whatsappButton");
const statusMessage = document.getElementById("statusMessage");

const grossAmount = document.getElementById("grossAmount");
const taxAmount = document.getElementById("taxAmount");
const chargeAmount = document.getElementById("chargeAmount");
const netAmount = document.getElementById("netAmount");
const summaryText = document.getElementById("summaryText");

const FINAL_RATE = 0.0015;
let lastCalculation = null;

function formatCurrency(value, showMinus = false) {
  const prefix = showMinus ? "- RD$ " : "RD$ ";
  return `${prefix}${value.toFixed(2)}`;
}

function calculateValues(amountUsd, exchangeRate, fixedCharge) {
  const gross = amountUsd * exchangeRate;
  const tax = gross * FINAL_RATE;
  const net = gross - tax - fixedCharge;

  return {
    gross,
    tax,
    fixedCharge,
    net
  };
}

function sanitizePhoneNumber(value) {
  return value.replace(/\D/g, "");
}

function resetResults() {
  grossAmount.textContent = "RD$ 0.00";
  taxAmount.textContent = "- RD$ 0.00";
  chargeAmount.textContent = "- RD$ 0.00";
  netAmount.textContent = "RD$ 0.00";
}

function buildWhatsappMessage(calculation) {
  const today = new Date().toLocaleDateString("es-DO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  return [
    "COTIZACION USD A DOP",
    `Fecha: ${today}`,
    "",
    "Detalle de la operacion",
    `Monto recibido: USD ${calculation.amountUsd.toFixed(2)}`,
    `Tasa aplicada: RD$ ${calculation.exchangeRate.toFixed(4)} por USD`,
    "",
    "Desglose",
    `Equivalente bruto: RD$ ${calculation.gross.toFixed(2)}`,
    `Impuesto DGII (0.15%): - RD$ ${calculation.tax.toFixed(2)}`,
    `Comision bancaria: - RD$ ${calculation.fixedCharge.toFixed(2)}`,
    "",
    "Total neto a recibir",
    `RD$ ${calculation.net.toFixed(2)}`,
    "",
    "Gracias por su confianza."
  ].join("\n");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const amountUsd = Number(amountUsdInput.value);
  const exchangeRate = Number(exchangeRateInput.value);
  const fixedCharge = Number(fixedChargeInput.value);

  if ([amountUsd, exchangeRate, fixedCharge].some((value) => Number.isNaN(value) || value < 0)) {
    statusMessage.textContent = "Asegurate de ingresar solo numeros validos.";
    resetResults();
    lastCalculation = null;
    summaryText.textContent = "Ingresa valores validos mayores o iguales a cero.";
    return;
  }

  const { gross, tax, net } = calculateValues(
    amountUsd,
    exchangeRate,
    fixedCharge
  );

  if (net < 0) {
    statusMessage.textContent = "Atencion: los cargos superan el monto convertido.";
    resetResults();
    lastCalculation = null;
    summaryText.textContent = "El monto neto no puede ser negativo con los valores ingresados.";
    return;
  }

  statusMessage.textContent = "";
  grossAmount.textContent = formatCurrency(gross);
  taxAmount.textContent = formatCurrency(tax, true);
  chargeAmount.textContent = formatCurrency(fixedCharge, true);
  netAmount.textContent = formatCurrency(net);
  lastCalculation = {
    amountUsd,
    exchangeRate,
    fixedCharge,
    gross,
    tax,
    net
  };

  summaryText.textContent =
    `${amountUsd.toFixed(2)} USD x ${exchangeRate.toFixed(4)} = RD$ ${gross.toFixed(2)}. ` +
    `Se descuenta DGII por RD$ ${tax.toFixed(2)} y comision por RD$ ${fixedCharge.toFixed(2)}.`;
});

whatsappButton.addEventListener("click", () => {
  if (!lastCalculation) {
    statusMessage.textContent = "Primero calcula un resultado antes de enviarlo por WhatsApp.";
    return;
  }

  statusMessage.textContent = "";
  const phoneNumber = sanitizePhoneNumber(phoneNumberInput.value);
  const message = encodeURIComponent(buildWhatsappMessage(lastCalculation));
  const baseUrl = phoneNumber
    ? `https://wa.me/${phoneNumber}?text=${message}`
    : `https://wa.me/?text=${message}`;

  window.open(baseUrl, "_blank", "noopener,noreferrer");
});

amountUsdInput.value = "100";
exchangeRateInput.value = "60";
fixedChargeInput.value = "100";
form.requestSubmit();
