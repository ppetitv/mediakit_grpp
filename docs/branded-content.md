# Branded Content

Catálogo adaptado de las referencias oficiales de Grupo RPP:

- Web: https://mediakitrpp.com/web.html
- Redes sociales: https://mediakitrpp.com/redes-sociales.html

## Contenido

Seis formatos web: Nota, Reportaje, Landing, Blog, Ruta interactiva y
Publirreportaje. Once formatos sociales: Facebook Live informativo, Facebook
Live musical, Video patrocinado, Playground, Stories patrocinados, Reel,
Video on site, Post publicitario, Infografía patrocinada, Crossposting y Tema
del día.

`src/components/formats/branded-content.ts` contiene el texto adaptado, las
condiciones de integración y los enlaces originales de cada ficha.
`BrandedContentSection.tsx` presenta Web y Redes sociales como dos secciones
consecutivas. Cada entrada del catálogo muestra su imagen, título y bajada,
y enlaza a `/formatos/branded-content/{slug}`. La integración, los ejemplos y las
condiciones se muestran dentro de la ficha individual.

Las fichas utilizan el mismo diálogo a pantalla completa de Display en
`FormatExplorer.tsx`: cabecera, imagen a la izquierda, información a la derecha,
cierre, apertura/cierre animados, copia de URL y navegación anterior/siguiente.
`BrandedContentDetail.tsx` aporta los datos y reutiliza las tarjetas y acordeones
de Display para mostrar integración, demos externas y condiciones. El enlace
«Consultar este formato» lleva directamente a Impulsa tu Marca.

Cada ruta admite acceso directo y recarga. Al abrir desde el catálogo, cerrar o
presionar Escape devuelve a la posición y al enlace de origen. Una ficha abierta
directamente vuelve a su familia. Un slug desconocido muestra una vista de
formato no encontrado.

Landing, Blog, Ruta interactiva, Video patrocinado, Playground, Stories
patrocinados, Video on site y Tema del día reproducen sus demos directamente
desde `public/videos/branded-content/`. Cada ficha enlaza la publicación original.
Los ejemplos de Nota, Reportaje, Publirreportaje, Post publicitario e Infografía
se mantienen como enlaces.

Facebook Live informativo, Facebook Live musical, Reel y Crossposting tienen la
demo pendiente. Sus publicaciones originales ya no reproducen públicamente:

- Facebook Live informativo: https://www.facebook.com/rppnoticias/videos/1975128499335035
- Facebook Live musical: https://www.facebook.com/watch/?v=556747869028856 y https://www.facebook.com/watch/live/?v=3065959823663389
- Reel: https://www.instagram.com/reel/CWYlayWl9Pq/
- Crossposting: https://www.facebook.com/watch/live/?v=3741707392807541

Branded Content y Display comparten un reproductor con controles. El ancho se
calcula a partir de la proporción del video, el ancho de la columna y la altura
visible de la pantalla. Middle reserva además espacio para su selector de
dispositivo.

La referencia original de Video on site no publica un ejemplo. El 23/11/2026 se
incorporó una demo reciente del LinkedIn oficial de GRUPORPP: Romina Vinoglo de
Radio Corazón cubriendo PMX 2025 para OOHLA, con entrevistas a los asistentes.

- Demo: https://www.linkedin.com/posts/gruporpp-peru_oohla-grpp-ooh-activity-7379932204648525826-kE3i
- Publicación: 03/10/2025; duración: 58 segundos, según el VideoObject público.

Se usa como ejemplo de cobertura en locación; su duración no cambia la
especificación comercial del formato. La ficha abre «Demos y ejemplos» para
mostrar el acceso al video al ingresar. Se sustituyó el ejemplo anterior de 2024.

El video de PMX 2025 está descargado en
`public/videos/branded-content/video-on-site-pmx-2025.mp4`, junto con su portada
original. Se reproduce directamente en la ficha con el reproductor compartido
de Display, en proporción vertical y con controles de pausa, audio, avance y
pantalla completa. Comienza sin sonido para permitir la reproducción automática;
el usuario puede activarlo. El enlace de LinkedIn conserva la fuente original.

## Miniaturas

17 ilustraciones conceptuales nuevas, producidas con la herramienta integrada
`image_gen`. Usan las imágenes de los ejemplos publicados como referencias
de composición y `public/images/formats/thumbnails/standard/middle.webp` como
referencia de estilo. No son capturas de las campañas originales. Video on
site tiene una ilustración conceptual creada antes de incorporar la demo.

La familia visual mantiene el fondo claro, ventanas blancas frontales, texto
simulado en gris y áreas de integración en rojo de los thumbnails de Display.
Las piezas sociales conservan las proporciones propias de cada experiencia:
transmisión, story, reel, post, infografía o amplificación multiplataforma.

Archivos finales:
`public/images/formats/thumbnails/branded-content/{slug}.webp` y
`{slug}-720.webp`, de 1448 × 1086 y 720 × 540 píxeles respectivamente.
El manifiesto de esta carpeta registra dimensiones, pesos y referencias.
Los prompts completos se guardan en `docs/branded-content-prompts.json`.

Las conversiones finales a WebP y la normalización a 4:3 conservan las
ilustraciones generadas. El manifiesto previo de Display se mantiene separado.

## Comprobaciones

Actualización de fichas individuales (23/11/2026):

- 30 pruebas del proyecto y compilación de producción correctas.
- Las 17 fichas revisadas en escritorio de 1440 px y móvil de 390 px, con recarga
  directa y sin desborde horizontal.
- Catálogo con 17 accesos que muestran imagen, título y bajada.
- Enlaces externos, regreso al catálogo, recorrido anterior/siguiente, copia de
  URL y consulta con interés precargado comprobados.
- URL desconocida y regresión de la ficha Display Top comprobadas.

Comprobaciones de la entrega anterior:

- Compilación de producción y lint de los nuevos componentes correctos.
- 15 pruebas de rutas y thumbnails de Display correctas, incluidos los nuevos
  accesos directos a las familias de Branded Content.
- 17 fichas, 34 archivos WebP y 17 enlaces cotejados con las fuentes oficiales.
- Vista de escritorio y móvil de 390 px revisadas en navegador, sin desborde
  horizontal en el catálogo.
- Navegación continua por Web y Redes sociales, accesos directos, detalles
  desplegables y consulta con el formato de interés comprobados.

Se añadió `esbuild` como dependencia de desarrollo: la configuración existente
ya lo exigía para minificar CSS, pero el paquete no estaba instalado.
