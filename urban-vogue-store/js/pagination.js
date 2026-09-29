// labels (opcional): texto/tooltip de cada botón, p. ej. ["Hombres", "Mujeres", "Accesorios"]
export function renderPagination(container, { page, totalPages, onChange, labels }) {
  if (!container) return;

  if (totalPages <= 1) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = Array.from({ length: totalPages }, (_, i) => i + 1)
    .map((n) => {
      const label = labels ? ` title="${labels[n - 1]}" aria-label="${labels[n - 1]}"` : "";
      return `<button class="page-btn ${n === page ? "active" : ""}" data-page="${n}"${label}>${n}</button>`;
    })
    .join("");

  container.querySelectorAll("[data-page]").forEach((btn) => {
    btn.addEventListener("click", () => onChange(Number(btn.dataset.page)));
  });
}
