"use client";

import type { DaySlot } from "@/lib/types";

export function SlotCard({ slot, onTap }: { slot: DaySlot; onTap: () => void }) {
  const free = slot.capacity - slot.taken;
  const isFull = free <= 0 && !slot.mine;
  const isTight = free > 0 && free <= 2;

  return (
    <button
      onClick={onTap}
      className={[
        "w-full flex items-center justify-between p-4 rounded-2xl border transition active:scale-[0.99]",
        slot.mine
          ? "bg-gradient-to-r from-brand-50 to-brand-100 border-brand-500"
          : isFull
            ? "bg-muted border-border opacity-70"
            : "bg-surface border-border hover:border-brand-500/40",
      ].join(" ")}
    >
      <div className="flex items-center gap-4">
        <div
          className={[
            "w-14 h-14 rounded-xl grid place-items-center font-bold text-lg",
            slot.mine
              ? "bg-brand-500 text-white"
              : isFull
                ? "bg-border text-muted-fg"
                : "bg-brand-50 text-brand-600",
          ].join(" ")}
        >
          {slot.time}
        </div>
        <div className="text-left">
          <div className="font-semibold text-[15px] leading-tight">
            {slot.mine ? "Tu turno" : "Turno de gimnasio"}
          </div>
          <div
            className={[
              "text-xs mt-0.5",
              slot.mine ? "text-brand-700" : isFull ? "text-muted-fg" : isTight ? "text-warn" : "text-muted-fg",
            ].join(" ")}
          >
            {slot.mine
              ? "Reservado · tocá para cancelar"
              : isFull
                ? "Sin cupos"
                : `${free} ${free === 1 ? "cupo" : "cupos"} de ${slot.capacity}`}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <CapacityDots filled={slot.taken} total={slot.capacity} mine={slot.mine} />
      </div>
    </button>
  );
}

function CapacityDots({ filled, total, mine }: { filled: number; total: number; mine: boolean }) {
  return (
    <div className="flex gap-[3px]">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={[
            "w-1.5 h-4 rounded-full",
            i < filled ? (mine ? "bg-brand-600" : "bg-brand-500/70") : "bg-border",
          ].join(" ")}
        />
      ))}
    </div>
  );
}
