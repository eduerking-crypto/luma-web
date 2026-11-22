# Luma · Inglés con ciencia

En **Inicio**, pulsa **Comenzar sesión**. Lee un pasaje científico en inglés, consulta las palabras que necesitas, responde la pregunta y explica el fenómeno por escrito o con tu voz. Puedes salir a mitad de la sesión y retomarla desde el mismo paso.

## Abrir la aplicación

- **Web y móvil.** Abre [Luma](https://luma-laboratorio-ingles.expertbow2052.chatgpt.site) con la cuenta que tiene acceso. En **Configuración → Luma en tu dispositivo** puedes iniciar la instalación o consultar cómo añadirla a la pantalla de inicio. Las lecciones editoriales funcionan sin conexión después de que aparezca el estado de disponibilidad en ese dispositivo.
- **Windows.** Descomprime el archivo ZIP. Haz doble clic en **Abrir Luma.cmd**. Con Node.js 24 o superior, el lanzador abre la edición con SQLite y detecta si Luma ya se está ejecutando. Mantén abierta la ventana del servidor mientras estudias. Si Node no está instalado, se abre la edición editorial directamente en el navegador.
- **Terminal.** Con Node.js 24 o superior, ejecuta `node server.mjs` desde la carpeta que contiene este archivo. Abre la dirección que aparece en la terminal, normalmente [Luma en tu equipo](http://127.0.0.1:4173). El servidor se detiene con Ctrl+C.
- **Carpeta sin servidor.** Abre `public/index.html` con un navegador actual. El almacenamiento y el micrófono dependen de los permisos de ese navegador. El servidor local permite usar la base SQLite y el tutor generativo con un modelo de Ollama instalado.

## Qué incluye esta edición

- Siete temas científicos y cinco niveles, desde A1 hasta C1. Cada combinación incluye un pasaje en inglés, apoyo en español, glosario contextual, fuente, modelo de respuesta y pregunta de comprensión. Las áreas son biología marina, astronomía, botánica, física, química, matemáticas y ciencias de la Tierra.
- **Elegir tema** cambia la sesión de hoy. **Configuración** permite elegir la disciplina de los próximos días, el nivel, la velocidad de voz y el objetivo de actividades. La sesión conserva su borrador por fecha, tema y nivel. Cuando regresas después de completar una sesión, se ofrece un repaso de la lectura anterior.
- Una biblioteca con marcadores y paneles independientes de pronunciación, lectura, escritura, gramática, ejercicios, exposición y juegos. La toma de voz queda en la pantalla durante la actividad. Puedes conservar una transcripción o un guion para retomarlo.
- Cinco exámenes de práctica. Cada nivel presenta un caso científico nuevo, cuatro preguntas con retroalimentación y una tarea de producción escrita u oral. El informe distingue respuestas automáticas y autoevaluadas. El historial conserva los resultados del estudiante.
- Un banco de **102 términos en 17 temas**, con audio, ejemplos y repaso espaciado. El orden del repaso usa la curva de recuerdo de Settles y Meeder con una regla de semivida propia de Luma. [Investigación original](https://aclanthology.org/P16-1174/)
- Noticias de ocho revistas científicas mediante Crossref. El panel identifica revistas, fechas y DOI, reconoce licencias declaradas y muestra avisos editoriales cuando están depositados. Las prácticas basadas en un título se identifican como tales. [API de Crossref](https://www.crossref.org/documentation/retrieve-metadata/rest-api/)
- Vídeos del canal NASA Goddard por YouTube Data API cuando hay clave, o por el feed público cuando está disponible. TikTok e Instagram abren canales oficiales seleccionados. [Directorio de la NASA](https://www.nasa.gov/social-media/)
- Lumi explica palabras y pasajes, recibe la fuente de la lectura y permite revisar una respuesta. La guía integrada funciona sin modelo. El servidor local puede usar Ollama. En el alojamiento se admite Workers AI con un binding compatible o credenciales del servidor. El tutor identifica el modo activo.

## Datos y configuración

En local, `.luma-local/luma.sqlite` guarda por perfil el nivel, los borradores, la actividad y el vocabulario. Una cookie identifica el perfil del navegador. Para crear una copia verificada, ejecuta `node scripts/respaldo.mjs .luma-local/luma.sqlite copias/luma.sqlite`. Para restaurarla en una carpeta nueva, usa `node scripts/respaldo.mjs copias/luma.sqlite restaurada/luma.sqlite` y arranca el servidor con `LUMA_DATA_DIR` apuntando a `restaurada`. Usa el mismo perfil del navegador. La operación conserva las bases existentes. Se conserva además el estado en el almacenamiento del navegador. La edición para Sites incluye migración de Cloudflare D1 e identifica al visitante cuando el alojamiento suministra su identidad.

| Variable opcional | Uso |
| --- | --- |
| `LUMA_PORT` | Puerto del servidor local, inicialmente 4173. |
| `LUMA_DATA_DIR` | Directorio de la base SQLite local. |
| `LUMA_OLLAMA_MODEL` | Nombre de un modelo de conversación instalado en el servicio local de Ollama. |
| `YOUTUBE_API_KEY` | Clave del servidor autorizada para YouTube Data API v3. |
| `CF_AI_ACCOUNT_ID` y `CF_AI_TOKEN` | Acceso de servidor a Workers AI. También se admite un binding `AI` en un alojamiento compatible. |

Configura las credenciales en el entorno del servidor. La versión local escucha en la interfaz de bucle local.

## Continuar el proyecto

El **Prompt-maestro-Luma.md** reúne el encargo, el plan por etapas, los referentes de aprendizaje y los criterios de aceptación. La skill del proyecto está en `.agents/skills/luma-diseno/SKILL.md`. El registro de verificaciones está en **Pruebas.md**. El catálogo sirve como piloto del currículo. El plan contempla autores y revisores, más unidades y la evaluación del aprendizaje después de siete días.

| Carpeta | Función |
| --- | --- |
| `public/` | Interfaz, lector, ejercicios, biblioteca, noticias y tutor. |
| `public/assets/` | Imágenes, iconos Lucide, tipografía DM Sans y sus licencias. |
| `backend/api.mjs` | Noticias, vídeo, tutor y progreso compartidos entre el servidor y el Worker. |
| `db/` y `drizzle/` | Esquema y migración del progreso. |
| `scripts/build.mjs` | Genera un Worker ESM autónomo con los recursos de la interfaz. |

Ejecuta `npm run build` para reproducir la compilación de la edición alojada. Las herramientas de desarrollo de Drizzle solo hacen falta para generar migraciones nuevas. El paquete incluye la configuración identificativa de este proyecto de Sites para continuar su desarrollo.

Las escenas gráficas son ilustraciones originales generadas para Luma. Las fuentes de los hechos científicos están en cada lector. Las escenas de astronomía y biología ilustran el tema y no constituyen imágenes de los experimentos. Los recursos y sus instrucciones de generación están en **Diseño-visual.md**.

