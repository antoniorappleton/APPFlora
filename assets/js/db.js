const STORAGE_KEY = "floracare-data-v1";
const CATALOG_SEED_VERSION = 4;

export const LEGACY_CARE_TAGS = [
  { id: "watering", label: "Rega e Humidade" },
  { id: "light", label: "☀️ Luz e Ambiente" },
  { id: "maintenance", label: "✂️ Manutenção e Estética" },
  { id: "nutrition", label: "🧪 Nutrição e Solo" },
  { id: "health", label: "🛡️ Saúde e Proteção" },
];

export const CARE_TAG_GROUPS = [
  {
    id: "watering",
    label: "💧 Rega e Humidade",
    tags: [
      ["abundant-watering", "Rega Abundante"],
      ["moderate-watering", "Rega Moderada"],
      ["light-watering", "Rega Ligeira"],
      ["immersion-watering", "Rega por Imersão"],
      ["mist-leaves", "Borrifar Folhas"],
      ["humidifier", "Humidificador Ligado"],
      ["pebble-tray", "Prato com Seixos (para humidade passiva)"],
      ["little-water", "Pouca Água"],
      ["much-water", "Muita Água"],
      ["consistently-moist-soil", "Solo Sempre Húmido"],
      ["dry-between-watering", "Secar entre Regas"],
      ["daily-watering", "Rega Diária"],
      ["weekly-watering", "Rega 1x por Semana"],
      ["twice-weekly-watering", "Rega 2x por Semana"],
      ["thrice-weekly-watering", "Rega 3x por Semana"],
      ["fortnightly-watering", "Rega Quinzenal"],
      ["monthly-watering", "Rega Mensal"],
      ["chlorine-sensitive", "Sensível a Cloro (usar água filtrada/descansada)"],
    ].map(([id, label]) => ({ id, label })),
  },
  {
    id: "environment",
    label: "☀️ Luz, Ambiente e Tipo",
    tags: [
      ["direct-sun", "Sol Direto"],
      ["bright-indirect-light", "Luz Indireta Forte"],
      ["partial-shade", "Meia Sombra"],
      ["full-shade", "Sombra Total"],
      ["low-light", "Pouca Luz"],
      ["indoor-plant", "Planta de Interior"],
      ["outdoor-plant", "Planta de Exterior"],
      ["greenhouse-plant", "Planta de Estufa"],
      ["rotate-pot", "Rodar Vaso"],
      ["relocate-plant", "Mudar de Local"],
      ["protect-from-sun", "Proteger do Sol"],
      ["avoid-drafts", "Evitar Correntes de Ar"],
      ["protect-from-cold", "Proteger do Frio"],
      ["protect-from-heat", "Proteger do Calor"],
      ["tropical-climate", "Clima Tropical"],
      ["arid-climate", "Clima Árido"],
    ].map(([id, label]) => ({ id, label })),
  },
  {
    id: "maintenance",
    label: "✂️ Manutenção, Porte e Estética",
    tags: [
      ["clean-leaves", "Limpar Folhas"],
      ["leaf-shine", "Brilho Foliar"],
      ["remove-dry-leaves", "Remover Folhas Secas"],
      ["formative-pruning", "Poda de Formação"],
      ["cleaning-pruning", "Poda de Limpeza"],
      ["take-cuttings", "Fazer Estacas (Propagação)"],
      ["add-support", "Colocar Tutor"],
      ["tie-branches", "Prender Ramos"],
      ["climbing-plant", "Planta Trepadeira"],
      ["trailing-plant", "Planta Pendente"],
      ["fast-growth", "Crescimento Rápido"],
      ["slow-growth", "Crescimento Lento"],
    ].map(([id, label]) => ({ id, label })),
  },
  {
    id: "nutrition",
    label: "🧪 Nutrição, Solo e Vaso",
    tags: [
      ["liquid-fertilizer", "Fertilizante Líquido"],
      ["granular-fertilizer", "Fertilizante Granulado"],
      ["foliar-fertilizer", "Fertilizante de Folha (Foliar)"],
      ["organic-fertilizer", "Adubo Orgânico"],
      ["universal-substrate", "Substrato Universal"],
      ["cactus-substrate", "Substrato p/ Cactos"],
      ["orchid-substrate", "Substrato p/ Orquídeas"],
      ["aerate-soil", "Arejar Solo"],
      ["repot-plant", "Mudar de Vaso"],
      ["refresh-topsoil", "Renovar Terra Superficial"],
      ["clay-pot", "Vaso de Barro"],
      ["plastic-pot", "Vaso de Plástico"],
      ["good-drainage", "Boa Drenagem"],
    ].map(([id, label]) => ({ id, label })),
  },
  {
    id: "health",
    label: "🛡️ Saúde, Proteção e Segurança",
    tags: [
      ["inspect-pests", "Inspecionar Pragas"],
      ["remove-mealybugs", "Limpar Cochonilha"],
      ["treat-mites", "Tratar Ácaros"],
      ["neem-oil", "Óleo de Neem"],
      ["potassium-soap", "Sabão Potássico"],
      ["apply-fungicide", "Aplicar Fungicida"],
      ["quarantine-plant", "Quarentena"],
      ["wash-roots", "Lavar Raízes"],
      ["toxic-to-pets", "Tóxica para Animais"],
      ["pet-friendly", "Pet Friendly (Segura para animais)"],
      ["hardy-plant", "Planta Resistente"],
      ["sensitive-plant", "Planta Sensível"],
    ].map(([id, label]) => ({ id, label })),
  },
];

