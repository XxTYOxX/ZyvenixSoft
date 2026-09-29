import { $ } from "./dom.js";
import { toast } from "./toast.js";
import { products } from "./products-data.js";
import { state } from "./state.js";
import { renderPagination } from "./pagination.js";
import { productCardHTML } from "./product-card.js";
import { showCategory, CATEGORIES } from "./category.js";

// Productos destacados que se ven en el inicio (mezcla de categorías)
const FEATURED_IDS = [2, 1, 5, 6];

export function renderProducts() {
  const list = FEATURED_IDS.map((id) => products.find((p) => p.id === id)).filter(Boolean);
  $("#products").innerHTML = list.map(productCardHTML).join("");

  // Botones 1, 2, 3 → cada uno abre su página: 1 = Hombres, 2 = Mujeres, 3 = Accesorios
  renderPagination($("#tiendaPagination"), {
    page: 0,
    totalPages: CATEGORIES.length,
    labels: CATEGORIES,
    onChange: (n) => showCategory(CATEGORIES[n - 1]),
  });
}

export function initProductEvents(onCartChange) {
  $("#products").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const id = Number(btn.closest("[data-id]").dataset.id);

    if (btn.dataset.action === "favorite") {
      const isFav = state.toggleFavorite(id);
      renderProducts();
      toast(isFav ? "Añadido a favoritos" : "Quitado de favoritos");
    } else if (btn.dataset.action === "add") {
      state.addToCart(id);
      onCartChange();
      toast("Producto añadido al carrito");
    }
  });
}
