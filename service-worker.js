const CACHE_NAME = "monomikke-post-studio-v1";
const APP_SHELL = [
  "./", "./index.html", "./style.css", "./manifest.webmanifest",
  "./icon-192.png", "./icon-512.png", "./knowledge.js",
  "./generator.js", "./topics.js", "./purchase.js", "./product.js",
  "./carousel.js", "./image-loader.js", "./carousel-ui.js",
  "./app.js", "./library-data.js", "./library-ui.js"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("monomikke-post-studio-") && key !== CACHE_NAME).map(key => caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener("fetch", event => {
  if(event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if(url.origin !== self.location.origin || !url.pathname.startsWith(new URL("./",self.registration.scope).pathname)) return;
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
