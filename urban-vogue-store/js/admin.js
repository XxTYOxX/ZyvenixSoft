import { $, $$ } from "./dom.js";
import { state } from "./state.js";
import { toast } from "./toast.js";
import { showHome, showPage } from "./pages.js";
import { money } from "./format.js";
import { products } from "./products-data.js";
import { lineChart, donut, hbars, compact } from "./admin-charts.js";
import * as D from "./admin-data.js";

/* ---------- iconos ---------- */
const ICONS = {
  home: '<path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
  box: '<path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M3 7l9 5 9-5M12 12v10"/>',
  cart: '<path d="M3 4h2l2.4 11h11l2-8H6"/><circle cx="9" cy="20" r="1.2"/><circle cx="17" cy="20" r="1.2"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.6"/><path d="M16 14.2a5 5 0 0 1 5.5 4.8"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  ticket: '<path d="M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4z"/><path d="M14 7v10" stroke-dasharray="2 2"/>',
  chart: '<path d="M5 21V11M12 21V4M19 21v-7"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5h0a1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  bell: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  calendar: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/>',
  crown: '<path d="M3 8l4 4 5-7 5 7 4-4v11H3z"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  pencil: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  dots: '<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  bag: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8a3 3 0 0 1 6 0"/>',
  trend: '<path d="M3 17l6-6 4 4 8-8"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  chev: '<path d="M6 9l6 6 6-6"/>',
};
const icon = (name, size = 20) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

const LOGO_MARK = `<svg class="ad-mark" viewBox="0 0 48 40" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c4b5fd"/><stop offset="1" stop-color="#7c3aed"/></linearGradient></defs><path d="M4 6h8v16a8 8 0 0 0 16 0V6h8L34 30c-2 6-6 8-11 8s-10-2-12-8z" fill="url(#lg)"/><path d="M26 6h6l10-0-12 30h-4z" fill="#fff" opacity=".92"/></svg>`;

/* ---------- utilidades ---------- */
const MES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmtDate = (iso) => (iso ? `${new Date(iso).getDate()} ${MES[new Date(iso).getMonth()]}. ${new Date(iso).getFullYear()}` : "—");
function fmtLong(iso) {
  const d = new Date(iso);
  let h = d.getHours();
  const ap = h >= 12 ? "p. m." : "a. m.";
  h = h % 12 || 12;
  return `${d.getDate()} ${MES[d.getMonth()]} ${d.getFullYear()} - ${String(h).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")} ${ap}`;
}
const fmtDateTime = (iso) => (iso ? fmtLong(iso) : "—");
const match = (q, ...fields) => !q || fields.join(" ").toLowerCase().includes(q.toLowerCase());
const STATUS_CLASS = { "En proceso": "proc", Pagado: "paid", Enviado: "ship", Entregado: "done" };
const pill = (s) => `<span class="ad-st ${STATUS_CLASS[s] || ""}">${s}</span>`;
const thumbOf = (o) => productsImg(o.items[0]?.id);
function productsImg(id) {
  const p = D.productById(id);
  return `<img class="ad-thumb" src="${p ? p.img : ""}" alt="">`;
}
const delta = (pctVal, note = "vs. 7 días previos") =>
  pctVal === null ? `<span class="ad-dnote">${note}</span>` : `<span class="ad-delta ${pctVal >= 0 ? "up" : "down"}">${icon(pctVal >= 0 ? "up" : "down", 13)}${Math.abs(pctVal).toFixed(1)}%</span><span class="ad-dnote">${note}</span>`;

/* ---------- estado de la interfaz ---------- */
const ui = { view: "home", period: 7, metric: "ventas", invCat: "Todos", prodCat: "Todos", ordStatus: "Todos", q: "", editProd: null, menuFor: null, modal: null, bell: false };
let bound = false;

const NAV = [
  ["home", "Inicio", "home"],
  ["box", "Productos", "products"],
  ["cart", "Pedidos", "sales"],
  ["users", "Clientes", "customers"],
  ["layers", "Inventario", "inventory"],
  ["ticket", "Cupones", "coupons"],
  ["chart", "Reportes", "reports"],
  ["gear", "Configuración", "config"],
];

export function goToAdmin() {
  if (!state.isAdmin()) return;
  Object.assign(ui, { view: "home", q: "", editProd: null, menuFor: null, modal: null, bell: false });
  render(false);
  showPage("page-admin");
  bind();
}

