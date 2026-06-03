"use client";

import { useMemo, useState } from "react";
import { SLOT_TEMPLATES, preloadedTakenFor } from "@/lib/mock";
import { useBookings, useSucursal } from "@/lib/store";
import { dayNameFull, monthShort, nextDays, toISODate } from "@/lib/fmt";
import type { DaySlot } from "@/lib/types";
import { WeekStrip } from "./WeekStrip";
import { SlotCard } from "./SlotCard";
import { SlotSheet } from "./SlotSheet";
import { BrandHeader } from "./BrandHeader";
import { SucursalSwitcher } from "./SucursalSwitcher";

export function TurnosView() {
  const [selected, setSelected] = useState<Date>(() => {
    const t = new Date();
    if (t.getDay() === 0) t.setDate(t.getDate() + 1);
    return t;
  });
  const [openSlot, setOpenSlot] = useState<DaySlot | null>(null);
  const bookings = useBookings();
  const sucursalId = useSucursal();

  const days = useMemo(() => {
    const start = new Date();
    return nextDays(start, 14);
  }, []);

  const slotsForDay = useMemo<DaySlot[]>(() => {
    const dow = selected.getDay();
    const iso = toISODate(selected);
    const mineSet = new Set(
      bookings.filter((b) => b.date === iso && b.sucursalId === sucursalId).map((b) => b.slotId),
    );
    return SLOT_TEMPLATES.filter((t) => t.dayOfWeek === dow).map((t) => {
      const preloaded = preloadedTakenFor(t.id, iso, t.capacity, sucursalId);
      const mine = mineSet.has(t.id);
      return {
        templateId: t.id,
        date: iso,
        time: t.time,
        capacity: t.capacity,
        taken: Math.min(t.capacity, preloaded + (mine ? 1 : 0)),
        mine,
        sucursalId,
      };
    });
  }, [selected, bookings, sucursalId]);

  const isClosed = selected.getDay() === 0;

  return (
    <>
      <BrandHeader subtitle={`${dayNameFull(selected)} ${selected.getDate()} de ${monthShort(selected)}`} />
      <SucursalSwitcher />
      <WeekStrip days={days} selected={selected} onSelect={setSelected} />

      <main className="px-5 pb-32">
        {isClosed ? (
          <EmptyState
            title="Domingo cerrado"
            description="Volvemos el lunes con todos los horarios."
          />
        ) : (
          <>
            <SectionTitle morning />
            <div className="space-y-2.5">
              {slotsForDay
                .filter((s) => parseInt(s.time) < 12)
                .map((s) => (
                  <SlotCard key={s.templateId} slot={s} onTap={() => setOpenSlot(s)} />
                ))}
            </div>

            {slotsForDay.some((s) => parseInt(s.time) >= 12) ? (
              <>
                <SectionTitle morning={false} />
                <div className="space-y-2.5">
                  {slotsForDay
                    .filter((s) => parseInt(s.time) >= 12)
                    .map((s) => (
                      <SlotCard key={s.templateId} slot={s} onTap={() => setOpenSlot(s)} />
                    ))}
                </div>
              </>
            ) : null}
          </>
        )}
      </main>

      <SlotSheet slot={openSlot} onClose={() => setOpenSlot(null)} />
    </>
  );
}

function SectionTitle({ morning }: { morning: boolean }) {
  return (
    <h2 className="text-xs uppercase tracking-wider font-semibold text-muted-fg mt-5 mb-2.5 flex items-center gap-2">
      <span>{morning ? "Mañana" : "Tarde y noche"}</span>
      <span className="flex-1 h-px bg-border" />
    </h2>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="mt-10 text-center py-12 px-6 rounded-3xl bg-muted">
      <div className="text-3xl mb-2">🌙</div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-muted-fg text-sm mt-1">{description}</p>
    </div>
  );
}
