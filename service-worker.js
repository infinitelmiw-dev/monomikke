const CACHE_NAME = "monomikke-post-studio-v2-easy1";
const APP_VERSION = "20261110-easy1";
const APP_SHELL = [
  "./", "./index.html", "./manifest.webmanifest",
  "./icon-192.png", "./icon-512.png", "./assets/fonts/ZenMaruGothic-Bold.woff2",
  ...[
    "style.css", "knowledge.js", "generator.js", "topics.js", "purchase.js",
    "product.js", "carousel.js", "brand-layout.js", "image-loader.js",
    "carousel-ui.js", "app.js", "library-data.js", "library-ui.js",
    "easy-post.js", "easy-ui.js"
  ].map(file => `./${file}?v=${APP_VERSION}`)
];
const shellUrls = new Set(APP_SHELL.map(file => new URL(file, self.registration.scope).href));
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("monomikke-post-studio-") && key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET" || !shellUrls.has(event.request.url)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      // Revalidate the HTTP cache and keep the offline copy in sync with Pages.
      const response = await fetch(event.request, { cache: "no-cache" });
      if (response.ok) await cache.put(event.request, response.clone());
      return response;
    } catch (error) {
      const cached = await cache.match(event.request);
      if (cached) return cached;
      throw error;
    }
  })());
});