/* ---------- PANEL PRINCIPAL ---------- */
function dashboardView() {
  const all = D.getSales();
  const cur = D.windowSales(all, 7, 0), prev = D.windowSales(all, 7, 7);
  const kc = D.kpis(cur), kp = D.kpis(prev);
  const custCur = new Set(cur.map((o) => o.customer.name)).size;
  const custPrev = new Set(prev.map((o) => o.customer.name)).size;
  const custAll = new Set(D.windowSales(all, 30, 0).map((o) => o.customer.name)).size;
  const inv = D.inventory();
  const units = inv.reduce((a, p) => a + p.stock, 0);
  const lowCount = inv.filter((p) => p.stock <= D.lowLimit()).length;

  const series = D.dailySeries(ui.period).map((d) => ({ ...d, value: ui.metric === "ventas" ? d.value : d.orders }));
  const chart = lineChart(series, ui.metric === "ventas" ? { format: compact, w: 440, h: 230 } : { format: (v) => String(Math.round(v)), integer: true, w: 440, h: 230 });

  const periodSales = D.windowSales(all, ui.period, 0);
  const byType = D.revenueByType(periodSales);
  const donutData = D.TYPES.map((t, i) => ({ label: t, value: byType[t], color: D.TYPE_COLORS[i] }));
  const totalPeriod = D.kpis(periodSales).revenue;

  const recent = all.slice(0, 4);
  const top = D.topProducts(D.windowSales(all, 30, 0), 5);

  return `
  <div class="ad-dash">
    <div class="ad-dash-main">
      <div class="ad-head">
        <div><h1>Panel de Administración</h1><p>Bienvenido de nuevo, aquí tienes un resumen de tu tienda.</p></div>
        <div class="ad-today">${icon("calendar", 26)}<div><b>Hoy</b><span>${new Date().toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}</span></div></div>
      </div>

      <div class="ad-kpis4">
        <div class="ad-kcard"><span class="ad-kicon" style="background:#7c4dff">${icon("bag", 26)}</span><div><small>Ventas Totales</small><b>${money(kc.revenue)}</b><p>${delta(D.pctDelta(kc.revenue, kp.revenue))}</p></div></div>
        <div class="ad-kcard"><span class="ad-kicon" style="background:#3b82f6">${icon("cart", 26)}</span><div><small>Pedidos</small><b>${kc.orders}</b><p>${delta(D.pctDelta(kc.orders, kp.orders))}</p></div></div>
        <div class="ad-kcard"><span class="ad-kicon" style="background:#22c55e">${icon("users", 26)}</span><div><small>Clientes</small><b>${custAll}</b><p>${delta(D.pctDelta(custCur, custPrev))}</p></div></div>
        <div class="ad-kcard"><span class="ad-kicon" style="background:#ec4899">${icon("box", 26)}</span><div><small>Productos en Stock</small><b>${units}</b><p>${lowCount ? `<span class="ad-delta down">${icon("down", 13)}${lowCount}</span><span class="ad-dnote">con poco stock</span>` : `<span class="ad-dnote">Todo en orden</span>`}</p></div></div>
      </div>

      <div class="ad-row2">
        <div class="ad-card">
          <div class="ad-card-head"><h3>Ventas de los últimos ${ui.period} días</h3>
            <div class="ad-selects">
              <select class="ad-select" data-sel="metric"><option value="ventas" ${ui.metric === "ventas" ? "selected" : ""}>Ventas</option><option value="pedidos" ${ui.metric === "pedidos" ? "selected" : ""}>Pedidos</option></select>
              <select class="ad-select" data-sel="period">${[7, 14, 30].map((d) => `<option value="${d}" ${d === ui.period ? "selected" : ""}>${d} días</option>`).join("")}</select>
            </div></div>
          ${chart}
        </div>
        <div class="ad-card"><div class="ad-card-head"><h3>Ventas por categoría</h3></div>${donut(donutData, { format: compact, center: () => money(totalPeriod), amounts: false })}</div>
      </div>

      <div class="ad-card">
        <div class="ad-card-head"><h3>Últimos pedidos</h3><button class="ad-link" data-act="nav" data-view="sales">Ver todos ${icon("arrow", 15)}</button></div>
        ${ordersTable(all.slice(0, 5))}
      </div>

      <div class="ad-banner" style="background-image:linear-gradient(90deg,#3b1a78 0%,rgba(59,26,120,.9) 38%,rgba(10,10,30,.25) 100%),url(img/hero-hombres.jpg)">
        <div class="ad-banner-logo">${LOGO_MARK}<b>URBAN VOGUE</b><small>STORE</small></div>
        <div class="ad-banner-copy"><h2>Tu estilo, nuestra prioridad</h2><p>Ropa moderna, calidad y tendencia en un solo lugar.</p></div>
        <button class="ad-banner-btn" data-act="nav" data-view="products">Ver productos ${icon("arrow", 16)}</button>
      </div>
    </div>

    <div class="ad-dash-side">
      <div class="ad-card">
        <div class="ad-card-head"><h3>${icon("cart", 18)} Pedidos recientes</h3><button class="ad-link" data-act="nav" data-view="sales">Ver todos ${icon("arrow", 15)}</button></div>
        <div class="ad-recent">${recent.map((o) => `
          <button class="ad-recent-row" data-act="order-view" data-n="${esc(o.number)}">
            ${thumbOf(o)}
            <div><b>#${esc(o.number)}</b><small>${fmtLong(o.date).replace(" - ", " - ")}</small></div>
            <div class="ad-recent-r">${pill(o.status)}<b>${money(o.total)}</b></div>
          </button>`).join("")}</div>
      </div>
      <div class="ad-card">
        <div class="ad-card-head"><h3>${icon("trend", 18)} Productos más vendidos</h3><button class="ad-link" data-act="nav" data-view="reports">Ver todos ${icon("arrow", 15)}</button></div>
        <ol class="ad-toplist">${top.map((t, i) => {
          const p = D.productById(t.id);
          const d = D.pctDelta(D.unitsOf(cur, t.id), D.unitsOf(prev, t.id));
          return `<li><span class="ad-rank">${i + 1}.</span>${productsImg(t.id)}<div><b>${esc(p.name)}</b><small>${t.units} unidades</small></div>${d === null ? "" : `<span class="ad-delta ${d >= 0 ? "up" : "down"}">${icon(d >= 0 ? "up" : "down", 13)}${Math.abs(d).toFixed(0)}%</span>`}</li>`;
        }).join("")}</ol>
        <p class="ad-foot">Unidades vendidas en 30 días · variación vs. 7 días previos</p>
      </div>
    </div>
  </div>`;
}

