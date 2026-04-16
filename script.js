const form = document.getElementById("converter-form");
const amountUsdInput = document.getElementById("amountUsd");
const exchangeRateInput = document.getElementById("exchangeRate");
const fixedChargeInput = document.getElementById("fixedCharge");
const taxRateInput = document.getElementById("taxRate");
const phoneNumberInput = document.getElementById("phoneNumber");
const whatsappButton = document.getElementById("whatsappButton");
const statusMessage = document.getElementById("statusMessage");

const grossAmount = document.getElementById("grossAmount");
const taxLabel = document.getElementById("taxLabel");
const taxAmount = document.getElementById("taxAmount");
const chargeAmount = document.getElementById("chargeAmount");
const netAmount = document.getElementById("netAmount");
const summaryText = document.getElementById("summaryText");

const DEFAULT_TAX_RATE = 0.15;
let lastCalculation = null;

function formatCurrency(value, showMinus = false) {
  const prefix = showMinus ? "- RD$ " : "RD$ ";
  return `${prefix}${value.toFixed(2)}`;
}

function formatPercent(value) {
  return `${value.toFixed(4).replace(/\.?0+$/, "")}%`;
}

function calculateValues(amountUsd, exchangeRate, fixedCharge, taxRatePercent) {
  const gross = amountUsd * exchangeRate;
  const tax = gross * (taxRatePercent / 100);
  const net = gross - tax - fixedCharge;

  return {
    gross,
    tax,
    fixedCharge,
    taxRatePercent,
    net
  };
}

function sanitizePhoneNumber(value) {
  return value.replace(/\D/g, "");
}

function isIOSDevice() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
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
    `Impuesto DGII (${formatPercent(calculation.taxRatePercent)}): - RD$ ${calculation.tax.toFixed(2)}`,
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
  const taxRatePercent = Number(taxRateInput.value);

  if ([amountUsd, exchangeRate, fixedCharge, taxRatePercent].some((value) => Number.isNaN(value) || value < 0)) {
    statusMessage.textContent = "Asegurate de ingresar solo numeros validos.";
    resetResults();
    lastCalculation = null;
    summaryText.textContent = "Ingresa valores validos mayores o iguales a cero.";
    return;
  }

  const { gross, tax, net } = calculateValues(
    amountUsd,
    exchangeRate,
    fixedCharge,
    taxRatePercent
  );

  if (net < 0) {
    statusMessage.textContent = "Atencion: los cargos superan el monto convertido.";
    resetResults();
    lastCalculation = null;
    summaryText.textContent = "El monto neto no puede ser negativo con los valores ingresados.";
    return;
  }

  statusMessage.textContent = "";
  taxLabel.textContent = `Impuesto DGII (${formatPercent(taxRatePercent)})`;
  grossAmount.textContent = formatCurrency(gross);
  taxAmount.textContent = formatCurrency(tax, true);
  chargeAmount.textContent = formatCurrency(fixedCharge, true);
  netAmount.textContent = formatCurrency(net);
  lastCalculation = {
    amountUsd,
    exchangeRate,
    fixedCharge,
    taxRatePercent,
    gross,
    tax,
    net
  };

  summaryText.textContent =
    `${amountUsd.toFixed(2)} USD x ${exchangeRate.toFixed(4)} = RD$ ${gross.toFixed(2)}. ` +
    `Se descuenta DGII (${formatPercent(taxRatePercent)}) por RD$ ${tax.toFixed(2)} y comision por RD$ ${fixedCharge.toFixed(2)}.`;
});

whatsappButton.addEventListener("click", () => {
  if (!lastCalculation) {
    statusMessage.textContent = "Primero calcula un resultado antes de enviarlo por WhatsApp.";
    return;
  }

  statusMessage.textContent = "";
  const phoneNumber = sanitizePhoneNumber(phoneNumberInput.value);
  const message = encodeURIComponent(buildWhatsappMessage(lastCalculation));
  const webUrl = phoneNumber
    ? `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`
    : `https://api.whatsapp.com/send?text=${message}`;
  const appUrl = phoneNumber
    ? `whatsapp://send?phone=${phoneNumber}&text=${message}`
    : `whatsapp://send?text=${message}`;

  if (isIOSDevice()) {
    const fallbackTimer = window.setTimeout(() => {
      window.location.href = webUrl;
    }, 1200);

    window.addEventListener("pagehide", () => window.clearTimeout(fallbackTimer), { once: true });
    window.location.href = appUrl;
    return;
  }

  window.location.href = webUrl;
});

amountUsdInput.value = "";
exchangeRateInput.value = "";
fixedChargeInput.value = "";
taxRateInput.value = String(DEFAULT_TAX_RATE);
resetResults();
