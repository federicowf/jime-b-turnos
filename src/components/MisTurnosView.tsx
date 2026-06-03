"use client";

import { useMemo, useState } from "react";
import { useBookings, useUser } from "@/lib/store";
import { useData } from "@/lib/data";
import { SLOT_TEMPLATES, preloadedTakenFor } from "@/lib/mock";
import { dayNameFull, monthShort, parseISODate, toISODate } from "@/lib/fmt";
import type { DaySlot, Sucursal } from "@/lib/types";
import { BrandHeader } from "./BrandHeader";
import { SlotSheet } from "./SlotSheet";
import { Calendar, MapPin, Ticket } from "lucide-react";

type MiTurno = { date: string; time: string; sucursalId: string };

export function MisTurnosView() {
  const bookings = useBookings();
  const { sheetActive, reservas, config, sucursales } = useData();
  const user = useUser();
  const phone = (user ?? "|").split("|")[1] ?? "";
  const [openSlot, setOpenSlot] = useState<DaySlot | null>(null);

  const findSucursal = (id: string): Sucursal =>
    sucursales.find((s) => s.id === id) ?? sucursales[0];

  const upcoming = useMemo<MiTurno[]>(() => {
    const today = toISODate(new Date());
    const list: MiTurno[] = sheetActive
      ? reservas
          .filter((r) => r.telefono === phone)
          .map((r) => ({ date: r.fecha, time: r.hora, sucursalId: r.sucursalId }))
      : bookings.map((b) => ({
          date: b.date,
          time: SLOT_TEMPLATES.find((t) => t.id === b.slotId)?.time ?? "",
          sucursalId: b.sucursalId,
        }));
    return list
      .filter((t) => t.date >= today && t.time)
      .sort((a, b) => (a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)));
  }, [sheetActive, reservas, phone, bookings]);

  function openBooking(t: MiTurno) {
    const date = parseISODate(t.date);
    const capacity = config.cuposPorClase;
    let taken: number;
    if (sheetActive) {
      taken = reservas.filter(
        (r) => r.fecha === t.date && r.hora === t.time && r.sucursalId === t.sucursalId,
      ).length;
    } else {
      const templateId = `${date.getDay()}-${t.time}`;
      taken = preloadedTakenFor(templateId, t.date, capacity, t.sucursalId) + 1;
    }
    setOpenSlot({
      templateId: `${date.getDay()}-${t.time}`,
      date: t.date,
      time: t.time,
      capacity,
      taken: Math.min(capacity, taken),
      mine: true,
      sucursalId: t.sucursalId,
    });
  }

  return (
    <>
      <BrandHeader subtitle="Tus próximos turnos" />

      <main className="px-5 pb-32 pt-2">
        {upcoming.length === 0 ? (
          <div className="mt-16 text-center py-12 px-6 rounded-3xl bg-muted">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-surface grid place-items-center mb-3">
              <Ticket size={26} strokeWidth={1.8} className="text-muted-fg" />
            </div>
            <h3 className="font-semibold">No tenés turnos reservados</h3>
            <p className="text-muted-fg text-sm mt-1">Andá a la pestaña Turnos y reservá uno.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {upcoming.map((t) => {
              const date = parseISODate(t.date);
              const sucursal = findSucursal(t.sucursalId);
              return (
                <button
                  key={`${t.date}-${t.time}-${t.sucursalId}`}
                  onClick={() => openBooking(t)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-brand-50 to-brand-100 border border-brand-500/30 active:scale-[0.99] transition text-left"
                >
                  <div className="w-14 h-14 rounded-xl bg-brand-500 text-white grid place-items-center">
                    <div className="text-center leading-tight">
                      <div className="text-[10px] uppercase font-medium opacity-90">{monthShort(date)}</div>
                      <div className="text-xl font-bold">{date.getDate()}</div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[15px] capitalize">{dayNameFull(date)}</div>
                    <div className="text-sm text-brand-700 flex items-center gap-1.5 mt-0.5">
                      <Calendar size={13} strokeWidth={2} />
                      <span>{t.time} hs</span>
                    </div>
                    <div className="text-xs text-muted-fg flex items-center gap-1.5 mt-0.5 truncate">
                      <MapPin size={12} strokeWidth={2} />
                      <span className="truncate">{sucursal?.name}</span>
                    </div>
                  </div>
                  <div className="text-xs text-brand-700 font-medium">Detalle ›</div>
                </button>
              );
            })}
          </div>
        )}
      </main>

      <SlotSheet slot={openSlot} onClose={() => setOpenSlot(null)} />
    </>
  );
}