/* ---------- tabla de pedidos ---------- */
function ordersTable(list) {
  if (!list.length) return `<p class="ad-empty">No hay pedidos para mostrar.</p>`;
  return `<div class="ad-table-wrap"><table class="ad-table ad-orders">
    <thead><tr><th># Pedido</th><th>Cliente</th><th>Fecha</th><th>Total</th><th>Estado</th><th>Acciones</th></tr></thead>
    <tbody>${list.map((o) => `<tr>
      <td><div class="ad-idcell">${thumbOf(o)}<span>#${esc(o.number)}</span></div></td>
      <td>${esc(o.customer.name)}</td>
      <td>${fmtLong(o.date)}</td>
      <td>${money(o.total)}</td>
      <td>${pill(o.status)}</td>
      <td><div class="ad-actions">
        <button class="ad-icon-btn" data-act="order-view" data-n="${esc(o.number)}" aria-label="Ver pedido">${icon("eye", 18)}</button>
        <button class="ad-icon-btn" data-act="order-menu" data-n="${esc(o.number)}" aria-label="Cambiar estado">${icon("dots", 18)}</button>
        ${ui.menuFor === o.number ? `<div class="ad-menu"><small>Cambiar estado</small>${D.STATUSES.map((s) => `<button data-act="set-status" data-n="${esc(o.number)}" data-s="${s}" class="${s === o.status ? "on" : ""}">${s}</button>`).join("")}</div>` : ""}
      </div></td></tr>`).join("")}</tbody></table></div>`;
}

function orderModal() {
  if (!ui.modal) return "";
  const o = D.getSales().find((x) => x.number === ui.modal.number);
  if (!o) return "";
  return `<div class="ad-modal-bg" data-act="close-modal"><div class="ad-modal" role="dialog" aria-label="Detalle del pedido">
    <div class="ad-modal-head"><div><h3>Pedido #${esc(o.number)}</h3><small>${fmtLong(o.date)}</small></div><button class="ad-icon-btn" data-act="close-modal" aria-label="Cerrar">${icon("x", 20)}</button></div>
    <div class="ad-modal-grid">
      <div><small>Cliente</small><b>${esc(o.customer.name)}</b>${o.customer.email ? `<span>${esc(o.customer.email)}</span>` : ""}</div>
      <div><small>Ciudad</small><b>${esc(o.city)}</b>${o.address ? `<span>${esc(o.address)}</span>` : ""}</div>
      <div><small>Pago</small><b>${o.method}</b><span>${o.real ? "Compra real en la tienda" : "Pedido de demostración"}</span></div>
      <div><small>Estado</small><select class="ad-select" data-sel="order-status" data-n="${esc(o.number)}">${D.STATUSES.map((s) => `<option ${s === o.status ? "selected" : ""}>${s}</option>`).join("")}</select></div>
    </div>
    <table class="ad-table"><thead><tr><th>Producto</th><th>Cant.</th><th>Precio</th><th>Subtotal</th></tr></thead>
      <tbody>${o.items.map((i) => `<tr><td class="ad-prod">${productsImg(i.id)}<span>${esc(i.name)}</span></td><td>${i.qty}</td><td>${money(i.price)}</td><td>${money(i.price * i.qty)}</td></tr>`).join("")}</tbody></table>
    <div class="ad-modal-total"><span>Total</span><b>${money(o.total)}</b></div>
  </div></div>`;
}

/* ---------- vistas secundarias ---------- */
const filterBadge = () => (ui.q ? `<button class="ad-chip-btn active" data-act="clear-q">Filtro: ${esc(ui.q)} ${icon("x", 12)}</button>` : "");
const kpiCard = (label, value, note = "") => `<div class="ad-kpi"><span>${label}</span><b>${value}</b>${note ? `<small>${note}</small>` : ""}</div>`;
const chips = (items, attr, active) => `<div class="ad-chips ad-chips-left">${items.map((c) => `<button class="ad-chip-btn ${c === active ? "active" : ""}" data-act="${attr}" data-v="${c}">${c}</button>`).join("")}${filterBadge()}</div>`;

