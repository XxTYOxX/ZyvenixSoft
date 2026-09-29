import { renderProducts, initProductEvents } from "./products.js";
import { renderCart, initCartEvents } from "./cart.js";
import { initNav } from "./nav.js";
import { initSearch } from "./search.js";
import { initOfflineGame } from "./offline-game.js";
import { initCategory } from "./category.js";
import { initCheckoutEvents } from "./checkout.js";

function onCartChange() {
  renderCart();
}

// render inicial
renderProducts();
renderCart();

// eventos
initProductEvents(onCartChange);
initCartEvents();
initNav({ renderProducts, onCartOpen: renderCart });
initSearch(onCartChange);
initOfflineGame();
initCategory(onCartChange);
initCheckoutEvents();

// Si una foto no carga (por ejemplo, todavía no guardaste img/14.jpg), muestra un recuadro gris.
const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800"><rect width="100%" height="100%" fill="#e9e9e9"/><text x="50%" y="50%" fill="#aaa" font-family="Arial" font-size="28" text-anchor="middle">Urban Vogue</text></svg>'
  );
document.addEventListener(
  "error",
  (e) => {
    const img = e.target;
    if (img.tagName === "IMG" && img.src !== PLACEHOLDER && !img.dataset.fallback) {
      img.dataset.fallback = "1";
      img.src = PLACEHOLDER;
    }
  },
  true
);
