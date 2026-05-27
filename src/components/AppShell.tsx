"use client";

import { useEffect, useState } from "react";
import { useBookings, useUser, useStorageSync } from "@/lib/store";
import { toISODate } from "@/lib/fmt";
import { LoginGate } from "./LoginGate";
import { TurnosView } from "./TurnosView";
import { MisTurnosView } from "./MisTurnosView";
import { PerfilView } from "./PerfilView";
import { BottomNav, type Tab } from "./BottomNav";

export function AppShell() {
  const [hydrated, setHydrated] = useState(false);
  const user = useUser();
  const bookings = useBookings();
  const [tab, setTab] = useState<Tab>("turnos");

  useStorageSync();

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-accent grid place-items-center text-white font-bold text-xl shadow-lg shadow-brand-500/20">
          J
        </div>
      </div>
    );
  }

  if (!user) return <LoginGate />;

  const today = toISODate(new Date());
  const upcomingCount = bookings.filter((b) => b.date >= today).length;

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-background">
      <div className="flex-1">
        {tab === "turnos" && <TurnosView />}
        {tab === "mis-turnos" && <MisTurnosView />}
        {tab === "perfil" && <PerfilView />}
      </div>
      <BottomNav active={tab} onChange={setTab} badge={upcomingCount} />
    </div>
  );
}
