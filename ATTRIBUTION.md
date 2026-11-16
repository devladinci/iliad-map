# Sources and credits

This map stands on the work of many people who share their data and research openly. Thank you.

If something here is missing or wrongly credited, please open an issue.

## Map data

| What | Source | Licence | Where it is used |
|---|---|---|---|
| Coastline | © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors, as packaged by the [geo-maps](https://github.com/simonepri/geo-maps) project (`@geo-maps/earth-lands-100m`) | ODbL 1.0 | `public/geo/land.json` |
| Elevation | © [Mapterhorn](https://mapterhorn.com/attribution) terrain tiles. For Greece, Turkey and most of the map they are built from the Copernicus GLO-30 elevation model. | see "Elevation data" below | `public/terrain/` |
| Ancient places, their coordinates and certainty | [Pleiades: A Gazetteer of Past Places](https://pleiades.stoa.org), checked against the literature | CC BY | `content/iliad/places.json`, `towns.json` |
| Large rivers | [Natural Earth](https://www.naturalearthdata.com), 10 m rivers | Public domain | `public/geo/rivers.json` |
| Rivers of the Troad | OpenStreetMap lines, found through Pleiades | ODbL 1.0 | `public/geo/rivers.json` |
| Modern borders | Natural Earth, 50 m boundary lines | Public domain | `public/geo/borders.json` |
| Modern towns | Well-known coordinates, rounded to about one kilometre; no dataset was copied | | `content/iliad/modern.json` |

### Required notices

**OpenStreetMap.** © OpenStreetMap contributors. `public/geo/land.json` is a simplified extract of OpenStreetMap data and is made available under the Open Database Licence: https://www.openstreetmap.org/copyright

**Copernicus DEM.** © DLR e.V. 2010–2014 and © Airbus Defence and Space GmbH 2014–2018, provided under COPERNICUS by the European Union and ESA; all rights reserved.

**Mapterhorn.** © Mapterhorn. Full list of its sources: https://mapterhorn.com/attribution

**Pleiades.** Pleiades: A Gazetteer of Past Places, https://pleiades.stoa.org, Creative Commons Attribution.

**Natural Earth.** Made with Natural Earth. Free vector and raster map data at naturalearthdata.com.

### Elevation data

The elevation tiles in `public/terrain/` were downloaded from Mapterhorn with `scripts/fetch-terrain.mjs`. Mapterhorn blends many open datasets. On this map sheet these are the ones that matter:

| Area | Dataset | Producer | Licence |
|---|---|---|---|
| Greece, Turkey, the Balkans and everything not listed below | Copernicus GLO-30 | DLR e.V., Airbus Defence and Space; European Union and ESA | Copernicus free and open licence |
| Cyprus | Cyprus DTM 2019 | Department of Lands and Surveys, Cyprus | CC BY 4.0 |
| Southern Italy | TINITALY 1.1 | Istituto Nazionale di Geofisica e Vulcanologia (INGV) | CC BY 4.0 |
| Sicily | Modello digitale del terreno 2 m | Regione Siciliana | CC BY 4.0 |
| Romania | LAKI II MNT | geoportal.gov.ro | OGL-ROU-1.0 |
| Slovenia | DMR | Slovenian Environment Agency (ARSO) | CC BY 4.0 |
| Southern Austria | ALS-DGM and regional models | BEV; Land Kärnten; Land Burgenland | CC BY 4.0 |

The widest zoom levels use large tiles that reach beyond the map sheet, so they also contain data from other sources on Mapterhorn's list.

## The poem

- Line numbers follow the standard numbering of the Greek text. Scene boundaries were checked against Homer, *Iliad*, edited by D. B. Monro and T. W. Allen (Oxford, 1920), as published by the [Perseus Digital Library](https://www.perseus.tufts.edu).
- No text of the poem and no published translation is reproduced. All summaries are written for this map.

## Research the map relies on

The coast of about 1200 BC, the lakes and the old river beds are drawn by hand for this map after these studies. The drawings are approximate, and each note on the map says how sure it is.

| What | Study |
|---|---|
| Bay and marshes north of Troy, old beds of Scamander and Simoeis | J. Kraft, G. Rapp, İ. Kayan, J. Luce (2003); İ. Kayan (2014) |
| Miletus and the Latmian Gulf | M. Müllenhoff, A. Herda, H. Brückner (2009) |
| Ephesus | J. Kraft, H. Brückner, İ. Kayan, H. Engelmann (2007) |
| Gediz delta | E. Öner, S. Vardar (2018) |
| Thermopylae and the Malian Gulf | J. Kraft, G. Rapp, G. Szemler and others (1987) |
| Thermaic Gulf | M. Ghilardi and others (2008–2012) |
| Lake Copais | the archaeology of Gla and the Copais basin; no single study is named yet |
| Lake Boebeis | modern data on Lake Karla; no single study is named yet |
| Tiryns and the Argive plain | E. Zangger (1994); H. Maroukian and others |
| Pylos | E. Zangger and others (1997) |
| Acheloos delta | A. Vött, H. Brückner and others (2004–2017) |
| Plan of Troy: citadel, lower city, ditch | the excavations led by M. Korfmann (1988–2005) |

Other things on the map come from the same kind of reading:

- **The Catalogue of Ships as a journey** follows the observation of the *Mapping the Catalogue of Ships* project at the University of Virginia (Jenny Strauss Clay, Courtney Evans, Ben Jasnow).
- **The realms of the kings** are computed from the towns Homer lists. They are not historical borders.
- **Battle sites, the camp, routes and the battle line** are schematic. Homer names the points, not the exact spot.

## Software and fonts

| What | Licence |
|---|---|
| [MapLibre GL JS](https://maplibre.org), the map engine | BSD 3-Clause |
| [Preact](https://preactjs.com) and Preact Signals, the interface | MIT |
| [Vite](https://vite.dev) and TypeScript, the build | MIT, Apache 2.0 |
| [PMTiles](https://github.com/protomaps/PMTiles), used to download the elevation tiles | BSD 3-Clause |
| Puppeteer, used for the automated checks | Apache 2.0 |
| Cormorant Garamond by Christian Thalmann (Catharsis Fonts) | SIL Open Font Licence 1.1 |
| PT Sans by ParaType | SIL Open Font Licence 1.1 |

The fonts are packaged by [Fontsource](https://fontsource.org).
