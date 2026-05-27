import { GYM } from "@/lib/mock";

export function BrandHeader({ subtitle }: { subtitle?: string }) {
  return (
    <header className="px-5 pt-6 pb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-accent grid place-items-center text-white font-bold text-lg shadow-sm">
          J
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold leading-tight tracking-tight">
            {GYM.name}
            <span className="ml-1.5 text-muted-fg font-normal text-sm">{GYM.tagline}</span>
          </h1>
          {subtitle ? (
            <p className="text-xs text-muted-fg leading-tight truncate">{subtitle}</p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
