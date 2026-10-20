import {
  addRoutine,
  deletePlant,
  deleteRoutine,
  getGarden,
  getPlants,
  isInGarden,
  savePlant,
  toggleGardenPlant,
} from "../db.js";

const categories = {
  interior: "Interior",
  exterior: "Exterior",
  suculentas: "Suculentas",
};

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  element.className = className;
  if (text !== undefined) {
    element.textContent = text;
  }
  return element;
}

function createButton(label, action, className = "plant-action") {
  const button = createElement("button", className, label);
  button.type = "button";
  button.dataset.action = action;
  return button;
}

function localDateString() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

function safeImageSource(source) {
  if (!source) {
    return "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80";
  }
  try {
    const url = new URL(source);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.href
      : "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80";
  } catch {
    return "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80";
  }
}

function showStatus(message, isError = false) {
  document.querySelectorAll("[data-app-status]").forEach((status) => {
    status.textContent = message;
    status.classList.toggle("text-error", isError);
  });
}

function persistChange(change) {
  try {
    change();
    showStatus("");
    renderPlants();
    renderGarden();
    return true;
  } catch (error) {
    console.error("Não foi possível guardar as alterações:", error);
    showStatus(
      "Não foi possível guardar as alterações. Verifique o armazenamento do navegador e tente novamente.",
      true,
    );
    return false;
  }
}

function makePlantCard(plant) {
  const card = createElement(
    "article",
    "plant-card group rounded-[1.5rem] overflow-hidden bg-surface-container-lowest soft-elevation border border-outline-variant/30",
  );
  card.dataset.id = plant.id;
  card.dataset.category = plant.category;
  card.dataset.name = `${plant.name} ${plant.description}`;

  const imageWrap = createElement("div", "relative aspect-[4/3] overflow-hidden");
  const image = createElement(
    "img",
    "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
  );
  image.src = safeImageSource(plant.image);
  image.alt = `Imagem de ${plant.name}`;
  image.loading = "lazy";
  imageWrap.append(image);

  const badge = createElement(
    "span",
    "absolute top-3 left-3 bg-white/90 text-primary text-[11px] uppercase tracking-widest font-semibold px-3 py-1 rounded-full",
    categories[plant.category],
  );
  imageWrap.append(badge);

  const content = createElement("div", "p-5");
  content.append(
    createElement(
      "h3",
      "font-headline-md text-headline-md text-on-background mb-1",
      plant.name,
    ),
    createElement("p", "text-on-surface-variant text-sm", plant.description),
  );

  const actions = createElement("div", "mt-5 flex flex-wrap gap-2");
  const selected = isInGarden(plant.id);
  const gardenButton = createButton(
    selected ? "Remover do meu jardim" : "Adicionar ao meu jardim",
    "toggle-garden",
    "rounded-full px-4 py-2 text-sm font-semibold " +
      (selected ? "bg-surface-container text-primary" : "bg-primary text-white"),
  );
  gardenButton.dataset.plantId = plant.id;
  actions.append(
    gardenButton,
    createButton("Editar", "edit-plant", "plant-action"),
    createButton("Eliminar", "delete-plant", "plant-action text-error"),
  );
  content.append(actions);
  card.append(imageWrap, content);
  return card;
}

function applyFilters() {
  const searchInput = document.getElementById("catalogue-search");
  const activeFilter = document.querySelector(".pill[data-filter].active");
  const query = searchInput?.value.trim().toLocaleLowerCase("pt-PT") || "";
  const category = activeFilter?.dataset.filter || "todas";
  let visibleCount = 0;

  document.querySelectorAll("#plant-grid .plant-card").forEach((card) => {
    const matchesCategory =
      category === "todas" || card.dataset.category === category;
    const matchesSearch = (card.dataset.name || "")
      .toLocaleLowerCase("pt-PT")
      .includes(query);
    const visible = matchesCategory && matchesSearch;
    card.classList.toggle("hidden", !visible);
    visibleCount += Number(visible);
  });
  document.getElementById("catalogue-empty")?.classList.toggle("hidden", visibleCount > 0);
}

function renderPlants() {
  const grid = document.getElementById("plant-grid");
  if (!grid) {
    return;
  }
  grid.replaceChildren(...getPlants().map(makePlantCard));
  applyFilters();
}

