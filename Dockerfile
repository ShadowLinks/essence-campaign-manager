# Serves the campaign manager (a static single-page app - no build step, no backend)
# with a tiny nginx image. Rebuild the image any time index.html/styles.css/app.js change.
FROM nginx:alpine

COPY index.html /usr/share/nginx/html/index.html
COPY styles.css /usr/share/nginx/html/styles.css
COPY app.js /usr/share/nginx/html/app.js

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -q -O- http://localhost/ >/dev/null || exit 1
