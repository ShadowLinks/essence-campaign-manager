# Campaign Manager

Offline, single-session D&D homebrew campaign tool: bestiary, monster builder, combat tracker, and a custom HWFWM-style essence/confluence system layered on top of heavily modified 5e monster rules.

## Running it

No build step, no server, no dependencies. Open `index.html` in a browser.

## Files

- `index.html` - page shell and markup
- `styles.css` - all styling
- `app.js` - application logic (state, rendering, combat math, bestiary, monster builder, essence/confluence system, Foundry VTT importer)

## Data persistence

The app keeps everything in memory for the session. There's no localStorage/server - use **Export JSON** in the header to save your campaign data to a file, and **Import JSON** to load it back in on a future session. Export often.

## Foundry VTT import

The bestiary tab has an "Import Foundry file" button that reads a JSON export of a Foundry world compendium (actors) and queues each monster for conversion into this app's format. It understands both the older Foundry/dnd5e data shape and the newer "Activities" model (dnd5e v4+ on Foundry v13). Anything it can't confidently map gets flagged with an import warning on that monster instead of silently guessing.

This does **not** read DDB-Importer's `.fvttadv` content packages directly - those are encrypted, licensed D&D Beyond content and are intentionally not decoded. The supported path is: import your content into a Foundry world via DDB-Importer as normal, then run a GM script macro to export the resulting world compendium to plain JSON, and import that JSON here.

## House rules encoded in the damage/type engine

- Undead: vulnerable to radiant, weak to fire (flat bonus damage)
- Giants: resist nonmagical bludgeoning/piercing/slashing
- Shapechangers: vulnerable to silver
- Fey: vulnerable to cold iron
- Constructs/structures: vulnerable to adamantine
- Fiends/celestials: vulnerable to orichalcum
- Elemental damage cycle: cold -> fire -> water -> lightning -> earth -> cold (each vulnerable to the previous)
- Psychic/shadow: mutual vulnerability ("hidden war")
- Everything: vulnerable to void
- Tyranny of Rank: higher tier creatures resist/ignore lower-tier attacks (toggleable)

Vulnerabilities can either double damage or negate a resistance. Resistances can either halve damage or apply as a "boon" (full damage plus a separate secondary effect). Weaknesses can be non-damage effects or flat bonus damage. All of this is suggested automatically based on creature type/tags, but nothing is force-applied - it's editable per monster.

## Essences

144 essences across four kinds (Living, Weapon, Elemental, Concept) and five rarities (Common, Uncommon, Rare, Epic, Legendary). Three chosen essences combine into a fourth "confluence" essence. The confluence finder is a live filter over 0-3 picked essences (plus an optional result-name filter) against a table of known combinations - it doesn't require all three to be picked, and lets you save new homebrew combinations as you discover them.
