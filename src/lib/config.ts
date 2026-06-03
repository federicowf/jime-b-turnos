// ════════════════════════════════════════════════════════════════
//   ⚙️  CONFIGURACIÓN DE TURNOS
//   Este es el ÚNICO archivo que tenés que tocar para cambiar
//   tus horarios y la cantidad de lugares.
//
//   Cómo usarlo:
//     1. Editá los valores de abajo.
//     2. Guardá el archivo.
//     3. Volvé a publicar la app (o pedímelo a mí y lo hago).
//
//   Reglas de los horarios:
//     • Se escriben entre comillas, formato "HH:MM" en 24 horas.
//       Ejemplos: "07:00", "13:30", "20:00".
//     • Separados por coma.
// ════════════════════════════════════════════════════════════════

export const CONFIG = {
  // ── CUPOS ──────────────────────────────────────────────
  // Cuántas personas entran en cada clase.
  cuposPorClase: 8,

  // ── DÍAS QUE ABRÍS ─────────────────────────────────────
  // 1 = lunes, 2 = martes, 3 = miércoles, 4 = jueves,
  // 5 = viernes, 6 = sábado, 0 = domingo.
  // Sacá o agregá números para abrir/cerrar días.
  diasAbiertos: [1, 2, 3, 4, 5, 6],

  // ── HORARIOS DE LA MAÑANA ──────────────────────────────
  horariosManana: ["07:00", "08:00", "09:00", "10:00"],

  // ── HORARIOS DE LA TARDE / NOCHE ───────────────────────
  horariosTarde: ["17:00", "18:00", "19:00", "20:00", "21:00"],

  // ── DÍAS CON SOLO TURNOS DE MAÑANA ─────────────────────
  // Estos días NO tienen turnos de tarde (ej: el sábado).
  // Si querés que todos los días tengan mañana y tarde,
  // dejalo vacío así:  soloMananaLos: [],
  soloMananaLos: [6],
};
