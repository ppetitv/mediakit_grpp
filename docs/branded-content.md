# Branded Content

Catálogo adaptado de las referencias oficiales de Grupo RPP:

- Web: https://mediakitrpp.com/web.html
- Redes sociales: https://mediakitrpp.com/redes-sociales.html

## Contenido

Seis formatos web: Nota, Reportaje, Landing, Blog, Ruta interactiva y
Publirreportaje. Once formatos sociales: Facebook Live informativo, Facebook
Live musical, Video patrocinado, Playground, Stories patrocinados, Reel,
Video on site, Post publicitario, Infografía patrocinada, Crossposting y Tema
del día. Los dos casos de Facebook Live musical permanecen disponibles.

`src/components/formats/branded-content.ts` contiene el texto adaptado, las
condiciones de integración y los enlaces originales de cada ficha.
`BrandedContentSection.tsx` presenta Web y Redes sociales como dos secciones
consecutivas en una sola página, con los 17 formatos disponibles en el recorrido.
Los accesos del inicio y los enlaces de cada encabezado permiten ir directamente
a cada familia, siguiendo el patrón de Streaming. Cada ficha conserva sus
detalles desplegables y la consulta con el formato de interés precargado.

La referencia de Video on site no publica un ejemplo y utiliza una imagen de
próximamente. La ficha conserva la descripción del formato y permite consultar
su disponibilidad; no se inventó un caso ni un enlace de demostración.

## Miniaturas

17 ilustraciones conceptuales nuevas, producidas con la herramienta integrada
`image_gen`. Usan las imágenes de los ejemplos publicados como referencias
de composición y `public/images/formats/thumbnails/standard/middle.webp` como
referencia de estilo. No son capturas de las campañas originales. Video on
site tiene una ilustración conceptual sin caso publicado de referencia.

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
