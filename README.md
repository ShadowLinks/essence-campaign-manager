# Campaign Manager

Offline, single-session D&D homebrew campaign tool: bestiary, monster builder, combat tracker, and a custom HWFWM-style essence/confluence system layered on top of heavily modified 5e monster rules.

## Running it

No build step, no backend, no dependencies. Open `index.html` directly in a browser, or serve it with any static webserver (see Docker/Unraid below).

## Files

- `index.html` - page shell and markup
- `styles.css` - all styling
- `app.js` - application logic (state, rendering, combat math, bestiary, monster builder, essence/confluence system, Foundry VTT importer)
- `Dockerfile`, `docker-compose.yml`, `.dockerignore` - container packaging (nginx serving the three files above)
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

This is a static site, so the container is just nginx serving three files - no app server, no database.

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

Remember this is still a single-session, in-memory app underneath - moving it into a container doesn't add a database. Everyone hitting the container's URL gets their own blank slate until they Import a JSON file; **Export JSON** is still how you save/share campaign data.

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
