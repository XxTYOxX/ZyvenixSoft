
const CACHE_NAME = "urban-vogue-store-v7";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./admin.css",
  "./js/dom.js",
  "./js/format.js",
  "./js/toast.js",
  "./js/modal.js",
  "./js/products-data.js",
  "./js/product-card.js",
  "./js/state.js",
  "./js/products.js",
  "./js/category.js",
  "./js/cart.js",
  "./js/pagination.js",
  "./js/account.js",
  "./js/admin.js",
  "./js/admin-data.js",
  "./js/admin-charts.js",
  "./js/profile.js",
  "./js/checkout.js",
  "./js/pages.js",
  "./js/search.js",
  "./js/nav.js",
  "./js/offline-game.js",
  "./js/main.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request, { cache: "no-cache" })
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then(cached => cached || caches.match("./index.html")))
  );
});
