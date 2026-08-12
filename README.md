# Campaign Manager

Offline, single-session D&D homebrew campaign tool: bestiary, monster builder, combat tracker, and a custom HWFWM-style essence/confluence system layered on top of heavily modified 5e monster rules.

## Running it

No build step, no npm dependencies. Open `index.html` directly in a browser and it works exactly like before (in-memory only, use Export/Import JSON to save/load). Serve it with `server.js` (see Docker/Unraid below) instead and it also autosaves to disk so data survives restarts - see **Data persistence** below.

## Files

- `index.html` - page shell and markup
- `styles.css` - all styling
- `app.js` - application logic (state, rendering, combat math, bestiary, monster builder, essence/confluence system, Foundry VTT importer, server autosave/autoload)
- `server.js` - tiny dependency-free Node server: serves the three files above and exposes a `/api/state` endpoint that autosaves/loads campaign data to a mounted volume
- `campaign-manager-data.json` - bundled sample campaign data, used to seed a brand-new install's persisted storage on first boot
- `Dockerfile`, `docker-compose.yml`, `.dockerignore` - container packaging
- `.github/workflows/docker-publish.yml` - GitHub Actions workflow that builds the Dockerfile and pushes it to Docker Hub on every push

## Docker Hub

The image is published at [shadowlinks/essence-campaign-manager](https://hub.docker.com/repository/docker/shadowlinks/essence-campaign-manager). GitHub Actions rebuilds and pushes it automatically on every push to this repo that touches `Dockerfile`, `index.html`, `styles.css`, or `app.js` - there's nothing to build by hand, Unraid (or anything else) just pulls the image.

**One-time setup for the auto-publish workflow to work** (only needed once, on GitHub.com - I can't do this part, since it's your Docker Hub credentials):
1. On Docker Hub: Account Settings -> Security -> New Access Token. Give it "Read & Write" scope and copy the token (you won't see it again).
2. On the GitHub repo: Settings -> Secrets and variables -> Actions -> New repository secret. Add two:
   - `DOCKERHUB_USERNAME` = `shadowlinks`
   - `DOCKERHUB_TOKEN` = the access token from step 1
3. Push anything (or open the Actions tab and manually run "Build and publish Docker image") - it should go green and the image will show up on Docker Hub a minute or two later.

## Running it in Docker / on Unraid

The container runs `server.js` - a tiny built-in Node server (no npm dependencies) that serves the static files and auto-saves campaign data to a mounted volume so it survives restarts. Still no external database to run or manage.

**Unraid (Docker Compose Manager plugin):** create a new stack and paste in `docker-compose.yml`'s contents (make sure `services:` only appears once at the top - the plugin sometimes leaves its own default line in place if you paste over part of an existing stub). It pulls `shadowlinks/essence-campaign-manager:latest` from Docker Hub - no local build, no cloning this repo onto the Unraid box at all - and publishes it on host port `8080` (change the left-hand side of the `ports:` line if that's taken - Unraid's own web UI already uses 80/443). Once it's up, hit `http://<your-unraid-ip>:8080/`.

**Plain Docker, any host:**
```
docker compose up -d
```
or without Compose:
```
docker run -d --name essence-campaign-manager -p 8080:80 --restart unless-stopped shadowlinks/essence-campaign-manager:latest
```

**Getting updates after a code change:** push to GitHub, wait for the Actions workflow to finish (Actions tab on the repo), then re-pull on Unraid/wherever it's running:
```
docker compose pull && docker compose up -d
```
On Unraid, the stack's "Force Update" (or Docker tab -> the container's icon -> Check for Updates) does the same thing.

**Building locally instead of pulling** (e.g. to test a change before pushing): swap `image:` back out for `build: .` in `docker-compose.yml`, or run `docker build -t essence-campaign-manager .` directly - the `Dockerfile` is still there and unchanged.

Note the behavior change from before: everyone hitting the container's URL now shares the **same** live, persisted campaign data (there's one save file per container, not one per browser) - see **Data persistence** below. If you want separate, isolated data sets, run separate containers with separate `./data` folders.

## Tailscale (via Unraid's built-in per-container toggle)

`docker-compose.yml` maps a persistent local folder, `./tailscale-state`, to `/config` inside the container. That's what was missing when Unraid's own "Tailscale" toggle errored with `Couldn't detect persistent Docker directory for .tailscale_state` - the toggle needs somewhere durable inside the container to keep its state, and without a mapped volume there was nowhere for it to point at.

**One-time setup, after pulling this update and recreating the container:**
1. Unraid's **Docker** tab -> click this container's icon -> **Edit**.
2. Find the **Tailscale** section and enable it.
3. Toggle **Advanced View** (top right of that panel) so the "Tailscale State Directory" field shows up.
4. Set it to `/config/.tailscale_state`.
5. **Apply**.

Unraid will install and start Tailscale inside the container itself (no separate container, no auth key to paste in - it gives you a login link/QR code to approve the node from the Tailscale admin console the first time). The `./tailscale-state` folder next to `docker-compose.yml` is where that state actually lives on disk, gitignored since it's machine-specific.

