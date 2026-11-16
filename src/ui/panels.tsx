// The simpler panels: first visit, intro, legend, heroes, themes.
import { useState } from 'preact/hooks';
import { BOOKS, DIGS, HERO, HEROES, HITTITE, ITEMS, PEOPLE, PLACES, ROUTES, THEME, THEMES } from '../content';
import type { TreeNode } from '../types';
import { t } from '../i18n';
import { unlocked } from '../map/features';
import { WHOLE_POEM, closeTheme, coast, lang, openBook, openItem, openTheme, panel, peek, progress, seen, setProgress, setView, texts, theme, tourIx } from '../state';
import { Ico, ItemRow, Rich, plain } from './bits';

/** Slides between the coast of about 1200 BC and the coast of today. */
export function CoastToggle() {
  const run = () => {
    const from = coast.value, to = from > 50 ? 0 : 100, t0 = performance.now();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { coast.value = to; return; }
    const step = (now: number) => { const k = Math.min(1, (now - t0) / 2600); coast.value = Math.round(from + (to - from) * k); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  return (
    <div class="coast">
      <div class="coast-row">
        <span>{t('coastNow')}</span>
        <input type="range" min="0" max="100" step="1" value={coast.value} aria-label={t('coast')} onInput={e => { coast.value = +(e.currentTarget as HTMLInputElement).value; }} />
        <span>{t('coastThen')}</span>
        <button type="button" class="btn icon sm" title={t('coastPlay')} aria-label={t('coastPlay')} onClick={run}>▶</button>
      </div>
      <p class="small">{t('coastBlend')}</p>
    </div>
  );
}

export function Onboard() {
  return (
    <div>
      <h2>{t('onboardTitle')}</h2>
      <p>{t('onboardText')}</p>
      <div class="bookgrid">
        {BOOKS.map(B => <button type="button" onClick={() => { setProgress(B.book); openBook(B.book); }}>{B.book}</button>)}
      </div>
      <div class="actions">
        <button type="button" class="btn" onClick={() => { setProgress(WHOLE_POEM); panel.value = 'intro'; }}>{t('readAll')}</button>
      </div>
      <p class="small">{t('changeLater')}</p>
    </div>
  );
}

function ReadButton() {
  const p = progress.value;
  return p && p < WHOLE_POEM
    ? <button type="button" class="btn primary" onClick={() => openBook(p)}>📖 {t('reading', { n: p })}</button>
    : <button type="button" class="btn primary" onClick={() => { panel.value = 'books'; }}>📖 {t('books')}</button>;
}

export function Intro() {
  return (
    <div>
      <h2>{t('introTitle')}</h2>
      <p>{t('introText')}</p>
      <LegendMarks />
      <p>{t('introCoast')}</p>
      <div class="actions">
        <ReadButton />
        <button type="button" class="btn" onClick={() => { panel.value = 'themes'; }}>{t('themes')} ✦</button>
        <button type="button" class="btn" onClick={() => { panel.value = 'heroes'; }}>{t('heroesTitle')}</button>
        <button type="button" class="btn" onClick={() => setView('troy')}>{t('vTroy')}</button>
      </div>
    </div>
  );
}

function LegendMarks() {
  const row = (icon: string, label: string) => <li><Ico name={icon} size={20} /> {label}</li>;
  return (
    <ul class="marks">
      {row('ach-1', t('achaean'))}{row('tro-1', t('trojan'))}{row('sto-1', t('story'))}{row('evt', t('event'))}
      {row('ach-1', t('c1'))}{row('ach-2', t('c2'))}{row('ach-3', t('c3'))}{row('alt', t('alt'))}
    </ul>
  );
}

export function Legend() {
  return (
    <div>
      <h2>{t('legendTitle')}</h2>
      <LegendMarks />
      <p>{t('legendShape')}</p>
      <p>{t('legendFill')}</p>
      <p class="small">{t('schematic')}</p>
      <h4>{t('coast')}</h4>
      <CoastToggle />
      <p class="small">{t('coastNote')}</p>
      <h4>{t('credits')}</h4>
      <p class="small">{t('creditsText')}</p>
      <p class="small"><a class="link" href="https://github.com/devladinci/iliad-map/blob/main/ATTRIBUTION.md" target="_blank" rel="noopener">{t('creditsAll')}</a> · <a class="link" href="https://github.com/devladinci/iliad-map" target="_blank" rel="noopener">{t('sourceCode')}</a></p>
      <div class="actions">
        <button type="button" class="btn sm" onClick={() => { lang.value = lang.value === 'bg' ? 'en' : 'bg'; }}>🌐 {t('lang')}</button>
      </div>
    </div>
  );
}

function HeroList() {
  const T = texts.value!;
  const [q, setQ] = useState('');
  const list = PLACES.flatMap(p => (T.places[p.id].heroes || []).map(h => ({ ...h, place: p.id, side: p.side })));
  const needle = q.trim().toLowerCase();
  const shown = needle ? list.filter(h => h.name.toLowerCase().includes(needle) || T.places[h.place].name.toLowerCase().includes(needle)) : list;
  return (
    <div>
      <h4>{t('mainHeroes')}</h4>
      <div class="chips-wrap">{HEROES.map(h => <button type="button" class={'ref side-' + h.side} onClick={() => openItem('hero:' + h.id)}>{T.reader.names[h.id]}</button>)}</div>
      <h4>{t('allLeaders')}</h4>
      <input class="field" type="search" placeholder={t('heroesFilter')} value={q} onInput={e => setQ((e.currentTarget as HTMLInputElement).value)} />
      <div class="herolist">
        {shown.map(h => <ItemRow id={h.place} sub={<><b class={'side-' + h.side}>{h.name}</b>{h.role ? ' — ' + plain(h.role) : ''}</>} />)}
      </div>
    </div>
  );
}

export function ThemePicker({ title = true }: { title?: boolean }) {
  const T = texts.value!;
  return (
    <div>
      {title ? <h2>{t('themes')}</h2> : <h4>{t('otherThemes')}</h4>}
      <div class="themelist">
        {THEMES.filter(th => th.id !== theme.value).map(th => (
          <button type="button" class="themecard" onClick={() => openTheme(th.id)}>
            <i style={{ background: th.color }} />
            <span><b>{T.themes[th.id].name}</b><small>{T.themes[th.id].sub}</small></span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function ThemePanel() {
  const T = texts.value!, id = theme.value!, th = THEME[id], x = T.themes[id];
  const canSee = (n: number) => seen(n) || peek.value === n;
  let ids: string[] = [...(th.items || []).map(i => i.id), ...(th.lines || []).map(l => l.id)];
  if (th.builtin === 'routes') ids = ROUTES.map(r => r.id);
  if (th.builtin === 'digs') ids = DIGS.map(d => d.id);
  if (th.builtin === 'hittite') ids = HITTITE.map(h => h.id);
  if (th.builtin === 'realms') ids = PLACES.filter(p => (p.side === 'achaean' || p.side === 'trojan') && T.places[p.id].heroes?.length).map(p => p.id);
  const open = ids.filter(i => unlocked(ITEMS[i], canSee));
  const hiddenN = ids.length - open.length;
  const stop = th.tour ? th.items![Math.min(tourIx.value, th.items!.length - 1)] : null;
  const stopText = stop ? x.items?.[stop.id] : null;

  return (
    <div key={id}>
      <div class="tags"><span class="tag" style={{ color: th.color, borderColor: th.color }}>{t('theme')}</span><button type="button" class="clearlink" onClick={closeTheme}>× {t('themeOff')}</button></div>
      <h2>{x.name}</h2>
      <p><Rich text={x.intro} /></p>
      {th.builtin === 'realms' ? <p class="small">{t('realmsHint')}</p> : null}

      {stop && stopText ? (
        <div class="scene">
          <div class="scene-meta">{t('stop', { i: tourIx.value + 1, n: th.items!.length })}</div>
          <h3>{stopText.name}</h3>
          <p><Rich text={stopText.text} /></p>
          {stopText.src ? <p class="small"><b>{t('source')}:</b> {stopText.src}</p> : null}
          <CoastToggle />
          <div class="stepper">
            <button type="button" class="btn" disabled={tourIx.value === 0} onClick={() => { tourIx.value--; }}>‹ {t('prev')}</button>
            <button type="button" class="btn primary" disabled={tourIx.value >= th.items!.length - 1} onClick={() => { tourIx.value++; }}>{t('next')} ›</button>
          </div>
        </div>
      ) : null}

      <div class="themeitems">
        {open.map((i, n) => th.tour
          ? <button type="button" class={'row' + (n === tourIx.value ? ' on' : '')} onClick={() => { tourIx.value = n; }}><span class="num">{n + 1}</span><span class="row-t"><b>{x.items![i].name}</b></span></button>
          : <ItemRow id={i} sub={th.builtin === 'realms' ? T.places[i].heroes![0].name : undefined} />)}
      </div>
      {hiddenN > 0 ? <p class="small">{t('hiddenItems', { n: hiddenN })}</p> : null}
      <div class="actions foot"><button type="button" class="btn sm" onClick={closeTheme}>{t('themeOff')}</button></div>
      <ThemePicker title={false} />
    </div>
  );
}

// ---- people: heroes, gods and families
function Tree({ node }: { node: TreeNode }) {
  const N = texts.value!.reader.names;
  const name = N[node.n] || node.n;
  return (
    <li>
      <span class="node">
        {HERO[node.n] ? <button type="button" class="link" onClick={() => openItem('hero:' + node.n)}>● {name}</button>
          : node.at ? <button type="button" class="link" onClick={() => openItem(node.at!)}>● {name}</button> : <b>{name}</b>}
        {node.w ? <small> ∞ {N[node.w] || node.w}</small> : null}
      </span>
      {node.c?.length ? <ul>{node.c.map(c => <Tree node={c} />)}</ul> : null}
    </li>
  );
}

function Families() {
  const R = texts.value!.reader;
  return (
    <div>
      <p class="small">{R.familiesIntro}</p>
      {PEOPLE.families.map(f => (
        <section class="family">
          <h3 class={'side-' + f.side}>{R.families[f.id].name}</h3>
          <ul class="tree"><Tree node={f.tree} /></ul>
          <p class="small"><Rich text={R.families[f.id].note} /></p>
        </section>
      ))}
    </div>
  );
}

function Gods() {
  const R = texts.value!.reader;
  const group = (side: string, title: string) => (
    <section>
      <h4>{title}</h4>
      <ul class="gods">{PEOPLE.gods.filter(g => g.side === side).map(g => <li><b class={side === 'both' ? '' : 'side-' + side}>{R.names[g.id]}</b> — <Rich text={R.gods[g.id]} /></li>)}</ul>
    </section>
  );
  return <div>{group('both', t('aboveBoth'))}{group('achaean', t('forAchaeans'))}{group('trojan', t('forTrojans'))}<p class="small">{R.godsIntro}</p></div>;
}

export function Heroes() {
  const [tab, setTab] = useState<'heroes' | 'gods' | 'families'>('heroes');
  const tabs = [['heroes', t('tabHeroes')], ['gods', t('tabGods')], ['families', t('tabFamilies')]] as const;
  return (
    <div>
      <h2>{t('peopleTitle')}</h2>
      <div class="seg" role="tablist">
        {tabs.map(([id, label]) => <button type="button" role="tab" aria-selected={tab === id} class={tab === id ? 'on' : ''} onClick={() => setTab(id)}>{label}</button>)}
      </div>
      {tab === 'heroes' ? <HeroList /> : tab === 'gods' ? <Gods /> : <Families />}
    </div>
  );
}
