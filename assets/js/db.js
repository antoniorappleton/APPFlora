const STORAGE_KEY = "floracare-data-v1";
const CATALOG_SEED_VERSION = 2;

const initialPlants = [
  {
    id: "buganvilia",
    name: "Buganvília",
    category: "exterior",
    description:
      "A buganvília é uma planta trepadeira tropical extremamente resistente e de crescimento vigoroso, famosa pela sua floração exuberante e pelas suas cores vibrantes (que cobrem tons de rosa, roxo, vermelho, laranja e branco).\n\nAqui tem as respostas diretas aos cuidados essenciais que pediu:\n\n• Interior ou Exterior: É uma planta obrigatoriamente de exterior. Não se desenvolve nem sobrevive a longo prazo dentro de casa, pois necessita de uma circulação de ar natural e de uma intensidade de luz impossível de replicar em ambientes fechados.\n\n• Sol ou Sombra: Exige sol pleno. Deve ser plantada no local mais soalheiro do jardim ou da varanda, recebendo no mínimo 6 horas de sol direto por dia. Se for colocada à sombra, a planta vai produzir apenas folhas verdes e perderá toda a sua floração icónica.\n\n• Regas: A regra de ouro é regar pouco. A buganvília odeia o excesso de humidade e tolera muito bem a seca. Deixe a terra secar completamente entre regas. No verão, regue apenas quando notar a terra seca e, no inverno, reduza as regas ao mínimo (ou deixe que a água da chuva trate disso se estiver no solo). O excesso de água faz cair as flores e apodrece as raízes.",
    image: "../assets/images/Catálogo/buganvilia.jpg",
  },
  {
    id: "jacaranda",
    name: "Jacarandá",
    category: "exterior",
    description:
      "Jacarandá*: Originário da América do Sul e introduzido no século XIX, é a árvore mais emblemática da capital. Na primavera, cobre praças e avenidas (como o Parque Eduardo VII ou o Largo do Rato) com uma cor púrpura vibrante. [[1]",
    image: "../assets/images/Catálogo/jacarandá.jpg",
  },
  {
    id: "monstera",
    name: "Monstera",
    category: "interior",
    description: "Folhas marcantes para dar personalidade à casa.",
    image:
      "https://images.unsplash.com/photo-1503149779833-1de50ebe5f8a?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "peace-lily",
    name: "Lírio-da-paz",
    category: "interior",
    description: "Uma presença elegante com flores delicadas.",
    image:
      "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "lavender",
    name: "Lavanda",
    category: "exterior",
    description: "Cor e aroma para varandas e jardins soalheiros.",
    image:
      "https://images.unsplash.com/photo-1600759487717-62bbb608106e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "echeveria",
    name: "Echeveria",
    category: "suculentas",
    description: "Uma suculenta compacta, perfeita para pequenos espaços.",
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
        typeof plant.description === "string" &&
        typeof plant.image === "string",
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
    plants[index] = plant;
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
