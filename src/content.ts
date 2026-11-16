// Loads the Iliad content pack and builds one registry of everything that can be selected.
import type { BookInfo, DayBlock, Dig, EventSite, HeroInfo, Hittite, Item, Lang, ModernPlace, Overlay, People, Place, Region, Route, Scene, Texts, Theme, Town } from './types';
import peopleJson from '../content/iliad/people.json';
import daysJson from '../content/iliad/days.json';
import modernJson from '../content/iliad/modern.json';
import heroesJson from '../content/iliad/heroes.json';
import frontJson from '../content/iliad/front.json';
import placesJson from '../content/iliad/places.json';
import eventsJson from '../content/iliad/events.json';
import routesJson from '../content/iliad/routes.json';
import digsJson from '../content/iliad/digs.json';
import townsJson from '../content/iliad/towns.json';
import hittiteJson from '../content/iliad/hittite.json';
import themesJson from '../content/iliad/themes.json';
import booksJson from '../content/iliad/books.json';
import regionsJson from '../content/iliad/regions.json';
import overlaysJson from '../content/iliad/overlays.json';
import scenesJson from '../content/iliad/scenes.json';

export const PLACES = placesJson as unknown as Place[];
export const EVENTS = eventsJson as unknown as EventSite[];
export const ROUTES = routesJson as unknown as Route[];
export const DIGS = digsJson as unknown as Dig[];
export const TOWNS = townsJson as unknown as Town[];
export const HITTITE = hittiteJson as unknown as Hittite[];
export const THEMES = themesJson as unknown as Theme[];
export const BOOKS = booksJson as unknown as BookInfo[];
export const REGIONS = regionsJson as unknown as Region[];
export const OVERLAYS = overlaysJson as unknown as Overlay[];
export const SCENES = scenesJson as unknown as Scene[];
for (const s of SCENES) { const f = (frontJson as Record<string, number>)[s.id]; if (f != null) s.front = f; }
export const PEOPLE = peopleJson as unknown as People;
export const DAYS = daysJson as unknown as DayBlock[];
export const MODERN = modernJson as unknown as ModernPlace[];
export const HEROES = heroesJson as unknown as HeroInfo[];
export const HERO: Record<string, HeroInfo> = Object.fromEntries(HEROES.map(h => [h.id, h]));
/** The place a selection points at: an item itself, or the home of a hero. */
export const placeOfSel = (id: string | null): string | null => (id?.startsWith('hero:') ? HERO[id.slice(5)]?.home ?? null : id);

export const PLACE: Record<string, Place> = Object.fromEntries(PLACES.map(p => [p.id, p]));
export const THEME: Record<string, Theme> = Object.fromEntries(THEMES.map(t => [t.id, t]));
export const scenesOf = (book: number) => SCENES.filter(s => s.book === book);

const uniq = (a: number[]) => [...new Set(a)].sort((x, y) => x - y);
const mid = (pts: [number, number][]) => pts[Math.floor(pts.length / 2)];

export const ITEMS: Record<string, Item> = {};
const add = (it: Item) => { ITEMS[it.id] = it; };

for (const p of PLACES) {
  add({ id: p.id, kind: 'place', lat: p.lat, lon: p.lon, side: p.side, certainty: p.certainty, minZoom: p.minZoom, anchor: p.anchor, books: uniq(p.refs.filter(r => !r.od).map(r => r.b)) });
  (p.alts || []).forEach((a, i) => add({ id: `${p.id}~${i}`, kind: 'alt', lat: a.lat, lon: a.lon, parent: p.id, altIndex: i, side: p.side, certainty: 3, minZoom: Math.max(p.minZoom, 6), books: [] }));
}
for (const e of EVENTS) add({ id: e.id, kind: 'event', lat: e.lat, lon: e.lon, certainty: e.certainty, minZoom: e.minZoom, anchor: e.anchor, books: e.books });
for (const r of ROUTES) { const [lon, lat] = mid(r.pts); add({ id: r.id, kind: 'route', lat, lon, certainty: r.certainty, minZoom: 0, books: r.books, pts: r.pts, color: r.color }); }
for (const d of DIGS) add({ id: d.id, kind: 'dig', lat: d.lat, lon: d.lon, minZoom: d.minZoom, anchor: d.anchor, theme: 'arch', books: [] });
for (const t of TOWNS) add({ id: t.id, kind: 'town', lat: t.lat, lon: t.lon, parent: t.parent, side: PLACE[t.parent]?.side, certainty: t.certainty, minZoom: 7, books: [] });
for (const h of HITTITE) add({ id: h.id, kind: 'hittite', lat: h.lat, lon: h.lon, minZoom: 0, theme: 'hit', books: [] });
for (const th of THEMES) {
  for (const it of th.items || []) add({ id: it.id, kind: 'titem', lat: it.lat, lon: it.lon, anchor: it.anchor, minZoom: 0, theme: th.id, books: it.books || [], color: th.color, reveals: it.reveals });
  for (const ln of th.lines || []) { const [lon, lat] = mid(ln.pts); add({ id: ln.id, kind: 'tline', lat, lon, minZoom: 0, theme: th.id, books: [], pts: ln.pts, color: ln.color }); }
}
for (const s of SCENES) for (const p of s.points || []) if (!ITEMS[p.id]) add({ id: p.id, kind: 'point', lat: p.lat, lon: p.lon, certainty: p.certainty, minZoom: 0, books: [s.book] });

/** Everything tied to a given book: places named in it, events, routes, theme items. */
export const itemsOfBook = (book: number): string[] => {
  const first = BOOKS.find(b => b.book === book)?.at || [];
  const rest = Object.values(ITEMS).filter(it => it.books.includes(book) && it.kind !== 'point' && !first.includes(it.id)).map(it => it.id);
  return [...first.filter(id => ITEMS[id]), ...rest];
};

// ---- text
const files = import.meta.glob('../content/iliad/text/*/*.json') as Record<string, () => Promise<{ default: unknown }>>;
const cache: Partial<Record<Lang, Texts>> = {};

export async function loadTexts(lang: Lang): Promise<Texts> {
  if (cache[lang]) return cache[lang]!;
  const part = async (l: Lang, name: string) => {
    const f = files[`../content/iliad/text/${l}/${name}.json`];
    return f ? (await f()).default : null;
  };
  const out: Record<string, unknown> = {};
  for (const name of ['places', 'story', 'extra', 'themes', 'scenes', 'reader']) {
    // A language that is not finished yet falls back to Bulgarian for the missing file.
    out[name] = (await part(lang, name)) ?? (await part('bg', name));
  }
  return (cache[lang] = out as unknown as Texts);
}

/** Display name of any item. */
export function nameOf(id: string, T: Texts): string {
  const it = ITEMS[id];
  if (!it) return T.scenes.points[id] || id;
  switch (it.kind) {
    case 'place': return T.places[id]?.name ?? id;
    case 'alt': return T.places[it.parent!]?.alts?.[it.altIndex!] ?? id;
    case 'event': return T.story.events[id]?.name ?? id;
    case 'route': return T.story.routes[id]?.name ?? id;
    case 'dig': return T.extra.digs[id]?.name ?? id;
    case 'town': return T.extra.towns[id] ?? id;
    case 'hittite': return T.extra.hittite[id]?.name ?? id;
    case 'titem': return T.themes[it.theme!]?.items?.[id]?.name ?? id;
    case 'tline': return T.themes[it.theme!]?.lines?.[id]?.name ?? id;
    case 'point': return T.scenes.points[id] ?? id;
    default: return id;
  }
}
