// apply-code.js - build-time syntax highlighting for the 43 <pre><code> samples on the
// 11 project-*.html guides. No runtime dependency ships: this writes <span class="..."> into
// the HTML once, using the six classes [code-and-diagrams] already styles
// (.comment .keyword .string .number .variable .function).
//
//   node harness/apply-code.js          apply
//   node harness/apply-code.js --check  report what would change, write nothing
//
// HARD invariants, both enforced by a self-check on every block before it is written:
//   1. pre.textContent is byte-identical before and after. Only <span> open/close tags are
//      inserted; not one source character is added, removed, reordered or re-cased.
//   2. HTML entities (&lt; &gt; &amp; &quot; &#NN;) are atomic. The tokenizer runs over a
//      working string in which every entity is one opaque placeholder character, so no token
//      can ever start or end inside an entity.
// Idempotent: every previously written span is stripped first, then the block is re-tokenized,
// so running it twice is a no-op (that is what --check reports on).
//
// Deliberately conservative: a run of characters that is not certainly a comment, a string, a
// number, a known keyword, a --flag or a $variable is left plain. Unknown .code-lang values are
// skipped whole.
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const CHECK = process.argv.includes('--check');

// ---------------------------------------------------------------- language table
// .code-lang text (upper-cased) -> grammar id
const LANG = {
  BASH: 'bash', SH: 'bash', SHELL: 'bash',
  JSON: 'json',
  YAML: 'yaml', YML: 'yaml',
  HCL: 'hcl', TERRAFORM: 'hcl',
  PYTHON: 'python', PY: 'python',
  JAVASCRIPT: 'js', JS: 'js', TYPESCRIPT: 'js', TS: 'js',
  NGINX: 'nginx',
};
const KW = {
  bash: 'aws if then else elif fi for while do done case esac export echo return function'.split(' '),
  json: 'true false null'.split(' '),
  yaml: 'true false null yes no'.split(' '),
  hcl: 'resource variable output provider module data locals terraform backend true false null'.split(' '),
  python: 'def return import from if elif else for in while try except finally with as lambda class pass raise not and or is None True False'.split(' '),
  js: 'const let var function return await async import export from as new class extends if else for of while try catch finally throw typeof instanceof this default interface type public readonly'.split(' '),
  nginx: 'server location listen server_name root index include upstream http events return try_files error_page add_header proxy_pass proxy_set_header gzip gzip_types ssl_certificate ssl_certificate_key rewrite'.split(' '),
};
const CFG = {
  bash:   { hash: 1, quotes: `'"`, esc: 1, dollar: 1, flags: 1 },
  json:   { quotes: '"', esc: 1, keyColon: 1 },
  yaml:   { hash: 1, quotes: `'"`, esc: 1, yamlKey: 1 },
  hcl:    { hash: 1, slash: 1, block: 1, quotes: '"', esc: 1, dollar: 1, keyColon: 1 },
  python: { hash: 1, quotes: `'"`, esc: 1, triple: 1, call: 1 },
  js:     { slash: 1, block: 1, quotes: `'"\``, esc: 1, call: 1 },
  nginx:  { hash: 1, quotes: `'"`, esc: 1, dollar: 1 },
};
// characters that may appear inside one "run" (an unsplittable bare word such as us-east-1,
// t3.micro, 0.0.0.0/0 or arn:aws:iam::1:role/x - keeping them whole is what stops the
// tokenizer from colouring the "1" in "us-east-1").
const RUN = /[A-Za-z0-9_$\-.:/@*]/;
const RUN_HEAD = /[A-Za-z_$]|[0-9]/;
const WORD = /[A-Za-z0-9_$]/;

