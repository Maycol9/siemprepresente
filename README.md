# Lo que mi corazón no olvida

Aventura de plataformas y magia con Phaser 3, TypeScript y Vite. Tres encuentros, cartas completas, controles táctiles y teclado, pausa, reintento, modo tranquilo, progreso local y final con galería. Repositorio: https://github.com/Maycol9/siemprepresente. Sitio: https://maycol9.github.io/siemprepresente/.

## Ejecutar en Windows 11 / PowerShell

Instala Node.js 22.12 o posterior. Abre PowerShell:

```powershell
Set-Location 'C:\Users\Maycol Perez\Documents\Visual Studio\PROYECTODELIVERYMAY\siemprepresente'
npm ci
npm run dev
```

Abre la dirección local que imprime Vite. Para producción:

```powershell
npm run build
npm run preview
```

No abras index.html directamente ni publiques el HTML de desarrollo. La carpeta public se copia a dist y Vite genera referencias al JavaScript compilado con `base: '/siemprepresente/'`.

## Fotografías integradas

Las tres fotografías proporcionadas están en `public/assets/memories/1.svg`, `2.svg` y `3.svg`. Cada SVG contiene el JPEG original sin EXIF, IPTC ni comentarios. No hay redibujo, recorte ni recompresión: se mantienen los píxeles y la proporción. El formato contenedor permitió guardar los recursos pese a las restricciones de escritura binaria de esta sesión. Las imágenes miden 960 × 1280, 1280 × 960 y 1230 × 1600; ya son adecuadas para la web. Los originales del Escritorio permanecen intactos.

`scripts/prepare-memory.mjs` genera estos contenedores eliminando metadatos sin alterar la imagen. Rechaza orientación EXIF distinta de 1 para evitar girar una foto incorrectamente. Conserva los originales fuera del repositorio y de public.

## Controles

- A/D o flechas: movimiento. Espacio: salto. J: magia (se puede mantener). Escape: pausa.
- Móvil: cuatro botones con captura de puntero y liberación por cancelación; permiten acciones simultáneas.
- Las estrellas recuperan energía. El aleteo luminoso anticipa un ataque. Las ondas bajas se saltan.
- La pausa permite activar modo tranquilo; también se ofrece tras dos derrotas.
- El nivel se conserva al recargar. «Empezar una aventura nueva» pide confirmar antes de borrar el progreso.

## Música

Un único reproductor oficial visible de YouTube, video `nyerdKDi45s`, sin playlist ni extracción de audio. El iframe carga directamente aunque tarde la IFrame API, con permiso de autoplay y referrer HTTP. Hay control de reproducir/pausar, reintento de conexión y mensajes específicos de error. Mide al menos 200 × 200 píxeles. Se intenta reproducir desde Comenzar; el navegador puede exigir pulsar reproducir. Al ocultar la pestaña se pausa y al regresar se pide una nueva interacción. Efectos sintetizados separados, sin otra música.

Referencia: https://developers.google.com/youtube/iframe_api_reference

YouTube es un servicio externo y puede procesar datos según sus políticas. El proyecto no incluye analítica, formularios ni seguimiento propio. Las fuentes de Google tienen alternativas locales serif y sans-serif si la conexión falla.

## Publicación con GitHub Actions

El único workflow `.github/workflows/pages.yml` se ejecuta al actualizar `main` y mediante **Run workflow**. Usa Node 22, `npm ci`, pruebas de música, compilación TypeScript/Vite y validación de los archivos de producción.

Pages debe usar Settings → Pages → GitHub Actions. Se publica exclusivamente `dist`. Consulta `VERIFICACION.md` para los resultados y límites de la última comprobación.

**Privacidad:** las fotografías en GitHub Pages serán accesibles a quien tenga sus URLs; también desde el repositorio si es público.

## Arte y limitaciones

Ilustración vectorial original en `src/art.ts`: princesa, cabello articulado, dragón y alas, castillo, árboles, montañas y estrellas. Paleta nocturna con lavanda, rosa y oro, parallax y partículas. Son ilustraciones estilizadas sencillas; no equivalen al acabado profesional pintado solicitado. Los tres dragones comparten anatomía con variaciones de escala y color; no son tres diseños anatómicos completamente independientes. Las animaciones son articulación procedural, no secuencias de sprites dibujadas cuadro a cuadro.

La duración de 5–8 minutos depende de lectura y habilidad y está pendiente de medir. No se han medido FPS ni probado en teléfono físico. Consulta VALIDACION.md para distinguir comprobaciones ejecutadas y pendientes.

## Créditos

- Arte SVG y efectos: originales de este proyecto; se autoriza su uso, modificación y distribución con este juego.
- Cartas y fotografías: proporcionadas por el usuario; derechos de sus titulares.
- Phaser 3: MIT, https://github.com/phaserjs/phaser
- Vite: MIT, https://github.com/vitejs/vite
- TypeScript: Apache-2.0, https://github.com/microsoft/TypeScript
- Cormorant Garamond y Manrope: SIL Open Font License, servidas por Google Fonts.
- Canción: derechos de sus titulares, reproducida únicamente mediante el reproductor oficial de YouTube.
