"use client";

import { dayNameShort, isSameDay, monthShort, toISODate } from "@/lib/fmt";

export function WeekStrip({
  days,
  selected,
  onSelect,
}: {
  days: Date[];
  selected: Date;
  onSelect: (d: Date) => void;
}) {
  const today = new Date();
  return (
    <div className="px-5 pt-1 pb-3">
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
        {days.map((d) => {
          const isSelected = isSameDay(d, selected);
          const isToday = isSameDay(d, today);
          const isSunday = d.getDay() === 0;
          return (
            <button
              key={toISODate(d)}
              onClick={() => onSelect(d)}
              disabled={isSunday}
              className={[
                "flex-shrink-0 flex flex-col items-center justify-center w-14 h-[72px] rounded-2xl transition-all",
                isSelected
                  ? "bg-gradient-to-br from-brand-500 to-accent text-white shadow-md shadow-brand-500/30"
                  : isSunday
                    ? "bg-muted text-muted-fg/50"
                    : "bg-surface border border-border text-foreground active:scale-95",
              ].join(" ")}
            >
              <span
                className={[
                  "text-[10px] uppercase tracking-wider font-medium",
                  isSelected ? "opacity-80" : "text-muted-fg",
                ].join(" ")}
              >
                {dayNameShort(d)}
              </span>
              <span className="text-xl font-bold leading-none mt-1">{d.getDate()}</span>
              <span
                className={[
                  "text-[10px] mt-0.5",
                  isSelected ? "opacity-80" : "text-muted-fg",
                ].join(" ")}
              >
                {isToday ? "hoy" : monthShort(d)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