function ordersView() {
  const list = D.getSales().filter((o) => (ui.ordStatus === "Todos" || o.status === ui.ordStatus) && match(ui.q, o.number, o.customer.name));
  const k = D.kpis(list);
  return `
    <div class="ad-title"><div><h1>Pedidos</h1><p>Todo lo que se ha vendido en la tienda.</p></div></div>
    <div class="ad-kpis">${kpiCard("Ingresos", money(k.revenue))}${kpiCard("Pedidos", k.orders)}${kpiCard("Artículos vendidos", k.units)}${kpiCard("Ticket promedio", money(k.avg))}</div>
    ${chips(["Todos", ...D.STATUSES], "ord-status", ui.ordStatus)}
    <div class="ad-card">${ordersTable(list.slice(0, 60))}</div>
    <p class="ad-note">Los últimos 30 días incluyen pedidos de demostración. Las compras reales hechas en la tienda aparecen con el número que ve el cliente y se guardan en este navegador.</p>`;
}

function inventoryView() {
  const all = D.inventory();
  const list = all.filter((p) => (ui.invCat === "Todos" || p.cat === ui.invCat) && match(ui.q, p.name));
  const lim = D.lowLimit();
  const low = all.filter((p) => p.stock > 0 && p.stock <= lim);
  const out = all.filter((p) => p.stock === 0);
  const alerts = [...out.map((p) => `${p.name} (agotado)`), ...low.map((p) => `${p.name} (${p.stock})`)];
  return `
    <div class="ad-title"><div><h1>Inventario</h1><p>Cuántos artículos nos quedan de cada producto.</p></div></div>
    <div class="ad-kpis">${kpiCard("Unidades en stock", all.reduce((a, p) => a + p.stock, 0))}${kpiCard("Poco stock", low.length, `${lim} o menos unidades`)}${kpiCard("Agotados", out.length)}${kpiCard("Valor del inventario", money(all.reduce((a, p) => a + p.stock * p.price, 0)))}</div>
    ${alerts.length ? `<div class="ad-alert"><b>Atención:</b> ${alerts.join(" · ")}</div>` : ""}
    ${chips(["Todos", "Hombres", "Mujeres", "Accesorios"], "inv-cat", ui.invCat)}
    <div class="ad-card"><div class="ad-table-wrap"><table class="ad-table">
      <thead><tr><th>Producto</th><th>Precio</th><th>Vendidos (30 d)</th><th>En stock</th><th>Estado</th><th></th></tr></thead>
      <tbody>${list.map((p) => { const st = D.stockStatus(p.stock); const pct = Math.min(100, (p.stock / 30) * 100);
        return `<tr><td class="ad-prod">${productsImg(p.id)}<span>${esc(p.name)}<small>${p.cat}</small></span></td><td>${money(p.price)}</td><td>${p.sold}</td>
          <td><div class="ad-stock"><b>${p.stock}</b><div class="ad-meter"><div class="${st.key}" style="width:${pct}%"></div></div></div></td>
          <td><span class="ad-pill ${st.key}">${st.label}</span></td><td><button class="ad-mini" data-act="restock" data-id="${p.id}">+10</button></td></tr>`; }).join("")}</tbody>
    </table></div></div>`;
}

function productsView() {
  const list = products.filter((p) => (ui.prodCat === "Todos" || p.cat === ui.prodCat) && match(ui.q, p.name, p.cat));
  return `
    <div class="ad-title"><div><h1>Productos</h1><p>Catálogo de la tienda. Puedes editar nombre y precio.</p></div></div>
    ${chips(["Todos", "Hombres", "Mujeres", "Accesorios"], "prod-cat", ui.prodCat)}
    <div class="ad-card"><div class="ad-table-wrap"><table class="ad-table">
      <thead><tr><th>Producto</th><th>Categoría</th><th>Tipo</th><th>Precio</th><th>Stock</th><th></th></tr></thead>
      <tbody>${list.map((p) => {
        const editing = ui.editProd === p.id;
        return `<tr><td class="ad-prod">${productsImg(p.id)}${editing ? `<input class="ad-input" id="pe-name-${p.id}" value="${esc(p.name)}">` : `<span>${esc(p.name)}<small>ID ${p.id}</small></span>`}</td>
          <td>${p.cat}</td><td>${D.typeOf(p)}</td>
          <td>${editing ? `<input class="ad-input ad-input-sm" id="pe-price-${p.id}" type="number" min="1" value="${p.price}">` : money(p.price)}</td>
          <td>${D.stockOf(p.id)}</td>
          <td>${editing ? `<button class="ad-mini" data-act="prod-save" data-id="${p.id}">Guardar</button> <button class="ad-mini ghost" data-act="prod-cancel">Cancelar</button>` : `<button class="ad-mini" data-act="prod-edit" data-id="${p.id}">Editar</button>`}</td></tr>`;
      }).join("")}</tbody></table></div></div>`;
}

