const DASHBOARD_PASSWORD_HASH = "b86b9e8b7aff76d9e2dc99c9714eeb96f5667f62982540a4350cb4f8011adb47";
const AUTH_SESSION_KEY = "cpd_dashboard_auth";

async function sha256Hex(value) {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");
}

function unlockDashboard() {
  document.body.classList.remove("auth-locked");
  const screen = document.getElementById("authScreen");
  if (screen) screen.remove();
}

if (sessionStorage.getItem(AUTH_SESSION_KEY) === "ok") {
  unlockDashboard();
}

document.getElementById("authForm").addEventListener("submit", async event => {
  event.preventDefault();

  const input = document.getElementById("authPassword");
  const error = document.getElementById("authError");
  const hash = await sha256Hex(input.value);

  if (hash === DASHBOARD_PASSWORD_HASH) {
    sessionStorage.setItem(AUTH_SESSION_KEY, "ok");
    unlockDashboard();
    return;
  }

  error.textContent = "Sai mật khẩu. Vui lòng thử lại.";
  input.value = "";
  input.focus();
});
