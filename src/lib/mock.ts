import type { SlotTemplate, Sucursal } from "./types";

export const GYM = {
  name: "Jime B",
  tagline: "Dance & Training",
  city: "San Miguel de Tucumán",
  ig: "@jimebdt",
};

export const SUCURSALES: Sucursal[] = [
  { id: "norte", name: "Barrio Norte", address: "Av. Mate de Luna 1500" },
  { id: "sur", name: "Barrio Sur", address: "Av. Sáenz Peña 850" },
];

export const DEFAULT_SUCURSAL_ID = SUCURSALES[0].id;

export function sucursalById(id: string): Sucursal {
  return SUCURSALES.find((s) => s.id === id) ?? SUCURSALES[0];
}

const MORNING = ["07:00", "08:00", "09:00", "10:00"];
const EVENING = ["17:00", "18:00", "19:00", "20:00", "21:00"];
const ALL_TIMES = [...MORNING, ...EVENING];

export const SLOT_TEMPLATES: SlotTemplate[] = (() => {
  const out: SlotTemplate[] = [];
  for (let dow = 1; dow <= 6; dow++) {
    const times = dow === 6 ? MORNING : ALL_TIMES;
    for (const time of times) {
      out.push({
        id: `${dow}-${time}`,
        dayOfWeek: dow,
        time,
        capacity: 8,
      });
    }
  }
  return out;
})();

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function preloadedTakenFor(
  templateId: string,
  date: string,
  capacity: number,
  sucursalId: string,
): number {
  const time = templateId.split("-")[1];
  const h = hash(`${sucursalId}|${templateId}|${date}`);
  const isPeak = time === "08:00" || time === "18:00" || time === "19:00" || time === "20:00";
  const base = isPeak ? capacity - 1 : Math.floor(capacity * 0.4);
  const jitter = (h % 4) - 1;
  return Math.max(0, Math.min(capacity, base + jitter));
}
