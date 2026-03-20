# Mich

Galeria estatica y creativa construida en `E:\Coding\Personal\Mich`, pensada para abrirse directamente en navegador o servirse desde cualquier servidor estatico.

## Enfoque

- Base tecnica nueva y liviana para no depender de Node para la app.
- Inspiracion tomada de `Love-1` para la idea de collage/slideshow y de `valentine` para el tono romantico general.
- Direccion visual con detalles de tulipanes rojo-negro, atmosfera de bosque suave, transiciones cuidadas y lightbox editorial.
- Catalogo desacoplado: las fotos reales se convierten en `assets/photos/albums/...` y el sitio consume `data/gallery-data.json`.
- Navegacion tipo libro con capitulos, foco mejorado por teclado y estado visible si falla la carga del catalogo.

## Regenerar assets y catalogo

Las fotos originales viven en `E:\Media\Heartopia\Michelle\extracted`.

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\build-gallery-data.ps1
```

Eso recorre las carpetas extraidas, copia las imagenes al proyecto en una estructura limpia por album y genera `data/gallery-data.json`.

## Abrir la galeria

En este equipo no habia `node` ni `python` en el `PATH`, asi que deje un servidor estatico en PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\serve-gallery.ps1
```

Luego abre `http://localhost:4173`.

## Publicar en GitHub Pages

El repo ya incluye un workflow en `.github/workflows/deploy-pages.yml` para desplegar este sitio estatico con GitHub Pages.

Pasos:

1. Sube los cambios a `main`.
2. En GitHub, entra a `Settings > Pages`.
3. En `Build and deployment`, deja `Source: GitHub Actions`.
4. Espera a que termine el workflow `Deploy To GitHub Pages`.

## Estructura

- `index.html`: shell principal.
- `styles.css`: sistema visual completo del libro, fondos y componentes.
- `app.js`: arranque principal, carga de datos y controles globales.
- `js/`: controladores, renderers, estado y utilidades separadas por responsabilidad.
- `scripts/build-gallery-data.ps1`: pipeline local de assets.
- `scripts/serve-gallery.ps1`: servidor estatico local sin dependencias externas.
- `data/gallery-data.json`: catalogo generado.
