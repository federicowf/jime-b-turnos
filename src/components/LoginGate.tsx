"use client";

import { useState } from "react";
import { setUser } from "@/lib/store";
import { GYM } from "@/lib/mock";

export function LoginGate() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const valid = phone.replace(/\D/g, "").length >= 10 && name.trim().length >= 2;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setUser(`${name.trim()}|${phone.replace(/\D/g, "")}`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-brand-50 via-background to-background">
      <div className="flex-1 flex flex-col justify-center px-7 max-w-md mx-auto w-full">
        <div className="mb-10">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-brand-500 to-accent grid place-items-center text-white font-bold text-3xl mb-5 shadow-lg shadow-brand-500/20">
            J
          </div>
          <h1 className="text-3xl font-bold tracking-tight leading-tight">
            {GYM.name}
            <br />
            <span className="text-brand-600">{GYM.tagline}</span>
          </h1>
          <p className="text-muted-fg mt-2 text-sm">Reservá tu turno desde el celu, sin escribir por WhatsApp.</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="block text-xs font-medium text-muted-fg mb-1.5 uppercase tracking-wider">
              Tu nombre
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Cami Gómez"
              className="w-full px-4 py-3.5 rounded-2xl bg-surface border border-border focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition text-base"
              autoComplete="given-name"
            />
          </label>

          <label className="block">
            <span className="block text-xs font-medium text-muted-fg mb-1.5 uppercase tracking-wider">
              Tu celular
            </span>
            <input
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="381 555-1234"
              className="w-full px-4 py-3.5 rounded-2xl bg-surface border border-border focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition text-base"
              autoComplete="tel"
            />
          </label>

          <button
            type="submit"
            disabled={!valid}
            className="w-full mt-2 py-4 rounded-2xl bg-brand-500 text-white font-semibold text-base shadow-lg shadow-brand-500/25 active:scale-[0.98] transition disabled:opacity-40 disabled:shadow-none"
          >
            Entrar
          </button>

          <p className="text-center text-xs text-muted-fg mt-4">
            Prototipo · sin datos reales · Tucumán
          </p>
        </form>
      </div>
    </div>
  );
}
