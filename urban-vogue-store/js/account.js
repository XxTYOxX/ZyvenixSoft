import { $ } from "./dom.js";
import { toast } from "./toast.js";
import { state } from "./state.js";
import { toggleModal } from "./modal.js";
import { goToAdmin } from "./admin.js";

export function openAccount(mode = "login") {
  toggleModal("#accountModal", true);
  const user = state.getUser();

  if (user) {
    $("#accountContent").innerHTML = `
      <div class="user">
        <div class="mini dark">MI CUENTA</div>
        <h3>Hola, ${user.name}</h3>
        <p class="note">${user.email}</p>
        <button class="black-btn" data-action="logout">Cerrar sesión</button>
      </div>`;
    $("[data-action='logout']").addEventListener("click", () => {
      state.logout();
      openAccount("login");
      toast("Sesión cerrada");
    });
    return;
  }

  $("#accountContent").innerHTML = `
    <div class="tabs">
      <button class="${mode === "login" ? "active" : ""}" data-tab="login">Iniciar sesión</button>
      <button class="${mode === "register" ? "active" : ""}" data-tab="register">Registrarme</button>
    </div>
    ${
      mode === "login"
        ? `<form class="form" id="loginForm">
             <label>Correo electrónico</label><input type="email" id="email" required>
             <label>Contraseña</label><input type="password" id="pass" required>
             <button class="submit">Iniciar sesión</button>
           </form>
           <p class="note">Demo local para Visual Studio Code.</p>`
        : `<form class="form" id="registerForm">
             <label>Nombre completo</label><input id="name" required>
             <label>Correo electrónico</label><input type="email" id="newEmail" required>
             <label>Contraseña</label><input type="password" id="newPass" minlength="4" required>
             <button class="submit">Crear cuenta</button>
           </form>`
    }
  `;

  $("#accountContent")
    .querySelectorAll("[data-tab]")
    .forEach((btn) => btn.addEventListener("click", () => openAccount(btn.dataset.tab)));

  $("#loginForm")?.addEventListener("submit", handleLogin);
  $("#registerForm")?.addEventListener("submit", handleRegister);
}

async function handleRegister(e) {
  e.preventDefault();
  const name = $("#name").value.trim();
  const email = $("#newEmail").value.trim().toLowerCase();
  const pass = $("#newPass").value;

  const result = await state.register({ name, email, pass });
  if (!result.ok) {
    return toast(result.reason === "network" ? "No se pudo conectar con el backend" : "Ese correo ya está registrado");
  }

  toggleModal("#accountModal", false);
  toast("Cuenta creada correctamente");
}

async function handleLogin(e) {
  e.preventDefault();
  const email = $("#email").value.trim().toLowerCase();
  const pass = $("#pass").value;

  const result = await state.login(email, pass);
  if (!result.ok) {
    return toast(result.reason === "network" ? "No se pudo conectar con el backend" : "Datos incorrectos");
  }

  toggleModal("#accountModal", false);
  toast("Sesión iniciada");
  if (state.isAdmin()) goToAdmin();
}
