# Luma · Inglés para leer y explicar ciencia

**La primera meta es que una persona pueda abrir un artículo, entender una idea científica y explicarla en inglés con sus propias palabras.** Para alguien que empieza, la explicación puede ser una sola frase. Para alguien con más experiencia, puede incluir evidencia, una comparación y una limitación.

## Prompt maestro listo para copiar

Copia el siguiente bloque en tu agente de desarrollo. Si trabajas sobre la primera versión de Luma, adjunta el proyecto y la skill `luma-diseno`.

```text
Desarrolla Luma, un laboratorio de lectura en inglés para jóvenes y adultos hispanohablantes que disfrutan de las ciencias exactas y naturales. La prioridad son los principiantes y los estudiantes de nivel intermedio. Incluye una ruta que alcance C1. Una persona que empiece desde cero debe poder completar su primera sesión con instrucciones en español, un ejemplo resuelto y audio opcional.

Empieza revisando el proyecto existente, sus rutas, el almacenamiento y las pruebas disponibles. Usa la skill luma-diseno si está presente. Conserva lo que ya funciona y entrega cada incremento como un recorrido que se pueda probar en móvil y escritorio.

Diseña alrededor de una pregunta científica del día. Desde Inicio, el estudiante abre una lectura adaptada, escucha una frase, consulta una palabra, contesta una pregunta de comprensión y escribe o graba una explicación. Al volver mañana encuentra su avance y un repaso que recupera lo aprendido. Permite también usar cada panel de forma independiente.

Conecta las siguientes áreas.
1. Hoy y lectura. Selecciona una lectura por fecha local y preferencia científica. Distingue fecha de estudio y fecha de publicación. Muestra autoría o institución, fuente original y enlace estable. Presenta una adaptación graduada, audio cuando esté disponible, glosario contextual, preguntas y reanudación.
2. Escritura, pronunciación y exposición. Ofrece un ejemplo, un borrador, feedback explicativo y reintento. Para hablar, permite escuchar un modelo, grabarse, reproducir la toma y elegir una frase para mejorar. Ayuda a exponer un artículo mediante pregunta, método, hallazgo y límite con apoyos acordes al nivel. Ofrece alternativa con guion y autoevaluación cuando no haya micrófono.
3. Teoría, ejercicios, juegos y vocabulario. Practica la gramática que aparece en la lectura y el concepto científico asociado. Combina recuperación espaciada y uso en frases nuevas. Empieza con cuerpo, viajes, colores, números y objetos. Conecta esos temas con sentidos, navegación, luz, medición y materiales. Amplía después a hogar, alimentos, clima, movimiento, tiempo, laboratorio y datos.
4. Exámenes de práctica A1, A2, B1, B2 y C1. Especifica el descriptor de referencia, reparte preguntas por destreza e incorpora un texto nuevo. Pide más autonomía en los niveles avanzados. Devuelve resultados por destreza, razón del error y próxima práctica. Identifica por separado las respuestas automáticas, la autoevaluación y cualquier revisión humana.
5. Racha y ajustes. Cuenta los días con actividad completada en la zona horaria del estudiante. Una actividad repetida puede servir para practicar sin duplicar el logro. Permite elegir nivel, objetivo diario y preferencias de lectura o audio. Protege borradores al cambiar de panel.
6. Noticias y vídeos breves. Consulta metadatos de revistas seleccionadas por disciplina e ISSN mediante Crossref. Añade acceso abierto de editoriales o repositorios cuando corresponda. Cubre progresivamente matemáticas, física, química, astronomía, ciencias de la Tierra y biología. Muestra publicaciones y contenido social en vistas distinguibles. Identifica la fecha real, la fuente, los preprints y las selecciones editoriales guardadas.
7. Tutor. Ofrece pistas vinculadas al pasaje y al nivel. Si hay un proveedor generativo activo en el servidor, indica qué fragmento recibió, cita la lectura y reconoce cuándo hace falta otra fuente. Sin el proveedor, ofrece ayuda guiada local con ejemplos y explicaciones. Para escritura, pide una revisión breve que el estudiante pueda aplicar.

Mantén una identidad propia. El nombre es Luma y la mascota es Lumi, un ajolote lavanda con gafas redondas y bata. Inspírate en la claridad de las interfaces de Apple. Usa fondo perla, índigo para acciones, lavanda tenue, jerarquía tipográfica y animación breve con reducción de movimiento. Prioriza lectura cómoda, contraste comprobable, navegación por teclado y controles con etiquetas claras.

Trabaja en paralelo con responsables de currículo, fuentes científicas, producto visual e ingeniería. Acordad al inicio el identificador de lección, el formato de contenido y el evento de finalización. Integra mediante el recorrido completo del estudiante. Usa código propio y dependencias con licencia comprobada. Estudia el modelo público de repaso de Duolingo y las interacciones documentadas de otras aplicaciones. Registra qué se reutiliza y qué mejora se propone medir.

Para el piloto, conserva una edición utilizable en un dispositivo y un conjunto editorial disponible con mala conexión. Para cuentas y sincronización, escoge una base transaccional, aplica aislamiento por usuario y verifica una restauración. Protege secretos detrás del servidor. Configura YouTube Data API con clave y canales seleccionados. Activa TikTok o Instagram al disponer de cuenta, permisos y contenido autorizado. Los estados de datos en vivo, guardados y de muestra deben ser visibles.

Entrega código ejecutable, instrucciones de arranque, procedencia y licencias de las fuentes, y un registro breve de pruebas. Comprueba el flujo de una persona nueva, la reanudación tras recargar, permisos de micrófono denegados, fallo de una API, teclado, móvil, borradores y finalizaciones repetidas. Entrega también un plan con dependencias y criterios de salida. Informa qué funciona en esta versión, qué requiere credenciales y qué sigue en desarrollo.
```

