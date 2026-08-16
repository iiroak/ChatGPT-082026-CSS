'use strict';
const fs = require('fs');
const path = require('path');

const cssDir = path.join(__dirname, '..', 'css');
const outDir = path.join(__dirname, '..', 'tokens');
fs.mkdirSync(outDir, { recursive: true });

// Proper CSS body splitter: returns { decls: [{name,value}], nested: [{selector, body}] }
function splitBody(body, onNested) {
  const decls = [];
  const nested = [];
  let i = 0, depth = 0, cur = '', insideComment = false, quote = null;
  const n = body.length;

  function emitDecl(s) {
    const mm = s.match(/^\s*(--[a-zA-Z0-9_-]+)\s*:\s*(.*)$/);
    if (mm) decls.push({ name: mm[1], value: mm[2].trim() });
  }
  function emitBlock(sel, b) {
    nested.push({ selector: sel.trim(), body: b });
  }

  while (i < n) {
    const c = body[i];
    if (insideComment) {
      if (c === '*' && body[i + 1] === '/') { insideComment = false; i += 2; }
      else i++;
      continue;
    }
    if (c === '/' && body[i + 1] === '*') { insideComment = true; cur += c + body[i + 1]; i += 2; continue; }
    if (quote) {
      cur += c;
      if (c === '\\' && i + 1 < n) { cur += body[i + 1]; i += 2; continue; }
      if (c === quote) quote = null;
      i++;
      continue;
    }
    if (c === '"' || c === "'") { quote = c; cur += c; i++; continue; }
    if (c === '(' || c === '[') { depth++; cur += c; i++; continue; }
    if (c === ')' || c === ']') { depth--; cur += c; i++; continue; }
    if (c === '{') {
      if (depth === 0) {
        const sel = cur;
        cur = '';
        const close = findMatching(body, i);
        const inner = body.slice(i + 1, close);
        // decide: nested rule if inner has a top-level ':' block or '{' — treat as nested block always
        if (onNested && inner.trim()) emitBlock(sel, inner);
        i = close + 1;
        continue;
      } else { cur += c; i++; continue; }
    }
    if (c === ';' && depth === 0) {
      emitDecl(cur);
      cur = '';
      i++;
      continue;
    }
    cur += c;
    i++;
  }
  if (cur.trim()) emitDecl(cur);
  return { decls, nested };
}

function findMatching(str, openIdx) {
  let depth = 0, quote = null, comment = false;
  for (let i = openIdx; i < str.length; i++) {
    const c = str[i];
    if (comment) { if (c === '*' && str[i + 1] === '/') { comment = false; i++; } continue; }
    if (c === '/' && str[i + 1] === '*') { comment = true; i++; continue; }
    if (quote) { if (c === '\\') i++; else if (c === quote) quote = null; continue; }
    if (c === '"' || c === "'") { quote = c; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) return i; }
  }
  return -1;
}

function findSelectorStart(css, from) {
  // selector is the text between last '}' (or start) and the '{' at `from`
  let depth = 0, quote = null;
  for (let i = from - 1; i >= 0; i--) {
    const c = css[i];
    if (c === '}') return i + 1;
  }
  return 0;
}

const allDecls = [];

function processFile(css, file) {
  collectRules(css, '', file);
}

function collectRules(css, parentSel, file) {
  let i = 0;
  const n = css.length;
  while (i < n) {
    const open = css.indexOf('{', i);
    if (open === -1) break;
    const selRaw = css.slice(findSelectorStart(css, open), open).trim();
    const sel = parentSel ? (selRaw.includes('@') && /^@/.test(selRaw) ? selRaw : parentSel + ' ' + selRaw) : selRaw;
    const close = findMatching(css, open);
    if (close === -1) { i = open + 1; continue; }
    const body = css.slice(open + 1, close);
    const isAtRule = /^@[a-z-]+/.test(selRaw.replace(/^\s*/, ''));
    if (isAtRule) {
      // recurse inside @media/@layer/@supports
      collectRules(body, '', file);
    } else {
      const { decls } = splitBody(body);
      for (const d of decls) allDecls.push({ file, selector: sel, name: d.name, value: d.value });
    }
    i = close + 1;
  }
}

for (const file of fs.readdirSync(cssDir)) {
  if (!file.endsWith('.css') || file.startsWith('tokens-')) continue;
  const css = fs.readFileSync(path.join(cssDir, file), 'utf8');
  processFile(css, file);
}

function isLight(d) {
  const s = d.selector;
  return (/^html($|[,\s{])/.test(s) || /^:root/.test(s) || /(^|,)\s*\.light\b/.test(s)) && !/^html\.dark/.test(s);
}
function isDark(d) {
  const s = d.selector;
  return /^html\.dark/.test(s) || /(^|,)\s*\.dark(?![.a-z_-])/.test(s.replace(/\.dark\s+\.light\b/g, ''));
}

const polluted = allDecls.filter(x => /[{}]/.test(x.value));
const clean = allDecls.filter(x => !/[{}]/.test(x.value));
const lightDecls = clean.filter(isLight);
const darkDecls = clean.filter(isDark);
const scoped = clean.filter(d => !isLight(d) && !isDark(d));

function formatCss(decls) {
  const bySel = new Map();
  for (const d of decls) {
    if (!bySel.has(d.selector)) bySel.set(d.selector, []);
    bySel.get(d.selector).push(d);
  }
  const parts = [];
  for (const [sel, vars] of bySel) {
    parts.push(sel + ' {\n' + vars.map(v => '  ' + v.name + ': ' + v.value + ';').join('\n') + '\n}');
  }
  return parts.join('\n\n');
}

fs.writeFileSync(path.join(outDir, 'declarations-all.json'), JSON.stringify(allDecls, null, 1));
fs.writeFileSync(path.join(outDir, 'light.css'), formatCss(lightDecls));
fs.writeFileSync(path.join(outDir, 'dark.css'), formatCss(darkDecls));
fs.writeFileSync(path.join(outDir, 'scoped.css'), formatCss(scoped));

const master = [
  '/** ChatGPT (chatgpt.com) tokens completos. 2026-08-16. Generado por scripts/extract-tokens.js */',
  formatCss(clean.filter(d => /:root|^html($|[,\s])/.test(d.selector) && !isDark(d))),
  formatCss(lightDecls),
  formatCss(darkDecls),
  formatCss(scoped),
].join('\n\n');
fs.writeFileSync(path.join(outDir, 'chatgpt-theme-master.css'), master);

const names = new Set(clean.map(d => d.name));
console.log('declaraciones totales:', allDecls.length);
console.log('  limpias:', clean.length, '| contaminadas:', polluted.length);
console.log('  light:', lightDecls.length, '| dark:', darkDecls.length, '| scoped:', scoped.length);
console.log('nombres únicos (limpias):', names.size);