Don't want Tailscale at all? The bottom of `docker-compose.yml` has the three-line change to strip the sidecar back out.

## Data persistence

**When self-hosted via Docker** (this is the new default behavior): the app autosaves to `server.js`'s `/api/state` endpoint a second or two after any change, which writes to `/data/state.json` inside the container. `docker-compose.yml` maps that to `./data` next to the compose file, so campaign data survives container restarts, recreates, and image updates - you don't need to do anything for this to work. On a brand-new install (empty `./data` folder), the app seeds itself from the bundled `campaign-manager-data.json` sample data instead of starting blank.

**When opened directly as a file** (double-clicking `index.html`, no server involved) or if the `/api/state` endpoint is ever unreachable for any reason: the app falls back to its old behavior automatically - everything lives only in the browser's memory for that session, and the autosave calls just fail silently in the background. **Export JSON**/**Import JSON** in the header still work exactly as before in either mode, and are still the right tool for taking a portable snapshot, moving data between machines, or keeping an off-container backup - autosave to the volume isn't a replacement for that, just a safety net against restarts.

## Foundry VTT import

The bestiary tab has an "Import Foundry file" button that reads a JSON export of a Foundry world compendium (actors) and queues each monster for conversion into this app's format. It understands both the older Foundry/dnd5e data shape and the newer "Activities" model (dnd5e v4+ on Foundry v13). Anything it can't confidently map gets flagged with an import warning on that monster instead of silently guessing.

This does **not** read DDB-Importer's `.fvttadv` content packages directly - those are encrypted, licensed D&D Beyond content and are intentionally not decoded. The supported path is: import your content into a Foundry world via DDB-Importer as normal, then run a GM script macro to export the resulting world compendium to plain JSON, and import that JSON here.

### GM export macro

Run this inside Foundry (GM only) to dump a world compendium's NPC actors to a JSON file you can then feed into this app's "Import Foundry file" button:

1. Open the **Macros** directory in Foundry.
2. **Create Macro** -> Type: **Script**.
3. Paste the code below and **Save**.
4. Drag it to your hotbar and click it to run.

```js
// Export a compendium's NPC actors to JSON for external tools. GM only.
const actorPacks = game.packs.filter(p => p.documentName === "Actor");
let pack = actorPacks.find(p => /monster manual/i.test(p.metadata.label));

if (!pack) {
  const list = actorPacks.map(p => `${p.metadata.label} (id: ${p.metadata.id})`).join("<br>");
  ui.notifications.warn("Couldn't auto-detect a Monster Manual compendium - check chat for the list.");
  ChatMessage.create({ content: `<b>Available Actor compendiums:</b><br>${list}<br><br>Edit this macro, replace the auto-detect line with e.g. <code>pack = game.packs.get("world.your-pack-id");</code>, and run it again.` });
} else {
  const docs = await pack.getDocuments();
  const data = docs.filter(d => d.type === "npc").map(d => d.toObject());
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `${pack.metadata.label || "monsters"}.json`; a.click();
  URL.revokeObjectURL(url);
  ui.notifications.info(`Exported ${data.length} NPC actors from ${pack.metadata.label}.`);
}
```

It auto-detects a compendium whose label contains "monster manual". If it can't find one, it posts every Actor-type compendium's name and ID to chat instead of guessing wrong - edit the `pack = game.packs.get(...)` line it suggests with the correct ID and run it again. The download comes out as a plain `.json` file of NPC actor data, ready to hand to this app's Foundry importer.

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
- Tag a monster Demon: Explosive Fluids (Fire boon - explodes for Xd6 fire in a 10 ft radius, X = half CR, on a fire-damage kill)
- Tag a monster Devil: Zuggtmoy's Rancor (Poison weakness - can't dash/disengage/dodge and flying speed is halved while poisoned or after taking poison damage)
- Type Dragon: Conductive Scales (Lightning weakness - disadvantage on saves against lightning)

Vulnerabilities can either double damage or negate a resistance. Resistances can either halve damage or apply as a "boon" (full damage plus a separate secondary effect). Weaknesses can be non-damage effects or flat bonus damage. All of the above is suggested automatically based on creature type/tags - the first eight are wired into the engine itself, the last three live in the editable **Type-based auto-rules** list on the Overview tab (Settings -> add your own the same way). Nothing is force-applied; it's editable per monster, and any single monster can have automatic rules turned off entirely with a checkbox in the Monster Builder's Damage profile section if you want full manual control over its damage profile.

## Essences

144 essences across four kinds (Living, Weapon, Elemental, Concept) and five rarities (Common, Uncommon, Rare, Epic, Legendary). Three chosen essences combine into a fourth "confluence" essence. The confluence finder is a live filter over 0-3 picked essences (plus an optional result-name filter) against a table of known combinations - it doesn't require all three to be picked, and lets you save new homebrew combinations as you discover them.
