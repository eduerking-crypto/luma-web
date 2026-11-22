# Verificación de Luma

Comprobaciones de la edición instalable, 21 de noviembre de 2026.

| Recorrido | Resultado observado |
| --- | --- |
| Catálogo | Las siete disciplinas cargaron un pasaje, traducción, glosario y pregunta con respuesta distinta de los distractores en cada uno de los cinco niveles. |
| Sesión de una persona nueva | Desde Inicio se eligió Química en A1, se abrió el texto, se acertó la pregunta y se escribió una explicación. Tras recargar, el guion continuó disponible. |
| Expresión | Al denegar el micrófono se mostró la alternativa con guion. El estudiante pudo comparar su versión con el ejemplo, revisar la idea científica y el inglés y completar la sesión. |
| Progreso y regreso | Completar la sesión y recargar mantuvo un único logro. Al simular el siguiente día local, apareció una pregunta de recuerdo sobre la lectura anterior. |
| Biblioteca y tutor | Una lectura de Matemáticas se abrió desde su tarjeta. La acción de consulta del pasaje compartió texto, fuente y nivel. Con Ollama se comprobó una respuesta real sobre el verbo *melts* en el pasaje de prueba. |
| Exámenes | Se probaron los cinco casos nuevos, sus 20 preguntas, los borradores, las dos modalidades de producción y sus rúbricas. Los resultados distinguen corrección automática y autoevaluación. |
| Red y dispositivo | Se instaló el *service worker* en Chromium. Con la red deshabilitada, una recarga abrió una sesión C1 y su pregunta de comprensión. La caché editorial excluyó las rutas de la API. Se comprobó navegación móvil sin desbordamiento horizontal. |
| Base de datos | Una copia de una base SQLite con WAL activo conservó el borrador al restaurarla en una base independiente. El script rechazó sobrescribir una copia previa. |
| Lanzador | La comprobación local reconoció un servidor Luma y distinguió un puerto libre de otro que servía una aplicación ajena. |
| Noticias | La consulta real devolvió ocho artículos de PLOS Biology. También se probaron la selección editorial sin red, las prácticas sobre un titular y los metadatos de licencia. |

La prueba de grabación usa las posibilidades del navegador y se debe complementar con dispositivos y voces reales. La instalación desde la pantalla de inicio depende del navegador. Quedan por realizar las sesiones de usabilidad con estudiantes, la revisión docente y científica externa y la medición de recuerdo a los siete días descritas en el prompt maestro.

