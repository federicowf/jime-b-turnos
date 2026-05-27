"use client";

import { useMemo, useState } from "react";
import { useBookings } from "@/lib/store";
import { SLOT_TEMPLATES, preloadedTakenFor } from "@/lib/mock";
import { dayNameFull, monthShort, parseISODate, toISODate } from "@/lib/fmt";
import type { DaySlot } from "@/lib/types";
import { BrandHeader } from "./BrandHeader";
import { SlotSheet } from "./SlotSheet";
import { Calendar, Ticket } from "lucide-react";

export function MisTurnosView() {
  const bookings = useBookings();
  const [openSlot, setOpenSlot] = useState<DaySlot | null>(null);

  const upcoming = useMemo(() => {
    const today = toISODate(new Date());
    return bookings
      .filter((b) => b.date >= today)
      .sort((a, b) => (a.date === b.date ? a.slotId.localeCompare(b.slotId) : a.date.localeCompare(b.date)));
  }, [bookings]);

  function openBooking(slotId: string, date: string) {
    const tmpl = SLOT_TEMPLATES.find((t) => t.id === slotId);
    if (!tmpl) return;
    const taken = preloadedTakenFor(slotId, date, tmpl.capacity) + 1;
    setOpenSlot({
      templateId: tmpl.id,
      date,
      time: tmpl.time,
      capacity: tmpl.capacity,
      taken: Math.min(tmpl.capacity, taken),
      mine: true,
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
            {upcoming.map((b) => {
              const tmpl = SLOT_TEMPLATES.find((t) => t.id === b.slotId);
              if (!tmpl) return null;
              const date = parseISODate(b.date);
              return (
                <button
                  key={`${b.slotId}-${b.date}`}
                  onClick={() => openBooking(b.slotId, b.date)}
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
                      <span>{tmpl.time} hs</span>
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
