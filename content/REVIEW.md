# Statements that need a second look

These came up while the texts were translated. They were translated as written and **not changed**. Each needs a check against the poem or the literature, and then either a fix in both languages or removal from this list.

## The poem

| Where | What the text says | The doubt |
|---|---|---|
| `places` → Phthia | Achilles "has promised his hair" to the river Spercheius | In Book 23 (lines 144–149) the vow was made by Peleus, not Achilles. |
| `places` → Salamis | In Book 15 Ajax guards the ships "with his huge shield" | In that passage (lines 674–746) he fights from the decks with a long pike. |
| `places` → Lyrnessus | Mynes is the husband of Briseis | Homer does not say so (Book 19, lines 291–296). It is a later inference. |
| `places` → Cyphus | The Enienes are at Dodona, the Perrhaebians on the Titaressus | Homer (Book 2, lines 749–751) gives both peoples both places. |
| `places` → Scamander | The two springs are "in front of the Scaean Gates" | Homer puts them on the route of the chase along the wall, not at the gates. |
| `places` → Miletus | The "gold like a girl" line is about Amphimachus | The pronoun is ambiguous and is often read as Nastes. |
| `story` → pyre of Patroclus | The list of games ends with spear throwing | In Book 23 it is announced but not held. The armed duel, the weight throw and archery are missing from the list. |
| `story` → route of Chryseis | The ship "rounds Cape Lekton", with a line reference | Book 1, lines 430–487 do not name Lekton. It is the map's route, not Homer's. |
| `themes` → Ares · Thrace | "Ares sets out for the battle from Thrace with his son Fear (Book 13)" | In the poem this is a simile (13.298–303), not an event. |
| `themes` → Aphrodite · Cyprus | "Homer often calls Aphrodite Cypris" | The name seems to occur only about five times, all in Book 5. |
| `themes` → the Amazons | Bellerophon fights the Amazons in Lycia | The poem does not say where. |

## Archaeology and history

| Where | What the text says | The doubt |
|---|---|---|
| `story` → Lake Copais | "finally drained in the 1880s" | The works began in the 1880s and were finished around 1931. |
| `story` → Gediz delta | The Hermus is the Seha River of the Hittite texts | The Hittite note says "Caicus or Hermus". The two texts disagree on how sure this is. |
| `story` → Thermaic Gulf | Pella was "the main port of Macedonia" | It was the capital. "Main port" is a stronger claim. |
| `places` → Iolcus | "Mycenaean palaces" at Dimini and Kastro | The dig notes say a palace at Dimini and "buildings" at Kastro. |
| `places` → Sparta | The palace at Agios Vasileios was "found in 2009" | The first tablets turned up in 2008 and the excavation followed. |
| `extra`, `themes` → Ada Tepe | Gold mining "about 1650–1200 BC" | The usual dates are roughly 1500–1000 BC. |
| `themes` → Hittite names, intro | The Hittite tablets are "the only written source from the very time of the war" | Linear B and Egyptian texts are from the same time. |
| `themes` → Linear B | The name a-ki-re-u at Pylos, and pa-ja-wo | The Pylos form is the dative a-ki-re-we; a-ki-re-u is from Knossos. pa-ja-wo is attested as pa-ja-wo-ne. |
| `themes` → trade, Alashiya | Alashiya is Enkomi | It is usually taken as Cyprus, or a kingdom on it. |
| `themes` → the copper and tin route | "This is how the Uluburun ship travelled" | Its destination is not known. |
| `themes` → coasts, the bay of Troy | "The ships of the Achaeans were here" | Stated as certain. Another note has ships waiting in Beşik Bay. |

## Scenes

The line where each scene starts and ends was checked against the Greek text of the Perseus Digital Library. The summaries themselves were written from knowledge of the poem and only spot-checked.

## Names in English

The English text uses the familiar Latin forms (Achilles, Ajax, Scamander, Sigeum, Lectum). The ids in the data keep Greek-style spellings (`sigeion`, `lekton`). That is fine, but a few names could go either way and should be made consistent: Xanthus / Xanthos, Kos, Knossos, Ida (Gargarus) / Gargaron, Thebe under Placus / Hypoplacian Thebe.

## Reading aids added later

These were written from knowledge of the poem and not checked line by line:

- `days.json`: the split of the poem into days, and the line where each day starts. Counts differ between scholars (50 to 54 days).
- `people.json`: the family trees and the notes on the gods.
- Heights of the peaks in `places.json` (Ida 1774 m, Samothrace 1611 m, Olympus 2917 m, Athos 2033 m, Cyllene 2376 m).
- Coordinates of the modern towns in `modern.json` are rounded to about one kilometre.
- `front.json`: where the battle line stands in each battle scene (0 = at the ships, 1 = at the walls). These are one reading of the poem, and the shape of the line on the map is not from Homer.
- `heroes.json`: parents, homes and the gods on each hero's side. The list of scenes on a hero card is found by searching the scene texts for the name, so "Ajax" also catches scenes with the other Ajax.
- Two reconstructions have no named study yet: Lake Copais and Lake Boebeis (see `ATTRIBUTION.md`). They need a proper citation.