export const CARE_TAGS = CARE_TAG_GROUPS.flatMap((group) => group.tags);
const careTagIds = new Set([
  ...CARE_TAGS.map((tag) => tag.id),
  ...LEGACY_CARE_TAGS.map((tag) => tag.id),
]);

const initialPlants = [
  {
    id: "buganvilia",
    name: "Buganvília",
    category: "exterior",
    careTags: [
      "little-water",
      "dry-between-watering",
      "outdoor-plant",
      "direct-sun",
      "climbing-plant",
      "fast-growth",
    ],
    image: "../assets/images/Catálogo/buganvilia.jpg",
  },
  {
    id: "jacaranda",
    name: "Jacarandá",
    category: "exterior",
    careTags: [],
    image: "../assets/images/Catálogo/jacarandá.jpg",
  },
  {
    id: "monstera",
    name: "Monstera",
    category: "interior",
    careTags: [],
    image:
      "https://images.unsplash.com/photo-1503149779833-1de50ebe5f8a?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "peace-lily",
    name: "Lírio-da-paz",
    category: "interior",
    careTags: [],
    image:
      "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "lavender",
    name: "Lavanda",
    category: "exterior",
    careTags: [],
    image:
      "https://images.unsplash.com/photo-1600759487717-62bbb608106e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "echeveria",
    name: "Echeveria",
    category: "suculentas",
    careTags: [],
    image:
      "https://images.unsplash.com/photo-1657988149309-b9d63475d553?auto=format&fit=crop&w=900&q=80",
  },
];

