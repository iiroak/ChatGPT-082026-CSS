'use strict';
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'tokens');
const jar = JSON.parse(fs.readFileSync(path.join(outDir, 'declarations-all.json'), 'utf8'));

// Fuente: solo las declaraciones puras (sin llaves en valor)
const decls = jar.filter(d => !/[{}]/.test(d.value));

function selMatches(d, test) { return test(d.selector); }

// 1) paleta global (:root, html, html:not(.dark))
const palette = {};
for (const d of decls) {
  if (/^(:root|html|html\(|html:not|\*)/.test(d.selector) && !/^html\.dark/.test(d.selector) && !/\.light/.test(d.selector)) {
    palette[d.name] = d.value;
  }
}

// 2) tema light: selectores html,.light,.dark .light / html.light 
const lightCtx = {};
for (const d of decls) {
  if (/^html,\.light,\.dark \.light/.test(d.selector) || /^html\.light/.test(d.selector)) lightCtx[d.name] = d.value;
}
// dark: html.dark + .dark directos (no .dark .light)
const darkCtx = {};
for (const d of decls) {
  if (/^html\.dark/.test(d.selector)) darkCtx[d.name] = d.value;
  else if (/^[.]dark(?![.a-z_-])/.test(d.selector) && !/\.dark \./.test(d.selector)) darkCtx[d.name] = d.value;
}

// resolver var() (con fallback), hasta 6 niveles
function resolve(value, ctx) {
  let out = value, guard = 0;
  while (out.includes('var(') && guard++ < 8) {
    out = out.replace(/var\((--[a-zA-Z0-9_-]+)\s*(?:,\s*([^)]*))?\)/g, (m, name, fb) => {
      const lookup = ctx[name] !== undefined ? ctx[name] : (palette[name] !== undefined ? palette[name] : (fb || m));
      return lookup === undefined ? m : lookup;
    });
  }
  return out.trim();
}

// patrón lightningcss: var(--x-light, A)var(--x-dark, B) -> tema claro usa A, oscuro usa B
function splitLightning(value) {
  const m = value.match(/^var\(--lightningcss-light\s*,\s*([^)]*)\)var\(--lightningcss-dark\s*,\s*([^)]*)\)$/);
  return m ? { light: m[1], dark: m[2] } : null;
}

function build(overrides) {
  const merged = { ...palette, ...overrides };
  const out = {};
  for (const [k, v] of Object.entries(merged)) {
    const spl = splitLightning(v);
    const val = spl ? spl.light : resolve(v, merged);
    out[k] = val;
  }
  return out;
}

const light = build(lightCtx);
const dark = build(darkCtx);

fs.mkdirSync(path.join(outDir, 'resolved'), { recursive: true });
fs.writeFileSync(path.join(outDir, 'resolved', 'light.json'), JSON.stringify(light, null, 1));
fs.writeFileSync(path.join(outDir, 'resolved', 'dark.json'), JSON.stringify(dark, null, 1));
fs.writeFileSync(path.join(outDir, 'resolved', 'palette.json'), JSON.stringify(palette, null, 1));

// export como CSS: :root light + html.dark dark
function cssVars(obj) {
  return Object.entries(obj).map(([k, v]) => `  ${k}: ${v};`).join('\n');
}
const css = `:root {\n${cssVars(light)}\n}\n\nhtml.dark, html.dark :not(:where(.light, .light *)) {\n${cssVars(dark)}\n}\n`;
fs.writeFileSync(path.join(outDir, 'resolved', 'chatgpt-theme.css'), css);

console.log('paleta:', Object.keys(palette).length, '| light:', Object.keys(light).length, '| dark:', Object.keys(dark).length);
console.log('chatgpt-theme.css KB:', Math.round(css.length / 1024));
const samples = ['--gray-50', '--gray-950', '--bg-primary', '--bg-secondary', '--bg-tertiary', '--text-primary', '--text-secondary', '--text-tertiary', '--main-surface-primary', '--main-surface-secondary', '--sidebar-surface-primary', '--sidebar-surface-secondary', '--border-default', '--border-medium'];
for (const s of samples) {
  const l = light[s], d = dark[s];
  if (l !== undefined || d !== undefined) console.log((s.padEnd(30)) + (l || '-').padEnd(12) + (d || '-'));
}