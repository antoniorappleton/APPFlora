export function initNavigation() {
  const navItems = document.querySelectorAll(".bottom-nav .nav-item");
  const screens = document.querySelectorAll(".app-screen");
  const appTitle = document.getElementById("app-title");

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      // 1. Remover classe ativa de todos os botões de navegação
      navItems.forEach((btn) => btn.classList.remove("active"));

      // 2. Adicionar classe ativa ao botão clicado
      item.classList.add("active");

      // 3. Esconder todos os ecrãs
      screens.forEach((screen) => screen.classList.add("hidden"));

      // 4. Mostrar o ecrã correspondente
      const targetScreenId = item.getAttribute("data-screen");
      const targetScreen = document.getElementById(targetScreenId);
      if (targetScreen) {
        targetScreen.classList.remove("hidden");
      }

      // 5. Atualizar o título do cabeçalho de acordo com a aba ativa
      const label = item.querySelector(".nav-label").textContent;
      appTitle.textContent = label;
    });
  });
}
