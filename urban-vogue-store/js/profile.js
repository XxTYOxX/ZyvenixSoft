import { $, $$ } from "./dom.js";
import { state } from "./state.js";
import { toast } from "./toast.js";
import { showHome, showPage } from "./pages.js";
import { money } from "./format.js";
import { goToAdmin } from "./admin.js";

function avatarUrl(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "U")}&background=111111&color=ffffff&size=128&bold=true`;
}

export function goToProfile(section) {
  if (state.isAdmin()) return goToAdmin();
  renderProfileHome();
  showPage("page-perfil");
  if (section === "orders") renderOrders();
  else if (section === "notif") renderNotifications();
  else if (section === "security") renderSecurity();
}

function backButton() {
  return `<button class="profile-back" id="backToProfile">‹ Volver al perfil</button>`;
}
function wireBack() {
  $("#backToProfile").addEventListener("click", renderProfileHome);
}

function renderProfileHome() {
  const user = state.getUser();
  if (!user) return;

  $("#perfilContent").innerHTML = `
    <div class="profile-card">
      <div class="profile-top">
        <img class="avatar" src="${avatarUrl(user.name)}" alt="">
        <div class="profile-id">
          <strong>${user.name}</strong>
          <span>${user.email}</span>
        </div>
        <button class="outline-btn" id="editProfileBtn">Editar perfil</button>
      </div>
      <div class="profile-list">
        <button class="profile-row" data-row="orders">
          <span class="row-icon">🧾</span>
          <span class="row-text"><b>Mis pedidos</b><small>Historial y seguimiento de compras</small></span>
          <span class="chev">›</span>
        </button>
        <button class="profile-row" data-row="notif">
          <span class="row-icon">🔔</span>
          <span class="row-text"><b>Notificaciones</b><small>Preferencias de ofertas, pedidos y novedades</small></span>
          <span class="chev">›</span>
        </button>
        <button class="profile-row" data-row="security">
          <span class="row-icon">🛡</span>
          <span class="row-text"><b>Seguridad</b><small>Contraseña, acceso y privacidad de tu cuenta</small></span>
          <span class="chev">›</span>
        </button>
        <button class="profile-row danger" data-row="logout">
          <span class="row-icon">⏻</span>
          <span class="row-text"><b>Cerrar sesión</b><small>Salir de tu cuenta de Urban Vogue</small></span>
          <span class="chev">›</span>
        </button>
      </div>
    </div>
  `;

  $("#editProfileBtn").addEventListener("click", renderEditProfile);
  $$(".profile-row").forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.dataset.row;
      if (row === "orders") renderOrders();
      else if (row === "notif") renderNotifications();
      else if (row === "security") renderSecurity();
      else if (row === "logout") {
        state.logout();
        toast("Sesión cerrada");
        showHome();
      }
    });
  });
}

function renderEditProfile() {
  const user = state.getUser();
  $("#perfilContent").innerHTML = `
    <div class="profile-card">
      ${backButton()}
      <h3 class="section-title">Editar perfil</h3>
      <form class="form" id="editProfileForm">
        <label>Nombre completo</label><input id="editName" value="${user.name}" required>
        <label>Correo electrónico</label><input type="email" id="editEmail" value="${user.email}" required>
        <button class="submit">Guardar cambios</button>
      </form>
    </div>
  `;
  wireBack();
  $("#editProfileForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#editName").value.trim();
    const email = $("#editEmail").value.trim().toLowerCase();
    state.updateProfile({ name, email });
    toast("Perfil actualizado");
    renderProfileHome();
  });
}

function renderNotifications() {
  const prefs = state.getNotifPrefs();
  const rows = [
    { key: "pedidos", label: "Pedidos", note: "Actualizaciones de tus compras y envíos" },
    { key: "ofertas", label: "Ofertas", note: "Descuentos y promociones exclusivas" },
    { key: "novedades", label: "Novedades", note: "Nuevas colecciones y lanzamientos" },
  ];

  $("#perfilContent").innerHTML = `
    <div class="profile-card">
      ${backButton()}
      <h3 class="section-title">Notificaciones</h3>
      ${rows
        .map(
          (r) => `
        <div class="notif-toggle">
          <div><b>${r.label}</b><small>${r.note}</small></div>
          <label class="switch">
            <input type="checkbox" data-key="${r.key}" ${prefs[r.key] ? "checked" : ""}>
            <span></span>
          </label>
        </div>`
        )
        .join("")}
    </div>
  `;
  wireBack();
  $$("[data-key]").forEach((input) => {
    input.addEventListener("change", () => {
      state.setNotifPrefs({ [input.dataset.key]: input.checked });
      toast("Preferencias guardadas");
    });
  });
}

function renderSecurity() {
  $("#perfilContent").innerHTML = `
    <div class="profile-card">
      ${backButton()}
      <h3 class="section-title">Seguridad</h3>
      <form class="form" id="passForm">
        <label>Contraseña actual</label><input type="password" id="curPass" required>
        <label>Nueva contraseña</label><input type="password" id="newPass2" minlength="4" required>
        <button class="submit">Actualizar contraseña</button>
      </form>
    </div>
  `;
  wireBack();
  $("#passForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const cur = $("#curPass").value;
    const next = $("#newPass2").value;
    const result = state.changePassword(cur, next);
    if (!result.ok) return toast("Contraseña actual incorrecta");
    toast("Contraseña actualizada");
    $("#passForm").reset();
  });
}

function renderOrders() {
  const orders = state.getOrders();
  $("#perfilContent").innerHTML = `
    <div class="profile-card">
      ${backButton()}
      <h3 class="section-title">Mis pedidos</h3>
      ${
        orders.length
          ? orders
              .map(
                (o) => `
        <div class="order-card">
          <div class="order-head"><span>Pedido <b>#${o.number}</b></span><span>${new Date(o.date).toLocaleDateString("es-ES")}</span></div>
          <div class="order-items">${o.items.map((i) => `${i.qty} × ${i.name}`).join("<br>")}</div>
          <div class="order-total">${money(o.total)}</div>
        </div>`
              )
              .join("")
          : `<p class="order-empty">Todavía no tienes pedidos.</p>`
      }
    </div>
  `;
  wireBack();
}