function makeRoutineForm(plantId) {
  const form = document.createElement("form");
  form.className = "routine-form mt-4 grid gap-3 rounded-xl bg-surface-container-low p-4";
  form.dataset.plantId = plantId;

  const typeLabel = createElement("label", "grid gap-1 text-sm font-medium", "Cuidado");
  const type = document.createElement("select");
  type.name = "type";
  type.required = true;
  type.className = "rounded-lg border-outline-variant bg-white";
  [
    ["rega", "Rega"],
    ["fertilizacao", "Fertilização"],
    ["poda", "Poda"],
    ["limpeza", "Limpeza das folhas"],
    ["outro", "Outro cuidado"],
  ].forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    type.append(option);
  });
  typeLabel.append(type);

  const intervalLabel = createElement("label", "grid gap-1 text-sm font-medium", "Repetir a cada (dias)");
  const interval = document.createElement("input");
  interval.name = "intervalDays";
  interval.type = "number";
  interval.min = "1";
  interval.max = "365";
  interval.value = "7";
  interval.required = true;
  interval.className = "rounded-lg border-outline-variant";
  intervalLabel.append(interval);

  const dateLabel = createElement("label", "grid gap-1 text-sm font-medium", "Próxima data");
  const date = document.createElement("input");
  date.name = "nextDate";
  date.type = "date";
  date.value = localDateString();
  date.required = true;
  date.className = "rounded-lg border-outline-variant";
  dateLabel.append(date);

  const noteLabel = createElement("label", "grid gap-1 text-sm font-medium", "Notas (opcional)");
  const note = document.createElement("input");
  note.name = "notes";
  note.type = "text";
  note.maxLength = 160;
  note.placeholder = "Ex.: verificar se a terra está seca";
  note.className = "rounded-lg border-outline-variant";
  noteLabel.append(note);

  const submit = createElement(
    "button",
    "w-fit rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white",
    "Guardar rotina",
  );
  submit.type = "submit";
  const cancel = createButton("Cancelar", "cancel-routine", "plant-action w-fit");
  form.append(typeLabel, intervalLabel, dateLabel, noteLabel, submit, cancel);
  return form;
}

function renderGarden() {
  const grid = document.getElementById("garden-grid");
  const empty = document.getElementById("garden-empty");
  const garden = getGarden();
  if (!grid || !empty) {
    return;
  }
  const plantById = new Map(getPlants().map((plant) => [plant.id, plant]));
  const entries = garden.filter((entry) => plantById.has(entry.plantId));
  empty.classList.toggle("hidden", entries.length > 0);
  grid.replaceChildren();

  entries.forEach((entry) => {
    const plant = plantById.get(entry.plantId);
    const card = createElement(
      "article",
      "rounded-[1.5rem] bg-surface-container-lowest p-5 soft-elevation border border-outline-variant/30",
    );
    const heading = createElement("div", "flex items-start gap-4");
    const image = createElement("img", "h-20 w-20 rounded-xl object-cover");
    image.src = safeImageSource(plant.image);
    image.alt = "";
    image.loading = "lazy";
    const details = createElement("div", "min-w-0 flex-1");
    details.append(
      createElement("h3", "font-headline-md text-headline-md", plant.name),
      createElement("p", "mt-1 text-sm text-on-surface-variant", categories[plant.category]),
    );
    const addRoutine = createButton(
      "Criar rotina",
      "add-routine",
      "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white",
    );
    addRoutine.dataset.plantId = plant.id;
    details.append(addRoutine);
    heading.append(image, details);
    card.append(heading);

    const routineList = createElement("div", "mt-5 space-y-3");
    if (!entry.routines.length) {
      routineList.append(
        createElement("p", "text-sm text-on-surface-variant", "Ainda não criou rotinas para esta planta."),
      );
    }
    entry.routines.forEach((routine) => {
      const row = createElement("div", "flex items-start justify-between gap-3 border-t border-outline-variant/40 pt-3");
      const info = createElement("div", "text-sm");
      const routineName = routine.type === "rega"
        ? "Rega"
        : routine.type === "fertilizacao"
          ? "Fertilização"
          : routine.type === "poda"
            ? "Poda"
            : routine.type === "limpeza"
              ? "Limpeza das folhas"
              : "Outro cuidado";
      info.append(
        createElement("p", "font-semibold text-on-background", routineName),
        createElement(
          "p",
          "text-on-surface-variant",
          `A cada ${routine.intervalDays} dias · Próxima: ${new Date(`${routine.nextDate}T00:00:00`).toLocaleDateString("pt-PT")}`,
        ),
      );
      if (routine.notes) {
        info.append(createElement("p", "mt-1 text-on-surface-variant", routine.notes));
      }
      const remove = createButton("Eliminar", "delete-routine", "plant-action text-error");
      remove.dataset.plantId = plant.id;
      remove.dataset.routineId = routine.id;
      row.append(info, remove);
      routineList.append(row);
    });
    card.append(routineList);
    grid.append(card);
  });
  document.getElementById("garden-count").textContent = String(entries.length);
}

