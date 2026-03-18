# Mich Docs

Esta carpeta guarda notas de trabajo para el album/regalo.

## Objetivo

El proyecto evoluciono desde una galeria estatica hacia una experiencia tipo libro, mas emocional y editorial, con una portada calida, interludios atmosfericos y una navegacion visual mas clara.

## Lo Que Se Hizo

### 1. Intro / Portada

- Se creo una pantalla inicial con tono romantico y warm/forest.
- Se agrego un collage inicial interactivo con fotos del album.
- Se incorporo una nota visual secundaria para darle mas narrativa a la escena derecha.
- Se ajustaron jerarquias tipograficas, espaciados y composicion para evitar que la portada se viera partida o muy cargada.

### 2. Direccion Visual

- Se reforzo la atmosfera con tulipanes oscuros, fondos calidos y acentos verdes.
- Se sumaron detalles editoriales para que la galeria se sintiera mas como un paseo impreso.
- Se integraron assets atmosfericos en `assets/atmosphere/`, incluyendo una escena de bosque usada dentro del libro.

### 3. Interaccion

- Se mantuvo una intro con CTA para entrar.
- Se dejaron cambios de tono por capitulo a traves de `data-book-tone`.
- Se dejo el lightbox navegable con teclado y controles.
- Se mejoro el flujo de foco para teclado y se agrego feedback si falla la carga del catalogo.

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
- `js/lightbox.js`: controlador del lightbox
- `js/book.js`: controlador de apertura, paginas y tabs
- `js/renderers.js`: renderizado de portada, secciones y recuerdos

## Pendientes Reales

- Seguir refinando la composicion exacta de la intro en navegador real.
- Curar mejor que fotos entran al collage inicial para que siempre cuenten mejor la historia.
- Hacer una pasada final de textos para que todo suene mas intimo y menos general.
- Definir si conviene comprimir aun mas el video atmosferico para deploy publico.

## Notas De Trabajo

- Se uso `type="module"` para permitir la modularizacion del frontend sin dependencias extra.
- El servidor local recomendado sigue siendo `scripts/serve-gallery.ps1`.
- Conviene revisar en navegador real las transiciones de apertura del libro y el video atmosferico.
