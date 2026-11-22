# Luma · Inglés con Ciencia 🌊🔬

**Laboratorio de lectura en inglés** para hispanohablantes que disfrutan de las ciencias. Lee artículos científicos adaptados a tu nivel (A1–C1), practica vocabulario y verbos, y explica descubrimientos con tus propias palabras.

> **Mascota:** Lumi, un ajolote lavanda con gafas redondas y bata.

---

## 🌐 Abrir la app

**Web (funciona offline tras la primera visita):**

```
https://eduerking-crypto.github.io/luma-web/
```

En móvil: abre el enlace en Chrome/Edge → menú → **"Instalar app"** o **"Añadir a pantalla de inicio"**.

---

## ✨ Qué incluye

| Sección | Contenido |
|---------|-----------|
| 🏠 **Inicio** | Sesión del día, racha y objetivo diario |
| 📚 **Biblioteca** | Lecturas guiadas + 12 artículos completos bilingües |
| 📰 **Noticias** | Revistas científicas (Crossref/PubMed) |
| 🔤 **Vocabulario** | 900+ palabras + APIs externas (Datamuse, ConceptNet, Dictionary) |
| 🔀 **Conjugador** | **1000+ verbos** × 12 tiempos × 6 personas × 3 modos |
| 🧪 **Explorador de temas** | Genera sesiones A1–C1 en 8 áreas científicas |
| 🎮 **Juegos** | Word Match, Verb Challenge, Science Quiz, Spelling Bee |
| 🤖 **Agentes** | Curriculum, QA, UI/UX, Vocabulario, Científico, Integración |
| 🎓 **Exámenes** | Práctica A1–C1 con retroalimentación |

### Artículos científicos completos (5 capítulos, A1–C1 cada uno)
- 🌊 Chimeneas hidrotermales (vida sin luz solar)
- 🧬 CRISPR (editando el código de la vida)
- ⚛️ Entrelazamiento cuántico
- 🦠 El microbioma humano
- 🌌 Materia oscura

---

## 🚀 Ejecutar localmente

```bash
cd server
npm install
npm start          # servidor en http://127.0.0.1:4173
```

O simplemente abre la web alojada (GitHub Pages). La app funciona como **PWA**: sin conexión tras la primera visita.

---

## 📱 App Android (APK)

El APK firmado se genera con Capacitor (ver `server/` y la guía de despliegue). Requisitos: Android SDK + JDK.

```bash
cd server
npx cap add android
npx cap sync android
cd android && gradlew assembleRelease
```

---

## 🛠️ Tecnologías

- **Frontend:** HTML/CSS/JS vanilla + Service Worker (PWA)
- **Backend:** Node.js + SQLite (`node:sqlite`) · Cloudflare Worker (edición alojada)
- **APIs científicas:** Crossref, PubMed/Europe PMC, Datamuse, ConceptNet, Free Dictionary, Wikipedia
- **Diseño:** Propio, inspiración Apple · DM Sans · accesibilidad AA

---

## 📄 Licencias y fuentes

- Fuentes de datos científicos citadas en cada lector con enlace estable.
- Ilustraciones e interfaces: originales para Luma.
- Iconos: Lucide (ISC). Tipografía: DM Sans (SIL OFL).

---

## 👨‍💻 Autor

Desarrollado por **Eduer** · Cartagena de Indias, Colombia 🇨🇴