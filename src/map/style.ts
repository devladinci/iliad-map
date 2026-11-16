// The map style: what is drawn, in which order, and how it looks.
import type { LayerSpecification, StyleSpecification } from 'maplibre-gl';
import { C, REALM_ACHAEAN, REALM_TROJAN } from '../theme';
import { DEM_SOURCE } from './dem';
import cyr from '@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-600-normal.woff2?url';
import lat from '@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2?url';
import latx from '@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-600-normal.woff2?url';
import cyrI from '@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-600-italic.woff2?url';
import latI from '@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-italic.woff2?url';
import latxI from '@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-600-italic.woff2?url';

const abs = (u: string) => new URL(u, document.baseURI).href;
const geo = (name: string) => abs(`geo/${name}.json`);
const empty = { type: 'FeatureCollection' as const, features: [] };
const face = (c: string, l: string, lx: string) => [
  { url: abs(c), 'unicode-range': ['U+0400-052F'] },
  { url: abs(lx), 'unicode-range': ['U+0100-024F', 'U+1E00-1EFF'] },
  { url: abs(l), 'unicode-range': ['U+0000-00FF', 'U+2000-206F'] },
];
export const FONT = ['Cormorant'], FONT_I = ['Cormorant Italic'];

// Height colours. Lowlands keep the plain land colour; hills and mountains get warmer, peaks pale.
const TINT: any = ['interpolate', ['linear'], ['elevation'],
  0, 'rgba(236,228,207,0)',
  40, 'rgba(232,222,196,0)',
  200, 'rgba(224,209,172,0.55)',
  500, 'rgba(211,191,149,0.8)',
  900, 'rgba(194,170,130,0.88)',
  1400, 'rgba(174,152,120,0.9)',
  2000, 'rgba(170,158,142,0.92)',
  2600, 'rgba(214,208,198,0.94)',
  3000, 'rgba(244,242,236,0.96)'];

// The same idea for close views of the Troad, where a ridge of 50 m matters.
const TINT_LOCAL: any = ['interpolate', ['linear'], ['elevation'],
  0, 'rgba(236,228,207,0)',
  6, 'rgba(232,222,196,0.2)',
  20, 'rgba(226,214,182,0.5)',
  50, 'rgba(217,201,164,0.7)',
  110, 'rgba(205,186,146,0.82)',
  220, 'rgba(191,169,131,0.88)',
  450, 'rgba(176,154,122,0.9)',
  900, 'rgba(166,150,130,0.92)',
  1500, 'rgba(198,190,176,0.94)',
  1800, 'rgba(236,233,226,0.96)'];

const realmFill = (pal: string[]): any => ['match', ['get', 'ci'], ...pal.flatMap((c, i) => [i, c]), pal[0]];
const hidden = { visibility: 'none' as const };

// Label side for each marker. The preferred side comes first; the others are tried when it does not fit.
const R: any = ['left', [0.75, 0]], L: any = ['right', [-0.75, 0]], T: any = ['bottom', [0, -0.7]], B: any = ['top', [0, 0.7]];
const ANCHORS: any = ['match', ['get', 'anchor'],
  'left', ['literal', [...L, ...R, ...T, ...B]],
  'top', ['literal', [...T, ...R, ...L, ...B]],
  'bottom', ['literal', [...B, ...R, ...L, ...T]],
  ['literal', [...R, ...L, ...T, ...B]]];