function openPlantDialog(plant) {
  const dialog = document.getElementById("plant-dialog");
  const form = document.getElementById("plant-form");
  form.reset();
  form.elements.namedItem("id").value = plant?.id || "";
  form.elements.namedItem("name").value = plant?.name || "";
  form.elements.namedItem("category").value = plant?.category || "interior";
  form.elements.namedItem("description").value = plant?.description || "";
  form.elements.namedItem("image").value = plant?.image || "";
  document.getElementById("plant-dialog-title").textContent = plant
    ? "Editar planta"
    : "Adicionar planta";
  dialog.showModal();
  form.elements.namedItem("name").focus();
}

export function initPlantManagement() {
  if (!document.getElementById("plant-grid")) {
    return;
  }

  renderPlants();
  renderGarden();

  document.getElementById("add-plant-button").addEventListener("click", () => {
    openPlantDialog();
  });
  document.querySelector("[data-close-dialog]").addEventListener("click", (event) => {
    event.currentTarget.closest("dialog").close();
  });

  document.getElementById("plant-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) {
      return;
    }
    const data = new FormData(form);
    const saved = persistChange(() => {
      savePlant({
        id: String(data.get("id") || ""),
        name: String(data.get("name") || "").trim(),
        category: String(data.get("category") || ""),
        description: String(data.get("description") || "").trim(),
        image: String(data.get("image") || "").trim(),
      });
    });
    if (saved) {
      form.closest("dialog").close();
    }
  });

  document.getElementById("plant-grid").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) {
      return;
    }
    const card = button.closest(".plant-card");
    const plant = getPlants().find((item) => item.id === card?.dataset.id);
    if (!plant) {
      return;
    }
    if (button.dataset.action === "toggle-garden") {
      persistChange(() => toggleGardenPlant(plant.id));
    } else if (button.dataset.action === "edit-plant") {
      openPlantDialog(plant);
    } else if (button.dataset.action === "delete-plant") {
      if (window.confirm(`Eliminar "${plant.name}" do catálogo e do seu jardim?`)) {
        persistChange(() => deletePlant(plant.id));
      }
    }
  });

  document.getElementById("garden-grid").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) {
      return;
    }
    if (button.dataset.action === "add-routine") {
      const plant = getPlants().find((item) => item.id === button.dataset.plantId);
      if (!plant) {
        return;
      }
      const form = makeRoutineForm(plant.id);
      const container = button.closest("article");
      container.querySelector(".routine-form")?.remove();
      container.append(form);
      form.elements.namedItem("type").focus();
    } else if (button.dataset.action === "cancel-routine") {
      button.closest("form").remove();
    } else if (button.dataset.action === "delete-routine") {
      persistChange(() =>
        deleteRoutine(button.dataset.plantId, button.dataset.routineId),
      );
    }
  });

  document.getElementById("garden-grid").addEventListener("submit", (event) => {
    if (!event.target.matches(".routine-form")) {
      return;
    }
    event.preventDefault();
    const form = event.target;
    if (!form.reportValidity()) {
      return;
    }
    const data = new FormData(form);
    persistChange(() =>
      addRoutine(form.dataset.plantId, {
        type: String(data.get("type")),
        intervalDays: Number(data.get("intervalDays")),
        nextDate: String(data.get("nextDate")),
        notes: String(data.get("notes") || "").trim(),
      }),
    );
  });

  document.getElementById("catalogue-search").addEventListener("input", applyFilters);
  document.querySelectorAll(".pill[data-filter]").forEach((filter) => {
    filter.addEventListener("click", () => {
      document.querySelectorAll(".pill[data-filter]").forEach((button) => {
        const active = button === filter;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      applyFilters();
    });
  });
}
