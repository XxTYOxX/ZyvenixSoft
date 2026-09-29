import { API_BASE } from "./config.js";

const CART_KEY = "uv_cart";
const FAVS_KEY = "uv_favs";
const USER_KEY = "uv_user";
const USERS_KEY = "uv_users";
const ORDERS_KEY = "uv_orders";
const NOTIF_KEY = "uv_notifications";
const STOCK_KEY = "uv_stock_adj";
const ORDST_KEY = "uv_order_status";
const COUPONS_KEY = "uv_coupons";
const PROD_KEY = "uv_product_overrides";
const SET_KEY = "uv_settings";
const DEFAULT_COUPONS = [
  { code: "BIENVENIDO10", type: "percent", value: 10, uses: 42, active: true },
  { code: "URBAN20", type: "percent", value: 20, uses: 18, active: true },
  { code: "VOGUE15000", type: "fixed", value: 15000, uses: 11, active: false },
];

let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
let favs = JSON.parse(localStorage.getItem(FAVS_KEY) || "[]");
let user = JSON.parse(localStorage.getItem(USER_KEY) || "null");
let orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
let notifPrefs = JSON.parse(localStorage.getItem(NOTIF_KEY) || "null") || {
  pedidos: true,
  ofertas: true,
  novedades: false,
};
let stockAdj = JSON.parse(localStorage.getItem(STOCK_KEY) || "{}");
let orderStatus = JSON.parse(localStorage.getItem(ORDST_KEY) || "{}");
let coupons = JSON.parse(localStorage.getItem(COUPONS_KEY) || "null") || DEFAULT_COUPONS;
let settings = { low: 5, ...JSON.parse(localStorage.getItem(SET_KEY) || "{}") };
let filter = "Todos";

// Cuenta de administrador de demostración (se crea sola la primera vez).
// Cambia aquí el correo o la contraseña si quieres otros datos.
const ADMIN_ACCOUNT = {
  name: "Alexander Jiménez",
  email: "alexander@urbanboguestore.com",
  pass: "admin123",
  role: "admin",
  created: "2026-09-10T00:00:00.000Z",
};

function ensureAdmin() {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  // Siempre deja la cuenta de administrador lista (aunque el correo ya existiera como cliente).
  const i = users.findIndex((u) => u.email === ADMIN_ACCOUNT.email);
  if (i === -1) users.push(ADMIN_ACCOUNT);
  else users[i] = { ...users[i], ...ADMIN_ACCOUNT, lastAccess: users[i].lastAccess };
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
ensureAdmin();

function persistCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function persistFavs() {
  localStorage.setItem(FAVS_KEY, JSON.stringify(favs));
}
function persistUser() {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}
function persistOrders() {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}
function persistNotif() {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(notifPrefs));
}

