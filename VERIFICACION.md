# Verificación — 21 de octubre de 2026

## Causas y cambios

- Repositorio confirmado: Maycol9/siemprepresente, rama main, proyecto en la raíz. Árbol inicial limpio. No se encontraron instrucciones AGENTS.md aplicables.
- Pages estaba configurado con build_type=legacy y origen main:/docs. El flujo existente era exclusivamente manual. Esta configuración no publicaba la compilación Vite mediante Actions.
- `vite.config.ts`: base explícita `/siemprepresente/`, conservando las otras opciones.
- `.github/workflows/pages.yml`: push a main y ejecución manual, Node 22, npm ci, pruebas, compilación y validación; publicación exclusiva de dist, permisos Pages/id-token y concurrencia única.
- `src/music.ts`: inicialización única, carga de API sin duplicados, reintento sin destruir iframe, pausa al ocultar sin reanudación automática y errores 2/5/100/101/150/153 diferenciados. Conserva HTTPS, playsinline, origin, controles oficiales, permiso autoplay y Referer strict-origin-when-cross-origin.
- `src/main.ts`: enlace explícito para abrir la canción original en YouTube. No se cambiaron cartas, fotografías, arte ni combates.
- `tests/music.test.mjs`, `tests/production-check.mjs` y package.json: pruebas de regresión y verificación de archivos publicados. Pruebas de navegador existentes admiten GAME_URL para probar producción.
- README actualizado con el repositorio y procedimiento reales.

## Pruebas ejecutadas

- npm ci con el package-lock.json existente, Node 24.14 local.
- npm test: 4 pruebas aprobadas (API ya cargada/tardía, instancia única, reintento, autoplay bloqueado, visibilidad, errores).
- npm run build: TypeScript y Vite aprobados.
- node tests/production-check.mjs: HTML compilado sin /src/main.ts; JS/CSS bajo /siemprepresente/ y las tres fotografías idénticas a las originales del repositorio.
- Windows deniega escrituras de npm en la carpeta original. Instalación y pruebas se ejecutan en una copia temporal; no se cambiaron permisos ni se instalaron dependencias opcionales en el lockfile.

## Publicación y comprobaciones finales

- Commit de reparación: `5e247295c5cef82aecc403497b8d74e980243d18`, subido a origin/main sin force push.
- Pages cambiado mediante API a `build_type=workflow`, HTTPS activo. No queda un paso manual pendiente.
- Despliegue aprobado, incluidas pruebas y compilación con Node 22: https://github.com/Maycol9/siemprepresente/actions/runs/39620289080.
- Sitio comprobado: https://maycol9.github.io/siemprepresente/.
- HTML público HTTP 200, `text/html`, sin `/src/main.ts`. Referencia `/siemprepresente/assets/index-5704QWGM.js` (HTTP 200, application/javascript) y `index-CuLqRDX0.css` (HTTP 200, text/css).
- Fotografías 1.svg, 2.svg y 3.svg: HTTP 200, image/svg+xml; originales conservados.
- Edge, producción local y pública: inicio, movimiento, salto/disparo durante los combates, tres dragones en modo tranquilo, tres cartas/fotografías y sus ampliaciones, final y progreso tras recarga; cero errores JavaScript en el recorrido.
- Edge, producción local: daño, derrota, reintento, pausa sin daño y oferta de modo tranquilo aprobados (`tests/retry-check.mjs`).
- Edge, producción local y pública: multitáctil emulado con movimiento y ataque simultáneos, eventos pointerup/pointercancel, pausa/reanudación y nueva aventura. Sin desbordamiento horizontal a 320, 390 y 844 píxeles; botones dentro del escenario, iframe separado del juego y mayor de 200 × 200 (`tests/mobile-check.mjs`).

## YouTube en el sitio público

- Canción original `nyerdKDi45s`, sin sustitución ni extracción de audio.
- Primera ejecución: no se recibió PLAYING en 30 segundos. Esto no demuestra una restricción del propietario; no se observó un código 101/150.
- Segunda ejecución con diagnóstico: YouTube confirmó PLAYING tras pulsar Reproducir música, luego PAUSED y nuevamente PLAYING. La prueba `tests/music-memories-check.mjs` terminó correctamente, comprobó un iframe con permiso autoplay y guardó captura.
- La integración distingue errores oficiales y ofrece el enlace externo; las pruebas simuladas comprueban esos casos, pero no significan que esos errores ocurrieran en el video real.
- No se evaluó el sonido mediante escucha humana ni se garantiza autoplay con sonido en teléfonos.

## Repetir comprobaciones

`npm ci`, `npm test`, `npm run build`, `node tests/production-check.mjs`.

Para las pruebas opcionales de navegador, instalar Playwright sin cambiar el lockfile (`npm install --no-save --package-lock=false playwright`) y disponer de Edge. Establecer `GAME_URL=https://maycol9.github.io/siemprepresente/` y ejecutar los scripts browser-check, retry-check, mobile-check o music-memories-check en tests. Son pruebas de interacción reales; YouTube depende del servicio externo. Las capturas quedan fuera de Git y dist.

Referencia oficial consultada: https://developers.google.com/youtube/iframe_api_reference (onReady, onAutoplayBlocked, errores y tamaño mínimo de 200 × 200).

## Límites

El navegador integrado no pudo conectarse por un error de configuración de la herramienta. Se usa Edge automatizado como alternativa. No se ha probado un teléfono físico ni se ha evaluado el audio por escucha humana.
