// Bootstrap desde npm (sin CDN)
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./style.css";

/* =============================
   CONFIG
============================= */
const API_BASE = "https://exercise1-iot.onrender.com"; // tu API
/*
const ENDPOINTS = {
  status: `${API_BASE}/status`,
  on: `${API_BASE}/turn-on`,
  off: `${API_BASE}/turn-off`,
};*/

// Login simulado:
const DEMO_EMAIL = "ejemplo@hotmail.com";
const DEMO_PASS = "123456";
const TOKEN_KEY = "token_demo";

/* =============================
   AUTH HELPERS
============================= */
const isAuthenticated = () => Boolean(localStorage.getItem(TOKEN_KEY));
const login = () => localStorage.setItem(TOKEN_KEY, "FAKE_TOKEN");
const logout = () => localStorage.removeItem(TOKEN_KEY);
const getToken = () => localStorage.getItem(TOKEN_KEY);

/* =============================
   DOM REFS
============================= */
const loginView = document.querySelector("#loginView");
const dashboardView = document.querySelector("#dashboardView");
const lightView = document.querySelector("#lightView");

const loginForm = document.querySelector("#loginForm");
const emailInput = document.querySelector("#email");
const passInput = document.querySelector("#password");
const loginError = document.querySelector("#loginError");

const loginBtn = document.querySelector("#loginBtn");
const logoutBtn = document.querySelector("#logoutBtn");
const userEmailSpan = document.querySelector("#userEmail");

const links = Array.from(document.querySelectorAll("[data-view]"));

const lightBulb = document.querySelector("#lightBulb");
const lightText = document.querySelector("#lightStateText");
const lightError = document.querySelector("#lightError");
const lightStatusBadge = document.querySelector("#lightStatusBadge");
const btnOn = document.querySelector("#btnOn");
const btnOff = document.querySelector("#btnOff");

/* =============================
   UI STATE
============================= */
function showView(view) {
  // Oculta todas
  loginView.classList.add("d-none");
  dashboardView.classList.add("d-none");
  lightView.classList.add("d-none");

  // Rutas protegidas
  if (!isAuthenticated() && (view === "dashboard" || view === "light")) {
    loginView.classList.remove("d-none");
    return;
  }
  if (view === "login") loginView.classList.remove("d-none");
  if (view === "dashboard") dashboardView.classList.remove("d-none");
  if (view === "light") {
    lightView.classList.remove("d-none");
    // cada vez que entras al control, refresca estado
    getStatus();
  }
}

function updateNav() {
  if (isAuthenticated()) {
    userEmailSpan.textContent =
      localStorage.getItem("last_email") || DEMO_EMAIL;
    userEmailSpan.classList.remove("d-none");
    loginBtn.classList.add("d-none");
    logoutBtn.classList.remove("d-none");
  } else {
    userEmailSpan.textContent = "";
    userEmailSpan.classList.add("d-none");
    loginBtn.classList.remove("d-none");
    logoutBtn.classList.add("d-none");
  }
}

/* =============================
   EVENTOS GENERALES
============================= */
links.forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const view = a.getAttribute("data-view");
    // activa visualmente el link
    links.forEach((l) => l.classList.remove("active"));
    a.classList.add("active");
    showView(view);
  });
});

loginBtn.addEventListener("click", () => showView("login"));

logoutBtn.addEventListener("click", () => {
  logout();
  updateNav();
  // vuelve a login
  links.forEach((l) => l.classList.remove("active"));
  showView("login");
});

/* =============================
   LOGIN (SIMULADO)
============================= */
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  loginError.classList.add("d-none");

  const email = emailInput.value.trim();
  const pass = passInput.value;

  if (email === DEMO_EMAIL && pass === DEMO_PASS) {
    login();
    localStorage.setItem("last_email", email);
    updateNav();
    // navega al dashboard
    links.forEach((l) => l.classList.remove("active"));
    document.querySelector('[data-view="dashboard"]').classList.add("active");
    showView("dashboard");
  } else {
    loginError.textContent = "Credenciales inválidas";
    loginError.classList.remove("d-none");
  }
});

/* =============================
   CONTROL FOCO (API)
============================= */
function renderLight(state) {
  const isOn = state === "on" || state === true;
  if (isOn) {
    lightBulb.classList.add("bulb-on");
    lightBulb.classList.remove("bulb-off");
    lightText.textContent = "Encendido";
    lightStatusBadge.className = "badge text-bg-success";
    lightStatusBadge.textContent = "Encendido";
  } else {
    lightBulb.classList.add("bulb-off");
    lightBulb.classList.remove("bulb-on");
    lightText.textContent = "Apagado";
    lightStatusBadge.className = "badge text-bg-secondary";
    lightStatusBadge.textContent = "Apagado";
  }
}

async function getStatus() {
  try {
    lightError.classList.add("d-none");
    const res = await fetch("https://exercise1-iot.onrender.com/status", {
      headers: authHeaders(),
    });
    // Suponiendo { status: "on" } / { status: "off" }
    const data = await res.json();
    renderLight(data.status);
  } catch (err) {
    console.error("Error al obtener estado:", err);
    lightError.textContent = "No se pudo obtener el estado del foco";
    lightError.classList.remove("d-none");
  }
}

async function turnOn() {
  try {
    lightError.classList.add("d-none");
    await fetch("https://exercise1-iot.onrender.com/turn-on", {
      method: "POST",
      headers: authHeaders(),
    });
    renderLight("on");
  } catch (err) {
    console.error("Error al encender:", err);
    lightError.textContent = "No se pudo encender el foco";
    lightError.classList.remove("d-none");
  }
}

async function turnOff() {
  try {
    lightError.classList.add("d-none");
    await fetch("https://exercise1-iot.onrender.com/turn-off", {
      method: "POST",
      headers: authHeaders(),
    });
    renderLight("off");
  } catch (err) {
    console.error("Error al apagar:", err);
    lightError.textContent = "No se pudo apagar el foco";
    lightError.classList.remove("d-none");
  }
}

// Si tu backend pide Authorization, la enviamos.
// En este demo, solo se agrega si hay token.
function authHeaders() {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

btnOn.addEventListener("click", turnOn);
btnOff.addEventListener("click", turnOff);

/* =============================
   INICIALIZACIÓN
============================= */
updateNav();
// al cargar, muestra login o dashboard según token
showView(isAuthenticated() ? "dashboard" : "login");
