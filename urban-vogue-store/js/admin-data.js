import { products } from "./products-data.js";
import { state } from "./state.js";

// Unidades en bodega (antes de las compras reales hechas en la tienda).
const STOCK0 = {
  1: 14, 2: 9, 3: 22, 4: 30, 5: 7, 6: 18, 7: 5, 8: 26,
  9: 20, 10: 15, 11: 4, 12: 12, 13: 16, 14: 8, 15: 19, 16: 11,
  17: 3, 18: 24, 19: 28, 20: 21, 21: 6, 22: 17, 23: 13, 24: 0,
};
export const LOW_STOCK = 5;
export const lowLimit = () => state.getSettings().low ?? LOW_STOCK;

const POP = [2, 1, 10, 5, 9, 4, 3, 7, 11, 6, 17, 14, 22, 19, 8, 12, 15, 20, 13, 16, 18, 23, 21, 24];

export const CAT_COLORS = { Hombres: "#7c3aed", Mujeres: "#f472b6", Accesorios: "#22d3ee" };
export const STATUSES = ["En proceso", "Pagado", "Enviado", "Entregado"];
export const TYPES = ["Conjuntos", "Camisas y tops", "Pantalones", "Chaquetas", "Calzado", "Accesorios"];
export const TYPE_COLORS = ["#7c3aed", "#a78bfa", "#f0abfc", "#fbbf24", "#4ade80", "#38bdf8"];

export const productById = (id) => products.find((p) => p.id === id);

export function typeOf(p) {
  if (!p) return "Accesorios";
  if (p.cat === "Accesorios") return "Accesorios";
  const n = p.name.toLowerCase();
  if (/conjunto|vestido/.test(n)) return "Conjuntos";
  if (/pantal|jean/.test(n)) return "Pantalones";
  if (/chaqueta|blazer/.test(n)) return "Chaquetas";
  if (/zapato/.test(n)) return "Calzado";
  return "Camisas y tops";
}

const FIRST = ["Daniel", "Valentina", "Camilo", "Laura", "Andrés", "Sofía", "Mateo", "Isabela", "Santiago", "Camila", "Juan", "Mariana", "Felipe", "Daniela", "Sebastián", "Luisa", "Nicolás", "Paula", "Esteban", "Carolina"];
const LAST = ["Rojas", "Torres", "Pérez", "Gómez", "Silva", "Martínez", "Ramírez", "López", "Castro", "Vargas", "Herrera", "Mejía", "Ortiz", "Cárdenas", "Molina"];
const CITIES = ["Barranquilla", "Bogotá", "Medellín", "Cali", "Cartagena", "Bucaramanga", "Santa Marta"];
const slug = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const CUSTOMERS = Array.from({ length: 36 }, (_, i) => {
  const f = FIRST[i % 20], l = LAST[(i * 7 + 3) % 15];
  return { name: `${f} ${l}`, email: `${slug(f)}.${slug(l)}@correo.com` };
});

function rng(seed) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Ventas de demostración de los últimos 30 días (siempre las mismas para un mismo día).
let demo = null;
function buildDemo() {
  const out = [];
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  for (let d = 29; d >= 0; d--) {
    const day = new Date(today);
    day.setDate(today.getDate() - d);
    const rnd = rng(day.getFullYear() * 10000 + (day.getMonth() + 1) * 100 + day.getDate());
    const dow = day.getDay();
    const orders = (dow === 5 || dow === 6 ? 6 : 3) + Math.floor(rnd() * 3);
    for (let i = 0; i < orders; i++) {
      const items = [];
      const n = 1 + Math.floor(rnd() * 3);
      for (let k = 0; k < n; k++) {
        const id = POP[Math.floor(Math.pow(rnd(), 1.6) * POP.length)];
        const p = productById(id);
        if (!p || items.some((x) => x.id === id)) continue;
        items.push({ id, name: p.name, price: p.price, qty: rnd() < 0.3 ? 2 : 1 });
      }
      const date = new Date(day);
      date.setHours(9 + Math.floor(rnd() * 11), Math.floor(rnd() * 60));
      const customer = CUSTOMERS[Math.floor(rnd() * CUSTOMERS.length)];
      const city = CITIES[Math.floor(rnd() * CITIES.length)];
      const method = rnd() < 0.7 ? "Tarjeta" : "PayPal";
      const status = d >= 2 ? "Entregado" : d === 1 ? (rnd() < 0.5 ? "Enviado" : "Pagado") : rnd() < 0.5 ? "En proceso" : "Pagado";
      if (date > now) continue;
      out.push({
        number: "UV-" + (4000 + out.length),
        date: date.toISOString(),
        items,
        total: items.reduce((a, x) => a + x.price * x.qty, 0),
        status, real: false, customer, city, method, address: "",
      });
    }
  }
  return out;
}

