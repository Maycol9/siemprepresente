# Comprobaciones — 20 de octubre de 2026

Windows, Node 24.14, Phaser 3.90 y Vite 7.3.7.

## Confirmado

- Dependencias instaladas en copia temporal: npm informó 0 vulnerabilidades.
- `tsc --noEmit` pasó sin errores.
- `vite build --configLoader native` pasó. La carga nativa evitó una restricción de acceso de Windows al cargar la configuración con esbuild.
- `dist/index.html` referencia JavaScript y CSS compilados mediante `./assets/`, sin archivos .ts. Los dibujos están incluidos en el bundle; las fotografías usan la base de Vite.
- Servidor local: HTTP 200.
- Edge automatizado: inicio, introducción, movimiento, salto, disparo, pausa/reanudación y activación de modo tranquilo.
- Los tres combates hasta sus cartas, continuación, final y progreso tras recarga. Sin errores JavaScript en ese recorrido.
- Capturas de escritorio, tres cartas y vista emulada de 390 × 844. Sin desbordamiento horizontal móvil.
- Daño y derrota provocados deliberadamente.
- Reintento desde el punto de control, energía estable durante la pausa y oferta de modo tranquilo tras dos derrotas: prueba completada.

## Pendientes y límites

- Fotografías incorporadas posteriormente: se verificaron las tres rutas HTTP, JPEG íntegro y ausencia de EXIF. Los originales se conservan sin modificación; no se recomprimieron ni recortaron.
- Recorrido repetido con las fotos reales: tres combates, tres cartas y apertura/cierre de las tres ampliaciones; final, progreso y vista móvil sin errores JavaScript. La canción siguió durante los cambios de nivel.
- YouTube verificado posteriormente en Edge: el reproductor confirmó PLAYING al pulsar reproducir; pausa y reanudación también pasaron. Se verificó un solo iframe visible con permiso de autoplay. El audio no se evaluó mediante escucha humana y la reproducción automática sigue dependiendo del navegador.
- No hubo pruebas en teléfono físico ni multitáctil real. No se midieron FPS, duración de lectura ni balance con jugadores principiantes.
- Los vectores son sencillos y estilizados; no alcanzan el acabado profesional solicitado. Los dragones comparten anatomía.
- El recorrido automatizado se realizó en modo tranquilo.
- No se publicó ni conectó un repositorio remoto.

## Repetir pruebas

Con Edge instalado, instalar opcionalmente Playwright (`npm install --no-save playwright`), iniciar `npm run dev` y ejecutar `node tests/browser-check.mjs` o `node tests/retry-check.mjs`. Las capturas se escriben en el directorio actual y no se publican.

La sesión no pudo instalar con npm en la carpeta original. Instalación, compilación y navegador se ejecutaron sobre una copia en `%TEMP%\corazon-build-check`. Fuentes y lockfile están en el proyecto; ejecuta `npm ci` y `npm run build` con tu usuario habitual para generar allí node_modules y dist.
