// Checks the content pack. Run with: npm run check
// It fails when an id is missing, a language is incomplete, or a spoiler tag is broken.
import fs from 'node:fs';
import path from 'node:path';

const DIR = path.resolve(import.meta.dirname, '..', 'content', 'iliad');
const json = rel => JSON.parse(fs.readFileSync(path.join(DIR, rel), 'utf8'));
const exists = rel => fs.existsSync(path.join(DIR, rel));
const errors = [], warnings = [];
const err = m => errors.push(m), warn = m => warnings.push(m);

const TAG = /\{\{(\d+)\|([^{}]*)\}\}/g;
function tagsOf(s, where) {
  const nums = [...s.matchAll(TAG)].map(m => +m[1]);
  const rest = s.replace(TAG, '');
  if (/\{\{|\}\}/.test(rest)) err(`${where}: broken spoiler tag`);
  for (const n of nums) if (n < 1 || n > 25) err(`${where}: spoiler book ${n} out of range`);
  return nums;
}
function walk(a, b, where, lang) {
  if (typeof a === 'string') {
    if (typeof b !== 'string') return err(`${where}: missing in ${lang}`);
    const ta = tagsOf(a, 'bg ' + where), tb = tagsOf(b, lang + ' ' + where);
    if (ta.join() !== tb.join()) err(`${where}: spoiler tags differ (bg ${ta.join() || 'none'}, ${lang} ${tb.join() || 'none'})`);
    if (!b.trim() && a.trim()) err(`${where}: empty in ${lang}`);
    if (lang === 'en' && /[а-яА-Я]/.test(b)) warn(`${where}: Cyrillic left in en`);
    return;
  }
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return err(`${where}: list differs in ${lang}`);
    return a.forEach((x, i) => walk(x, b[i], `${where}[${i}]`, lang));
  }
  if (a && typeof a === 'object') {
    if (!b || typeof b !== 'object') return err(`${where}: missing in ${lang}`);
    for (const k of Object.keys(a)) walk(a[k], b[k], where ? `${where}.${k}` : k, lang);
    for (const k of Object.keys(b)) if (!(k in a)) err(`${where}.${k}: in ${lang} but not in bg`);
  }
}

// 1. every language has the same text as bg
const langs = fs.readdirSync(path.join(DIR, 'text')).filter(l => l !== 'bg' && !l.startsWith('.'));
const files = fs.readdirSync(path.join(DIR, 'text', 'bg')).filter(f => f.endsWith('.json'));
for (const f of files) {
  const bg = json(`text/bg/${f}`);
  walk(bg, bg, f, 'bg');
  for (const lang of langs) {
    if (!exists(`text/${lang}/${f}`)) { err(`text/${lang}/${f} is missing`); continue; }
    walk(bg, json(`text/${lang}/${f}`), f, lang);
  }
}

// 2. ids: data and text agree, and every link points at something real
const T = Object.fromEntries(files.map(f => [f.replace('.json', ''), json(`text/bg/${f}`)]));
const places = json('places.json'), events = json('events.json'), routes = json('routes.json'), digs = json('digs.json');
const towns = json('towns.json'), hittite = json('hittite.json'), themes = json('themes.json'), books = json('books.json');
const ids = new Set();
const add = (list, text, kind) => list.forEach(x => {
  if (ids.has(x.id)) err(`duplicate id ${x.id}`); ids.add(x.id);
  if (text && !(x.id in text)) err(`${kind} ${x.id} has no text`);
});
add(places, T.places, 'place'); add(events, T.story.events, 'event'); add(routes, T.story.routes, 'route');
add(digs, T.extra.digs, 'dig'); add(towns, T.extra.towns, 'town'); add(hittite, T.extra.hittite, 'hittite');
for (const th of themes) {
  if (!T.themes[th.id]) err(`theme ${th.id} has no text`);
  add(th.items || [], T.themes[th.id]?.items, 'theme item'); add(th.lines || [], T.themes[th.id]?.lines, 'theme line');
}
for (const tw of towns) if (!places.some(p => p.id === tw.parent)) err(`town ${tw.id}: unknown parent ${tw.parent}`);
for (const b of books) for (const id of b.at) if (!ids.has(id)) err(`book ${b.book}: unknown id ${id}`);
const inRange = (x, where) => { if (!(x.lat > 28 && x.lat < 48 && x.lon > 12 && x.lon < 46)) err(`${where}: coordinates look wrong`); };
[...places, ...events, ...digs, ...towns, ...hittite].forEach(x => inRange(x, x.id));
for (const p of places) for (const r of p.refs) if (!(r.b >= 1 && r.b <= 24)) err(`${p.id}: bad book in reference`);

