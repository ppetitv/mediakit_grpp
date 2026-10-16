# Miniaturas de formatos

## Entrega

21 ilustraciones conceptuales generadas con la herramienta integrada `image_gen`:
6 de Estándar y 15 de Rich Media. Las versiones finales están en
`public/images/formats/thumbnails/{standard,rich-media}/`.

Cada imagen tiene una versión WebP de 1448 x 1086 y otra de 720 x 540.
`manifest.json` registra dimensiones y pesos. Las imágenes originales de
`public/images/formats/standard/` se conservan sin modificar. Los vídeos tampoco cambian.

Son representaciones conceptuales: las dimensiones, condiciones comerciales y
comportamientos definitivos siguen siendo los de la ficha técnica y las demos.

## Referencia Y Prompts

Referencia principal: `public/images/formats/standard/middle.png`.
Los otros cinco PNG originales se usaron como referencia de posición y proporción
en sus respectivas versiones de mayor resolución.

Prompt base usado en la generación:

> Production-ready advertising-format thumbnail. Landscape 4:3, crisp high resolution.
> Flat front-facing white browser wireframes on pale #f5f5f5 background. Grey editorial
> skeleton cards and lines, thin browser controls, tiny red/yellow/green chrome dots,
> ONE continuous WHITE website header containing the centered yellow RPP badge,
> with NO dark grey bands above or below the logo. Keep the browser toolbar separate.
> Tight masthead height: thin light-grey top border tangent to the yellow badge top,
> and a soft pale-grey downward shadow tangent to its bottom. No vertical logo padding.
> Subtle external grey shadows. Advertising
> areas in vivid red #ff292e. No physical device hardware, perspective, photographs,
> format-name captions, watermarks, grain or blur inside the artwork. Match the Middle
> reference family, but preserve the placement and interaction specific to each format.

Corrección aplicada a las 21 imágenes con `image_gen`: eliminar únicamente las
bandas grises oscuras de la cabecera y sustituirlas por blanco. Conservar el logo,
la barra del navegador y la composición de cada formato. No eliminar las zonas
rojas publicitarias ni las capas grises propias de Scratch o del post de Social AD.

Tratamiento final aprobado tras la prueba de Interstitial: cabecera blanca compacta,
con borde superior gris claro pegado al logo y sombra ligera en el borde inferior,
también pegado a su base. Aplicado a los 21 formatos, tanto en desktop como en móvil.

Prompt de edición para propagar el tratamiento con `image_gen`:

> Image 1 is the edit target; image 2 is only the approved header reference.
> Modify only the white RPP website masthead in every browser window. Fit one white
> header bar tightly to the yellow badge height. Add a thin #dddddd top border tangent
> to the badge top and a soft pale-grey downward shadow tangent to its bottom, with
> no white vertical padding. Preserve separate browser controls, advertising geometry,
> editorial skeletons, interactions, 1448 x 1086 canvas and all other content.
> No dark bands or extra grey blocks. Never copy the reference advertisement layout.

Variantes del prompt para cada formato:

| Formato | Composición e indicaciones específicas |
| --- | --- |
| Top | Desktop y móvil; banner rojo superior en la posición de la referencia original. |
| Caja | Móvil a la izquierda y desktop detrás a la derecha; MREC en sidebar y cuadrado inline móvil. |
| Middle | Desktop y móvil; banner ancho después del primer contenido editorial. |
| Doble Caja | Solo desktop; rectángulo vertical alto en la columna derecha, como el original. |
| Destaque | Desktop y móvil; banner centrado, corto y más estrecho que Middle. |
| Intertexto | Desktop y móvil; bloque rojo centrado entre párrafos. |
| Interstitial | Desktop y móvil; modal rojo superpuesto al contenido, con cierre blanco. |
| Interscroller | Solo móvil; anuncio alto de ancho completo entre dos tramos editoriales y chevrones de scroll. |
| Skin | Solo desktop; laterales rojos con centro editorial blanco. Sin banda superior. |
| Skin Arco | Solo desktop; banda superior roja conectada a dos laterales, sin banda inferior. |
| Widget | Desktop y móvil; tarjeta roja flotante pequeña abajo a la derecha, con cierre. |
| Zócalo | Desktop y móvil; franja roja corta fijada al borde inferior del contenido. |
| Historias | Tres tarjetas verticales en desktop y una en móvil, con segmentos de progreso. |
| Sondeo | Tarjeta roja con línea de pregunta y tres opciones blancas delineadas. |
| Scratch | Anuncio parcialmente cubierto por capa gris, borde de raspado irregular y gesto de mano. |
| Antes y Después | Mitades rojo y burdeos, divisor blanco y control circular con flechas. |
| Banner 360 | Solo móvil; retícula panorámica, flechas curvas y el texto 360°. |
| Hot Spot | Tres puntos blancos y una pequeña ficha informativa sobre una zona roja. |
| Contador | Desktop y móvil; banner rojo con números blancos 02 : 18 : 43. |
| Social AD | Post insertado con avatar gris, imagen roja y acciones sociales debajo. |
| Video Top Full | Solo desktop; vídeo rojo grande bajo la cabecera, con play blanco centrado. |

## Integración

`FormatPreview` muestra la imagen completa, sin navegador adicional ni marca de
agua superpuesta. Usa `srcSet`, dimensiones explícitas y carga diferida. Se eliminó
el parallax de estas imágenes para no introducir desenfoque por transformaciones.
Las demos de vídeo siguen teniendo prioridad en las fichas que ya las incluían.

Para preparar de nuevo los archivos desde los PNG generados, ejecutar
`scripts/prepare-format-thumbnails.mjs` con un JSON de entradas
`{ catalog, slug, path }`. El script necesita Sharp disponible en el entorno de Node
(en Codex se utilizó la dependencia incluida en el runtime, sin añadir paquetes a la app).

Verificación: `node --test tests/format-thumbnails.test.mjs` y `npm run build`.
