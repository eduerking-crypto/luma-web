# Luma · APK que se actualiza sola (Cloudflare Pages)

Esta guía deja la app publicada en la web (Cloudflare Pages, gratis) y el APK
apuntando a esa web, de modo que **cada cambio en la web se ve en la app sin
recompilar el APK**.

---

## 1. Publicar la web en Cloudflare Pages (gratis)

### Opción A · Panel web (arrastrar y soltar)
1. Entra a https://dash.cloudflare.com/ → **Workers & Pages** → **Create** → **Pages** → **Upload assets**.
2. Nombre del proyecto: `luma` (o el que quieras).
3. Arrastra la carpeta **`public/`** completa (con `index.html`, `_headers`, etc.).
4. **Deploy**. Te dará una URL tipo `https://luma.pages.dev`.

### Opción B · Wrangler (CLI)
```bash
npm install -g wrangler
wrangler login
# Desde la carpeta qui/work/luma-release :
wrangler pages deploy public --project-name=luma
```

### Verifica
Abre tu URL `https://luma.pages.dev` en el navegador. Debe cargar la app.

---

## 2. Reconstruir el APK apuntando a esa URL

Con tu URL en mano (ej: `https://luma.pages.dev`):

```bash
cd qui/work/luma-release
node actualizar-apk.mjs https://luma.pages.dev
```

Esto:
- Actualiza `capacitor.config.json` con tu URL.
- Compila el APK firmado.
- Lo deja en `qui/work/luma-release/Luma-v1.0-release.apk`.

También puedes usar:
```bash
npm run apk -- https://luma.pages.dev
```

---

## 3. Instalar y compartir

- Transfiere `Luma-v1.0-release.apk` al móvil e instálalo.
- La app abre tu web a pantalla completa, con icono propio.
- **Cuando cambies `public/` y vuelvas a subir a Cloudflare, la app se actualiza sola** la próxima vez que se abra con internet.

---

## 4. Ciclo de actualización (lo repetirás siempre)

Cada vez que edites contenido en `public/`:

```bash
# 1. Subir a Cloudflare (CLI)
cd qui/work/luma-release
wrangler pages deploy public --project-name=luma

# 2. (Opcional) reconstruir APK solo si cambias algo nativo o la URL
#    Normalmente NO hace falta: la web se actualiza sola.
node actualizar-apk.mjs https://luma.pages.dev
```

---

## Notas

- La app usa el **Service Worker** incluido en la PWA: tras la primera visita,
  funciona sin conexión y se actualiza cuando hay internet.
- `cleartext: false` fuerza HTTPS (obligatorio para actualización y micrófono).
- Si más adelante usas dominio propio (ej `luma.tudominio.com`), solo cambia la
  URL en el comando del paso 2.
- Para Google Play se sube el mismo `.apk` firmado (o se genera un `.aab`);
  la publicación cuesta $25 únicos y es opcional.