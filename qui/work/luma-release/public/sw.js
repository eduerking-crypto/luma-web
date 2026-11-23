// Build replaces the edition and the list of public learning resources.
const cacheName = "luma-editorial-" + "b7e42c19a08d5f63";
const paths = ["agents-ui.css","agents-ui.js","agents.js","app.js","assets/autumn.webp","assets/chemistry.webp","assets/clock.webp","assets/dm-sans.ttf","assets/earth.webp","assets/icecore.webp","assets/icons.js","assets/ink.webp","assets/luma-192.png","assets/luma-512.png","assets/luma-maskable.png","assets/luma-touch.png","assets/luma.svg","assets/lumi-cutout.webp","assets/lumi.webp","assets/math.webp","assets/nebula.webp","assets/ocean.webp","assets/physics.webp","assets/plant.webp","assets/sample.webp","assets/sonar.webp","assets/transit.webp","daily-data.js","daily.css","daily.js","features-data.js","features.css","features.js","games-expanded.js","games.css","index.html","install.js","learn.css","learn.js","library.css","library.js","longreads-expanded.js","manifest.webmanifest","mobile-nav.css","onboarding.css","research.css","research.js","onboarding.js","science.css","science.js","styles.css","theory-data.js","theory.css","topics-expanded.css","topics-expanded.js","verbs-data-extended.js","verbs-data-more.js","verbs-data.js","verbs.css","verbs.js","vocab-api.js","vocab-expanded.css","vocab-expanded.js","vocab-extra.js","vocab-more.js"];
const base = self.registration.scope;
const allowed = new Map(
  paths.map((path) => [new URL(path, base).pathname, new URL(path, base).href]),
);
const shell = new URL("index.html", base).href;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      await Promise.all(
        paths.map(async (path) => {
          const url = new URL(path, base).href;
          const response = await fetch(
            new Request(url, { cache: "reload", credentials: "same-origin" }),
          );
          if (!response.ok || response.redirected)
            throw new Error("Recurso editorial no disponible");
          await cache.put(url, response);
        }),
      );
      await self.skipWaiting();
    })(),
  );
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const old = (await caches.keys()).filter(
        (name) => name.startsWith("luma-editorial-") && name !== cacheName,
      );
      await Promise.all(old.map((name) => caches.delete(name)));
      await self.clients.claim();
    })(),
  );
});
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.search) return;
  const appRoot = new URL(".", base).pathname;
  if (
    request.mode === "navigate" &&
    (url.pathname === appRoot || url.href === shell)
  ) {
    event.respondWith(
      fetch(request).catch(
        async () =>
          (await (await caches.open(cacheName)).match(shell)) ||
          Response.error(),
      ),
    );
    return;
  }
  const resource = allowed.get(url.pathname);
  if (!resource || request.mode === "navigate") return;
  event.respondWith(
    (async () => {
      const file = await (await caches.open(cacheName)).match(resource);
      return file || fetch(request);
    })(),
  );
});
