# ChatGPT-082026-CSS

Tema de ChatGPT (chatgpt.com) extraído 1:1 del CSS real de la web (2026-08-16),
listo para consumir en proyectos propios. Sin dependencias, sin build.

## Uso rápido (CDN)

Enlaza el archivo core desde jsDelivr en un `<link>`. Ya tienes todas las variables.

```html
<html class="dark">
  <head>
    <link rel="stylesheet"
      href="https://cdn.jsdelivr.net/gh/iiroak/ChatGPT-082026-CSS@main/dist/chatgpt-theme.core.css">
  </head>
  <body>
    <div style="background: var(--bg-primary); color: var(--text-primary)">
      Hola
    </div>
  </body>
</html>
```

Tema claro por defecto (`:root`). Para oscuro añade `class="dark"` o `data-theme="dark"`
en `<html>` o en el contenedor raíz.

Archivos disponibles en `dist/`:

| Archivo | Tamaño | Descripción |
|---|---|---|
| `chatgpt-theme.core.css` | 26 KB | Tokens esenciales (630 vars): superficies, texto, bordes, radios, sombras, tipografía |
| `chatgpt-theme.css` | 111 KB | Tokens completos (2.416 vars), 1:1 con el CSS original |
| `chatgpt-theme.min.css` | 106 KB | Ídem minificado |

## Uso con Tailwind

Copia `dist/tailwind.config.ts` y añade la paleta a tu proyecto. Incluye:

- Escalas de color completas (`gray-25`…`gray-1000`, `blue-25`…`blue-1000`, `green`, `red`, `orange`, `yellow`, `pink`, `purple`, `a50`/`a75` con canal alpha)
- Superficies semánticas light/dark (`bg-primary`, `text-primary`, `sidebar-surface-primary`, …)
- Tipografía, radios y sombras de ChatGPT

Uso en tu HTML/Tailwind: `bg-gray-100`, `text-blue-400`, `bg-bg-primary`, `rounded-xl`.

## Variables principales (referencia rápida)

| Variable | Light | Dark |
|---|---|---|
| `--bg-primary` | `#fff` | `#212121` |
| `--bg-secondary` | `#e8e8e8` | `#303030` |
| `--text-primary` | `#0d0d0d` | `#fff` |
| `--text-secondary` | `#5d5d5d` | `#cdcdcd` |
| `--main-surface-primary` | `#fcfcfc` | `#000` |
| `--sidebar-surface-primary` | `#fcfcfc` | `#000` |
| `--composer-surface-primary` | `#fff` | `#212121` |
| `--user-chat-width` | `50%` | `50%` |
| `--font-sans` | system Stack | ídem |
| `--radius-md` / `xl` | `.375rem` / `.75rem` | ídem |

## Estructura del repo

```
dist/                  → paquetes listos para consumir (CSS + Tailwind config)
css/                   → CSS original de chatgpt.com (33 bundles, extraídos del HAR)
tokens/                → dump completo de variables (JSON + CSS por tema)
  resolved/            → tokens resueltos (sin var(): light.json, dark.json, palette.json)
scripts/               → extractores reproducibles
chatgpt.com_Archive.nar → HAR fuente (no versionado)
```

## Regenerar

```bash
node scripts/extract-tokens.js    # parsea css/ → tokens/*.css + declarations-all.json
node scripts/resolve-tokens.js    # resuelve var() → tokens/resolved/*.json + chatgpt-theme.css
node scripts/build-dist.js        # genera dist/ desde tokens/resolved
node scripts/build-tailwind.cjs   # genera dist/tailwind.config.ts
```

## Aviso

Este paquete es una reimplementación visual derivada del CSS observado en el
navegador; los activos/aplicación de OpenAI no se redistribuyen.