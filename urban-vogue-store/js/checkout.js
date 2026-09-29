import { $, $$ } from "./dom.js";
import { state } from "./state.js";
import { products } from "./products-data.js";
import { money } from "./format.js";
import { toast } from "./toast.js";
import { showPage } from "./pages.js";
import { API_BASE } from "./config.js";

export function goToCheckout() {
  const cart = state.getCart();
  if (!cart.length) {
    toast("Tu carrito está vacío");
    return;
  }

  $("#cartPanel").classList.remove("open");
  $("#overlay").classList.remove("show");

  fillCheckout();
  showPage("page-checkout");
}

function fillCheckout() {
  const user = state.getUser();
  const cart = state.getCart();

  const [firstName = "", ...rest] = (user?.name || "").trim().split(" ");
  $("#shipFirstName").value = firstName;
  $("#shipLastName").value = rest.join(" ");

  $("#checkoutSummary").innerHTML = cart
    .map((x) => {
      const p = products.find((y) => y.id === x.id);
      return `
        <div class="summary-item">
          <img src="${p.img}" alt="${p.name}">
          <div class="summary-info"><b>${p.name}</b><small>Cant. ${x.qty}</small></div>
          <span>${money(p.price * x.qty)}</span>
        </div>`;
    })
    .join("");

  const subtotal = cart.reduce((a, x) => a + products.find((p) => p.id === x.id).price * x.qty, 0);
  $("#checkoutSubtotal").textContent = money(subtotal);
  $("#checkoutTotal").textContent = money(subtotal);
}

function selectPayMethod(method) {
  $$(".pay-option").forEach((opt) => opt.classList.toggle("active", opt.dataset.pay === method));
  $("#cardFields").style.display = method === "card" ? "block" : "none";
}

export function initCheckoutEvents() {
  $$(".pay-option").forEach((opt) => {
    opt.addEventListener("click", () => {
      opt.querySelector("input[type='radio']").checked = true;
      selectPayMethod(opt.dataset.pay);
    });
  });

  $("#checkoutForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const cart = state.getCart();
    if (!cart.length) return;

    const method = $(".pay-option.active")?.dataset.pay || "card";
    if (method === "card") {
      const num = $("#cardNumber").value.trim();
      const exp = $("#cardExpiry").value.trim();
      const cvv = $("#cardCvv").value.trim();
      if (!num || !exp || !cvv) {
        toast("Completa los datos de la tarjeta");
        return;
      }
    }

    const items = cart.map((x) => {
      const p = products.find((y) => y.id === x.id);
      return { id: p.id, name: p.name, price: p.price, qty: x.qty };
    });
    const total = items.reduce((a, i) => a + i.price * i.qty, 0);

    const shipping = {
      name: `${$("#shipFirstName").value.trim()} ${$("#shipLastName").value.trim()}`.trim(),
      address: $("#shipAddress").value.trim(),
      zip: $("#shipZip").value.trim(),
      city: $("#shipCity").value.trim(),
    };

    // Guarda el pedido en el backend (base de datos real) y descuenta el stock real.
    try {
      const res = await fetch(`${API_BASE}/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuarioEmail: state.getUser()?.email || null,
          items: items.map((i) => ({ productoId: i.id, cantidad: i.qty })),
          metodoPago: method,
          nombreEnvio: shipping.name,
          direccionEnvio: shipping.address,
          ciudadEnvio: shipping.city,
          zipEnvio: shipping.zip,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast(err.error || "No se pudo completar el pedido en el backend");
        return;
      }
    } catch (err) {
      toast("No se pudo conectar con el backend; revisa que esté corriendo");
      return;
    }

    const order = state.addOrder({ items, total, method, shipping });

    state.clearCart();
    $("#checkoutForm").reset();
    selectPayMethod("card");

    $("#orderNumber").textContent = "#" + order.number;
    showPage("page-pedido");
  });
}