// ---------------------------------------------------------------- entity-safe working string
// Returns { work, map } where work[i] is one source atom (a character, or a whole HTML entity
// collapsed to ) and map[i] = [srcStart, srcEnd) for that atom.
function atomize(src) {
  const chars = [], map = [];
  const re = /&(?:[A-Za-z][A-Za-z0-9]*|#\d+|#[xX][0-9A-Fa-f]+);/g;
  let last = 0, m;
  while ((m = re.exec(src))) {
    for (let i = last; i < m.index; i++) { chars.push(src[i]); map.push([i, i + 1]); }
    chars.push(''); map.push([m.index, m.index + m[0].length]);
    last = m.index + m[0].length;
  }
  for (let i = last; i < src.length; i++) { chars.push(src[i]); map.push([i, i + 1]); }
  return { work: chars.join(''), map };
}

// ---------------------------------------------------------------- tokenizer
function tokenize(s, lang) {
  const cfg = CFG[lang], kw = KW[lang], t = [];
  const n = s.length;
  const push = (a, b, cls) => { if (b > a) t.push([a, b, cls]); };
  const eol = (i) => { const e = s.indexOf('\n', i); return e < 0 ? n : e; };
  let i = 0, ls = 0;
  while (i < n) {
    const c = s[i];
    if (c === '\n') { i++; ls = i; continue; }

    // --- comments
    if (cfg.block && c === '/' && s[i + 1] === '*') {
      const e = s.indexOf('*/', i + 2);
      push(i, e < 0 ? n : e + 2, 'comment'); i = e < 0 ? n : e + 2; continue;
    }
    if (cfg.slash && c === '/' && s[i + 1] === '/') { const e = eol(i); push(i, e, 'comment'); i = e; continue; }
    if (cfg.hash && c === '#' && (i === 0 || /\s/.test(s[i - 1]))) { const e = eol(i); push(i, e, 'comment'); i = e; continue; }

    // --- YAML key: at the head of a line, optionally after a "- " sequence dash
    if (cfg.yamlKey && /^[ \t]*(?:-[ \t]+)?$/.test(s.slice(ls, i))) {
      const k = /^[A-Za-z_][A-Za-z0-9_.\-]*(?=:(?:[ \t\n]|$))/.exec(s.slice(i));
      if (k) { push(i, i + k[0].length, 'variable'); i += k[0].length; continue; }
    }

    // --- strings (never span a line, except python triple quotes: an unterminated quote is
    //     left plain and scanning continues, so a stray apostrophe cannot swallow the block)
    if (cfg.quotes && cfg.quotes.indexOf(c) >= 0) {
      if (cfg.triple && s[i + 1] === c && s[i + 2] === c) {
        const e = s.indexOf(c + c + c, i + 3);
        push(i, e < 0 ? n : e + 3, 'string'); i = e < 0 ? n : e + 3; continue;
      }
      let j = i + 1;
      while (j < n && s[j] !== c && s[j] !== '\n') { if (cfg.esc && s[j] === '\\') j++; j++; }
      if (j < n && s[j] === c) {
        const e = j + 1;
        let k = e; while (k < n && (s[k] === ' ' || s[k] === '\t')) k++;
        push(i, e, cfg.keyColon && s[k] === ':' ? 'variable' : 'string');
        i = e; continue;
      }
      i++; continue;
    }

    // --- $variable / ${variable}
    if (cfg.dollar && c === '$') {
      if (s[i + 1] === '{') { const e = s.indexOf('}', i + 2); if (e > 0) { push(i, e + 1, 'variable'); i = e + 1; continue; } }
      let j = i + 1; while (j < n && WORD.test(s[j])) j++;
      if (j > i + 1) { push(i, j, 'variable'); i = j; continue; }
      i++; continue;
    }

    // --- --long-flag
    if (cfg.flags && c === '-' && s[i + 1] === '-' && /[A-Za-z]/.test(s[i + 2] || '')) {
      let j = i + 2; while (j < n && /[A-Za-z0-9-]/.test(s[j])) j++;
      push(i, j, 'variable'); i = j; continue;
    }

    // --- a bare run
    if (RUN_HEAD.test(c) && !RUN.test(s[i - 1] || ' ')) {
      let j = i; while (j < n && RUN.test(s[j])) j++;
      const run = s.slice(i, j);
      if (/^\d+(?:\.\d+)?$/.test(run)) push(i, j, 'number');
      else if (kw.indexOf(run) >= 0) push(i, j, 'keyword');
      else if (cfg.call && run.indexOf('.') >= 0 && !/[/:@*]/.test(run)) {
        // dotted member access: classify each segment on its own (cdk.Stack, this.vpc)
        let at = i;
        for (const seg of run.split('.')) {
          if (kw.indexOf(seg) >= 0) push(at, at + seg.length, 'keyword');
          else if (cfg.call && seg && at + seg.length === j && s[j] === '(' && /^[A-Za-z_$]/.test(seg)) push(at, j, 'function');
          at += seg.length + 1;
        }
      } else if (cfg.call && s[j] === '(' && /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(run)) push(i, j, 'function');
      i = j; continue;
    }
    i++;
  }
  return t.sort((a, b) => a[0] - b[0]);
}

// ---------------------------------------------------------------- apply / strip
const SPAN_RE = /<span class="(?:comment|keyword|string|number|variable|function)">([\s\S]*?)<\/span>/g;
function strip(html) {
  let out = html, prev;
  do { prev = out; out = out.replace(SPAN_RE, '$1'); } while (out !== prev);
  return out;
}
function highlight(html, lang) {
  const src = strip(html);
  if (!CFG[lang]) return { out: src, plain: src, spans: 0 };
  const { work, map } = atomize(src);
  const toks = tokenize(work, lang);
  let out = '', at = 0, spans = 0;
  for (const [a, b, cls] of toks) {
    const sa = map[a][0], sb = map[b - 1][1];
    if (sa < at) continue;               // never emit overlapping spans
    out += src.slice(at, sa) + `<span class="${cls}">` + src.slice(sa, sb) + '</span>';
    at = sb; spans++;
  }
  out += src.slice(at);
  return { out, plain: src, spans };
}

// ---------------------------------------------------------------- driver
const BLOCK_RE = /(<div class="code-block">\s*<div class="code-header">[\s\S]*?<span class="code-lang">([^<]*)<\/span>[\s\S]*?<pre><code>)([\s\S]*?)(<\/code><\/pre>)/g;
const pages = fs.readdirSync(ROOT).filter(f => /\.html$/.test(f)).sort();
const results = [];
let totalBlocks = 0, totalSpans = 0, skipped = [];
for (const page of pages) {
  const file = path.join(ROOT, page);
  const raw = fs.readFileSync(file, 'utf8');
  if (!/class="code-block"/.test(raw)) continue;
  const crlf = /\r\n/.test(raw);
  const before = raw.replace(/\r\n/g, '\n');
  let blocks = 0, spans = 0;
  const after = before.replace(BLOCK_RE, (m, head, langText, body, tail) => {
    blocks++;
    const lang = LANG[langText.trim().toUpperCase()];
    if (!lang) { skipped.push(`${page}: ${langText}`); return head + strip(body) + tail; }
    const r = highlight(body, lang);
    // invariant 1+2: the text behind the spans must be the plain source, character for character
    if (strip(r.out) !== r.plain) throw new Error(`TEXT DRIFT in ${page} (${langText}) - refusing to write`);
    spans += r.spans;
    return head + r.out + tail;
  });
  totalBlocks += blocks; totalSpans += spans;
  results.push([page, after === before ? 'unchanged' : 'updated', after.length - before.length, blocks, spans]);
  if (!CHECK && after !== before) fs.writeFileSync(file, crlf ? after.replace(/\n/g, '\r\n') : after);
}
for (const [p, st, d, b, s] of results) {
  console.log(`${st === 'updated' ? (CHECK ? 'WOULD UPDATE' : 'updated') : st.padEnd(12)}  ${p}  ${d >= 0 ? '+' : ''}${d} B  ${b} blocks  ${s} spans`);
}
if (skipped.length) console.log(`skipped (unknown language): ${skipped.join(', ')}`);
console.log(`${totalBlocks} code blocks, ${totalSpans} spans`);
console.log(`${results.filter(r => r[1] === 'updated').length}/${results.length} pages ${CHECK ? 'would change' : 'written'}`);