// 3. scenes
if (exists('scenes.json')) {
  const scenes = json('scenes.json');
  const seen = new Set();
  for (const s of scenes) {
    const w = `scene ${s.id}`;
    if (seen.has(s.id)) err(`${w}: duplicate`); seen.add(s.id);
    if (!T.scenes?.scenes?.[s.id]) err(`${w}: no text`);
    if (!(s.book >= 1 && s.book <= 24) || !String(s.id).startsWith(s.book + '.')) err(`${w}: id and book disagree`);
    if (!(s.from >= 1 && s.to >= s.from)) err(`${w}: bad line range`);
    const own = new Set((s.points || []).map(p => p.id));
    for (const p of s.points || []) { inRange(p, `${w} point ${p.id}`); if (!T.scenes?.points?.[p.id]) err(`${w}: point ${p.id} has no name`); }
    for (const id of [...(s.at || []), ...(s.mentions || [])]) if (!ids.has(id) && !own.has(id) && !T.scenes?.points?.[id]) err(`${w}: unknown id ${id}`);
    if (!s.view || !Array.isArray(s.view.center)) err(`${w}: no view`);
    else inRange({ lon: s.view.center[0], lat: s.view.center[1] }, `${w} view`);
    for (const pt of s.path?.pts || []) inRange({ lon: pt[0], lat: pt[1] }, `${w} path`);
  }
  for (let b = 1; b <= 24; b++) {
    const list = scenes.filter(s => s.book === b).sort((x, y) => x.from - y.from);
    for (let i = 1; i < list.length; i++) if (list[i].from <= list[i - 1].to) warn(`book ${b}: scenes ${list[i - 1].id} and ${list[i].id} overlap`);
  }
}

// 4. reading aids
if (exists('front.json') && exists('scenes.json')) {
  const sceneIds = new Set(json('scenes.json').map(s => s.id));
  for (const [id, f] of Object.entries(json('front.json'))) {
    if (!sceneIds.has(id)) err(`front.json: unknown scene ${id}`);
    if (!(f >= 0 && f <= 1)) err(`front.json: ${id} must be between 0 and 1`);
  }
}
if (exists('heroes.json')) for (const h of json('heroes.json')) {
  if (!places.some(p => p.id === h.home)) err(`hero ${h.id}: unknown home ${h.home}`);
  for (const k of [h.id, h.father, h.mother, ...(h.patrons || [])].filter(Boolean)) if (!T.reader?.names?.[k]) err(`hero ${h.id}: no name for ${k}`);
  if (!T.reader?.heroes?.[h.id]) err(`hero ${h.id}: no text`);
}
if (exists('days.json')) for (const d of json('days.json')) if (!T.reader?.days?.[d.id]) err(`day block ${d.id}: no label`);
if (exists('modern.json')) for (const m of json('modern.json')) { inRange(m, 'modern ' + m.id); if (!T.reader?.modern?.[m.id]) err(`modern ${m.id}: no name`); }

for (const w of warnings) console.log('warning:', w);
for (const e of errors) console.log('ERROR:', e);
console.log(`${errors.length} errors, ${warnings.length} warnings; languages: bg, ${langs.join(', ') || '(none yet)'}`);
process.exit(errors.length ? 1 : 0);
