export function initNavigation() {
  const navItems = document.querySelectorAll(".bottom-nav .nav-item");
  const screens = document.querySelectorAll(".app-screen");
  const appTitle = document.getElementById("app-title");

  const showScreen = (screenId) => {
    const selectedItem = Array.from(navItems).find(
      (item) => item.dataset.screen === screenId,
    );
    const selectedScreen = document.getElementById(screenId);

    if (!selectedItem || !selectedScreen) {
      return false;
    }

    navItems.forEach((item) => {
      const isActive = item === selectedItem;
      item.classList.toggle("active", isActive);
      if (isActive) {
        item.setAttribute("aria-current", "page");
      } else {
        item.removeAttribute("aria-current");
      }
    });

    screens.forEach((screen) => {
      screen.classList.toggle("hidden", screen !== selectedScreen);
    });

    const label = selectedItem.querySelector(".nav-label")?.textContent?.trim();
    if (appTitle && label) {
      appTitle.textContent = label;
    }

    return true;
  };

  if (!navItems.length || !screens.length) {
    return;
  }

  const navigateTo = (screenId) => {
    if (!showScreen(screenId)) {
      return;
    }
    if (window.location.hash !== `#${screenId}`) {
      window.location.hash = screenId;
    }
  };

  navItems.forEach((item) => {
    item.addEventListener("click", () => navigateTo(item.dataset.screen));
  });

  document.querySelectorAll("[data-go-to]").forEach((button) => {
    button.addEventListener("click", () => navigateTo(button.dataset.goTo));
  });

  window.addEventListener("hashchange", () => {
    showScreen(window.location.hash.slice(1) || "home");
  });

  const requestedScreen = window.location.hash.slice(1) || "home";
  showScreen(requestedScreen) || showScreen("home");

  const contactForm = document.getElementById("contact-form");
  const contactStatus = document.getElementById("contact-status");
  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (contactForm.reportValidity() && contactStatus) {
      contactStatus.textContent =
        "A mensagem está preenchida, mas o envio ainda não está disponível. Tente novamente mais tarde.";
    }
  });
}
