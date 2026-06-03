/**
 * ════════════════════════════════════════════════════════════════
 *  JIME B · TURNOS — Conexión con la planilla de Google
 *  Este código convierte tu planilla en el "panel" de la app:
 *    • La app LEE de acá los horarios, cupos y sucursales.
 *    • Cada reserva se ESCRIBE acá como una fila nueva.
 *
 *  Cómo instalarlo (se hace UNA sola vez):
 *    1. Abrí la planilla → menú "Extensiones" → "Apps Script".
 *    2. Borrá todo lo que haya y pegá ESTE archivo completo.
 *    3. Botón "Implementar" → "Nueva implementación".
 *    4. Tipo: "Aplicación web".
 *       - Ejecutar como: "Yo".
 *       - Quién tiene acceso: "Cualquier persona".
 *    5. Copiá la URL que te da (termina en /exec) y pegala en la app
 *       (variable NEXT_PUBLIC_SHEET_API en Vercel).
 *
 *  La planilla necesita 3 hojas (pestañas de abajo), con estos nombres
 *  EXACTOS: "Configuracion", "Sucursales", "Reservas".
 * ════════════════════════════════════════════════════════════════
 */

// Nombres de las hojas (pestañas) de la planilla.
var HOJA_CONFIG = "Configuracion";
var HOJA_SUCURSALES = "Sucursales";
var HOJA_RESERVAS = "Reservas";

/** La app pide los datos (horarios, cupos, sucursales y reservas). */
function doGet() {
  var data = {
    config: leerConfig(),
    sucursales: leerSucursales(),
    reservas: leerReservas(),
  };
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/** La app manda una reserva o una cancelación. */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var body = JSON.parse(e.postData.contents);
    if (body.accion === "reservar") {
      agregarReserva(body);
    } else if (body.accion === "cancelar") {
      cancelarReserva(body);
    }
    return ContentService.createTextOutput(
      JSON.stringify({ ok: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// ── Lectura ────────────────────────────────────────────────────

function leerConfig() {
  var hoja = SpreadsheetApp.getActive().getSheetByName(HOJA_CONFIG);
  var filas = hoja.getDataRange().getValues();
  var c = {};
  for (var i = 0; i < filas.length; i++) {
    var clave = String(filas[i][0]).trim().toLowerCase();
    var valor = String(filas[i][1]).trim();
    if (!clave) continue;
    if (clave.indexOf("cupos") === 0) c.cuposPorClase = parseInt(valor, 10) || 8;
    else if (clave.indexOf("mañana") >= 0 || clave.indexOf("manana") >= 0) c.horariosManana = aLista(valor);
    else if (clave.indexOf("tarde") >= 0) c.horariosTarde = aLista(valor);
    else if (clave.indexOf("días") >= 0 || clave.indexOf("dias") >= 0) c.diasAbiertos = aDias(valor);
    else if (clave.indexOf("solo") >= 0) c.soloMananaLos = aDias(valor);
  }
  return c;
}

function leerSucursales() {
  var hoja = SpreadsheetApp.getActive().getSheetByName(HOJA_SUCURSALES);
  var filas = hoja.getDataRange().getValues();
  var out = [];
  for (var i = 1; i < filas.length; i++) {
    var id = String(filas[i][0]).trim();
    if (!id) continue;
    out.push({ id: id, name: String(filas[i][1]).trim(), address: String(filas[i][2]).trim() });
  }
  return out;
}

function leerReservas() {
  var hoja = SpreadsheetApp.getActive().getSheetByName(HOJA_RESERVAS);
  var filas = hoja.getDataRange().getValues();
  var out = [];
  for (var i = 1; i < filas.length; i++) {
    var estado = String(filas[i][5]).trim().toLowerCase();
    if (estado === "cancelada") continue;
    out.push({
      fecha: String(filas[i][0]).trim(),
      hora: String(filas[i][1]).trim(),
      sucursalId: String(filas[i][2]).trim(),
      nombre: String(filas[i][3]).trim(),
      telefono: String(filas[i][4]).trim(),
    });
  }
  return out;
}

// ── Escritura ──────────────────────────────────────────────────

function agregarReserva(b) {
  var hoja = SpreadsheetApp.getActive().getSheetByName(HOJA_RESERVAS);
  hoja.appendRow([
    b.fecha,
    b.hora,
    b.sucursalId,
    b.nombre || "",
    b.telefono || "",
    "activa",
    new Date(),
  ]);
}

function cancelarReserva(b) {
  var hoja = SpreadsheetApp.getActive().getSheetByName(HOJA_RESERVAS);
  var filas = hoja.getDataRange().getValues();
  for (var i = filas.length - 1; i >= 1; i--) {
    if (
      String(filas[i][0]).trim() === b.fecha &&
      String(filas[i][1]).trim() === b.hora &&
      String(filas[i][2]).trim() === b.sucursalId &&
      String(filas[i][4]).trim() === String(b.telefono).trim() &&
      String(filas[i][5]).trim().toLowerCase() !== "cancelada"
    ) {
      hoja.getRange(i + 1, 6).setValue("cancelada");
      return;
    }
  }
}

// ── Ayudantes ──────────────────────────────────────────────────

// "07:00, 08:00" -> ["07:00","08:00"]
function aLista(texto) {
  return texto
    .split(/[,;\n]/)
    .map(function (x) { return x.trim(); })
    .filter(function (x) { return x.length > 0; });
}

// "lunes, martes" -> [1, 2]
function aDias(texto) {
  var map = { domingo: 0, lunes: 1, martes: 2, "miércoles": 3, miercoles: 3, jueves: 4, viernes: 5, "sábado": 6, sabado: 6 };
  return aLista(texto.toLowerCase())
    .map(function (d) { return map[d]; })
    .filter(function (d) { return d !== undefined; });
}