export function buildStyle(): StyleSpecification {
  const layers: LayerSpecification[] = [
    { id: 'sea', type: 'background', paint: { 'background-color': C.sea } },
    { id: 'coast-glow', type: 'line', source: 'land', paint: { 'line-color': '#7f9fc9', 'line-opacity': 0.22, 'line-width': ['interpolate', ['linear'], ['zoom'], 4, 5, 9, 12, 13, 22], 'line-blur': ['interpolate', ['linear'], ['zoom'], 4, 5, 9, 12, 13, 22] } },
    { id: 'land', type: 'fill', source: 'land', paint: { 'fill-color': C.land } },
    { id: 'relief-tint', type: 'color-relief', source: 'dem', maxzoom: 10.5, paint: { 'color-relief-color': TINT, 'color-relief-opacity': ['interpolate', ['linear'], ['zoom'], 9.3, 1, 10.5, 0] } },
    { id: 'relief-tint-local', type: 'color-relief', source: 'dem', minzoom: 9.3, paint: { 'color-relief-color': TINT_LOCAL, 'color-relief-opacity': ['interpolate', ['linear'], ['zoom'], 9.3, 0, 10.5, 1, 12.4, 1, 13.5, 0.6] } },
    { id: 'relief-shade', type: 'hillshade', source: 'dem', paint: {
      'hillshade-method': 'standard', 'hillshade-illumination-direction': 315, 'hillshade-illumination-anchor': 'map',
      'hillshade-exaggeration': ['interpolate', ['linear'], ['zoom'], 5, 0.38, 8, 0.48, 10, 0.6, 11.5, 0.95, 12.4, 0.8, 13.5, 0.4],
      'hillshade-shadow-color': 'rgba(70,52,34,0.9)', 'hillshade-highlight-color': 'rgba(255,251,240,0.85)', 'hillshade-accent-color': 'rgba(88,68,46,0.9)',
    } },
    { id: 'land-edge', type: 'line', source: 'land', paint: { 'line-color': '#7d7256', 'line-opacity': 0.55, 'line-width': 0.7 } },
    { id: 'borders', type: 'line', source: 'borders', layout: hidden, paint: { 'line-color': '#4b5060', 'line-opacity': 0.6, 'line-width': 1.2, 'line-dasharray': [5, 2, 1, 2] } },

    { id: 'riv', type: 'line', source: 'rivers', filter: ['==', ['get', 'kind'], 'modern'], layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': '#7da2c2', 'line-opacity': 0.9, 'line-width': ['interpolate', ['linear'], ['zoom'], 5, ['*', ['get', 'w'], 0.45], 9, ['*', ['get', 'w'], 0.8], 13, ['*', ['get', 'w'], 1.5]] } },
    // water and shores as they were around 1200 BC
    { id: 'anc-sea', type: 'fill', source: 'ancient', filter: ['==', ['get', 'kind'], 'sea'], paint: { 'fill-color': C.sea, 'fill-antialias': true } },
    { id: 'anc-marsh', type: 'fill', source: 'ancient', filter: ['==', ['get', 'kind'], 'marsh'], paint: { 'fill-color': '#8fb3a8', 'fill-opacity': 0.55, 'fill-outline-color': '#6f9a8e' } },
    { id: 'anc-lake', type: 'fill', source: 'ancient', filter: ['==', ['get', 'kind'], 'lake'], paint: { 'fill-color': '#7fa3c4', 'fill-opacity': 0.78, 'fill-outline-color': '#5d82a6' } },
    { id: 'anc-shore', type: 'line', source: 'ancient', filter: ['==', ['get', 'kind'], 'shore'], layout: { 'line-cap': 'round' }, paint: { 'line-color': '#dbe4f0', 'line-opacity': 0.85, 'line-width': 1.5, 'line-dasharray': [0.2, 3] } },

    { id: 'riv-anc', type: 'line', source: 'rivers', filter: ['==', ['get', 'kind'], 'ancient'], layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': '#4f7fa8', 'line-opacity': 0.95, 'line-width': 2.6, 'line-dasharray': [0.2, 2.2] } },

    // plan of Troy
    { id: 'troy-lower', type: 'fill', source: 'troy', minzoom: 10, filter: ['==', ['get', 'id'], 'lower'], paint: { 'fill-color': '#b8925e', 'fill-opacity': 0.28 } },
    { id: 'troy-lower-edge', type: 'line', source: 'troy', minzoom: 10, filter: ['==', ['get', 'id'], 'lower'], paint: { 'line-color': '#7a4a1f', 'line-width': 1.2, 'line-dasharray': [3, 3] } },
    { id: 'troy-ditch', type: 'line', source: 'troy', minzoom: 10, filter: ['==', ['get', 'id'], 'ditch'], layout: { 'line-cap': 'round' }, paint: { 'line-color': '#5b3412', 'line-width': 2.4, 'line-dasharray': [0.2, 2] } },
    { id: 'troy-citadel', type: 'fill', source: 'troy', minzoom: 10, filter: ['==', ['get', 'id'], 'citadel'], paint: { 'fill-color': '#9c6b3c', 'fill-opacity': 0.5, 'fill-outline-color': '#5b3412' } },
    { id: 'troy-achwall', type: 'line', source: 'troy', minzoom: 10, filter: ['==', ['get', 'id'], 'achwall'], layout: { 'line-cap': 'round' }, paint: { 'line-color': '#8467b0', 'line-width': 3, 'line-opacity': 0.85, 'line-dasharray': [0.2, 2.2] } },

    // realms of the kings (theme)
    { id: 'realm-fill', type: 'fill', source: 'realms', layout: hidden, paint: {
      'fill-color': ['case', ['==', ['get', 'side'], 'achaean'], realmFill(REALM_ACHAEAN), realmFill(REALM_TROJAN)],
      'fill-opacity': ['case', ['get', 'far'], 0.2, 0.36] } },
    { id: 'realm-edge', type: 'line', source: 'realms', layout: hidden, filter: ['!', ['get', 'far']], paint: { 'line-color': 'rgba(60,45,25,0.55)', 'line-width': 1 } },
    { id: 'realm-edge-far', type: 'line', source: 'realms', layout: hidden, filter: ['get', 'far'], paint: { 'line-color': 'rgba(60,45,25,0.55)', 'line-width': 1, 'line-dasharray': [3, 3] } },

    // routes and theme lines
    { id: 'ln-halo', type: 'line', source: 'lines', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#fffaf0', 'line-opacity': ['*', 0.6, ['get', 'op']], 'line-width': 7 } },
    { id: 'ln', type: 'line', source: 'lines', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': ['get', 'color'], 'line-opacity': ['get', 'op'], 'line-width': 3, 'line-dasharray': [0.2, 2] } },
    { id: 'altline', type: 'line', source: 'altlines', paint: { 'line-color': C.alt, 'line-width': 1.4, 'line-dasharray': [2, 2] } },

    // the battle line of the current scene (schematic)
    { id: 'front-glow', type: 'line', source: 'front', layout: { 'line-cap': 'round' }, paint: { 'line-color': '#fffaf0', 'line-opacity': 0.5, 'line-width': 9, 'line-blur': 4 } },
    { id: 'front', type: 'line', source: 'front', layout: { 'line-cap': 'round' }, paint: { 'line-color': ['get', 'color'], 'line-width': 3.2, 'line-opacity': 0.9 } },

    // the journey of the current scene
    { id: 'path-halo', type: 'line', source: 'path', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#fffaf0', 'line-opacity': 0.75, 'line-width': 7.5 } },
    { id: 'path', type: 'line', source: 'path', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': ['get', 'color'], 'line-width': 3.4 } },

    // names of seas and lands
    { id: 'regions', type: 'symbol', source: 'labels', maxzoom: 7.2, filter: ['in', ['get', 'kind'], ['literal', ['sea', 'land']]], layout: {
      'text-field': ['get', 'name'], 'text-font': ['case', ['==', ['get', 'kind'], 'sea'], ['literal', FONT_I], ['literal', FONT]],
      'text-size': ['interpolate', ['linear'], ['zoom'], 4, 13, 7, 20], 'text-letter-spacing': ['case', ['==', ['get', 'kind'], 'sea'], 0.08, 0.32],
      'text-transform': ['case', ['==', ['get', 'kind'], 'land'], 'uppercase', 'none'], 'text-max-width': 7 },
      paint: { 'text-color': ['case', ['==', ['get', 'kind'], 'sea'], '#9db4d4', '#8a7a55'], 'text-opacity': 0.8,
        'text-halo-color': ['case', ['==', ['get', 'kind'], 'sea'], 'rgba(37,52,79,0.6)', 'rgba(246,241,226,0.6)'], 'text-halo-width': 1 } },
    { id: 'river-names', type: 'symbol', source: 'rivers', minzoom: 7, layout: {
      'symbol-placement': 'line', 'text-field': '', 'text-font': FONT_I, 'text-size': ['interpolate', ['linear'], ['zoom'], 7, 11.5, 12, 15],
      'symbol-spacing': 420, 'text-offset': [0, -0.7], 'text-max-angle': 35 },
      paint: { 'text-color': '#3f6f97', 'text-halo-color': C.halo, 'text-halo-width': 1.3 } },
    { id: 'realm-names', type: 'symbol', source: 'labels', layout: { ...hidden,
      'text-field': ['get', 'name'], 'text-font': FONT, 'text-size': ['interpolate', ['linear'], ['zoom'], 5, 11.5, 8, 15], 'text-max-width': 7, 'text-line-height': 1.05, 'symbol-sort-key': ['get', 'sort'] },
      filter: ['==', ['get', 'kind'], 'realm'],
      paint: { 'text-color': '#3d2f17', 'text-halo-color': 'rgba(255,250,240,0.85)', 'text-halo-width': 1.4 } },

    // the edge of the map sheet: beyond it there is no data, so it is shown as a dark margin and not as open sea
    { id: 'margin', type: 'fill', source: 'frame', paint: { 'fill-color': '#141b2e' } },
    { id: 'neatline', type: 'line', source: 'frame', paint: { 'line-color': '#c9b98f', 'line-opacity': 0.55, 'line-width': 1.2 } },

    // towns and countries of today, drawn faintly, to answer "where is that now?"
    { id: 'modern', type: 'symbol', source: 'labels', filter: ['in', ['get', 'kind'], ['literal', ['mcity', 'mcountry']]], layout: {
      'icon-image': ['case', ['==', ['get', 'kind'], 'mcity'], 'modern', ''], 'icon-size': 0.8,
      'text-field': ['get', 'name'], 'text-font': FONT,
      'text-size': ['case', ['==', ['get', 'kind'], 'mcity'], 12.5, 14.5], 'text-letter-spacing': ['case', ['==', ['get', 'kind'], 'mcity'], 0.02, 0.22],
      'text-transform': ['case', ['==', ['get', 'kind'], 'mcity'], 'none', 'uppercase'],
      'text-variable-anchor-offset': ['case', ['==', ['get', 'kind'], 'mcity'], ['literal', ['left', [0.6, 0], 'right', [-0.6, 0], 'top', [0, 0.5], 'bottom', [0, -0.5]]], ['literal', ['center', [0, 0]]]] },
      paint: { 'text-color': ['case', ['==', ['get', 'kind'], 'mcity'], '#3f4657', '#5b5f6b'], 'text-halo-color': 'rgba(246,241,226,0.85)', 'text-halo-width': 1.2, 'text-opacity': 0.9, 'icon-opacity': 0.9 } },

    // every marker and its label
    { id: 'pts', type: 'symbol', source: 'points', filter: ['>=', ['zoom'], ['get', 'mz']], layout: {
      'icon-image': ['get', 'icon'], 'icon-size': ['interpolate', ['linear'], ['zoom'], 5, ['*', ['get', 'isz'], 0.72], 9, ['get', 'isz'], 13, ['*', ['get', 'isz'], 1.15]],
      'icon-allow-overlap': true, 'icon-rotate': ['get', 'irot'],
      'text-field': ['get', 'name'], 'text-font': ['case', ['==', ['get', 'font'], 'i'], ['literal', FONT_I], ['literal', FONT]],
      'text-size': ['interpolate', ['linear'], ['zoom'], 5, ['*', ['get', 'tsz'], 0.82], 9, ['get', 'tsz'], 13, ['*', ['get', 'tsz'], 1.12]],
      'text-variable-anchor-offset': ANCHORS, 'text-justify': 'auto', 'text-optional': true, 'text-max-width': 8, 'text-line-height': 1.05,
      'text-rotate': ['get', 'trot'], 'text-letter-spacing': ['get', 'sp'], 'symbol-sort-key': ['get', 'sort'], 'text-padding': 3 },
      paint: { 'text-color': ['get', 'tcol'], 'text-halo-color': C.halo, 'text-halo-width': 1.5, 'text-halo-blur': 0.3, 'icon-opacity': ['get', 'op'], 'text-opacity': ['get', 'top'] } },
  ];

  return {
    version: 8,
    name: 'Iliad',
    'font-faces': { Cormorant: face(cyr, lat, latx), 'Cormorant Italic': face(cyrI, latI, latxI) },
    sources: {
      land: { type: 'geojson', data: geo('land') },
      rivers: { type: 'geojson', data: geo('rivers') },
      ancient: { type: 'geojson', data: geo('ancient') },
      realms: { type: 'geojson', data: geo('realms') },
      troy: { type: 'geojson', data: geo('troy') },
      borders: { type: 'geojson', data: geo('borders') },
      dem: { ...DEM_SOURCE, attribution: '' },
      frame: { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [
        [[-40, -10], [100, -10], [100, 70], [-40, 70], [-40, -10]], [[15, 33], [15, 47.5], [50, 47.5], [50, 33], [15, 33]]] } } },
      points: { type: 'geojson', data: empty },
      labels: { type: 'geojson', data: empty },
      lines: { type: 'geojson', data: empty },
      altlines: { type: 'geojson', data: empty },
      path: { type: 'geojson', data: empty },
      front: { type: 'geojson', data: empty },
    },
    layers,
  };
}
