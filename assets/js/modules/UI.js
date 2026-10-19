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

  const searchInput = document.getElementById("catalogue-search");
  const categoryFilters = document.querySelectorAll(".pill[data-filter]");
  const plantCards = document.querySelectorAll(".plant-card");
  const emptyState = document.getElementById("catalogue-empty");
  let activeCategory = "todas";

  const filterPlants = () => {
    const query = searchInput?.value.trim().toLocaleLowerCase("pt-PT") || "";
    let visibleCount = 0;

    plantCards.forEach((card) => {
      const matchesCategory =
        activeCategory === "todas" || card.dataset.category === activeCategory;
      const matchesSearch = (card.dataset.name || "")
        .toLocaleLowerCase("pt-PT")
        .includes(query);
      const isVisible = matchesCategory && matchesSearch;

      card.classList.toggle("hidden", !isVisible);
      visibleCount += Number(isVisible);
    });

    emptyState?.classList.toggle("hidden", visibleCount > 0);
  };

  searchInput?.addEventListener("input", filterPlants);
  categoryFilters.forEach((filter) => {
    filter.addEventListener("click", () => {
      activeCategory = filter.dataset.filter || "todas";
      categoryFilters.forEach((button) => {
        const isActive = button === filter;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });
      filterPlants();
    });
  });

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