function loadState() {
  const storedValue = localStorage.getItem(STORAGE_KEY);
  if (storedValue === null) {
    const initialState = {
      plants: initialPlants,
      garden: [],
      catalogSeedVersion: CATALOG_SEED_VERSION,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
    return initialState;
  }

  const state = JSON.parse(storedValue);
  if (
    !state ||
    !Array.isArray(state.plants) ||
    !Array.isArray(state.garden) ||
    !state.plants.every(
      (plant) =>
        plant &&
        typeof plant.id === "string" &&
        typeof plant.name === "string" &&
        typeof plant.category === "string" &&
        typeof plant.image === "string" &&
        (plant.description === undefined ||
          typeof plant.description === "string") &&
        (plant.careTags === undefined ||
          (Array.isArray(plant.careTags) &&
            plant.careTags.every(
              (tag) => typeof tag === "string" && careTagIds.has(tag),
            ))),
    ) ||
    !state.garden.every(
      (entry) =>
        entry &&
        typeof entry.plantId === "string" &&
        Array.isArray(entry.routines),
    )
  ) {
    throw new Error("Os dados guardados da FloraCare têm um formato inválido.");
  }

  const catalogSeedVersion = Number.isInteger(state.catalogSeedVersion)
    ? state.catalogSeedVersion
    : 0;
  if (catalogSeedVersion < CATALOG_SEED_VERSION) {
    const plants = [...state.plants];
    if (
      catalogSeedVersion < 1 &&
      !plants.some((plant) => plant.id === "jacaranda")
    ) {
      plants.push(initialPlants.find((plant) => plant.id === "jacaranda"));
    }
    if (
      catalogSeedVersion < 2 &&
      !plants.some((plant) => plant.id === "buganvilia")
    ) {
      plants.push(initialPlants.find((plant) => plant.id === "buganvilia"));
    }
    if (catalogSeedVersion < 3) {
      for (let index = 0; index < plants.length; index += 1) {
        if (!Array.isArray(plants[index].careTags)) {
          plants[index] = {
            ...plants[index],
            careTags:
              plants[index].id === "buganvilia"
                ? initialPlants.find((plant) => plant.id === "buganvilia")
                    .careTags
                : [],
          };
        }
      }
    }
    if (
      catalogSeedVersion < 4 &&
      plants.some(
        (plant) =>
          plant.id === "buganvilia" &&
          Array.isArray(plant.careTags) &&
          plant.careTags.includes("watering") &&
          plant.careTags.includes("light"),
      )
    ) {
      const buganviliaIndex = plants.findIndex(
        (plant) => plant.id === "buganvilia",
      );
      plants[buganviliaIndex] = {
        ...plants[buganviliaIndex],
        careTags: initialPlants.find((plant) => plant.id === "buganvilia")
          .careTags,
      };
    }
    const migratedState = {
      ...state,
      plants,
      catalogSeedVersion: CATALOG_SEED_VERSION,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedState));
    return migratedState;
  }

  return state;
}

let state = loadState();

function commitState(nextState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  state = nextState;
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ||
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getPlants() {
  return state.plants;
}

export function getGarden() {
  return state.garden;
}

export function isInGarden(plantId) {
  return state.garden.some((entry) => entry.plantId === plantId);
}

export function savePlant(plant) {
  const plants = [...state.plants];
  if (plant.id) {
    const index = plants.findIndex((item) => item.id === plant.id);
    if (index === -1) {
      throw new Error("A planta que tentou editar já não existe.");
    }
    plants[index] = { ...plants[index], ...plant };
  } else {
    plants.push({ ...plant, id: createId() });
  }
  commitState({ ...state, plants });
}

export function deletePlant(plantId) {
  commitState({
    ...state,
    plants: state.plants.filter((plant) => plant.id !== plantId),
    garden: state.garden.filter((entry) => entry.plantId !== plantId),
  });
}

export function toggleGardenPlant(plantId) {
  const existingIndex = state.garden.findIndex(
    (entry) => entry.plantId === plantId,
  );
  const garden = [...state.garden];
  if (existingIndex === -1) {
    garden.push({ plantId, routines: [] });
  } else {
    garden.splice(existingIndex, 1);
  }
  commitState({ ...state, garden });
}

export function addRoutine(plantId, routine) {
  const entry = state.garden.find((item) => item.plantId === plantId);
  if (!entry) {
    throw new Error("Adicione a planta ao seu jardim antes de criar rotinas.");
  }
  const garden = state.garden.map((item) =>
    item.plantId === plantId
      ? { ...item, routines: [...item.routines, { ...routine, id: createId() }] }
      : item,
  );
  commitState({ ...state, garden });
}

export function deleteRoutine(plantId, routineId) {
  const entry = state.garden.find((item) => item.plantId === plantId);
  if (!entry) {
    throw new Error("Não foi possível encontrar esta planta no seu jardim.");
  }
  const garden = state.garden.map((item) =>
    item.plantId === plantId
      ? {
          ...item,
          routines: item.routines.filter(
            (routine) => routine.id !== routineId,
          ),
        }
      : item,
  );
  commitState({ ...state, garden });
}
