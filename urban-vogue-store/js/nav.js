import { $, $$ } from "./dom.js";
import { state } from "./state.js";
import { toggleModal } from "./modal.js";
import { openAccount } from "./account.js";
import { toast } from "./toast.js";
import { showCategory } from "./category.js";
import { showHome } from "./pages.js";
import { goToCheckout } from "./checkout.js";
import { goToProfile } from "./profile.js";

export function initNav({ renderProducts, onCartOpen }) {
  // Hombres / Mujeres / Accesorios: cada uno abre su propia página
  function goToCategory(cat) {
    showCategory(cat);
  }

  // tarjetas de categoría (Hombres / Mujeres / Accesorios)
  $$(".cat-card, .cat-quick").forEach((c) => c.addEventListener("click", () => goToCategory(c.dataset.filter)));

  // enlaces del footer (misma acción que las tarjetas de categoría)
  $$(".footer-filter").forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      goToCategory(a.dataset.filter);
    })
  );

  // enlaces del menú principal y el logo: siempre regresan a la página de inicio
  $$('.site-header nav a[href^="#"], .brand').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      e.preventDefault();
      showHome(href.slice(1));
    });
  });

  $("#accountBtn").addEventListener("click", () => {
    state.getUser() ? goToProfile() : openAccount("login");
  });
  $("#loginFooter").addEventListener("click", (e) => {
    e.preventDefault();
    openAccount("login");
  });
  $("#registerFooter").addEventListener("click", (e) => {
    e.preventDefault();
    openAccount("register");
  });
  $("#ordersFooter").addEventListener("click", (e) => {
    e.preventDefault();
    state.getUser() ? goToProfile("orders") : openAccount("login");
  });

  $("#cartBtn").addEventListener("click", () => {
    $("#cartPanel").classList.add("open");
    $("#overlay").classList.add("show");
    onCartOpen?.();
  });

  $("#checkout").addEventListener("click", () => {
    state.getUser() ? goToCheckout() : openAccount("login");
  });

  $("#backHomeBtn")?.addEventListener("click", () => showHome());

  $$("[data-close]").forEach((b) =>
    b.addEventListener("click", () => {
      const id = b.dataset.close;
      if (id === "cartPanel") {
        $("#cartPanel").classList.remove("open");
        $("#overlay").classList.remove("show");
      } else {
        toggleModal("#" + id, false);
      }
    })
  );

  $("#overlay").addEventListener("click", () => {
    $("#cartPanel").classList.remove("open");
    $$(".modal.show").forEach((m) => m.classList.remove("show"));
    $("#overlay").classList.remove("show");
  });
}
