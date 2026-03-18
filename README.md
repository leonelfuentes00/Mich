# Michelle Gallery

Galeria estatica y creativa construida en `E:\Coding\Personal\Mich`, pensada para abrirse directamente en navegador o servirse desde cualquier servidor estatico.

## Enfoque

- Base tecnica nueva y liviana para no depender de Node en este equipo.
- Inspiracion tomada de `Love-1` para la idea de collage/slideshow y de `valentine` para el tono romantico general.
- Catalogo desacoplado: las fotos reales se convierten en `assets/photos/albums/...` y el sitio consume `data/gallery-data.json`.

## Regenerar assets y catalogo

Las fotos originales viven en `E:\Media\Heartopia\Michelle\extracted`.

Ejecuta:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\build-gallery-data.ps1
```

Eso hace tres cosas:

1. Recorre las carpetas extraidas.
2. Copia las imagenes al proyecto en una estructura limpia por album.
3. Genera `data/gallery-data.json` con metadata util para la interfaz.

## Abrir la galeria

En este equipo no hay `node` ni `python` en el `PATH`, asi que dejé un servidor estatico en PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\serve-gallery.ps1
```

Luego abre `http://localhost:4173`.

Abrir `index.html` directamente puede fallar en algunos navegadores por las restricciones de `fetch()` sobre `file://`, asi que el servidor local es la opcion recomendada.

## Investigacion usada

- MDN `dialog`: para el visor modal nativo y accesible.
- MDN `scroll-snap-type`: para el carrusel horizontal suave.
- MDN `backdrop-filter`: para los paneles translcidos y el fondo del lightbox.

## Estructura

- `index.html`: shell principal.
- `styles.css`: sistema visual completo.
- `app.js`: carga de datos, render y lightbox.
- `scripts/build-gallery-data.ps1`: pipeline local de assets.
- `scripts/serve-gallery.ps1`: servidor estatico local sin dependencias externas.
- `data/gallery-data.json`: catalogo generado.
