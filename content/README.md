# Content

Everything the map says about the *Iliad* lives here. There is no code in this folder.

- `iliad/*.json` holds facts that do not depend on language: ids, coordinates, certainty, line references.
- `iliad/text/<lang>/*.json` holds the words, keyed by the same ids. There is one folder per language (`en`, `bg`). The check script compares every language with `bg`, where the texts were first written, so all languages must have exactly the same keys.

Run `npm run check` after any change. It fails if an id is missing, a language is incomplete, or a spoiler tag is broken.

## Rules for all text

- Plain, short sentences. One fact per sentence.
- Never state something as certain when it is not. Say how sure the location is, and why.
- Do not copy any published translation of the poem. Summaries are in our own words.

## Certainty

`1` certain, `2` approximate, `3` disputed or schematic.

## Line references

`{ "b": 6, "from": 119, "to": 236 }` means Book 6, lines 119–236. `to` and `from` are optional. `"od": true` marks the *Odyssey*.

## Spoiler tags

A reader sets how far they have read. Text about later books stays hidden until they get there.

Wrap any sentence or clause that tells **what happens in Book N of the Iliad** like this:

    {{N|the text}}

- `N` is the book where it happens (1–24).
- Use `{{25|…}}` for the fate of a named character **after** the poem ends (the fall of Troy, the death of Achilles, the returns).
- Wrap the smallest piece that still reads well when hidden. Keep the comma or full stop that belongs to the hidden clause inside the tag, so the sentence around it still reads well.
- Do not tag background: myths from before the poem, geography, archaeology, and the plain facts of the Catalogue in Book 2 (leaders, ships, towns).
- A tag cannot contain another tag.
- Every language must have the same tags, in the same order, in the same string.

Example:

    "role": "son of Ares{{13|, killed in Book 13}}"
    "role": "син на Арес{{13|, загива в Песен 13}}"

## Scenes

Each book is split into scenes: `iliad/scenes.json` holds the facts, `text/<lang>/scenes.json` the words.

```json
{
  "id": "6.3",
  "book": 6,
  "from": 119, "to": 236,
  "at": ["e_duels"],
  "mentions": ["lycia", "tiryns"],
  "points": [{ "id": "p_ephyra", "lat": 37.906, "lon": 22.879, "certainty": 2 }],
  "view": { "center": [25.5, 37.6], "zoom": 4.6 },
  "path": { "kind": "tale", "pts": [[22.879, 37.906], [22.8, 37.6], [29.32, 36.36]] }
}
```

- `at`: ids of places or events where the action happens.
- `mentions`: ids of places that are only talked about.
- `points`: extra places that are not in the main lists. Their names go in the text file under `points`.
- `view`: where the camera goes. `center` is `[lon, lat]`. `zoom` is a MapLibre zoom level (about 8 for the Troad, 11.5 for the plain of Troy, 13 inside the city, 4.6 for the whole Aegean).
- `path`: an optional journey to animate. `kind` is `walk`, `ride`, `sail`, `fly` or `tale` (a journey inside a story someone tells). `pts` are `[lon, lat]`.

Text for a scene:

```json
"6.3": { "title": "Glaucus and Diomedes", "text": "The two meet between the armies. …" }
```

A scene text is two to four short sentences. It tells what happens and where. It never reveals anything from a later scene or book.

## Hiding a whole marker

Some markers give the story away by their name alone (a tomb, for example). Give them `"reveals": N` in the data and they stay off the map until the reader reaches Book N (`25` = after the poem). Events and routes are hidden automatically until the first book they belong to.
