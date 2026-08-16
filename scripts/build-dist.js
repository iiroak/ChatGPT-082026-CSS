'use strict';
const fs = require('fs');
const path = require('path');

const inDir = path.join(__dirname, '..', 'tokens', 'resolved');
const distDir = path.join(__dirname, '..', 'dist');
fs.mkdirSync(distDir, { recursive: true });

const light = JSON.parse(fs.readFileSync(path.join(inDir, 'light.json'), 'utf8'));
const dark = JSON.parse(fs.readFileSync(path.join(inDir, 'dark.json'), 'utf8'));

const NOISE = /^(--tw-|--dil-|--lightningcss|--__)/;
const SIZED = /^(--radius|--spacing|--gap|--size-?)/;

function pick(obj, test) {
  return Object.entries(obj).filter(([k]) => test(k));
}

// ---- full: todo menos ruido interno de build ---- //
const fullLight = pick(light, k => !NOISE.test(k));
const fullDark = pick(dark, k => !NOISE.test(k));
const full = header()
  + block(':root', fullLight)
  + block('html.dark, .dark, [data-theme="dark"]', fullDark);

fs.writeFileSync(path.join(distDir, 'chatgpt-theme.css'), full);

// ---- core: solo los semánticos de verdad ---- //
const CORE_KEYS = /^(--bg-|--text-|--icon-|--border-|--main-surface|--sidebar-surface|--composer-|--interactive-focus|--shadow-|--font-|--radius|--theme-|--message-|--component-|--user-chat-width|--thread-content|--sidebar-width|--accent)/;
const coreLight = pick(light, k => CORE_KEYS.test(k));
const coreDark = pick(dark, k => CORE_KEYS.test(k));
const core = header(' core')
  + block(':root', coreLight)
  + block('html.dark, .dark, [data-theme="dark"]', coreDark);
fs.writeFileSync(path.join(distDir, 'chatgpt-theme.core.css'), core);

// ---- minified ---- //
fs.writeFileSync(path.join(distDir, 'chatgpt-theme.min.css'), minify(full));

console.log('chatgpt-theme.css     :', Math.round(full.length / 1024) + ' KB', `(${fullLight.length + fullDark.length} vars)`);
console.log('chatgpt-theme.core.css:', Math.round(core.length / 1024) + ' KB', `(${coreLight.length + coreDark.length} vars)`);
console.log('chatgpt-theme.min.css :', Math.round(minify(full).length / 1024) + ' KB');

function header(kind = '') {
  return `/**
 * ChatGPT Design Tokens${kind} — extraído 1:1 de chatgpt.com (2026-08-16)
 * Fuente: tokens/resolved/{light,dark,palette}.json
 * Uso: <html class="dark"> o <html data-theme="dark"> o .dark en el contenedor raíz
 */
`;
}

function block(sel, entries) {
  const sorted = entries.slice().sort((a, b) => a[0].localeCompare(b[0]));
  return sel + ' {\n' + sorted.map(([k, v]) => `  ${k}: ${v};`).join('\n') + '\n}\n\n';
}

function minify(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\n\s+/g, '\n').replace(/\n{2,}/g, '\n').trim() + '\n';
}