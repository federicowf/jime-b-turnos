"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { CONFIG } from "./config";
import { SUCURSALES, type TurnosConfig } from "./mock";
import type { Sucursal } from "./types";
import {
  fetchSheetData,
  sendSheetAction,
  sheetEnabled,
  type SheetReserva,
} from "./sheet";

type DataValue = {
  ready: boolean;
  sheetActive: boolean;
  config: TurnosConfig;
  sucursales: Sucursal[];
  reservas: SheetReserva[];
  refresh: () => void;
  reservar: (r: SheetReserva) => Promise<void>;
  cancelar: (r: SheetReserva) => Promise<void>;
};

const DEMO_VALUE: DataValue = {
  ready: true,
  sheetActive: false,
  config: CONFIG,
  sucursales: SUCURSALES,
  reservas: [],
  refresh: () => {},
  reservar: async () => {},
  cancelar: async () => {},
};

const DataContext = createContext<DataValue>(DEMO_VALUE);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(!sheetEnabled);
  const [config, setConfig] = useState<TurnosConfig>(CONFIG);
  const [sucursales, setSucursales] = useState<Sucursal[]>(SUCURSALES);
  const [reservas, setReservas] = useState<SheetReserva[]>([]);

  const load = useCallback(async () => {
    if (!sheetEnabled) return;
    try {
      const data = await fetchSheetData();
      // La planilla puede traer solo algunos campos: completamos con los defaults.
      setConfig({ ...CONFIG, ...data.config });
      if (data.sucursales?.length) setSucursales(data.sucursales);
      setReservas(data.reservas ?? []);
    } catch {
      // Si la planilla falla, seguimos en modo demo sin romper la app.
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    // Carga asíncrona: los setState ocurren después del await (no son síncronos).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const reservar = useCallback(
    async (r: SheetReserva) => {
      setReservas((prev) => [...prev, r]); // optimista
      await sendSheetAction({ accion: "reservar", ...r });
    },
    [],
  );

  const cancelar = useCallback(
    async (r: SheetReserva) => {
      setReservas((prev) =>
        prev.filter(
          (x) =>
            !(
              x.fecha === r.fecha &&
              x.hora === r.hora &&
              x.sucursalId === r.sucursalId &&
              x.telefono === r.telefono
            ),
        ),
      );
      await sendSheetAction({ accion: "cancelar", ...r });
    },
    [],
  );

  const value: DataValue = {
    ready,
    sheetActive: sheetEnabled,
    config,
    sucursales,
    reservas,
    refresh: load,
    reservar,
    cancelar,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataValue {
  return useContext(DataContext);
}

export function useSucursalById(id: string): Sucursal {
  const { sucursales } = useData();
  return sucursales.find((s) => s.id === id) ?? sucursales[0] ?? SUCURSALES[0];
}