function customersView() {
  const list = D.customersFrom(D.getSales()).filter((c) => match(ui.q, c.name, c.email));
  return `
    <div class="ad-title"><div><h1>Clientes</h1><p>Quiénes compran en la tienda y cuánto han gastado.</p></div></div>
    <div class="ad-kpis">${kpiCard("Clientes", list.length)}${kpiCard("Con compras", list.filter((c) => c.orders).length)}${kpiCard("Registrados sin compras", list.filter((c) => !c.orders).length)}${kpiCard("Mejor cliente", list[0] ? esc(list[0].name) : "—")}</div>
    ${ui.q ? `<div class="ad-chips ad-chips-left">${filterBadge()}</div>` : ""}
    <div class="ad-card"><div class="ad-table-wrap"><table class="ad-table">
      <thead><tr><th>Cliente</th><th>Correo</th><th>Ciudad</th><th>Pedidos</th><th>Total gastado</th><th>Última compra</th></tr></thead>
      <tbody>${list.map((c) => `<tr><td>${esc(c.name)}${c.registered ? ` <span class="ad-pill new">Nuevo</span>` : ""}</td><td>${esc(c.email || "—")}</td><td>${esc(c.city)}</td><td>${c.orders}</td><td>${money(c.spent)}</td><td>${fmtDate(c.last)}</td></tr>`).join("")}</tbody>
    </table></div></div>`;
}

function couponsView() {
  const list = state.getCoupons();
  return `
    <div class="ad-title"><div><h1>Cupones</h1><p>Códigos de descuento de la tienda.</p></div></div>
    <div class="ad-card ad-form-card"><h3>Crear cupón</h3>
      <form data-form="coupon" class="ad-inline-form">
        <input class="ad-input" name="code" placeholder="CÓDIGO" required maxlength="20">
        <select class="ad-select" name="type"><option value="percent">Porcentaje (%)</option><option value="fixed">Valor fijo ($)</option></select>
        <input class="ad-input ad-input-sm" name="value" type="number" min="1" placeholder="Valor" required>
        <button class="ad-primary">${icon("plus", 16)} Crear</button>
      </form>
    </div>
    <div class="ad-card"><div class="ad-table-wrap"><table class="ad-table">
      <thead><tr><th>Código</th><th>Descuento</th><th>Usos</th><th>Estado</th><th></th></tr></thead>
      <tbody>${list.map((c) => `<tr><td><b>${esc(c.code)}</b></td><td>${c.type === "percent" ? c.value + "%" : money(c.value)}</td><td>${c.uses}</td>
        <td><span class="ad-pill ${c.active ? "ok" : "out"}">${c.active ? "Activo" : "Inactivo"}</span></td>
        <td><button class="ad-mini" data-act="coupon-toggle" data-code="${esc(c.code)}">${c.active ? "Desactivar" : "Activar"}</button> <button class="ad-mini ghost" data-act="coupon-del" data-code="${esc(c.code)}">Eliminar</button></td></tr>`).join("") || `<tr><td colspan="5">No hay cupones.</td></tr>`}</tbody>
    </table></div></div>
    <p class="ad-note">Los cupones se administran aquí; todavía no se aplican en el pago de la tienda.</p>`;
}

function reportsView() {
  const sales = D.inPeriod(D.getSales(), ui.period);
  const k = D.kpis(sales);
  const cat = D.revenueByCategory(sales);
  const top = D.topProducts(sales, 5);
  const inv = D.inventory();
  const stockByCat = ["Hombres", "Mujeres", "Accesorios"].map((c) => ({ label: c, value: inv.filter((p) => p.cat === c).reduce((a, p) => a + p.stock, 0), color: D.CAT_COLORS[c] }));
  return `
    <div class="ad-title"><div><h1>Reportes</h1><p>Gráficas de ventas e inventario.</p></div>
      <div class="ad-chips">${[7, 14, 30].map((d) => `<button class="ad-chip-btn ${d === ui.period ? "active" : ""}" data-act="period" data-v="${d}">Últimos ${d} días</button>`).join("")}</div></div>
    <div class="ad-kpis">${kpiCard("Ingresos", money(k.revenue))}${kpiCard("Pedidos", k.orders)}${kpiCard("Artículos vendidos", k.units)}${kpiCard("Ticket promedio", money(k.avg))}</div>
    <div class="ad-card ad-chart-card"><h3>Ventas por día</h3>${lineChart(D.dailySeries(ui.period))}</div>
    <div class="ad-cols ad-cols-even">
      <div class="ad-card"><h3>Ventas por categoría</h3>${donut(["Hombres", "Mujeres", "Accesorios"].map((c) => ({ label: c, value: cat[c], color: D.CAT_COLORS[c] })), { center: (v) => compact(v) })}</div>
      <div class="ad-card"><h3>Top 5 productos (unidades)</h3>${hbars(top.map((t) => ({ label: D.productById(t.id).name, value: t.units, text: `${t.units} unid. · ${compact(t.revenue)}` })))}</div>
    </div>
    <div class="ad-card ad-chart-card"><h3>Unidades en stock por categoría</h3>${hbars(stockByCat.map((c) => ({ label: c.label, value: c.value, text: `${c.value} unidades`, color: c.color })))}</div>`;
}

