// Colours shared by the map and the panels. The CSS file repeats the panel colours as variables.
export const C = {
  sea: '#25344f',
  land: '#ece4cf',
  panel: '#18213a',
  text: '#efe8d8',
  bronze: '#b98a3e', bronzeL: '#e0ad52', bronzeD: '#7a5718',
  crimson: '#b5493f', crimsonL: '#ec6f66', crimsonD: '#8b2f27',
  olive: '#4a8766', oliveL: '#7cc49b', oliveD: '#2f6248',
  river: '#5f8db3',
  event: '#7a5cc0', eventD: '#4e3691',
  dig: '#8a5a2b',
  hittite: '#7d6fb3',
  alt: '#8b8f98',
  halo: 'rgba(246,241,226,0.92)',
};

export const SIDE_COLOR = { achaean: C.bronze, trojan: C.crimson, story: C.olive, water: C.river } as const;
export const SIDE_TEXT = { achaean: C.bronzeD, trojan: C.crimsonD, story: C.oliveD, water: '#3f6f97' } as const;

// Realm fills: neighbours get different colours (index `ci` comes from the data).
export const REALM_ACHAEAN = ['#d9ad62', '#8fbf84', '#8aa6d6', '#cf98bf', '#d2c46e', '#86c3bb', '#c9a48a', '#a7a0d8', '#9fc46a', '#e0a3a3'];
export const REALM_TROJAN = ['#e2907f', '#e7ad74', '#d58fa0', '#efc38a', '#e59a6a', '#d9a0c0', '#e8b6a0', '#f0a68a', '#e0b070', '#d88080'];
