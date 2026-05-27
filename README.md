# Jime B · Turnos

App web mobile-first para reservar turnos en **Jime B Dance & Training** (San Miguel de Tucumán).

Prototipo armado por Fede para mostrarle la idea a Facu.

## Idea

Hoy el gimnasio coordina cada turno por WhatsApp uno por uno. La app deja que cada alumna:

- Vea la semana completa con cupos disponibles
- Reserve y cancele turnos desde el celu
- Vea sus próximos turnos en un solo lugar

Sin app que descargar — entra desde el navegador del celular y queda como PWA.

## Estado actual

Es un **prototipo cliqueable**:

- Login fake (nombre + número de celular) que guarda en `localStorage`
- Datos de mentira generados pseudo-random (cupos por horario)
- Las reservas se persisten en el navegador del usuario
- Sin backend ni base de datos todavía

## Stack

- Next.js 16 (App Router) + React 19
- Tailwind CSS 4
- TypeScript
- `lucide-react` para iconos
- Deploy: Vercel

## Correr local

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Próximos pasos (cuando le copen la idea)

1. Backend real — Supabase con auth por celular
2. Panel admin para Jime y Facu (ver inscriptos del día, marcar asistencia, agregar/quitar horarios)
3. Recordatorios por WhatsApp 1h antes
4. Lista de espera cuando hay cupo completo
5. Cuotas / pagos

## Estructura

```
src/
├── app/                    rutas (layout + page)
├── components/             AppShell + vistas + UI
│   ├── AppShell.tsx        orquesta login / tabs
│   ├── LoginGate.tsx       gate inicial
│   ├── TurnosView.tsx      home: semana + slots
│   ├── MisTurnosView.tsx   reservas del usuario
│   ├── PerfilView.tsx      datos del usuario y gym
│   ├── BottomNav.tsx       tabs inferiores
│   ├── BrandHeader.tsx     header con marca
│   ├── WeekStrip.tsx       selector de día
│   ├── SlotCard.tsx        tarjeta de turno
│   └── SlotSheet.tsx       bottom sheet para reservar
└── lib/
    ├── mock.ts             config del gym + slots template + cupos pseudo-random
    ├── store.ts            localStorage + hooks
    ├── fmt.ts              helpers de fecha/teléfono
    └── types.ts            tipos compartidos
```
