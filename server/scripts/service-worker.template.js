// Build replaces the edition and the list of public learning resources.
const cacheName = "luma-editorial-" + "__EDITION__";
const paths = __PUBLIC_PATHS__;
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
