"use client";

import { clearUser, useUser } from "@/lib/store";
import { formatPhone } from "@/lib/fmt";
import { GYM } from "@/lib/mock";
import { useData } from "@/lib/data";
import { BrandHeader } from "./BrandHeader";
import { AtSign, LogOut, MapPin, Phone } from "lucide-react";

export function PerfilView() {
  const user = useUser();
  const { sucursales: SUCURSALES } = useData();
  const [name, phone] = (user ?? "|").split("|");

  return (
    <>
      <BrandHeader subtitle="Tu perfil" />

      <main className="px-5 pb-32 pt-2">
        <div className="rounded-3xl bg-gradient-to-br from-brand-500 to-accent p-6 text-white shadow-lg shadow-brand-500/20">
          <div className="w-16 h-16 rounded-2xl bg-white/20 grid place-items-center text-3xl font-bold backdrop-blur">
            {name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <h2 className="text-2xl font-bold mt-4 leading-tight">{name || "Anónima"}</h2>
          <p className="text-white/80 text-sm mt-1 tabular-nums">{formatPhone(phone)}</p>
        </div>

        <h3 className="text-xs uppercase tracking-wider font-semibold text-muted-fg mt-7 mb-2.5 px-1">
          Sucursales
        </h3>
        <div className="rounded-2xl bg-surface border border-border divide-y divide-border">
          {SUCURSALES.map((s) => (
            <Row key={s.id} icon={<MapPin size={18} />} label={s.name} value={s.address} />
          ))}
        </div>

        <h3 className="text-xs uppercase tracking-wider font-semibold text-muted-fg mt-7 mb-2.5 px-1">
          El gimnasio
        </h3>
        <div className="rounded-2xl bg-surface border border-border divide-y divide-border">
          <Row icon={<MapPin size={18} />} label="Ciudad" value={GYM.city} />
          <Row icon={<AtSign size={18} />} label="Instagram" value={GYM.ig} />
          <Row icon={<Phone size={18} />} label="WhatsApp" value="381 555-9000" />
        </div>

        <button
          onClick={clearUser}
          className="w-full mt-7 py-3.5 rounded-2xl text-danger font-medium flex items-center justify-center gap-2 active:bg-muted transition"
        >
          <LogOut size={17} strokeWidth={2.2} />
          Cerrar sesión
        </button>

        <p className="text-center text-[11px] text-muted-fg mt-6 leading-relaxed">
          Prototipo armado por Fede · sin datos reales
          <br />
          {new Date().getFullYear()} · Tucumán
        </p>
      </main>
    </>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 grid place-items-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted-fg leading-tight">{label}</div>
        <div className="font-medium text-sm truncate">{value}</div>
      </div>
    </div>
  );
}
