'use strict';
const fs = require('fs');
const path = require('path');

const inDir = path.join(__dirname, '..', 'tokens', 'resolved');
const outDir = path.join(__dirname, '..', 'dist');
fs.mkdirSync(outDir, { recursive: true });

const light = JSON.parse(fs.readFileSync(path.join(inDir, 'light.json'), 'utf8'));
const dark = JSON.parse(fs.readFileSync(path.join(inDir, 'dark.json'), 'utf8'));

function isHex(v) { return typeof v === 'string' && /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v); }
function isRgb(v) { return typeof v === 'string' && (v.startsWith('rgb') || v.startsWith('#')); }

function scalesFrom(obj) {
  const scales = {};
  for (const [k, v] of Object.entries(obj)) {
    const m = k.match(/^--(gray|blue|green|red|orange|yellow|pink|purple)-(\d+|a\d+)$/);
    if (m && isHex(v)) {
      if (!scales[m[1]]) scales[m[1]] = {};
      scales[m[1]][m[2]] = v;
    }
  }
  return scales;
}

function mergeScaled(base, override) {
  for (const [color, steps] of Object.entries(override)) {
    if (!base[color]) base[color] = {};
    Object.assign(base[color], steps);
  }
  return base;
}

function lit(v) { return JSON.stringify(v); }

const lightScales = scalesFrom(light);
const darkScales = scalesFrom(dark);

// dark scales overrides for hex that differ
function brightDiff(a, b) {
  const out = {};
  for (const c of Object.keys(b)) {
    if (a[c] && JSON.stringify(a[c]) !== JSON.stringify(b[c])) out[c] = b[c];
  }
  return out;
}
function alphabetical(obj) {
  const out = {};
  for (const k of Object.keys(obj).sort()) out[k] = obj[k];
  return out;
}

// surfaces light/dark
function surfaces(obj, theme) {
  const map = [
    'bg-primary','bg-secondary','bg-tertiary',
    'text-primary','text-secondary','text-tertiary',
    'main-surface-primary','main-surface-secondary','main-surface-tertiary',
    'sidebar-surface-primary','sidebar-surface-secondary','sidebar-surface-tertiary',
    'border-default','border-light','border-medium',
  ];
  const out = {};
  for (const name of map) {
    if (obj['--' + name] !== undefined) out[name] = obj['--' + name];
  }
  return out;
}

const config = `// ChatGPT Design Tokens — 2026-08-16. Generado por scripts/build-tailwind.cjs
// Uso: cambia la paleta según el tema activo (light/dark) con "darkMode: 'class'".
// Para un arranque rápido en un proyecto nuevo, copia este objeto a tu tailwind.config.
import type { Config } from 'tailwindcss'

const chatgptLight = ${lit(alphabetical(lightScales))}

const chatgptDark = ${lit(alphabetical(darkScales))}

const surfacesLight = ${lit(surfaces(light))}
const surfacesDark = ${lit(surfaces(dark))}

export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: chatgptLight,
      fontFamily: {
        sans: ["-apple-system-body", "ui-sans-serif", "-apple-system", "system-ui", "Segoe UI", "Helvetica", "Apple Color Emoji", "Arial", "sans-serif", "Segoe UI Emoji", "Segoe UI Symbol"],
        mono: ["ui-monospace", "SFMono-Regular", "SF Mono", "Menlo", "Consolas", "Liberation Mono", "monospace"],
      },
      borderRadius: {
        xs: '.125rem', sm: '.25rem', md: '.375rem', lg: '.5rem', xl: '.75rem',
        '2xl': '1rem', '3xl': '1.5rem', '4xl': '2rem',
      },
      boxShadow: {
        xs: '0 0 15px #0000001a',
        sm: '0 1px 3px 0 #0000001a, 0 1px 2px -1px #0000001a',
        md: '0 4px 6px -1px #0000001a, 0 2px 4px -2px #0000001a',
        lg: '0 10px 15px -3px #0000001a, 0 4px 6px -4px #0000001a',
      },
    },
  },
  plugins: [],
} satisfies Config
`;

fs.writeFileSync(path.join(outDir, 'tailwind.config.ts'), config);
console.log('tailwind.config.ts generado');
console.log('colores scales light:', Object.keys(lightScales).length, '| dark:', Object.keys(darkScales).length);