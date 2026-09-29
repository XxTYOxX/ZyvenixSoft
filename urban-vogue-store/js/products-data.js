import { API_BASE } from "./config.js";

// Los productos ya NO están escritos a mano aquí: se cargan una sola vez
// desde el backend (Spring Boot + base de datos) cuando arranca la página.
export const products = [];

function fromApi(p) {
  return {
    id: p.id,
    name: p.nombre,
    price: p.precio,
    stock: p.stock,
    cat: p.categoria,
    subcat: p.subcategoria || undefined,
    img: p.imagenUrl,
  };
}

try {
  const res = await fetch(`${API_BASE}/productos`);
  if (!res.ok) throw new Error("Respuesta no válida del backend");
  const data = await res.json();
  products.push(...data.map(fromApi));
} catch (err) {
  console.error(
    "No se pudieron cargar los productos desde el backend. ¿Está corriendo en " + API_BASE + "?",
    err
  );
}

// Vuelve a pedir el catálogo al backend (por ejemplo después de editar un producto).
export async function refreshProducts() {
  try {
    const res = await fetch(`${API_BASE}/productos`);
    if (!res.ok) return;
    const data = await res.json();
    const mapped = data.map(fromApi);
    products.length = 0;
    products.push(...mapped);
  } catch (err) {
    console.error("No se pudo actualizar el catálogo:", err);
  }
}
