// Downloads the elevation tiles the map needs and stores them in public/terrain/.
// Source: Mapterhorn (https://mapterhorn.com), built from Copernicus GLO-30 for this area.
// The tiles are 512 px WebP images in Terrarium encoding.
// Detail is kept only where the map needs it: fine around Troy, coarser further away.
// Usage: node scripts/fetch-terrain.mjs
import fs from 'node:fs';
import path from 'node:path';
import { PMTiles } from 'pmtiles';

const ARCHIVE = 'https://download.mapterhorn.com/planet.pmtiles';
const OUT = path.resolve(import.meta.dirname, '..', 'public', 'terrain');

// [west, south, east, north] and the zoom levels to keep for that box
const AREAS = [
  { name: 'whole map', box: [14, 30, 41, 46.5], zooms: [4, 5, 6, 7] },
  { name: 'Aegean and Anatolia', box: [19, 34, 34.5, 43.2], zooms: [8] },
  { name: 'Greece and the west coast of Anatolia', box: [19.5, 34.6, 30.6, 41.9], zooms: [9] },
  { name: 'Troad', box: [25.5, 39.2, 27.4, 40.6], zooms: [10, 11] },
  { name: 'plain of Troy', box: [25.95, 39.72, 26.65, 40.18], zooms: [12] },
];

const tx = (lon, z) => Math.floor(((lon + 180) / 360) * 2 ** z);
const ty = (lat, z) => { const r = (lat * Math.PI) / 180; return Math.floor(((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** z); };

const jobs = [];
for (const a of AREAS) for (const z of a.zooms) {
  const [w, s, e, n] = a.box;
  for (let x = tx(w, z); x <= tx(e, z); x++) for (let y = ty(n, z); y <= ty(s, z); y++) jobs.push([z, x, y]);
}
console.log(jobs.length, 'tiles to fetch');

const archive = new PMTiles(ARCHIVE);
const have = [];
let bytes = 0, done = 0;
async function worker() {
  for (;;) {
    const job = jobs.pop(); if (!job) return;
    const [z, x, y] = job;
    const file = path.join(OUT, String(z), String(x), y + '.webp');
    if (!fs.existsSync(file)) {
      let tile = null;
      for (let attempt = 0; attempt < 4 && !tile; attempt++) {
        try { tile = (await archive.getZxy(z, x, y)) || 'none'; } catch (err) { if (attempt === 3) throw err; await new Promise(r => setTimeout(r, 800 * (attempt + 1))); }
      }
      if (tile === 'none' || !tile.data) { done++; continue; }
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, Buffer.from(tile.data));
    }
    bytes += fs.statSync(file).size; have.push(`${z}/${x}/${y}`); done++;
    if (done % 50 === 0) console.log(done, 'done,', (bytes / 1e6).toFixed(1), 'MB');
  }
}
await Promise.all(Array.from({ length: 6 }, worker));
have.sort();
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify({ format: 'webp', encoding: 'terrarium', tileSize: 512, minzoom: 4, maxzoom: 12, tiles: have }));
console.log('finished:', have.length, 'tiles,', (bytes / 1e6).toFixed(1), 'MB');
