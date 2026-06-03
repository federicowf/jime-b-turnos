# 📊 Conectar la planilla de Google a la app

Esta guía deja la app conectada a una **planilla de Google** que funciona como tu
panel: ahí editás horarios y cupos, y ahí ves quién se inscribió.

> Es una configuración que se hace **una sola vez** (unos 10–15 minutos).
> Después, vos solo usás la planilla. Si te traba algo, pedíselo a Fede.

---

## Paso 1 · Crear la planilla

1. Entrá a [sheets.google.com](https://sheets.google.com) y creá una planilla nueva.
2. Ponele de nombre **Jime B - Turnos**.
3. Abajo a la izquierda, creá **3 pestañas** con estos nombres EXACTOS
   (doble clic en el nombre de la pestaña para renombrar):

   - `Configuracion`
   - `Sucursales`
   - `Reservas`

### Pestaña `Configuracion`
Pegá esto tal cual (columna A los nombres, columna B los valores):

| A | B |
|---|---|
| Cupos por clase | 8 |
| Horarios mañana | 07:00, 08:00, 09:00, 10:00 |
| Horarios tarde | 17:00, 18:00, 19:00, 20:00, 21:00 |
| Días abiertos | lunes, martes, miércoles, jueves, viernes, sábado |
| Solo mañana | sábado |

👉 **Esto es lo que vas a editar siempre.** Cambiás el número de cupos o los
horarios, y la app se actualiza sola.

### Pestaña `Sucursales`
La primera fila son los títulos. No la borres.

| ID | Nombre | Dirección |
|---|---|---|
| norte | Barrio Norte | Av. Mate de Luna 1500 |
| sur | Barrio Sur | Av. Sáenz Peña 850 |

### Pestaña `Reservas`
Solo poné los títulos en la primera fila. El resto se llena **solo** cuando
alguien reserva:

| Fecha | Hora | Sucursal | Nombre | Teléfono | Estado | ReservadoEl |
|---|---|---|---|---|---|---|

---

## Paso 2 · Pegar el código

1. En la planilla: menú **Extensiones → Apps Script**.
2. Borrá lo que aparezca y pegá todo el contenido del archivo `Codigo.gs`
   (está en esta misma carpeta).
3. Guardá (ícono del disquete).

---

## Paso 3 · Publicar la conexión

1. Arriba a la derecha: botón **Implementar → Nueva implementación**.
2. Engranaje ⚙️ → elegí **Aplicación web**.
3. Configurá:
   - **Ejecutar como:** Yo
   - **Quién tiene acceso:** Cualquier persona
4. **Implementar**. Google te va a pedir permisos la primera vez → aceptá.
5. Te da una **URL** que termina en `/exec`. **Copiala.**

---

## Paso 4 · Pegar la URL en la app

1. Entrá a [vercel.com](https://vercel.com) → tu proyecto **jime-b-turnos**.
2. **Settings → Environment Variables**.
3. Agregá una nueva:
   - **Name:** `NEXT_PUBLIC_SHEET_API`
   - **Value:** la URL que copiaste (la que termina en `/exec`)
4. Guardá y volvé a publicar (**Deployments → Redeploy**).

---

## ✅ Listo

A partir de ahí:

- **Cambiar horarios o cupos** → editás la pestaña `Configuracion`.
- **Ver quién se inscribió** → mirás la pestaña `Reservas` (cada fila es una alumna).
- Si una reserva se cancela desde la app, su fila queda marcada como `cancelada`.

> ⚠️ Mientras la URL NO esté cargada, la app sigue funcionando en modo demo
> (con datos de ejemplo). Recién cuando pongas la URL empieza a usar tu planilla.
