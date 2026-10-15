const CACHE_NAME = "floracare-v1";
const APP_SHELL = [
  "index.html",
  "manifest.json",
  "pages/offline.html",
  "pages/login.html",
  "pages/criarConta.html",
  "pages/sobre.html",
  "assets/css/styles.css",
  "assets/js/app.js",
  "assets/js/db.js",
  "assets/js/modules/UI.js",
  "assets/js/modules/api.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const urls = APP_SHELL.map((path) => new URL(path, self.registration.scope));
      await cache.addAll(urls);
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(
            (cacheName) =>
              cacheName.startsWith("floracare-") && cacheName !== CACHE_NAME,
          )
          .map((cacheName) => caches.delete(cacheName)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const requestUrl = new URL(request.url);
  const scopeUrl = new URL(self.registration.scope);

  if (
    request.method !== "GET" ||
    requestUrl.origin !== scopeUrl.origin ||
    !requestUrl.href.startsWith(scopeUrl.href)
  ) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);

        try {
          const response = await fetch(request);
          if (response.ok) {
            await cache.put(request, response.clone());
          }
          return response;
        } catch {
          const cachedPage = await cache.match(request, { ignoreSearch: true });
          if (cachedPage) {
            return cachedPage;
          }

          const offlinePage = new URL("pages/offline.html", scopeUrl);
          const fallback = await cache.match(offlinePage);
          if (fallback) {
            return fallback;
          }

          throw new Error("A página offline não está disponível na cache.");
        }
      })(),
    );
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(request);

      if (cachedResponse) {
        event.waitUntil(
          fetch(request)
            .then((response) => {
              if (response.ok) {
                return cache.put(request, response.clone());
              }
              return undefined;
            })
            .catch(() => undefined),
        );
        return cachedResponse;
      }

      try {
        const response = await fetch(request);
        if (response.ok) {
          await cache.put(request, response.clone());
        }
        return response;
      } catch (error) {
        throw error;
      }
    })(),
  );
});