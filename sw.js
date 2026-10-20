const CACHE_NAME = "floracare-v8";
const APP_SHELL = [
  "index.html",
  "manifest.json",
  "pages/offline.html",
  "pages/login.html",
  "pages/criarConta.html",
  "pages/home.html",
  "pages/sobre.html",
  "assets/js/app.js",
  "assets/js/db.js",
  "assets/js/modules/UI.js",
  "assets/js/modules/plants.js",
  "assets/js/modules/api.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const requests = APP_SHELL.map(
        (path) =>
          new Request(new URL(path, self.registration.scope), {
            cache: "reload",
          }),
      );
      await cache.addAll(requests);
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
        let response;

        try {
          response = await fetch(request);
        } catch (error) {
          const cachedPage = await cache.match(request, { ignoreSearch: true });
          if (cachedPage) {
            return cachedPage;
          }

          const offlinePage = new URL("pages/offline.html", scopeUrl);
          const fallback = await cache.match(offlinePage);
          if (fallback) {
            return fallback;
          }

          throw error;
        }

        if (response.ok) {
          event.waitUntil(
            cache.put(request, response.clone()).catch((error) => {
              console.warn("Não foi possível guardar a página na cache:", error);
            }),
          );
        }
        return response;
      })(),
    );
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const response = await fetch(request);
        if (response.ok) {
          event.waitUntil(
            cache.put(request, response.clone()).catch((error) => {
              console.warn("Não foi possível guardar o recurso na cache:", error);
            }),
          );
        }
        return response;
      } catch (error) {
        const cachedResponse = await cache.match(request, { ignoreSearch: true });
        if (cachedResponse) {
          return cachedResponse;
        }

        if (request.mode === "navigate") {
          const offlinePage = new URL("pages/offline.html", scopeUrl);
          const fallback = await cache.match(offlinePage);
          if (fallback) {
            return fallback;
          }
        }

        throw error;
      }
    })(),
  );
});