## Plan de entregas

Cada etapa termina con una demostración o una medición reproducible. La meta de cobertura representa trabajo editorial continuado.

| Orden | Resultado para el estudiante | Criterio de salida y dependencia |
| --- | --- | --- |
| 1 · Una primera sesión | Abre bioluminiscencia marina, entiende una frase en inglés y explica por qué un animal puede emitir luz. | Desde un dispositivo nuevo se llega al texto, se recibe feedback y se conserva un logro tras recargar. Un hablante A1 puede avanzar con ejemplo y traducción. |
| 2 · Un itinerario | Elige su nivel, presenta un hallazgo, repasa vocabulario y realiza una prueba formativa con material inédito. | Un profesor revisa las cinco muestras MCER y un revisor científico contrasta los hechos. Antes de proclamar un nivel completo, hay varias unidades, materiales inéditos y criterios de corrección por destreza. |
| 3 · Una biblioteca viva | Encuentra una lectura diaria y publicaciones recientes de sus áreas de interés. | Cada disciplina prevista cuenta con una fuente identificada. Se deduplican DOI, se atienden correcciones o retiradas y una caída del proveedor deja disponible la última selección fechada. |
| 4 · Vídeo y tutor | Convierte una noticia o un clip de un canal científico en una práctica contextual. | Con claves de servidor se verifica un vídeo real y una respuesta fundada en el pasaje. Se prueba también el mismo flujo sin servicios. Las integraciones sociales adicionales dependen de permisos de las cuentas. |
| 5 · Progreso entre dispositivos y piloto | Retoma su trabajo y comprueba qué recuerda una semana después. | Las pruebas de aislamiento, reintento y restauración de la base pasan. Se comparan respuestas iniciales, finales y diferidas con usuarios reales. |

### Reparto de agentes

| Responsable | Entrega | Acuerdo de integración |
| --- | --- | --- |
| Currículo bilingüe | Lecturas por nivel, errores previsibles, audio de referencia, preguntas, prácticas y rúbricas. | Un mismo `lesson_id` vincula pasaje, vocabulario y versión corregida también al cambiar de panel. |
| Edición científica y datos | Fuentes, licencias, catálogo por disciplina y adaptadores con fecha de actualización. | Cada lección guarda `source_id`, referencia, indicación de adaptación y estado editorial. Se conservan las cifras, unidades y límites del hallazgo. |
| Interacción e identidad | Navegación, paneles, Lumi, tipografía, estados vacíos, foco y móvil. | Un diseño de lectura, una acción principal por paso y una alternativa usable a cada recurso de audio o red. |
| Ingeniería e integración | Persistencia, servicios, llaves, recuperación ante fallos y pruebas del recorrido completo. | Las actividades llevan identificadores estables. El evento de finalización se procesa una vez y la racha utiliza el calendario local. |

## Cómo graduar una idea científica

