import { initNavigation } from "./modules/UI.js";

document.addEventListener("DOMContentLoaded", () => {
  // Inicializar o sistema de navegação entre ecrãs
  initNavigation();

  const loginForm = document.getElementById("login-form");
  const loginStatus = document.getElementById("login-status");
  loginForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");

    if (email !== "teste@teste.pt" || password !== "teste123") {
      if (loginStatus) {
        loginStatus.textContent =
          "E-mail ou palavra-passe incorretos. Utilize a conta de demonstração apresentada.";
      }
      return;
    }

    window.location.assign("home.html");
  });

  // Registar o Service Worker para suporte PWA offline
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register(new URL("../../sw.js", import.meta.url))
        .then((registration) => {
          console.log(
            "Service Worker registado com sucesso sob o escopo:",
            registration.scope,
          );
        })
        .catch((error) => {
          console.error("Falha ao registar o Service Worker:", error);
        });
    });
  }
});
