import { initNavigation } from "./modules/UI.js";

document.addEventListener("DOMContentLoaded", () => {
  // Inicializar o sistema de navegação entre ecrãs
  initNavigation();

  // Registar o Service Worker para suporte PWA offline
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
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
