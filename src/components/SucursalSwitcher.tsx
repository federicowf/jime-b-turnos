"use client";

import { MapPin } from "lucide-react";
import { setSucursal, useSucursal } from "@/lib/store";
import { useData } from "@/lib/data";

export function SucursalSwitcher() {
  const current = useSucursal();
  const { sucursales: SUCURSALES } = useData();

  return (
    <div className="px-5 pt-1 pb-2">
      <div className="flex items-center gap-1 p-1 rounded-2xl bg-muted">
        {SUCURSALES.map((s) => {
          const isActive = s.id === current;
          return (
            <button
              key={s.id}
              onClick={() => setSucursal(s.id)}
              className={[
                "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition active:scale-[0.98]",
                isActive
                  ? "bg-surface text-brand-600 shadow-sm"
                  : "text-muted-fg",
              ].join(" ")}
            >
              <MapPin size={15} strokeWidth={isActive ? 2.4 : 2} />
              {s.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
