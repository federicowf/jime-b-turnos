"use client";

import { CalendarDays, Ticket, User } from "lucide-react";

export type Tab = "turnos" | "mis-turnos" | "perfil";

const TABS: { id: Tab; label: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }[] = [
  { id: "turnos", label: "Turnos", Icon: CalendarDays },
  { id: "mis-turnos", label: "Mis turnos", Icon: Ticket },
  { id: "perfil", label: "Yo", Icon: User },
];

export function BottomNav({ active, onChange, badge }: { active: Tab; onChange: (t: Tab) => void; badge?: number }) {
  return (
    <nav className="sticky bottom-0 z-30 bg-surface/95 backdrop-blur border-t border-border">
      <div className="max-w-md mx-auto px-2 py-2 flex">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          const showBadge = id === "mis-turnos" && (badge ?? 0) > 0;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={[
                "relative flex-1 flex flex-col items-center justify-center gap-0.5 py-2 rounded-xl transition",
                isActive ? "text-brand-600" : "text-muted-fg active:bg-muted",
              ].join(" ")}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.4 : 1.8} />
                {showBadge ? (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                    {badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[11px] font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
