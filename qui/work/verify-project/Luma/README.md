# Luma · Inglés con ciencia

Abre **Inicio → Empezar lectura** para explorar la bioluminiscencia marina. Escoge A1 si es tu primera lección. Puedes escuchar el texto, consultar el significado de las palabras, responder una pregunta y grabar o escribir tu propia explicación.

## Ejecutar en tu equipo

Descomprime el proyecto completo. Con Node.js 24 o superior, abre una terminal en la carpeta que contiene este archivo y ejecuta `node server.mjs`. Abre el enlace que aparece en la terminal, normalmente [Luma en tu equipo](http://127.0.0.1:4173). No hacen falta instalaciones de npm para estudiar. Cierra el servidor con Ctrl+C.

Para probar las actividades editoriales con un doble clic, abre `public/index.html` en un navegador actual. En esa modalidad, la persistencia y los permisos de audio dependen del navegador. El servidor local habilita SQLite y el tutor generativo cuando Ollama está disponible.

## Qué incluye esta edición

- Tres lecturas sobre bioluminiscencia, nacimiento de estrellas y fotosíntesis. Cada una tiene variantes A1, A2, B1, B2 y C1. La biblioteca conserva los artículos guardados.
- Una unidad de bioluminiscencia con expresión escrita, pronunciación, teoría, ejercicios, exposición y cinco pruebas formativas de cuatro preguntas. La nota indica comprensión de esa unidad. Los borradores se conservan al cambiar de panel.
- Sesenta términos en diez temas, un juego de parejas y un repaso que ordena palabras según su recuerdo estimado. Luma usa la curva de olvido publicada por Settles y Meeder con una regla propia para la semivida. La interfaz explica cómo la calcula. [Estudio original](https://aclanthology.org/P16-1174/)
- Calendario, objetivos diarios, racha y nivel configurable. La grabación de voz se reproduce en el navegador y se descarta al salir del panel. La autoevaluación de pronunciación se apoya en la comparación con una voz de ejemplo.
- Noticias basadas en metadatos de **ocho revistas**. La vista muestra la revista, fecha y DOI, ofrece una lectura del día y conserva una selección editorial si falla la red. «Practicar el título» lleva el titular al tutor. [API de Crossref](https://www.crossref.org/documentation/retrieve-metadata/rest-api/)
- Videonoticias de NASA Goddard. El servidor intenta YouTube Data API si tiene clave y el feed público de YouTube cuando está disponible. Instagram y TikTok se abren como canales oficiales. [Directorio de la NASA](https://www.nasa.gov/social-media/)
- Lumi ofrece ayuda guiada integrada. Con un modelo local disponible en Ollama aparece el modo generativo. En un despliegue compatible también puede usar Workers AI. La pantalla identifica el modo de cada respuesta.

## Datos y configuración

En local, `.luma-local/luma.sqlite` guarda por perfil el nivel, los borradores, la actividad y el vocabulario. Una cookie identifica el perfil del navegador. Para restaurar la base local, detén el servidor, conserva la carpeta de datos completa y vuelve a abrirla usando ese mismo perfil del navegador. Se conserva además el estado en el almacenamiento del navegador. La edición para Sites incluye migración de Cloudflare D1 e identifica al visitante cuando el alojamiento suministra su identidad.

| Variable opcional | Uso |
| --- | --- |
| `LUMA_PORT` | Puerto del servidor local, inicialmente 4173. |
| `LUMA_DATA_DIR` | Directorio de la base SQLite local. |
| `LUMA_OLLAMA_MODEL` | Nombre de un modelo de conversación instalado en el servicio local de Ollama. |
| `YOUTUBE_API_KEY` | Clave del servidor autorizada para YouTube Data API v3. |
| `CF_AI_ACCOUNT_ID` y `CF_AI_TOKEN` | Acceso de servidor a Workers AI. También se admite un binding `AI` en un alojamiento compatible. |

Configura las credenciales en el entorno del servidor. La versión local escucha en la interfaz de bucle local.

## Continuar el proyecto

El **Prompt-maestro-Luma.md** reúne el encargo, el plan por etapas, los referentes de aprendizaje y los criterios de aceptación. La skill del proyecto está en `.agents/skills/luma-diseno/SKILL.md`. El catálogo editorial y las pruebas son una primera muestra del currículo. El plan contempla autores y revisores, más unidades y la evaluación del aprendizaje después de siete días.

| Carpeta | Función |
| --- | --- |
| `public/` | Interfaz, lector, ejercicios, biblioteca, noticias y tutor. |
| `public/assets/` | Imágenes, iconos Lucide, tipografía DM Sans y sus licencias. |
| `backend/api.mjs` | Noticias, vídeo, tutor y progreso compartidos entre el servidor y el Worker. |
| `db/` y `drizzle/` | Esquema y migración del progreso. |
| `scripts/build.mjs` | Genera un Worker ESM autónomo con los recursos de la interfaz. |

Ejecuta `npm run build` para reproducir la compilación de la edición alojada. Las herramientas de desarrollo de Drizzle solo hacen falta para generar migraciones nuevas. El paquete incluye la configuración identificativa de este proyecto de Sites para continuar su desarrollo.

Las escenas gráficas son ilustraciones originales generadas para Luma. Las fuentes de los hechos científicos están en cada lector. Las escenas de astronomía y biología ilustran el tema y no constituyen imágenes de los experimentos. Los recursos y sus instrucciones de generación están en **Diseño-visual.md**.

