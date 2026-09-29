import { $ } from "./dom.js";
import { money } from "./format.js";
import { products } from "./products-data.js";
import { state } from "./state.js";

export function renderCart() {
  const cart = state.getCart();
  $("#cartBadge").textContent = cart.reduce((a, x) => a + x.qty, 0);

  if (!cart.length) {
    $("#cartContent").innerHTML =
      '<p class="note" style="text-align:center;padding-top:50px">Tu carrito está vacío.</p>';
    $("#cartTotal").textContent = money(0);
    return;
  }

  $("#cartContent").innerHTML = cart
    .map((x) => {
      const p = products.find((y) => y.id === x.id);
      return `
        <div class="cart-item" data-id="${p.id}">
          <img src="${p.img}">
          <div class="cart-item-info">
            <b>${p.name}</b>
            <span>${money(p.price)}</span>
            <div class="qty">
              <button data-action="dec">−</button>
              <span>${x.qty}</span>
              <button data-action="inc">+</button>
              <button class="remove" data-action="remove">Eliminar</button>
            </div>
          </div>
        </div>`;
    })
    .join("");

  $("#cartTotal").textContent = money(
    cart.reduce((a, x) => a + products.find((p) => p.id === x.id).price * x.qty, 0)
  );
}

export function initCartEvents() {
  $("#cartContent").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const id = Number(btn.closest("[data-id]").dataset.id);

    if (btn.dataset.action === "inc") state.changeQty(id, 1);
    else if (btn.dataset.action === "dec") state.changeQty(id, -1);
    else if (btn.dataset.action === "remove") state.removeFromCart(id);

    renderCart();
  });
}
