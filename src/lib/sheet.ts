import type { Sucursal } from "./types";

// URL de la planilla (Apps Script). Se carga desde Vercel.
// Si está vacía, la app funciona en modo demo (sin planilla).
export const SHEET_API = process.env.NEXT_PUBLIC_SHEET_API ?? "";

export const sheetEnabled = SHEET_API.length > 0;

export type SheetConfig = {
  cuposPorClase?: number;
  horariosManana?: string[];
  horariosTarde?: string[];
  diasAbiertos?: number[];
  soloMananaLos?: number[];
};

export type SheetReserva = {
  fecha: string;
  hora: string;
  sucursalId: string;
  nombre: string;
  telefono: string;
};

export type SheetData = {
  config: SheetConfig;
  sucursales: Sucursal[];
  reservas: SheetReserva[];
};

/** Trae horarios, cupos, sucursales y reservas desde la planilla. */
export async function fetchSheetData(): Promise<SheetData> {
  const res = await fetch(SHEET_API, { cache: "no-store" });
  if (!res.ok) throw new Error(`Planilla respondió ${res.status}`);
  return (await res.json()) as SheetData;
}

type AccionReserva = {
  accion: "reservar" | "cancelar";
  fecha: string;
  hora: string;
  sucursalId: string;
  nombre: string;
  telefono: string;
};

/** Manda una reserva o cancelación a la planilla. */
export async function sendSheetAction(body: AccionReserva): Promise<void> {
  // text/plain evita el preflight CORS que Apps Script no maneja.
  await fetch(SHEET_API, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(body),
  });
}
