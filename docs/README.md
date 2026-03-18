# Mich Docs

Esta carpeta guarda notas de trabajo para el album/regalo.

## Objetivo

El proyecto evoluciono desde una galeria estatica hacia una experiencia mas emocional, interactiva y cinematica, con una intro calida, tonos forestales y una navegacion visual mas viva.

## Lo Que Se Hizo

### 1. Intro / Portada

- Se creo una pantalla inicial con tono romantico y warm/forest.
- Se agrego un collage inicial interactivo con fotos del album.
- Se incorporo una nota visual secundaria para darle mas narrativa a la escena derecha.
- Se ajustaron jerarquias tipograficas, espaciados y composicion para evitar que la portada se viera partida o muy cargada.

### 2. Direccion Visual

- Se reforzo la atmosfera con tulipanes oscuros, fondos calidos y acentos verdes.
- Se sumaron detalles editoriales y de reveal para que la galeria se sintiera mas como un paseo.
- Se integraron assets atmosfericos en `assets/atmosphere/`.

### 3. Interaccion

- Se mantuvo una intro con CTA para entrar.
- Se agregaron estados de mood que cambian frases y temperatura visual.
- Se dejo el lightbox navegable con teclado y controles.

### 4. Responsive

- Se ajustaron varios breakpoints para desktop, tablet y mobile.
- Se suavizaron paddings, anchos maximos, stacks, grids y tamanos de texto.
- Se reviso visualmente con capturas headless para iterar mas rapido.

### 5. Modularizacion

La logica principal ya no vive toda en un solo archivo.

- `app.js`: orquestacion principal
- `js/config.js`: contenido/configuracion
- `js/dom.js`: referencias DOM
- `js/state.js`: estado compartido
- `js/utils.js`: utilidades, transforms y helpers
- `js/motion.js`: reveals y motion base
- `js/lightbox.js`: controlador del lightbox
- `js/renderers.js`: renderizado de intro, hero, secciones y recuerdos

## Pendientes Reales

- Seguir refinando la composicion exacta de la intro en navegador real.
- Curar mejor que fotos entran al collage inicial para que siempre cuenten mejor la historia.
- Hacer una pasada final de textos para que todo suene mas intimo y menos general.
- Limpiar o decidir si se conservan carpetas temporales como `.tmp-screens/`.

## Notas De Trabajo

- Se uso `type="module"` para permitir la modularizacion del frontend sin dependencias extra.
- Se validaron los archivos JS con `node --check --experimental-default-type=module`.
- Las capturas de revision se hicieron contra `file:///.../index.html` cuando el servidor local no era confiable.