function configView() {
  return `
    <div class="ad-title"><div><h1>Configuración</h1><p>Ajustes del panel de administración.</p></div></div>
    <div class="ad-card ad-form-card"><h3>Inventario</h3>
      <form data-form="config" class="ad-inline-form">
        <label>Avisar de poco stock cuando queden</label>
        <input class="ad-input ad-input-sm" name="low" type="number" min="1" max="50" value="${D.lowLimit()}" required>
        <span class="ad-dnote">unidades o menos</span>
        <button class="ad-primary">Guardar</button>
      </form>
    </div>
    <div class="ad-card ad-form-card"><h3>Administradores</h3>
      <div class="ad-table-wrap"><table class="ad-table">
        <thead><tr><th>Nombre</th><th>Correo</th><th>Creado</th><th></th></tr></thead>
        <tbody>${state.getUsers().filter((a) => a.role === "admin").map((a) => `<tr><td>${esc(a.name)}</td><td>${esc(a.email)}</td><td>${fmtDate(a.created)}</td>
          <td>${state.isMainAdmin(a.email) ? `<span class="ad-pill new">Principal</span>` : a.email === state.getUser().email ? `<span class="ad-dnote">Tu cuenta</span>` : `<button class="ad-mini ghost" data-act="admin-remove" data-email="${esc(a.email)}">Quitar acceso</button>`}</td></tr>`).join("")}</tbody>
      </table></div>
      <h3 class="ad-sub">Crear administrador</h3>
      <form data-form="admin" class="ad-inline-form">
        <input class="ad-input" name="name" placeholder="Nombre completo" required>
        <input class="ad-input" name="email" type="email" placeholder="correo@ejemplo.com" required>
        <input class="ad-input" name="pass" type="password" placeholder="Contraseña (mín. 4)" minlength="4" required>
        <button class="ad-primary">${icon("plus", 16)} Crear</button>
      </form>
      <p class="ad-note">Si el correo ya es una cuenta de cliente, esa cuenta pasa a ser administrador y conserva su contraseña.</p>
    </div>
    <div class="ad-card ad-form-card"><h3>Datos del panel</h3>
      <p class="ad-note">Restablece stock, estados de pedidos, cupones y cambios de productos a sus valores iniciales.</p>
      <div class="ad-inline-form"><button class="ad-outline" data-act="reset-data">Restablecer datos del panel</button><button class="ad-outline danger" data-act="reset-orders">Borrar pedidos reales</button></div>
    </div>`;
}

function profileView(u) {
  return `
    <div class="ad-title"><div><h1>Usuario Administrador</h1><p>Cuenta con todos los permisos del sistema.</p></div><span class="ad-status"><i></i>Activo</span></div>
    <div class="ad-card ad-profile">
      <div class="ad-avatar">${icon("user", 64)}<span class="ad-crown">${icon("crown", 16)}</span></div>
      <div class="ad-profile-info"><h2>${esc(u.name)}</h2><span class="ad-role">Administrador</span>
        <ul><li>${icon("mail", 18)}${esc(u.email)}</li><li>${icon("lock", 18)}********</li><li>${icon("calendar", 18)}Creado el: ${fmtDate(u.created)}</li></ul></div>
      <button class="ad-outline" data-act="edit-profile">${icon("pencil", 16)}Editar perfil</button>
    </div>
    <div class="ad-cols">
      <div class="ad-card"><h3>Rol y permisos</h3>
        <div class="ad-role-head"><span class="ad-role-icon">${icon("crown", 22)}</span><div><b>Administrador</b><small>Tiene acceso completo a todas las secciones del sistema.</small></div></div>
        <ul class="ad-perms">${["Gestionar productos", "Ver y gestionar pedidos", "Administrar usuarios", "Acceder a reportes", "Modificar configuración de la tienda", "Eliminar y editar contenido", "Acceso total al panel de administración"].map((t) => `<li><span>${icon("check", 12)}</span>${t}</li>`).join("")}</ul></div>
      <div class="ad-card"><h3>Información del usuario</h3>
        <dl class="ad-info"><dt>Nombre:</dt><dd>${esc(u.name)}</dd><dt>Correo electrónico:</dt><dd>${esc(u.email)}</dd><dt>Rol:</dt><dd>Administrador</dd><dt>Estado:</dt><dd><i class="ad-dot"></i> Activo</dd><dt>Fecha de creación:</dt><dd>${fmtDate(u.created)}</dd><dt>Último acceso:</dt><dd>${fmtDateTime(u.lastAccess)}</dd></dl>
        <button class="ad-outline ad-logout" data-act="logout">${icon("logout", 18)}Cerrar sesión</button></div>
    </div>`;
}

