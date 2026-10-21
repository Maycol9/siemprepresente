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

## Publicación y comprobaciones en curso

Pendiente de registrar el resultado definitivo de Actions, las pruebas de juego y el estado real de YouTube en el dominio público. No confundir pruebas simuladas de la API con reproducción real.

Referencia oficial consultada: https://developers.google.com/youtube/iframe_api_reference (onReady, onAutoplayBlocked, errores y tamaño mínimo de 200 × 200).

## Límites

El navegador integrado no pudo conectarse por un error de configuración de la herramienta. Se usa Edge automatizado como alternativa. No se ha probado un teléfono físico ni se ha evaluado el audio por escucha humana.