// Ventas de demostración + compras reales hechas en la tienda (checkout)
export function getSales() {
  demo = demo || buildDemo();
  const real = state.getOrders().map((o) => ({
    number: o.number,
    date: o.date,
    items: o.items,
    total: o.total,
    status: "En proceso",
    real: true,
    customer: { name: o.shipping?.name || "Cliente", email: "" },
    city: o.shipping?.city || "—",
    address: o.shipping?.address || "",
    method: o.method === "paypal" ? "PayPal" : "Tarjeta",
  }));
  const st = state.getOrderStatus();
  return [...real, ...demo]
    .map((o) => ({ ...o, number: String(o.number).replace(/^#/, ""), status: st[String(o.number).replace(/^#/, "")] || o.status }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };

// ventana de `days` días que termina `offset` días atrás (offset 0 = incluye hoy)
export function windowSales(sales, days, offset = 0) {
  const end = startOfToday();
  end.setDate(end.getDate() - offset + 1);
  const start = new Date(end);
  start.setDate(start.getDate() - days);
  return sales.filter((s) => { const d = new Date(s.date); return d >= start && d < end; });
}
export const inPeriod = (sales, days) => windowSales(sales, days, 0);

export const pctDelta = (cur, prev) => (prev > 0 ? ((cur - prev) / prev) * 100 : null);

export function kpis(sales) {
  const revenue = sales.reduce((a, s) => a + s.total, 0);
  const units = sales.reduce((a, s) => a + s.items.reduce((b, i) => b + i.qty, 0), 0);
  return { revenue, orders: sales.length, units, avg: sales.length ? revenue / sales.length : 0 };
}

const MES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
export function dailySeries(days) {
  const today = startOfToday();
  const sales = inPeriod(getSales(), days);
  return Array.from({ length: days }, (_, i) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (days - 1 - i));
    const key = day.toDateString();
    const list = sales.filter((s) => new Date(s.date).toDateString() === key);
    return { label: `${day.getDate()} ${MES[day.getMonth()]}`, value: list.reduce((a, s) => a + s.total, 0), orders: list.length };
  });
}

export function revenueByCategory(sales) {
  const acc = { Hombres: 0, Mujeres: 0, Accesorios: 0 };
  sales.forEach((s) => s.items.forEach((i) => { const p = productById(i.id); if (p) acc[p.cat] += i.price * i.qty; }));
  return acc;
}

export function revenueByType(sales) {
  const acc = Object.fromEntries(TYPES.map((t) => [t, 0]));
  sales.forEach((s) => s.items.forEach((i) => { acc[typeOf(productById(i.id))] += i.price * i.qty; }));
  return acc;
}

export function topProducts(sales, n = 5) {
  const map = new Map();
  sales.forEach((s) =>
    s.items.forEach((i) => {
      const cur = map.get(i.id) || { id: i.id, units: 0, revenue: 0 };
      cur.units += i.qty;
      cur.revenue += i.price * i.qty;
      map.set(i.id, cur);
    })
  );
  return [...map.values()].sort((a, b) => b.units - a.units).slice(0, n);
}

export const unitsOf = (sales, id) =>
  sales.reduce((a, s) => a + s.items.filter((i) => i.id === id).reduce((b, i) => b + i.qty, 0), 0);

// Stock actual = bodega inicial + reposiciones − unidades de compras reales
export function stockOf(id) {
  const sold = state.getOrders().reduce((a, o) => a + o.items.filter((i) => i.id === id).reduce((b, i) => b + i.qty, 0), 0);
  return Math.max(0, (STOCK0[id] ?? 0) + (state.getStockAdj()[id] || 0) - sold);
}

export function stockStatus(n) {
  if (n <= 0) return { key: "out", label: "Agotado" };
  if (n <= lowLimit()) return { key: "low", label: "Poco stock" };
  return { key: "ok", label: "Disponible" };
}

export function inventory() {
  const sold30 = new Map(topProducts(inPeriod(getSales(), 30), 99).map((t) => [t.id, t.units]));
  return products.map((p) => ({ ...p, stock: stockOf(p.id), sold: sold30.get(p.id) || 0 }));
}

export function customersFrom(sales) {
  const map = new Map();
  sales.forEach((o) => {
    const c = map.get(o.customer.name) || { name: o.customer.name, email: o.customer.email, orders: 0, spent: 0, last: o.date, city: o.city };
    c.orders++; c.spent += o.total;
    if (new Date(o.date) > new Date(c.last)) c.last = o.date;
    map.set(o.customer.name, c);
  });
  state.getUsers().filter((u) => u.role !== "admin").forEach((u) => {
    if (![...map.values()].some((c) => c.email === u.email)) map.set(u.email, { name: u.name, email: u.email, orders: 0, spent: 0, last: null, city: "—", registered: true });
  });
  return [...map.values()].sort((a, b) => b.spent - a.spent);
}

export function notifications() {
  const list = [];
  const inv = inventory();
  inv.filter((p) => p.stock === 0).forEach((p) => list.push({ text: `${p.name} está agotado`, view: "inventory", q: p.name }));
  inv.filter((p) => p.stock > 0 && p.stock <= lowLimit()).forEach((p) => list.push({ text: `Poco stock: ${p.name} (${p.stock})`, view: "inventory", q: "" }));
  getSales().filter((o) => o.real && o.status === "En proceso").forEach((o) => list.push({ text: `Nuevo pedido #${o.number}`, view: "sales", q: o.number }));
  return list;
}
