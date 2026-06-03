"use client";

import { useEffect } from "react";
import type { DaySlot } from "@/lib/types";
import { addBooking, removeBooking } from "@/lib/store";
import { dayNameFull, parseISODate } from "@/lib/fmt";
import { sucursalById } from "@/lib/mock";
import { MapPin } from "lucide-react";

export function SlotSheet({ slot, onClose }: { slot: DaySlot | null; onClose: () => void }) {
  useEffect(() => {
    if (!slot) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [slot]);

  if (!slot) return null;

  const date = parseISODate(slot.date);
  const dayName = dayNameFull(date);
  const sucursal = sucursalById(slot.sucursalId);
  const free = slot.capacity - slot.taken;
  const isFull = free <= 0 && !slot.mine;

  function handleAction() {
    if (slot!.mine) {
      removeBooking(slot!.templateId, slot!.date, slot!.sucursalId);
    } else if (!isFull) {
      addBooking(slot!.templateId, slot!.date, slot!.sucursalId);
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm backdrop-enter"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-surface rounded-t-3xl shadow-2xl sheet-enter pb-6">
        <div className="pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 rounded-full bg-border" />
        </div>

        <div className="px-6 pt-3">
          <p className="text-xs uppercase tracking-wider text-muted-fg font-medium">
            {dayName} · {date.getDate()}
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <h2 className="text-4xl font-bold tracking-tight">{slot.time}</h2>
            <span className="text-muted-fg text-sm">hs</span>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-sm text-brand-700">
            <MapPin size={15} strokeWidth={2.2} />
            <span className="font-medium">{sucursal.name}</span>
            <span className="text-muted-fg">· {sucursal.address}</span>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-muted">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Cupos</span>
              <span className="text-sm tabular-nums text-muted-fg">
                {slot.taken}/{slot.capacity}
              </span>
            </div>
            <div className="h-2 rounded-full bg-border overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-accent rounded-full transition-all"
                style={{ width: `${Math.min(100, (slot.taken / slot.capacity) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-fg mt-2.5">
              {slot.mine
                ? "Estás anotada en este turno."
                : isFull
                  ? "Turno completo. Probá otro horario o entrá a la lista de espera."
                  : `Quedan ${free} ${free === 1 ? "lugar" : "lugares"} libres.`}
            </p>
          </div>

          <button
            onClick={handleAction}
            disabled={isFull && !slot.mine}
            className={[
              "w-full mt-6 py-4 rounded-2xl font-semibold text-base transition active:scale-[0.98]",
              slot.mine
                ? "bg-muted text-danger border border-border"
                : isFull
                  ? "bg-muted text-muted-fg cursor-not-allowed"
                  : "bg-brand-500 text-white shadow-lg shadow-brand-500/25",
            ].join(" ")}
          >
            {slot.mine ? "Cancelar mi turno" : isFull ? "Sin cupos" : "Reservar este turno"}
          </button>

          <button
            onClick={onClose}
            className="w-full mt-2 py-3 rounded-2xl text-muted-fg text-sm font-medium"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
