# Serves the campaign manager - still no build step and no npm dependencies (server.js only
# uses Node's built-in http/fs/path), but now a tiny Node server instead of plain nginx, so it
# can persist campaign data to a mounted volume (see server.js) instead of only living in the
# browser's memory. Rebuild the image any time server.js/index.html/styles.css/app.js change.
FROM node:20-alpine

WORKDIR /app

COPY server.js /app/server.js
COPY index.html styles.css app.js /app/public/
# Bundled sample data - used to seed a fresh install's persisted storage the first time the
# container runs against an empty /data volume (see server.js's GET /api/state fallback).
# If you remove campaign-manager-data.json from the repo, remove this COPY line too.
COPY campaign-manager-data.json /app/seed-data.json

ENV DATA_DIR=/data
ENV PORT=80

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -q -O- http://localhost/ >/dev/null || exit 1

CMD ["node", "/app/server.js"]
