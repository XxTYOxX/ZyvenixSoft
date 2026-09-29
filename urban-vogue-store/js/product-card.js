import { money } from "./format.js";
import { state } from "./state.js";

export function productCardHTML(p) {
  return `
      <article class="product" data-id="${p.id}">
        <button class="fav" data-action="favorite">${state.isFavorite(p.id) ? "♥" : "♡"}</button>
        <img class="product-image" src="${p.img}" alt="${p.name}">
        <div class="product-info">
          <p class="product-name">${p.name}</p>
          <p class="price">${money(p.price)}</p>
          <button class="add" data-action="add">Agregar al carrito</button>
        </div>
      </article>`;
}
