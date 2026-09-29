import { $$ } from "./dom.js";

// Muestra la página de inicio (main#inicio) y oculta el resto.
// Si se pasa targetId, además hace scroll suave hasta ese elemento.
export function showHome(targetId) {
  document.body.classList.remove("admin-mode");
  $$(".page-view").forEach((p) => p.classList.toggle("hidden", p.id !== "inicio"));
  window.scrollTo(0, 0);
  if (targetId) {
    requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    });
  }
}

// Muestra una página específica (checkout, confirmación, perfil) y oculta el resto.
export function showPage(id) {
  // el panel de administrador reemplaza el header y el footer de la tienda
  document.body.classList.toggle("admin-mode", id === "page-admin");
  $$(".page-view").forEach((p) => p.classList.toggle("hidden", p.id !== id));
  window.scrollTo(0, 0);
}