function editView(u) {
  return `
    <div class="ad-title"><div><h1>Editar perfil</h1><p>Actualiza tus datos de administrador.</p></div></div>
    <div class="ad-card ad-edit"><form data-form="profile">
      <label>Nombre completo</label><input class="ad-input" name="name" value="${esc(u.name)}" required>
      <label>Correo electrónico</label><input class="ad-input" name="email" type="email" value="${esc(u.email)}" required>
      <div class="ad-edit-actions"><button type="button" class="ad-outline" data-act="nav" data-view="profile">Cancelar</button><button class="ad-primary">Guardar cambios</button></div>
    </form></div>`;
}

/* ---------- estructura general ---------- */
function render(keepScroll = true) {
  const u = state.getUser();
  if (!u || u.role !== "admin") return;
  const y = window.scrollY;
  const views = { home: dashboardView, products: productsView, sales: ordersView, customers: customersView, inventory: inventoryView, coupons: couponsView, reports: reportsView, config: configView, profile: () => profileView(u), edit: () => editView(u) };
  const notes = D.notifications();

  $("#adminRoot").innerHTML = `
    <header class="ad-topbar">
      <button class="ad-logo" data-act="nav" data-view="home">${LOGO_MARK}<span class="ad-brand">URBAN <b>VOGUE</b><small>STORE</small></span></button>
      <div class="ad-search">${icon("search", 20)}<input id="adSearch" placeholder="Buscar productos, pedidos, clientes..." autocomplete="off" value="${esc(ui.q)}"><div class="ad-search-res hidden" id="adSearchRes"></div></div>
      <div class="ad-top-right">
        <button class="ad-bell" data-act="bell" aria-label="Notificaciones">${icon("bell", 24)}${notes.length ? `<i>${Math.min(notes.length, 9)}${notes.length > 9 ? "+" : ""}</i>` : ""}</button>
        <button class="ad-chip" data-act="nav" data-view="profile"><span class="ad-chip-avatar">${icon("user", 22)}</span><div><b>Administrador</b><span class="ad-chip-line"></span></div>${icon("chev", 16)}</button>
        ${ui.bell ? `<div class="ad-notes"><h4>Notificaciones</h4>${notes.length ? notes.slice(0, 8).map((n) => `<button data-act="note-go" data-view="${n.view}" data-q="${esc(n.q)}">${esc(n.text)}</button>`).join("") : `<p>No hay notificaciones nuevas.</p>`}</div>` : ""}
      </div>
    </header>

    <aside class="ad-side">
      <nav>${NAV.map(([ic, label, v]) => `<button class="ad-nav ${v === ui.view ? "active" : ""}" data-act="nav" data-view="${v}">${icon(ic, 22)}${label}</button>`).join("")}</nav>
      <div class="ad-side-bottom">
        <button class="ad-side-user" data-act="nav" data-view="profile"><span class="ad-chip-avatar purple">${icon("user", 22)}</span><div><b>Administrador</b><small>${esc(u.email)}</small></div></button>
        <button class="ad-nav ad-nav-out" data-act="logout">${icon("logout", 22)}Cerrar sesión</button>
      </div>
    </aside>

    <section class="ad-main">${(views[ui.view] || dashboardView)()}</section>
    ${orderModal()}`;

  window.scrollTo(0, keepScroll ? y : 0);
}

/* ---------- búsqueda ---------- */
function searchResults(q) {
  q = q.trim().toLowerCase();
  if (!q) return [];
  const res = [];
  products.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 4).forEach((p) => res.push({ t: "Producto", text: p.name, view: "products", q: p.name }));
  D.getSales().filter((o) => o.number.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q)).slice(0, 4).forEach((o) => res.push({ t: "Pedido", text: `#${o.number} · ${o.customer.name}`, view: "sales", q: o.number }));
  D.customersFrom(D.getSales()).filter((c) => c.name.toLowerCase().includes(q) || (c.email || "").toLowerCase().includes(q)).slice(0, 3).forEach((c) => res.push({ t: "Cliente", text: c.name, view: "customers", q: c.name }));
  return res;
}
function showSearch(value) {
  const box = $("#adSearchRes");
  const res = searchResults(value);
  box.classList.toggle("hidden", !value.trim());
  box.innerHTML = res.length
    ? res.map((r) => `<button data-act="search-go" data-view="${r.view}" data-q="${esc(r.q)}"><small>${r.t}</small>${esc(r.text)}</button>`).join("")
    : `<p>Sin resultados</p>`;
}

/* ---------- eventos ---------- */
function go(view, q = "") {
  Object.assign(ui, { view, q, editProd: null, menuFor: null, modal: null, bell: false });
  render(false);
}

