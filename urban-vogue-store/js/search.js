import { $ } from "./dom.js";
import { money } from "./format.js";
import { products } from "./products-data.js";
import { state } from "./state.js";
import { toggleModal } from "./modal.js";

export function initSearch(onCartChange) {
  $("#searchBtn").addEventListener("click", () => {
    toggleModal("#searchModal", true);
    $("#searchInput").focus();
  });

  $("#favBtn").addEventListener("click", () => {
    toggleModal("#searchModal", true);
    const favs = state.getFavs();
    $("#searchResults").innerHTML = favs.length
      ? products
          .filter((p) => favs.includes(p.id))
          .map((p) => `<div class="result"><span>${p.name}</span><b>${money(p.price)}</b></div>`)
          .join("")
      : "<p class='note'>Aún no tienes favoritos.</p>";
  });

  $("#searchInput").addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    const list = products.filter((p) => (p.name + " " + p.cat).toLowerCase().includes(q));
    $("#searchResults").innerHTML =
      list
        .map(
          (p) =>
            `<div class="result" data-id="${p.id}"><span>${p.name}</span><button data-action="add">Agregar</button></div>`
        )
        .join("") || "<p class='note'>No encontramos productos.</p>";
  });

  $("#searchResults").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action='add']");
    if (!btn) return;
    const id = Number(btn.closest("[data-id]").dataset.id);
    state.addToCart(id);
    onCartChange();
  });
}