export const state = {
  // lectura
  getCart: () => cart,
  getFavs: () => favs,
  getUser: () => user,
  getFilter: () => filter,
  isFavorite: (id) => favs.includes(id),
  isAdmin: () => user?.role === "admin",

  // filtro de categoría
  setFilter(value) {
    filter = value;
  },

  // carrito
  addToCart(id) {
    const item = cart.find((i) => i.id === id);
    item ? item.qty++ : cart.push({ id, qty: 1 });
    persistCart();
  },
  changeQty(id, delta) {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty < 1) cart = cart.filter((i) => i.id !== id);
    persistCart();
  },
  removeFromCart(id) {
    cart = cart.filter((i) => i.id !== id);
    persistCart();
  },
  clearCart() {
    cart = [];
    persistCart();
  },

  // favoritos
  toggleFavorite(id) {
    favs = favs.includes(id) ? favs.filter((x) => x !== id) : [...favs, id];
    persistFavs();
    return favs.includes(id);
  },

  // cuenta (conectada al backend real; también se refleja en este navegador
  // para que el panel de administrador siga mostrando clientes y accesos)
  async register({ name, email, pass }) {
    let created = new Date().toISOString();
    try {
      const res = await fetch(`${API_BASE}/auth/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: name, email, password: pass }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { ok: false, reason: err.error ? "exists" : "network" };
      }
      const data = await res.json();
      created = data.creado || created;
    } catch (err) {
      return { ok: false, reason: "network" };
    }

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    if (!users.some((u) => u.email === email)) {
      users.push({ name, email, pass, role: "cliente", created });
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    user = { name, email, role: "cliente", created };
    persistUser();
    return { ok: true };
  },
  async login(email, pass) {
    let data;
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });
      if (!res.ok) return { ok: false };
      data = await res.json();
    } catch (err) {
      return { ok: false, reason: "network" };
    }

    const role = data.rol === "admin" ? "admin" : "cliente";
    const lastAccess = new Date().toISOString();
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const idx = users.findIndex((u) => u.email === email);
    const entry = { name: data.nombre, email: data.email, pass, role, created: data.creado, lastAccess };
    if (idx > -1) users[idx] = { ...users[idx], ...entry };
    else users.push(entry);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    user = { name: data.nombre, email: data.email, role, created: data.creado, lastAccess };
    persistUser();
    return { ok: true };
  },
  logout() {
    user = null;
    persistUser();
  },
  updateProfile({ name, email }) {
    if (!user) return { ok: false };
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const idx = users.findIndex((u) => u.email === user.email);
    if (idx > -1) {
      users[idx].name = name;
      users[idx].email = email;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    user = { ...user, name, email };
    persistUser();
    return { ok: true };
  },
  changePassword(current, next) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const idx = users.findIndex((u) => u.email === user?.email);
    if (idx === -1 || users[idx].pass !== current) return { ok: false };
    users[idx].pass = next;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return { ok: true };
  },

  // pedidos
  getOrders: () => orders,
  addOrder(data) {
    const order = {
      number: "UV-" + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toISOString(),
      ...data,
    };
    orders = [order, ...orders];
    persistOrders();
    return order;
  },

  // inventario (ajustes de reposición hechos desde el panel de administrador)
  getStockAdj: () => stockAdj,
  adjustStock(id, delta) {
    stockAdj = { ...stockAdj, [id]: (stockAdj[id] || 0) + delta };
    localStorage.setItem(STOCK_KEY, JSON.stringify(stockAdj));
  },

  // panel de administrador: estados de pedidos, cupones, ajustes y ediciones de productos
  getOrderStatus: () => orderStatus,
  setOrderStatus(number, status) {
    orderStatus = { ...orderStatus, [number]: status };
    localStorage.setItem(ORDST_KEY, JSON.stringify(orderStatus));
  },
  getCoupons: () => coupons,
  saveCoupons(list) {
    coupons = list;
    localStorage.setItem(COUPONS_KEY, JSON.stringify(coupons));
  },
  getSettings: () => settings,
  setSettings(next) {
    settings = { ...settings, ...next };
    localStorage.setItem(SET_KEY, JSON.stringify(settings));
  },
  setProductOverride(id, data) {
    const all = JSON.parse(localStorage.getItem(PROD_KEY) || "{}");
    all[id] = { ...(all[id] || {}), ...data };
    localStorage.setItem(PROD_KEY, JSON.stringify(all));
  },
  resetAdminData({ orders = false } = {}) {
    [STOCK_KEY, ORDST_KEY, COUPONS_KEY, PROD_KEY, SET_KEY].forEach((k) => localStorage.removeItem(k));
    if (orders) localStorage.removeItem(ORDERS_KEY);
  },

  // cuentas de administrador
  isMainAdmin: (email) => email === ADMIN_ACCOUNT.email,
  addAdmin({ name, email, pass }) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const found = users.find((u) => u.email === email);
    if (found?.role === "admin") return { ok: false, reason: "exists" };
    if (found) found.role = "admin"; // cuenta de cliente que pasa a administrador
    else users.push({ name, email, pass, role: "admin", created: new Date().toISOString() });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return { ok: true, promoted: Boolean(found) };
  },
  removeAdmin(email) {
    if (email === ADMIN_ACCOUNT.email || email === user?.email) return false;
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const found = users.find((u) => u.email === email);
    if (!found) return false;
    found.role = "cliente";
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  },

  // usuarios registrados (sin contraseñas)
  getUsers: () =>
    JSON.parse(localStorage.getItem(USERS_KEY) || "[]").map(({ pass, ...u }) => u),

  // preferencias de notificaciones
  getNotifPrefs: () => notifPrefs,
  setNotifPrefs(prefs) {
    notifPrefs = { ...notifPrefs, ...prefs };
    persistNotif();
  },
};