function onClick(e) {
  const el = e.target.closest("[data-act]");
  if (!el) {
    if (!e.target.closest(".ad-search")) $("#adSearchRes")?.classList.add("hidden");
    if (ui.menuFor || ui.bell) { ui.menuFor = null; ui.bell = false; render(); }
    return;
  }
  const d = el.dataset;
  switch (d.act) {
    case "nav": go(d.view); break;
    case "logout": state.logout(); toast("Sesión cerrada"); showHome(); window.location.hash = "#inicio"; break;
    case "bell": ui.bell = !ui.bell; ui.menuFor = null; render(); break;
    case "note-go": go(d.view, d.q); break;
    case "search-go": go(d.view, d.q); break;
    case "clear-q": ui.q = ""; render(); break;
    case "period": ui.period = Number(d.v); render(); break;
    case "inv-cat": ui.invCat = d.v; render(); break;
    case "prod-cat": ui.prodCat = d.v; render(); break;
    case "ord-status": ui.ordStatus = d.v; render(); break;
    case "order-view": ui.modal = { number: d.n }; ui.menuFor = null; render(); break;
    case "close-modal": if (e.target === el || el.tagName === "BUTTON") { ui.modal = null; render(); } break;
    case "order-menu": ui.menuFor = ui.menuFor === d.n ? null : d.n; render(); break;
    case "set-status": state.setOrderStatus(d.n, d.s); ui.menuFor = null; toast(`Pedido #${d.n}: ${d.s}`); render(); break;
    case "restock": state.adjustStock(Number(d.id), 10); toast("Reposición registrada: +10 unidades"); render(); break;
    case "prod-edit": ui.editProd = Number(d.id); render(); break;
    case "prod-cancel": ui.editProd = null; render(); break;
    case "prod-save": {
      const id = Number(d.id);
      const name = $(`#pe-name-${id}`).value.trim();
      const price = Number($(`#pe-price-${id}`).value);
      if (!name || !(price > 0)) return toast("Revisa el nombre y el precio");
      state.setProductOverride(id, { name, price });
      const p = D.productById(id); p.name = name; p.price = price;
      ui.editProd = null; toast("Producto actualizado"); render(); break;
    }
    case "admin-remove": if (confirm(`¿Quitar el acceso de administrador a ${d.email}?`) && state.removeAdmin(d.email)) { toast("Acceso de administrador retirado"); render(); } break;
    case "coupon-toggle": state.saveCoupons(state.getCoupons().map((c) => (c.code === d.code ? { ...c, active: !c.active } : c))); render(); break;
    case "coupon-del": state.saveCoupons(state.getCoupons().filter((c) => c.code !== d.code)); toast("Cupón eliminado"); render(); break;
    case "edit-profile": ui.view = "edit"; render(false); break;
    case "reset-data": if (confirm("¿Restablecer stock, estados, cupones y cambios de productos?")) { state.resetAdminData(); toast("Datos restablecidos. Recarga la página para ver los productos originales."); render(); } break;
    case "reset-orders": if (confirm("¿Borrar los pedidos reales hechos en la tienda?")) { state.resetAdminData({ orders: true }); toast("Pedidos reales borrados"); render(); } break;
  }
}

function onChange(e) {
  const sel = e.target.dataset.sel;
  if (!sel) return;
  if (sel === "metric") ui.metric = e.target.value;
  if (sel === "period") ui.period = Number(e.target.value);
  if (sel === "order-status") { state.setOrderStatus(e.target.dataset.n, e.target.value); toast(`Pedido #${e.target.dataset.n}: ${e.target.value}`); }
  render();
}

function onSubmit(e) {
  const form = e.target.dataset.form;
  if (!form) return;
  e.preventDefault();
  const f = new FormData(e.target);
  if (form === "profile") {
    state.updateProfile({ name: String(f.get("name")).trim(), email: String(f.get("email")).trim().toLowerCase() });
    toast("Perfil actualizado");
    ui.view = "profile"; render(false);
  } else if (form === "coupon") {
    const code = String(f.get("code")).trim().toUpperCase();
    if (state.getCoupons().some((c) => c.code === code)) return toast("Ese código ya existe");
    state.saveCoupons([{ code, type: f.get("type"), value: Number(f.get("value")), uses: 0, active: true }, ...state.getCoupons()]);
    toast("Cupón creado"); render();
  } else if (form === "admin") {
    const r = state.addAdmin({ name: String(f.get("name")).trim(), email: String(f.get("email")).trim().toLowerCase(), pass: String(f.get("pass")) });
    if (!r.ok) return toast("Ese correo ya es administrador");
    toast(r.promoted ? "La cuenta existente ahora es administradora" : "Administrador creado");
    render();
  } else if (form === "config") {
    state.setSettings({ low: Math.max(1, Number(f.get("low"))) });
    toast("Ajustes guardados"); render();
  }
}

function bind() {
  if (bound) return;
  bound = true;
  const root = $("#adminRoot");
  root.addEventListener("click", onClick);
  root.addEventListener("change", onChange);
  root.addEventListener("submit", onSubmit);
  root.addEventListener("input", (e) => { if (e.target.id === "adSearch") showSearch(e.target.value); });
  root.addEventListener("keydown", (e) => {
    if (e.target.id === "adSearch" && e.key === "Enter") { e.preventDefault(); $("#adSearchRes button")?.click(); }
  });
}