Ejemplo editorial original basado en bioluminiscencia. La NOAA explica que una reacción química puede producir la luz de un organismo y que esta puede cumplir distintas funciones. El consejo enumera lo que una persona puede hacer en una lengua. Las consignas siguientes son propuestas para Luma. [NOAA](https://oceanservice.noaa.gov/facts/biolum.html) · [Descriptores del MCER](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors)

| Nivel | Consigna en inglés | Evidencia que se observa |
| --- | --- | --- |
| A1 | *Some fish make light. What do they make?* | Reconoce *light* y completa *The fish makes __.* con un apoyo visual. |
| A2 | *Describe a fish that makes light. Write two sentences.* | Une dos rasgos con vocabulario frecuente y emplea un sujeto y un verbo comprensibles. |
| B1 | *Explain how an animal can make light. Give one possible use.* | Explica que interviene una reacción química y distingue mecanismo y función. |
| B2 | *Compare two possible uses of light and explain what observation would help you tell them apart.* | Contrasta explicaciones y propone una observación pertinente con conectores adecuados. |
| C1 | *A video shows a fish emitting light when another fish approaches. Assess the claim that it is communicating.* | Distingue observación e inferencia, matiza la conclusión y describe qué evidencia adicional buscaría. |

**Ejemplo de feedback.** Para *“All fish makes light”*, el tutor puede responder «Has relacionado peces y luz. La fuente habla de algunos peces. En plural usamos *make*. Prueba con *Some fish…*». La segunda versión permite observar por separado la precisión científica y la concordancia verbal.

## Qué tomar de las aplicaciones existentes

| Referente revisado | Decisión concreta para Luma |
| --- | --- |
| Duolingo publica el experimento *half-life regression*. Su implementación estima la probabilidad de recuerdo según el tiempo transcurrido y una semivida aprendida. | Comparar un calendario inicial sencillo con uno adaptativo mediante recuerdo diferido. Registrar palabra, contexto, fecha e intento para poder hacer esa comparación. [Código de investigación MIT](https://github.com/duolingo/halflife-regression/blob/master/experiment.py) · [Artículo original](https://aclanthology.org/P16-1174/) |
| LingQ combina lectura, escucha y vocabulario guardado dentro de una lección. | Permitir consultar y practicar un término en la misma oración. Medir si el estudiante vuelve al párrafo y comprende el término una semana después. [Demostración del equipo de LingQ](https://www.lingq.com/blog/import-any-youtube-video-into-lingq/) |
| Busuu ofrece consignas con respuesta hablada o escrita y correcciones de la comunidad. | Permitir esos dos modos en la exposición y pedir una segunda versión después del feedback. Compartir con terceros sería una elección explícita del estudiante. [Ayuda de Busuu](https://help.busuu.com/hc/en-us/articles/16746898571025-Where-can-I-find-exercises-to-complete) |

Para Luma se revisó el código de investigación que Duolingo publicó sobre la memoria y el repaso. El término «REA» coincide con *Reverse Engineering Assistant* en GitHub y, en educación, también significa *recursos educativos abiertos*. Para el contenido de Luma, un REA útil especifica qué permite su licencia y cómo atribuir la adaptación. [Repositorio de investigación de Duolingo](https://github.com/duolingo/halflife-regression) · [Definición de la UNESCO](https://www.unesco.org/es/open-educational-resources)

## Fuentes e integraciones propuestas para ampliar el piloto

| Proveedor | Uso y condición de acceso |
| --- | --- |
| Crossref | Buscar publicaciones por ISSN y tipo, conservar título, revista, DOI y fecha. La disponibilidad de metadatos varía según lo que deposite la editorial. Revisar derechos del texto antes de reproducir un resumen o una figura. [Crossref REST API](https://www.crossref.org/documentation/retrieve-metadata/rest-api/) |
| PLOS y Europe PMC | Para ciencias de la vida, consultar el artículo y su licencia. Registrar autor, fuente, licencia, recursos de terceros y adaptación. PLOS indica las excepciones a sus condiciones generales. [PLOS](https://plos.org/terms-of-use/) · [Europe PMC REST](https://europepmc.org/RestfulWebService) |
| YouTube | Habilitar Data API en un proyecto de Google, usar una clave restringida en servidor y mantener una selección de canales. Una lista editorial permite obtener vídeos mediante `playlistItems.list`. Describir como «vídeo breve» cuando solo se conoce su duración. [Acceso y cuotas](https://developers.google.com/youtube/data/getting-started) · [Listas de reproducción](https://developers.google.com/youtube/data/reference/rest/v3/playlistItems/list) |
| TikTok e Instagram | TikTok Display API usa autorización del creador y permisos aprobados. La API con Instagram Login se orienta a cuentas profesionales y exige los permisos del usuario. Empezar con enlaces editoriales identificados y habilitar sincronización al obtener autorización. [TikTok Display API](https://developers.tiktok.com/docs/en/display-api-get-started) · [Instagram Platform](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/v21.0/) |

Para seleccionar «revistas de alto impacto», define si el criterio es alcance editorial, relevancia para cada disciplina o una métrica bibliométrica concreta. Si se muestra una métrica, registra su año, disciplina y proveedor. Para el aprendizaje, prioriza estudios cuyo hallazgo se pueda explicar fielmente con evidencia accesible. Incluye matemáticas y disciplinas con ritmos de publicación distintos. Mide la diversidad del catálogo por área y la claridad de cada adaptación de forma independiente.

## Decisiones técnicas

El primer cliente puede funcionar con HTML, CSS y JavaScript y guardar el progreso del dispositivo. Para una edición de escritorio monousuario, SQLite ofrece transacciones sin un servicio de base de datos separado. Al introducir cuentas, PostgreSQL permite aislar filas por usuario. En esa fase conviene versionar el contenido de cada intento, validar migraciones y ensayar restauraciones antes de activar la sincronización. [SQLite](https://sqlite.org/about.html) · [PostgreSQL](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)

| Herramienta de GitHub evaluada | Momento en que aporta valor |
| --- | --- |
| `duolingo/halflife-regression` · MIT | Referencia de investigación ya revisada. Contrastar el comportamiento del repaso de Luma con datos del piloto antes de adoptar su modelo. [Repositorio](https://github.com/duolingo/halflife-regression) |
| `open-spaced-repetition/ts-fsrs` · MIT | Candidata cuando existan tarjetas con historial y la aplicación necesite calcular el próximo repaso. Conservar el aviso de licencia si se distribuye. [Repositorio](https://github.com/open-spaced-repetition/ts-fsrs) |
| `motiondivision/motion` · MIT | Candidata si la navegación requiere transiciones coordinadas entre estados. Las transiciones sencillas pueden seguir en CSS con movimiento reducido. [Repositorio](https://github.com/motiondivision/motion) |
| `microsoft/playwright` · Apache-2.0 | Candidata para automatizar pruebas de reanudación, teclado y fallos de API en Chromium, Firefox y WebKit. [Repositorio](https://github.com/microsoft/playwright) |

En la edición con cuentas, `source` identifica el original y su licencia. `lesson_version` fija la adaptación y el nivel. `attempt` enlaza usuario, actividad, versión e intento. `review` guarda el término, el último resultado y la próxima fecha. Una clave única de evento evita duplicar un logro al reintentar la sincronización. Los borradores tienen su propia versión para recuperar una edición al volver a conectarse.

## Cómo saber si Luma enseña

1. **Prueba de uso.** Una persona nueva abre la lección sin instrucciones del equipo, consulta una palabra y llega a una explicación propia. Registra en qué paso requiere ayuda, qué conserva al regresar y si distingue el texto de Luma de la publicación original.
2. **Aprendizaje inmediato y diferido.** Antes de la sesión, pide explicar el fenómeno en una frase. Al terminar, cambia el ejemplo y repite la tarea. A los siete días, evalúa recuerdo y transferencia con una pregunta inédita de dificultad comparable.
3. **Corrección con criterios observables.** Valora comprensión de la fuente, precisión del concepto, claridad lingüística e inteligibilidad según la tarea. Emplea una escala sencilla de 0 a 2 por criterio, con ejemplos ancla. Dos revisores puntúan una muestra y discuten discrepancias. Examina por separado las mejoras en ciencia e inglés.
4. **Decisión de lanzamiento.** En el primer piloto de usabilidad, incluye estudiantes principiantes e intermedios, móvil y escritorio. Como metas iniciales, que al menos cuatro de cinco participantes completen la sesión sin ayuda y que cada lección revisada tenga fuente identificable. Usa los resultados para corregir fricción. Una afirmación comparativa de eficacia requiere una muestra mayor, grupos comparables y una medición diferida.
