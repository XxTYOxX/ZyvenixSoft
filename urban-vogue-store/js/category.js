import { $ } from "./dom.js";
import { toast } from "./toast.js";
import { state } from "./state.js";
import { products } from "./products-data.js";
import { productCardHTML } from "./product-card.js";
import { renderPagination } from "./pagination.js";
import { showPage, showHome } from "./pages.js";

// El orden define los botones: 1 = Hombres, 2 = Mujeres, 3 = Accesorios
export const CATEGORIES = ["Hombres", "Mujeres", "Accesorios"];

// Foto del banner: primero busca img/hero-<categoria>.jpg y, si no existe, usa la de respaldo.
const INFO = {
  Hombres: {
    title: "HOMBRES",
    text: "Colección de estructuras y prendas urbanas para un estilo contemporáneo.",
    hero: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1800&q=85",
  },
  Mujeres: {
    title: "MUJERES",
    text: "Piezas elegantes y versátiles para cada ocasión y en lo personal.",
    hero: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=85",
  },
  Accesorios: {
    title: "ACCESORIOS",
    text: "Bolsos, sombreros y complementos que elevan cualquier look.",
    hero: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1800&q=85",
  },
};

const SUBCATS = ["Todos", "Camisas", "Camisas Clásicas", "Camisas Oversize", "Jeans", "Zapatos", "Sudaderas", "Chaquetas"];
const SORTS = [
  ["default", "Destacados"],
  ["asc", "Menor precio"],
  ["desc", "Mayor precio"],
];

let current = "Hombres";
let subcat = "Todos";
let sort = "default";
let onCartChange = () => {};

function visibleProducts() {
  let list = products.filter((p) => p.cat === current);
  if (current === "Hombres" && subcat !== "Todos") list = list.filter((p) => p.subcat === subcat);
  if (sort === "asc") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "desc") list = [...list].sort((a, b) => b.price - a.price);
  return list;
}

function renderGrid() {
  const list = visibleProducts();
  $("#catProducts").innerHTML = list.length
    ? list.map(productCardHTML).join("")
    : `<p class="note cat-empty">No hay productos en esta selección.</p>`;
}

function renderFilters() {
  const chips = (items, attr, active) =>
    items
      .map(([value, label]) => `<button class="subcat-chip ${value === active ? "active" : ""}" data-${attr}="${value}">${label}</button>`)
      .join("");

  $("#catFilterPanel").innerHTML = `
    ${current === "Hombres" ? `<div class="subcat-row">${chips(SUBCATS.map((s) => [s, s]), "subcat", subcat)}</div>` : ""}
    <div class="subcat-row">${chips(SORTS, "sort", sort)}</div>`;
}

function renderCategory() {
  const info = INFO[current];
  const idx = CATEGORIES.indexOf(current);

  $("#catHeroBg").style.backgroundImage = `url("img/hero-${current.toLowerCase()}.jpg"), url("${info.hero}")`;
  $("#catTitle").textContent = info.title;
  $("#catText").textContent = info.text;

  renderGrid();
  renderFilters();

  renderPagination($("#catPagination"), {
    page: idx + 1,
    totalPages: CATEGORIES.length,
    labels: CATEGORIES,
    onChange: (n) => showCategory(CATEGORIES[n - 1]),
  });

  $("#catPrev").disabled = idx === 0;
  $("#catNext").disabled = idx === CATEGORIES.length - 1;
}

export function showCategory(cat) {
  if (!CATEGORIES.includes(cat)) return;
  current = cat;
  subcat = "Todos";
  sort = "default";
  $("#catFilterPanel").classList.add("hidden");
  renderCategory();
  showPage("page-categoria");
}

export function initCategory(cartChangeCb) {
  onCartChange = cartChangeCb || onCartChange;

  $("#catProducts").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const id = Number(btn.closest("[data-id]").dataset.id);

    if (btn.dataset.action === "favorite") {
      const isFav = state.toggleFavorite(id);
      renderGrid();
      toast(isFav ? "Añadido a favoritos" : "Quitado de favoritos");
    } else if (btn.dataset.action === "add") {
      state.addToCart(id);
      onCartChange();
      toast("Producto añadido al carrito");
    }
  });

  $("#catPrev").addEventListener("click", () => showCategory(CATEGORIES[CATEGORIES.indexOf(current) - 1]));
  $("#catNext").addEventListener("click", () => showCategory(CATEGORIES[CATEGORIES.indexOf(current) + 1]));

  $("#catFilterBtn").addEventListener("click", () => $("#catFilterPanel").classList.toggle("hidden"));

  $("#catFilterPanel").addEventListener("click", (e) => {
    const chip = e.target.closest(".subcat-chip");
    if (!chip) return;
    if (chip.dataset.subcat) subcat = chip.dataset.subcat;
    if (chip.dataset.sort) sort = chip.dataset.sort;
    renderGrid();
    renderFilters();
  });

  $("#catBuyBtn").addEventListener("click", () => showHome("tienda"));
  $("#catStoryBtn").addEventListener("click", () => showHome("nosotros"));
}
