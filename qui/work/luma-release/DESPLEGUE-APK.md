# Luma · APK que se actualiza solo (GitHub Pages)

La web se publica gratis en GitHub Pages y el APK apunta a esa URL, de modo que
**cada cambio en la web se ve en la app sin recompilar ni reinstalar**.

- Web: https://eduerking-crypto.github.io/luma-web/
- Repositorio: https://github.com/eduerking-crypto/luma-web
- APK: `qui/work/luma-release/Luma-v1.0-release.apk`

---

## 1. Publicar la web

La carpeta `public/` de este directorio es una copia de los archivos de la web
del repositorio. Para actualizarla después de editar la web:

```bash
# Desde la raíz del repositorio
$src = "luma-web"
$dst = "luma-web/qui/work/luma-release/public"
Get-ChildItem $src -File | Where-Object { $_.Extension -in @('.css','.js','.html','.webmanifest') } |
  ForEach-Object { Copy-Item $_.FullName $dst -Force }
Copy-Item "$src/assets" $dst -Recurse -Force
```

Después haz commit y push a `master`. GitHub Pages vuelve a publicar en 1–2 minutos.

---

## 2. Reconstruir el APK (solo si cambia la URL o algo nativo)

```bash
cd qui/work/luma-release
node actualizar-apk.mjs https://eduerking-crypto.github.io/luma-web/
```

Esto actualiza `capacitor.config.json`, sincroniza Capacitor, compila el APK
firmado y lo deja en `Luma-v1.0-release.apk`.

También puedes usar:

```bash
npm run apk -- https://eduerking-crypto.github.io/luma-web/
```

---

## 3. Instalar y compartir

- Transfiere `Luma-v1.0-release.apk` al móvil e instálalo.
- La app abre la web a pantalla completa, con icono propio.
- **Normalmente no hay que recompilar**: al publicar cambios en `master`, la app
  los muestra sola la próxima vez que se abra con internet.

---

## 4. Notas

- El APK usa `server.url` de Capacitor; los archivos incluidos siguen presentes
  como respaldo, pero la fuente principal es la URL pública.
- La PWA usa Service Worker: tras la primera visita puede funcionar sin conexión.
  Si ves una versión antigua tras un cambio, cierra y vuelve a abrir la app dos
  veces para que el caché se renueve.
- Play Store no es obligatorio si compartes el APK directamente; publicar allí
  cuesta $25 únicos y requiere un `.aab`.
