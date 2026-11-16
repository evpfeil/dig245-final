// [AI-Assisted: Copilot SDK | 2026-11-06]
// Intent: Load 2024 character data, preview granted proficiencies, and collect proficiency choices in a modal.
const API_ORIGIN = "https://www.dnd5eapi.co";
const API_ROOT = "/api/2024";

// [AI-Assisted: Copilot SDK | 2026-11-11]
// Intent: Fill the twelve 2024 Player's Handbook background entries that are not exposed by the API's SRD-only index.
const ADDITIONAL_2024_BACKGROUNDS = [
    {
        index: "artisan",
        name: "Artisan",
        overview: "You make useful goods and have experience working with customers.",
        abilities: ["str", "dex", "int"],
        feat: "Crafter",
        featSummary: "Adds artisan-tool training and benefits related to crafting and buying nonmagical gear.",
        skills: ["Investigation", "Persuasion"],
        toolChoice: "Artisan's Tools",
        equipment: "(A) Artisan's Tools (the chosen type), 2 Pouches, Traveler's Clothes, 32 GP; or (B) 50 GP."
    },
    {
        index: "charlatan",
        name: "Charlatan",
        overview: "You rely on deception, disguise, and quick hands to get by.",
        abilities: ["dex", "con", "cha"],
        feat: "Skilled",
        featSummary: "Grants proficiency in three skills or tools of your choice.",
        skills: ["Deception", "Sleight of Hand"],
        tools: ["Forgery Kit"],
        equipment: "(A) Forgery Kit, Costume, Fine Clothes, 15 GP; or (B) 50 GP."
    },
    {
        index: "entertainer",
        name: "Entertainer",
        overview: "You perform for audiences and know how to hold their attention.",
        abilities: ["str", "dex", "cha"],
        feat: "Musician",
        featSummary: "Grants musical-instrument training and can share Heroic Inspiration after a performance during a rest.",
        skills: ["Acrobatics", "Performance"],
        toolChoice: "Musical Instruments",
        equipment: "(A) Musical Instrument (the chosen type), 2 Costumes, Mirror, Perfume, Traveler's Clothes, 11 GP; or (B) 50 GP."
    },
    {
        index: "farmer",
        name: "Farmer",
        overview: "You have practical experience with animals, crops, and physical work.",
        abilities: ["str", "con", "wis"],
        feat: "Tough",
        featSummary: "Increases your maximum Hit Points at level 1 and again whenever you gain a level.",
        skills: ["Animal Handling", "Nature"],
        tools: ["Carpenter's Tools"],
        equipment: "(A) Sickle, Carpenter's Tools, Healer's Kit, Iron Pot, Shovel, Traveler's Clothes, 30 GP; or (B) 50 GP."
    },
    {
        index: "guard",
        name: "Guard",
        overview: "You have experience keeping watch and protecting a community.",
        abilities: ["str", "int", "wis"],
        feat: "Alert",
        featSummary: "Improves initiative and lets you exchange initiative with a willing ally after the roll.",
        skills: ["Athletics", "Perception"],
        toolChoice: "Gaming Sets",
        equipment: "(A) Spear, Light Crossbow, 20 Bolts, Gaming Set (the chosen type), Hooded Lantern, Manacles, Quiver, Traveler's Clothes, 12 GP; or (B) 50 GP."
    },
    {
        index: "guide",
        name: "Guide",
        overview: "You know how to travel quietly and find your way through the wilds.",
        abilities: ["dex", "con", "wis"],
        feat: "Magic Initiate",
        featNote: "Druid",
        featSummary: "Grants two Druid cantrips and one level-1 Druid spell, with one free spell casting per Long Rest.",
        skills: ["Stealth", "Survival"],
        tools: ["Cartographer's Tools"],
        equipment: "(A) Shortbow, 20 Arrows, Cartographer's Tools, Bedroll, Quiver, Tent, Traveler's Clothes, 3 GP; or (B) 50 GP."
    },
    {
        index: "hermit",
        name: "Hermit",
        overview: "You have lived apart from society and developed practical and spiritual knowledge.",
        abilities: ["con", "wis", "cha"],
        feat: "Healer",
        featSummary: "Improves the healing you can provide with a Healer's Kit.",
        skills: ["Medicine", "Religion"],
        tools: ["Herbalism Kit"],
        equipment: "(A) Quarterstaff, Herbalism Kit, Bedroll, Book (philosophy), Lamp, 3 flasks of Oil, Traveler's Clothes, 16 CP; or (B) 50 GP."
    },
    {
        index: "merchant",
        name: "Merchant",
        overview: "You trade goods and negotiate with customers along your route.",
        abilities: ["con", "int", "cha"],
        feat: "Lucky",
        featSummary: "Grants Luck points you can spend to influence D20 Tests; you regain them after a Long Rest.",
        skills: ["Animal Handling", "Persuasion"],
        tools: ["Navigator's Tools"],
        equipment: "(A) Navigator's Tools, 2 Pouches, Traveler's Clothes, 22 GP; or (B) 50 GP."
    },
    {
        index: "noble",
        name: "Noble",
        overview: "You were raised among privilege and learned the customs of formal society.",
        abilities: ["str", "int", "cha"],
        feat: "Skilled",
        featSummary: "Grants proficiency in three skills or tools of your choice.",
        skills: ["History", "Persuasion"],
        toolChoice: "Gaming Sets",
        equipment: "(A) Gaming Set (the chosen type), Fine Clothes, Perfume, 29 GP; or (B) 50 GP."
    },
    {
        index: "sailor",
        name: "Sailor",
        overview: "You have worked at sea and learned to navigate and keep your balance.",
        abilities: ["str", "dex", "wis"],
        feat: "Tavern Brawler",
        featSummary: "Improves your unarmed strikes and use of improvised weapons.",
        skills: ["Acrobatics", "Perception"],
        tools: ["Navigator's Tools"],
        equipment: "(A) Dagger, Navigator's Tools, Rope, Traveler's Clothes, 20 GP; or (B) 50 GP."
    },
    {
        index: "scribe",
        name: "Scribe",
        overview: "You create, organize, and preserve written records.",
        abilities: ["dex", "int", "wis"],
        feat: "Skilled",
        featSummary: "Grants proficiency in three skills or tools of your choice.",
        skills: ["Investigation", "Perception"],
        tools: ["Calligrapher's Supplies"],
        equipment: "(A) Calligrapher's Supplies, Fine Clothes, Lamp, 3 flasks of Oil, 12 sheets of Parchment, 23 GP; or (B) 50 GP."
    },
    {
        index: "wayfarer",
        name: "Wayfarer",
        overview: "You learned to find your way and make do while living on the road.",
        abilities: ["dex", "wis", "cha"],
        feat: "Lucky",
        featSummary: "Grants Luck points you can spend to influence D20 Tests; you regain them after a Long Rest.",
        skills: ["Insight", "Stealth"],
        tools: ["Thieves' Tools"],
        equipment: "(A) 2 Daggers, Thieves' Tools, Gaming Set (any type), Bedroll, 2 Pouches, Traveler's Clothes, 16 GP; or (B) 50 GP."
    }
];

const ADDITIONAL_2024_TOOL_OPTIONS = {
    "Artisan's Tools": [
        "Alchemist's Supplies", "Brewer's Supplies", "Calligrapher's Supplies", "Carpenter's Tools",
        "Cartographer's Tools", "Cobbler's Tools", "Cook's Utensils", "Glassblower's Tools",
        "Jeweler's Tools", "Leatherworker's Tools", "Mason's Tools", "Painter's Supplies",
        "Potter's Tools", "Smith's Tools", "Tinker's Tools", "Weaver's Tools", "Woodcarver's Tools"
    ],
    "Gaming Sets": ["Dice", "Dragonchess", "Playing Cards", "Three-Dragon Ante"],
    "Musical Instruments": [
        "Bagpipes", "Drum", "Dulcimer", "Flute", "Horn", "Lute", "Lyre", "Pan Flute", "Shawm", "Viol"
    ]
};

const selects = {
    species: document.querySelector("#species-select"),
    class: document.querySelector("#class-select"),
    background: document.querySelector("#background-select")
};
const randomButtons = {
    species: document.querySelector("#species-random"),
    class: document.querySelector("#class-random"),
    background: document.querySelector("#background-random")
};
const selectedNameLabels = {
    species: document.querySelector("#species-selected-name"),
    class: document.querySelector("#class-selected-name"),
    background: document.querySelector("#background-selected-name")
};
const infoButtons = {
    species: document.querySelector('[data-choice-info="species"]'),
    class: document.querySelector('[data-choice-info="class"]'),
    background: document.querySelector('[data-choice-info="background"]')
};
const speciesLineageButton = document.querySelector("#species-lineage-button");
const speciesLineageModal = document.querySelector("#species-lineage-modal");
const speciesLineageOptions = document.querySelector("#species-lineage-options");
const choiceInfoTooltip = document.querySelector("#choice-info-tooltip");
const choiceInfoTitle = document.querySelector("#choice-info-title");
const choiceInfoContent = document.querySelector("#choice-info-content");
const choiceInfoCloseButton = document.querySelector("#choice-info-close");
const selectionModal = document.querySelector("#selection-modal");
const selectionModalTitle = document.querySelector("#selection-modal-title");
const selectionOptionsElement = document.querySelector("#selection-options");
const nextButton = document.querySelector("#next-button");
const choicePrompt = document.querySelector("#choice-prompt");
const choiceGroupsElement = document.querySelector("#choice-groups");
const choiceStatus = document.querySelector("#choice-status");
const finishButton = document.querySelector("#finish-button");
const characterPage = document.querySelector("#character-page");
const pointBuyPage = document.querySelector("#point-buy-page");
const backstoryPage = document.querySelector("#backstory-page");
const characterSheetPage = document.querySelector("#character-sheet-page");
const abilityScoresElement = document.querySelector("#ability-scores");
const standardArrayPool = document.querySelector("#standard-array-scores");
const backgroundBonusControls = document.querySelector("#background-ability-bonuses");
const pointsRemainingElement = document.querySelector("#points-remaining");
const scoreMethodDescription = document.querySelector("#score-method-description");
const pointBuyStatus = document.querySelector("#point-buy-status");
const finishPointBuyButton = document.querySelector("#finish-point-buy");
const backstoryForm = document.querySelector("#backstory-form");
const armorChoiceSelect = document.querySelector("#armor-choice");
const armorChoiceList = document.querySelector("#armor-choice-list");
const wearingShieldInput = document.querySelector("#wearing-shield");
const armorClassPreview = document.querySelector("#armor-class-preview");
const armorProficiencyWarning = document.querySelector("#armor-proficiency-warning");
const startingEquipmentChoices = document.querySelector("#starting-equipment-choices");
const classWeaponChoice = document.querySelector("#class-weapon-choice");
const classWeaponStatus = document.querySelector("#class-weapon-status");
const characterSheetContent = document.querySelector("#character-sheet-content");
const pointBuyInfoModal = document.querySelector("#point-buy-info");
const proficiencyModal = document.querySelector("#proficiency-modal");
const levelUpModal = document.querySelector("#level-up-modal");
const levelUpForm = document.querySelector("#level-up-form");
const levelUpSummary = document.querySelector("#level-up-summary");
const levelUpStatus = document.querySelector("#level-up-status");
const levelUpHpMethod = document.querySelector("#level-up-hp-method");
const levelUpHpPreview = document.querySelector("#level-up-hp-preview");
const levelUpSubclassField = document.querySelector("#level-up-subclass-field");
const levelUpSubclassSelect = document.querySelector("#level-up-subclass");
const levelUpAsiField = document.querySelector("#level-up-asi-field");
const levelUpAsiChoice = document.querySelector("#level-up-asi-choice");
const levelUpAsiMethod = document.querySelector("#level-up-asi-method");
const levelUpAbilityChoices = document.querySelector("#level-up-ability-choices");
const levelUpAbilityOne = document.querySelector("#level-up-ability-one");
const levelUpAbilityTwo = document.querySelector("#level-up-ability-two");
const levelUpFeatChoices = document.querySelector("#level-up-feat-choices");
const levelUpFeatSelect = document.querySelector("#level-up-feat");
const levelUpFeatDescription = document.querySelector("#level-up-feat-description");
const confirmLevelUpButton = document.querySelector("#confirm-level-up");
const levelDownModal = document.querySelector("#level-down-modal");
const levelDownSummary = document.querySelector("#level-down-summary");
const confirmLevelDownButton = document.querySelector("#confirm-level-down");

const selectedChoices = new Map();
const apiRequestCache = new Map();
const choiceImagePlaceholders = {
    species: document.querySelector("#species-image-placeholder"),
    class: document.querySelector("#class-image-placeholder"),
    background: document.querySelector("#background-image-placeholder")
};
const choiceLabels = {
    species: "Species",
    class: "Class",
    background: "Background"
};
const renderedSelectionUrls = {
    species: "",
    class: "",
    background: ""
};
const choiceDetailData = {
    species: null,
    class: null,
    background: null
};
const choiceDetailErrors = {
    species: "",
    class: "",
    background: ""
};
let activeInfoType = "";
let selectedSpeciesLineage = null;
const abilityScores = {
    str: 8,
    dex: 8,
    con: 8,
    int: 8,
    wis: 8,
    cha: 8
};
const standardArrayScores = {
    str: null,
    dex: null,
    con: null,
    int: null,
    wis: null,
    cha: null
};
const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];
let selectedStandardArrayScore = null;
let backgroundBonusMode = "two-one";
let backgroundBonusAssignments = { two: "", one: "" };
let scoreMethod = "point-buy";
const POINT_BUY_BUDGET = 27;
const POINT_COSTS = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
const ARMOR_OPTIONS = {
    unarmored: { label: "Clothing / unarmored", base: 10, dexCap: Infinity },
    padded: { label: "Padded armor", base: 11, dexCap: Infinity, proficiency: "light armor", stealthDisadvantage: true },
    leather: { label: "Leather armor", base: 11, dexCap: Infinity, proficiency: "light armor" },
    "studded-leather": { label: "Studded leather armor", base: 12, dexCap: Infinity, proficiency: "light armor" },
    hide: { label: "Hide armor", base: 12, dexCap: 2, proficiency: "medium armor" },
    "chain-shirt": { label: "Chain shirt", base: 13, dexCap: 2, proficiency: "medium armor" },
    "scale-mail": { label: "Scale mail", base: 14, dexCap: 2, proficiency: "medium armor", stealthDisadvantage: true },
    breastplate: { label: "Breastplate", base: 14, dexCap: 2, proficiency: "medium armor" },
    "half-plate": { label: "Half plate", base: 15, dexCap: 2, proficiency: "medium armor", stealthDisadvantage: true },
    "ring-mail": { label: "Ring mail", base: 14, dexCap: 0, proficiency: "heavy armor" },
    "chain-mail": { label: "Chain mail", base: 16, dexCap: 0, proficiency: "heavy armor", strengthRequirement: 13 },
    splint: { label: "Splint armor", base: 17, dexCap: 0, proficiency: "heavy armor", strengthRequirement: 15 },
    plate: { label: "Plate armor", base: 18, dexCap: 0, proficiency: "heavy armor", strengthRequirement: 15 }
};
const ABILITIES = [
    { key: "str", name: "Strength", summary: "Measures physical power, athletic effort, and force.", skills: ["Athletics"] },
    { key: "dex", name: "Dexterity", summary: "Measures agility, reflexes, balance, and precision.", skills: ["Acrobatics", "Sleight of Hand", "Stealth"] },
    { key: "con", name: "Constitution", summary: "Measures endurance, health, and resistance to hardship.", skills: [] },
    { key: "int", name: "Intelligence", summary: "Measures reasoning, memory, and learned knowledge.", skills: ["Arcana", "History", "Investigation", "Nature", "Religion"] },
    { key: "wis", name: "Wisdom", summary: "Measures awareness, intuition, and practical insight.", skills: ["Animal Handling", "Insight", "Medicine", "Perception", "Survival"] },
    { key: "cha", name: "Charisma", summary: "Measures confidence, presence, and social influence.", skills: ["Deception", "Intimidation", "Performance", "Persuasion"] }
];
let proficiencyRecords = new Map();
let currentCharacterData = null;
const selectedStartingEquipment = new Map();
let additionalWeaponName = "";
let weaponChoiceRequestId = 0;
let characterAdvancement = {
    level: 1,
    hitPointRolls: [],
    abilityBonuses: Object.fromEntries(ABILITIES.map(({ key }) => [key, 0])),
    levels: [],
    subclass: null,
    subclassLevel: null
};
let pendingLevelAdvancement = null;
let latestCharacterRequest = 0;
let proceedToPointBuy = false;

// [AI-Assisted: Copilot SDK | 2026-11-06]
// Intent: Request a 2024 API resource and report unsuccessful HTTP responses.
async function fetchApi(path) {
    const requestUrl = path.startsWith("http")
        ? path
        : new URL(path, API_ORIGIN).toString(); // Resolve API-provided relative URLs against the API host.

    if (!apiRequestCache.has(requestUrl)) {
        const request = (async () => {
            const response = await fetch(requestUrl); // Send an HTTP GET request for this resource.
            if (!response.ok) { // Stop and report the HTTP status if the server rejected the request.
                throw new Error(`Request failed (${response.status}) for ${requestUrl}`);
            }
            return response.json(); // Parse the successful response body as JSON data.
        })();
        apiRequestCache.set(requestUrl, request);
    }

    try {
        return await apiRequestCache.get(requestUrl);
    } catch (error) {
        apiRequestCache.delete(requestUrl);
        throw error;
    }
}

// [AI-Assisted: Copilot SDK | 2026-11-06]
// Intent: Validate API collection response structure before using its results.
function readResults(payload, resourceName) {
    if (!Array.isArray(payload.results)) {
        throw new Error(`The API response for ${resourceName} did not contain a results list.`);
    }
    return payload.results;
}

// [AI-Assisted: Copilot SDK | 2026-11-06]
// Intent: Fill one character dropdown with API options.
function populateSelect(selectElement, resources, placeholder) {
    selectElement.replaceChildren();

    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = placeholder;
    selectElement.append(placeholderOption);

    resources.forEach((resource) => {
        const option = document.createElement("option");
        option.value = resource.url;
        option.textContent = resource.name;
        selectElement.append(option);
    });

    selectElement.disabled = false;
}

// [AI-Assisted: Copilot SDK | 2026-11-11]
// Intent: Shape manually supplied 2024 backgrounds like the API records consumed throughout the character builder.
function createAdditionalBackgroundData(backgroundEntry) {
    const makeProficiency = (name, category) => ({
        index: `${category === "Skills" ? "skill" : "tool"}-${name.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
        name: `${category === "Skills" ? "Skill" : "Tool"}: ${name}`,
        type: category
    });
    const proficiencies = backgroundEntry.skills.map((skill) => makeProficiency(skill, "Skills"));
    backgroundEntry.tools?.forEach((tool) => proficiencies.push(makeProficiency(tool, "Tools")));

    const proficiencyChoices = [];
    if (backgroundEntry.toolChoice) {
        const options = ADDITIONAL_2024_TOOL_OPTIONS[backgroundEntry.toolChoice];
        if (!options) {
            throw new Error(`No tool proficiency options are defined for ${backgroundEntry.toolChoice}.`);
        }
        proficiencyChoices.push({
            desc: `Choose one ${backgroundEntry.toolChoice === "Musical Instruments" ? "Musical Instrument" : backgroundEntry.toolChoice === "Gaming Sets" ? "Gaming Set" : "kind of Artisan's Tools"}.`,
            choose: 1,
            type: "proficiencies",
            from: {
                option_set_type: "options_array",
                options: options.map((name) => ({
                    option_type: "reference",
                    item: makeProficiency(name, "Tools")
                }))
            }
        });
    }

    const [featName, featNote] = backgroundEntry.feat === "Magic Initiate"
        ? [backgroundEntry.feat, backgroundEntry.featNote]
        : [backgroundEntry.feat, ""];
    const [equipmentA, equipmentB] = backgroundEntry.equipment.split("; or (B) ");
    const background = {
        index: backgroundEntry.index,
        name: backgroundEntry.name,
        url: `manual-background:${backgroundEntry.index}`,
        description: backgroundEntry.overview,
        ability_scores: backgroundEntry.abilities.map((index) => ({ index, name: index.toLocaleUpperCase() })),
        feat: {
            index: featName.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
            name: featName,
            note: featNote,
            url: `manual-feat:${featName.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`
        },
        proficiencies,
        proficiency_choices: proficiencyChoices,
        equipment_options: [{
            desc: "Choose starting equipment option A or option B.",
            choose: 1,
            type: "equipment",
            from: {
                option_set_type: "options_array",
                options: [
                    { option_type: "manual_equipment", desc: equipmentA },
                    ...(equipmentB ? [{ option_type: "manual_equipment", desc: `(B) ${equipmentB}` }] : [])
                ]
            }
        }]
    };
    const backgroundFeat = {
        name: featName,
        description: backgroundEntry.featSummary
    };
    return { background, backgroundFeat };
}

// [AI-Assisted: Copilot SDK | 2026-11-10]
// Intent: Load 2024 option collections and initialize the selection and randomizer controls.
async function loadResourceLists() {
    const [speciesPayload, classPayload, backgroundPayload, proficiencyPayload] = await Promise.all([
        fetchApi(`${API_ROOT}/species`), // GET the species index, which lists species names and detail URLs.
        fetchApi(`${API_ROOT}/classes`), // GET the class index, which lists class names and detail URLs.
        fetchApi(`${API_ROOT}/backgrounds`), // GET the background index, which lists background names and detail URLs.
        fetchApi(`${API_ROOT}/proficiencies`) // GET proficiency references used to identify skills, tools, armor, and weapons.
    ]);

    populateSelect(selects.species, readResults(speciesPayload, "species"), "Choose a species");
    populateSelect(selects.class, readResults(classPayload, "classes"), "Choose a class");
    const backgroundResources = [
        ...readResults(backgroundPayload, "backgrounds"),
        ...ADDITIONAL_2024_BACKGROUNDS.map(({ index, name }) => ({
            index,
            name,
            url: `manual-background:${index}`
        }))
    ].sort((first, second) => first.name.localeCompare(second.name));
    populateSelect(selects.background, backgroundResources, "Choose a background");

    const proficiencyList = readResults(proficiencyPayload, "proficiencies"); // Read the API's array of proficiency references.
    proficiencyRecords = new Map(proficiencyList.map((item) => [item.index, item])); // Index each proficiency by API identifier for later lookups.
    Object.values(randomButtons).forEach((button) => {
        button.disabled = false;
    });
    document.querySelectorAll("[data-open-choice]").forEach((button) => {
        button.disabled = false;
    });
    Object.keys(selects).forEach(refreshChoiceControls);
}

// [AI-Assisted: Copilot SDK | 2026-11-11]
// Intent: Load linked species, subspecies, class, subclass, feat, and trait data for expandable selection details.
async function fetchSelectionData(type, url) {
    if (type === "species") {
        const species = await fetchApi(url); // GET the selected species endpoint for its traits and details.
        if (!Array.isArray(species.traits)) {
            throw new Error(`The ${species.name} response did not contain a trait list.`);
        }
        const [speciesTraits, speciesSubspecies] = await Promise.all([
            Promise.all(
            species.traits.map((trait) => fetchApi(trait.url)) // GET each referenced trait because it may grant proficiencies.
            ),
            Promise.all((species.subspecies || []).map(async (subspeciesReference) => {
                const subspecies = await fetchApi(subspeciesReference.url);
                const traits = await Promise.all(
                    (subspecies.traits || []).map((trait) => fetchApi(trait.url))
                );
                return { subspecies, traits };
            }))
        ]);
        return { species, speciesTraits, speciesSubspecies };
    }

    if (type === "class") {
        const classDetails = await fetchApi(url); // GET the selected class endpoint for its class features and choices.
        const subclasses = await Promise.all((classDetails.subclasses || []).map((subclass) => fetchApi(subclass.url)));
        return { classDetails, classSubclasses: subclasses };
    }

    if (url.startsWith("manual-background:")) {
        const index = url.slice("manual-background:".length);
        const backgroundEntry = ADDITIONAL_2024_BACKGROUNDS.find((entry) => entry.index === index);
        if (!backgroundEntry) {
            throw new Error(`No additional 2024 background data is available for ${index}.`);
        }
        return createAdditionalBackgroundData(backgroundEntry);
    }

    const background = await fetchApi(url); // GET the selected background endpoint and its linked feat details.
    const backgroundFeat = background.feat?.url ? await fetchApi(background.feat.url) : null;
    return { background, backgroundFeat };
}

// [AI-Assisted: Copilot SDK | 2026-11-11]
// Intent: Keep selection labels, lineage controls, image placeholders, and Continue synchronized.
function refreshChoiceControls(type) {
    const select = selects[type];
    const selectedOption = select.selectedOptions[0];
    const selected = Boolean(select.value);
    selectedNameLabels[type].textContent = selectedOption?.textContent || `No ${type} selected`;
    infoButtons[type].disabled = !selected || renderedSelectionUrls[type] !== select.value;
    choiceImagePlaceholders[type].textContent = selected
        ? `${choiceLabels[type]} image: ${selectedOption.textContent}`
        : `${choiceLabels[type]} image placeholder`;
    choiceImagePlaceholders[type].setAttribute(
        "aria-label",
        selected ? `${choiceLabels[type]} image placeholder for ${selectedOption.textContent}` : `${choiceLabels[type]} image placeholder`
    );
    if (type === "species") {
        const speciesData = choiceDetailData.species;
        const lineages = speciesData?.speciesSubspecies || [];
        const hasLoadedSelection = renderedSelectionUrls.species === select.value;
        const lineageAvailable = selected && hasLoadedSelection && lineages.length > 0;
        speciesLineageButton.classList.toggle("is-unavailable", !lineageAvailable);
        speciesLineageButton.setAttribute("aria-hidden", String(!lineageAvailable));
        speciesLineageButton.disabled = !lineageAvailable;
        speciesLineageButton.textContent = selectedSpeciesLineage?.speciesIndex === speciesData?.species?.index
            ? `Lineage: ${lineages.find(({ subspecies }) => subspecies.index === selectedSpeciesLineage.subspeciesIndex)?.subspecies.name || "Choose lineage"}`
            : "Choose lineage";
    }

    refreshNextButton();
}

// [AI-Assisted: Copilot SDK | 2026-11-10]
// Intent: Display detailed selection information in a scrollable overlay without expanding the character card.
function showChoiceInfo(type, button) {
    if (infoButtons[type].disabled) {
        return;
    }

    if (activeInfoType === type && !choiceInfoTooltip.classList.contains("d-none")) {
        closeChoiceInfo(false);
        return;
    }

    activeInfoType = type;
    choiceInfoTitle.textContent = `${choiceLabels[type]} information`;
    choiceInfoContent.replaceChildren();
    choiceInfoContent.scrollTop = 0;
    if (choiceDetailErrors[type]) {
        const errorMessage = document.createElement("p");
        errorMessage.className = "text-danger mb-0";
        errorMessage.textContent = choiceDetailErrors[type];
        choiceInfoContent.append(errorMessage);
    } else {
        renderSelectionDetails(type, choiceDetailData[type], choiceInfoContent);
    }

    choiceInfoTooltip.classList.remove("d-none");
    choiceInfoTooltip.setAttribute("aria-hidden", "false");
    button.setAttribute("aria-expanded", "true");
    positionChoiceInfo(button);
}

// [AI-Assisted: Copilot SDK | 2026-11-10]
// Intent: Keep the information overlay within the viewport and choose space above or below its trigger.
function positionChoiceInfo(button = infoButtons[activeInfoType]) {
    if (!button || choiceInfoTooltip.classList.contains("d-none")) {
        return;
    }

    const trigger = button.getBoundingClientRect();
    const tooltip = choiceInfoTooltip.getBoundingClientRect();
    const margin = 8;
    const left = Math.min(
        Math.max(margin, trigger.left + (trigger.width - tooltip.width) / 2),
        window.innerWidth - tooltip.width - margin
    );
    const below = window.innerHeight - trigger.bottom - margin;
    const above = trigger.top - margin;
    const top = below >= tooltip.height || below >= above
        ? Math.min(trigger.bottom + margin, window.innerHeight - tooltip.height - margin)
        : Math.max(margin, trigger.top - tooltip.height - margin);

    choiceInfoTooltip.style.left = `${left}px`;
    choiceInfoTooltip.style.top = `${top}px`;
}

// [AI-Assisted: Copilot SDK | 2026-11-10]
// Intent: Dismiss the information overlay and restore focus when dismissal is explicit.
function closeChoiceInfo(restoreFocus = true) {
    if (!activeInfoType) {
        return;
    }

    const trigger = infoButtons[activeInfoType];
    trigger.setAttribute("aria-expanded", "false");
    choiceInfoTooltip.classList.add("d-none");
    choiceInfoTooltip.setAttribute("aria-hidden", "true");
    activeInfoType = "";
    if (restoreFocus) {
        trigger.focus();
    }
}

// [AI-Assisted: Copilot SDK | 2026-11-11]
// Intent: Enable Continue after API loading and any required species lineage selection are complete.
function refreshNextButton() {
    const speciesData = currentCharacterData?.speciesSubspecies || [];
    const requiresLineage = speciesData.length > 0;
    const hasSelectedLineage = speciesData.some(({ subspecies }) => (
        subspecies.index === selectedSpeciesLineage?.subspeciesIndex
        && currentCharacterData.species.index === selectedSpeciesLineage.speciesIndex
    ));
    const ready = Boolean(currentCharacterData)
        && (!requiresLineage || hasSelectedLineage)
        && Object.keys(selects).every((type) => (
            selects[type].value
            && renderedSelectionUrls[type] === selects[type].value
        ));
    nextButton.disabled = !ready;
    nextButton.classList.toggle("btn-primary", ready);
    nextButton.classList.toggle("btn-secondary", !ready);
}

// [AI-Assisted: Copilot SDK | 2026-11-11]
// Intent: Let players inspect each API-provided lineage and choose one for the selected species.
function openSpeciesLineageModal() {
    const data = choiceDetailData.species;
    const lineages = data?.speciesSubspecies || [];
    speciesLineageOptions.replaceChildren();

    lineages.forEach(({ subspecies, traits }) => {
        const entry = document.createElement("article");
        entry.className = "choice-option";
        const heading = document.createElement("div");
        heading.className = "d-flex justify-content-between align-items-center gap-2";
        const name = document.createElement("h3");
        name.className = "h6 mb-0";
        name.textContent = subspecies.name;

        const isSelected = selectedSpeciesLineage?.speciesIndex === data.species.index
            && selectedSpeciesLineage.subspeciesIndex === subspecies.index;
        const chooseButton = document.createElement("button");
        chooseButton.className = "btn btn-primary btn-sm";
        chooseButton.type = "button";
        chooseButton.textContent = isSelected ? "Selected" : "Choose";
        chooseButton.disabled = isSelected;
        chooseButton.addEventListener("click", () => {
            selectedSpeciesLineage = {
                speciesIndex: data.species.index,
                subspeciesIndex: subspecies.index
            };
            refreshChoiceControls("species");
            renderChoiceGroups();
            bootstrap.Modal.getOrCreateInstance(speciesLineageModal).hide();
        });
        heading.append(name, chooseButton);
        entry.append(heading);

        const details = document.createElement("details");
        details.className = "mt-2";
        const summary = document.createElement("summary");
        summary.className = "small";
        summary.textContent = "Find more about this lineage";
        details.append(summary);

        (data.speciesTraits || [])
            .filter((trait) => subspecies.index.startsWith(`${trait.index}-`))
            .forEach((trait) => appendApiDisclosure(
                details,
                `${trait.name} (shared rules)`,
                trait.description || "No description provided by the API."
            ));
        traits.forEach((trait) => appendApiDisclosure(
            details,
            `${trait.level ? `Level ${trait.level}: ` : ""}${trait.name}`,
            trait.description || "No description provided by the API."
        ));
        if (!traits.length) {
            const emptyMessage = document.createElement("p");
            emptyMessage.className = "small text-body-secondary mt-2 mb-0";
            emptyMessage.textContent = subspecies.description || "No additional lineage details are listed by the API.";
            details.append(emptyMessage);
        } else if (subspecies.description) {
            const description = document.createElement("p");
            description.className = "small text-body-secondary mt-2 mb-0";
            description.textContent = subspecies.description;
            details.append(description);
        }
        entry.append(details);
        speciesLineageOptions.append(entry);
    });

    bootstrap.Modal.getOrCreateInstance(speciesLineageModal).show();
}

// [AI-Assisted: Copilot SDK | 2026-11-10]
// Intent: Show every API option in a modal and load its expandable API details when requested.
function openSelectionModal(type) {
    selectionModalTitle.textContent = `Choose a ${choiceLabels[type].toLowerCase()}`;
    selectionOptionsElement.replaceChildren();

    const options = [...selects[type].options].filter((option) => option.value);
    options.forEach((option) => {
        const entry = document.createElement("article");
        entry.className = "choice-option";

        const heading = document.createElement("div");
        heading.className = "d-flex justify-content-between align-items-center gap-2";

        const name = document.createElement("h3");
        name.className = "h6 mb-0";
        name.textContent = option.textContent;

        const chooseButton = document.createElement("button");
        chooseButton.className = "btn btn-primary btn-sm";
        chooseButton.type = "button";
        chooseButton.textContent = option.value === selects[type].value ? "Selected" : "Choose";
        chooseButton.disabled = option.value === selects[type].value;
        chooseButton.addEventListener("click", () => {
            selects[type].value = option.value;
            selects[type].dispatchEvent(new Event("change"));
            bootstrap.Modal.getOrCreateInstance(selectionModal).hide();
        });

        heading.append(name, chooseButton);
        entry.append(heading);

        const preview = document.createElement("details");
        preview.dataset.choicePreview = "true";
        const summary = document.createElement("summary");
        summary.className = "small";
        summary.textContent = "Find more about this option";
        const previewContent = document.createElement("div");
        previewContent.className = "mt-2";
        previewContent.textContent = "Open to load API details.";
        preview.append(summary, previewContent);
        preview.addEventListener("toggle", async () => {
            if (!preview.open || preview.dataset.loaded === "true" || preview.dataset.loading === "true") {
                return;
            }

            preview.dataset.loading = "true";
            previewContent.textContent = "Loading API details…";
            try {
                const data = await fetchSelectionData(type, option.value);
                previewContent.replaceChildren();
                renderSelectionDetails(type, data, previewContent);
                preview.dataset.loaded = "true";
            } catch (error) {
                const message = document.createElement("p");
                message.className = "text-danger mb-0";
                message.textContent = `Could not load this option: ${error.message}`;
                previewContent.replaceChildren(message);
                console.error(`Could not load ${type} option details:`, error);
            } finally {
                delete preview.dataset.loading;
            }
        });
        entry.append(preview);
        selectionOptionsElement.append(entry);
    });

    bootstrap.Modal.getOrCreateInstance(selectionModal).show();
}

// [AI-Assisted: Copilot SDK | 2026-11-06]
// Intent: Convert API proficiency names into concise display labels.
function displayProficiencyName(item) {
    return (item.name || "").replace(/^(skill|tool|saving throw):\s*/i, "");
}

// [AI-Assisted: Copilot SDK | 2026-11-11]
// Intent: Repair a UTF-8 apostrophe that arrives mojibaked in proficiency-choice descriptions.
function getChoiceDescription(choice) {
    const description = choice.desc || `Choose ${choice.choose} proficiency option(s).`;
    return description.replaceAll("\u00e2\u20ac\u2122", "'");
}

// [AI-Assisted: Copilot SDK | 2026-11-11]
// Intent: Title-case nested category labels such as the Monk's Artisan's Tools and Musical Instrument choices.
function capitalizeChoiceLabel(label) {
    return label.replace(/(^|\s)\S/g, (letter) => letter.toLocaleUpperCase());
}

// [AI-Assisted: Copilot SDK | 2026-11-11]
// Intent: Extract direct API proficiency options and retain nested choices for two-step selection.
function getChoiceOptions(choice) {
    if (!Array.isArray(choice.from?.options)) {
        return [];
    }
    return choice.from.options.map((option) => {
        const item = option.item || option.of;
        if (item?.name) {
            return item;
        }
        if (option.option_type === "choice" && option.choice) {
            const name = capitalizeChoiceLabel(getChoiceDescription(option.choice));
            const index = `nested-choice-${name.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
            return { index, name, nestedChoice: option.choice };
        }
        return null;
    }).filter(Boolean);
}

// [AI-Assisted: Copilot SDK | 2026-11-06]
// Intent: Give proficiency choice options a stable identity.
function getOptionKey(option) {
    return option.index || option.url || option.name;
}

// [AI-Assisted: Copilot SDK | 2026-11-06]
// Intent: Normalize class/background choice arrays and species trait choice objects.
function normalizeChoices(choices) {
    if (Array.isArray(choices)) {
        return choices;
    }
    return choices ? [choices] : [];
}

// [AI-Assisted: Copilot SDK | 2026-11-11]
// Intent: Combine direct and nested proficiency choices across the selected character options and lineage.
function getChoiceGroups() {
    if (!currentCharacterData) {
        return [];
    }

    const { species, classDetails, background, speciesTraits } = currentCharacterData;
    const sources = [
        {
            key: `class-${classDetails.index}`,
            label: `${classDetails.name} class`,
            choices: normalizeChoices(classDetails.proficiency_choices)
        },
        {
            key: `background-${background.index}`,
            label: `${background.name} background`,
            choices: normalizeChoices(background.proficiency_choices)
        },
        ...speciesTraits.map((trait) => ({
            key: `species-${species.index}-${trait.index}`,
            label: `${species.name}: ${trait.name}`,
            choices: normalizeChoices(trait.proficiency_choices)
        })),
        ...(selectedSpeciesLineage?.speciesIndex === species.index
            ? (currentCharacterData.speciesSubspecies || [])
                .filter(({ subspecies }) => subspecies.index === selectedSpeciesLineage.subspeciesIndex)
                .flatMap(({ subspecies, traits }) => traits.map((trait) => ({
                    key: `species-${species.index}-${subspecies.index}-${trait.index}`,
                    label: `${species.name} (${subspecies.name}): ${trait.name}`,
                    choices: normalizeChoices(trait.proficiency_choices)
                })))
            : [])
    ];

    return sources.flatMap((source) => source.choices
        .filter((choice) => !choice.type || choice.type === "proficiencies")
        .flatMap((choice, index) => {
            const options = getChoiceOptions(choice);
            const id = `${source.key}-choice-${index}`;
            const availableOptions = new Set(options.map(getOptionKey));
            const savedChoices = selectedChoices.get(id) || [];
            selectedChoices.set(id, savedChoices.filter((key) => availableOptions.has(key)));

            const outerGroup = {
                id,
                source: source.label,
                description: getChoiceDescription(choice),
                choose: choice.choose || 0,
                options,
                selectionOnly: options.some((option) => Boolean(option.nestedChoice))
            };

            const selectedOption = options.find((option) => (
                option.nestedChoice && savedChoices.includes(getOptionKey(option))
            ));
            if (!selectedOption) {
                return [outerGroup];
            }

            const nestedChoice = selectedOption.nestedChoice;
            const nestedId = `${id}-${getOptionKey(selectedOption)}`;
            const nestedOptions = getChoiceOptions(nestedChoice);
            const nestedSavedChoices = selectedChoices.get(nestedId) || [];
            selectedChoices.set(
                nestedId,
                nestedSavedChoices.filter((key) => nestedOptions.some((option) => getOptionKey(option) === key))
            );
            return [
                outerGroup,
                {
                    id: nestedId,
                    source: `${source.label}: ${selectedOption.name}`,
                    description: capitalizeChoiceLabel(getChoiceDescription(nestedChoice)),
                    choose: nestedChoice.choose || 0,
                    options: nestedOptions
                }
            ];
        }));
}

// [AI-Assisted: Copilot SDK | 2026-11-06]
// Intent: Group proficiency references into skills, tools, and other proficiencies for each selection card.
function summarizeProficiencies(items) {
    const categories = new Map();

    items.forEach((item) => {
        const proficiency = proficiencyRecords.get(item.index) || item;
        const category = getProficiencyCategory(proficiency);

        if (!categories.has(category)) {
            categories.set(category, []);
        }
        categories.get(category).push(displayProficiencyName(proficiency));
    });

    return categories;
}

// [AI-Assisted: Copilot SDK | 2026-11-11]
// Intent: Recognize API skill, tool, instrument, saving-throw, armor, and weapon proficiency references.
function getProficiencyCategory(item) {
    const index = item.index || "";
    const url = item.url || "";
    const type = (item.type || "").toLocaleLowerCase();

    if (index.startsWith("saving-throw-")) {
        return "Saving throws";
    }
    if (index.startsWith("skill-") || url.includes("/skills/") || url.includes("/proficiencies/skill-")) {
        return "Skills";
    }
    if (index.startsWith("tool-")
        || url.includes("/tools/")
        || url.includes("/proficiencies/tool-")
        || type.includes("tool")
        || type.includes("instrument")) {
        return "Tools";
    }
    return "Armor & weapons";
}

// [AI-Assisted: Copilot SDK | 2026-11-11]
// Intent: Render safe, expandable API text while preserving the API's paragraph breaks.
function appendApiDisclosure(container, title, description = "") {
    const disclosure = document.createElement("details");
    disclosure.className = "selection-detail-disclosure";
    const summary = document.createElement("summary");
    summary.textContent = title;
    disclosure.append(summary);
    const content = document.createElement("div");
    content.className = "small mt-2";

    if (description) {
        const text = document.createElement("p");
        text.className = "mb-2";
        text.style.whiteSpace = "pre-line";
        text.textContent = String(description).replaceAll("**", "");
        content.append(text);
    }

    disclosure.append(content);
    container.append(disclosure);
    return content;
}

function appendApiList(container, items, emptyMessage = "") {
    const list = document.createElement("ul");
    list.className = "mb-2";
    const values = items.length ? items : emptyMessage ? [emptyMessage] : [];
    values.forEach((value) => {
        const item = document.createElement("li");
        item.textContent = value;
        list.append(item);
    });
    if (values.length) {
        container.append(list);
    }
}

function appendApiProficiencies(container, detail) {
    const proficiencies = summarizeProficiencies(detail.proficiencies || []);
    proficiencies.forEach((items, category) => {
        appendApiDisclosure(container, `${category} gained`, items.join(", "));
    });

    normalizeChoices(detail.proficiency_choices)
        .filter((choice) => !choice.type || choice.type === "proficiencies")
        .forEach((choice) => {
            appendApiChoiceDisclosure(container, choice, "Additional proficiency choice");
        });
}

function appendApiChoiceDisclosure(container, choice, title) {
    const options = getChoiceOptions(choice);
    const disclosure = appendApiDisclosure(
                container,
                title,
                getChoiceDescription(choice)
            );
    const directOptions = options.filter((option) => !option.nestedChoice).map(displayProficiencyName);
    appendApiList(disclosure, directOptions);
    options.filter((option) => option.nestedChoice).forEach((option) => (
        appendApiChoiceDisclosure(disclosure, option.nestedChoice, capitalizeChoiceLabel(option.name))
    ));
}

function appendApiEquipmentOptions(container, options, title) {
    if (!Array.isArray(options) || !options.length) {
        return;
    }
    options.forEach((option, index) => {
        appendApiDisclosure(container, `${title} ${index + 1}`, option.desc || "No description provided by the API.");
    });
}

// [AI-Assisted: Copilot SDK | 2026-11-11]
// Intent: Display detailed, independently expandable API information for species, classes, and backgrounds.
function renderSelectionDetails(type, data = currentCharacterData, panel = choiceInfoContent) {
    panel.replaceChildren();
    const selectedDetail = data?.[type === "class" ? "classDetails" : type];
    if (!selectedDetail) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "text-body-secondary mb-0";
        emptyMessage.textContent = `Choose a ${type} to find out more.`;
        panel.append(emptyMessage);
        return;
    }

    const renderId = String(Number(panel.dataset.selectionRenderId || 0) + 1);
    panel.dataset.selectionRenderId = renderId;

    if (type === "species") {
        const species = data.species;
        const profile = [
            species.type ? `Creature type: ${species.type}` : "",
            species.size ? `Size: ${species.size}` : "",
            species.speed !== undefined ? `Speed: ${getSpeciesSpeed(species.speed)}` : "",
            species.size_options?.desc || "",
            species.size_options?.from?.options?.length
                ? `Available sizes: ${species.size_options.from.options.map((option) => option.size).filter(Boolean).join(", ")}`
                : ""
        ].filter(Boolean);
        appendApiDisclosure(panel, "Species details", profile.join("\n"));

        const lineageTraits = (data.speciesTraits || []).filter((trait) => (
            (data.speciesSubspecies || []).some(({ subspecies }) => (
                subspecies.index.startsWith(`${trait.index}-`)
            ))
        ));
        (data.speciesTraits || []).filter((trait) => !lineageTraits.includes(trait)).forEach((trait) => {
            const traitContent = appendApiDisclosure(
                panel,
                trait.name,
                trait.description || "No description provided by the API."
            );
            normalizeChoices(trait.proficiency_choices).forEach((choice) => {
                appendApiChoiceDisclosure(traitContent, choice, getChoiceDescription(choice));
            });
        });
        if (!(data.speciesTraits || []).some((trait) => !lineageTraits.includes(trait))) {
            appendApiDisclosure(panel, "Species traits", "No trait details are listed by the API.");
        }
        return;
    }

    if (type === "background") {
        if (selectedDetail.description) {
            appendApiDisclosure(panel, "Background overview", selectedDetail.description);
        }
        const eligibleAbilityNames = Array.isArray(selectedDetail.ability_scores)
            ? [...new Set(selectedDetail.ability_scores
                .map((score) => ABILITIES.find((ability) => ability.key === String(score.index || "").toLowerCase())?.name)
                .filter(Boolean))]
            : [];
        const abilityContent = appendApiDisclosure(panel, "Ability scores you can boost");
        appendApiList(abilityContent, eligibleAbilityNames, "No ability-score options listed by the API.");

        if (data.backgroundFeat) {
            const featName = `${data.backgroundFeat.name}${selectedDetail.feat?.note ? ` (${selectedDetail.feat.note})` : ""}`;
            appendApiDisclosure(
                panel,
                `Origin feat: ${featName}`,
                data.backgroundFeat.description || "No description provided by the API."
            );
        }
        appendApiProficiencies(panel, selectedDetail);
        appendApiEquipmentOptions(panel, selectedDetail.equipment_options, "Starting equipment option");
        return;
    }

    const classFacts = [
        selectedDetail.primary_ability?.desc ? `Primary ability: ${selectedDetail.primary_ability.desc}` : "",
        selectedDetail.hit_die ? `Hit Die: d${selectedDetail.hit_die}` : "",
        Array.isArray(selectedDetail.saving_throws) && selectedDetail.saving_throws.length
            ? `Saving throws: ${selectedDetail.saving_throws.map((save) => save.name).join(", ")}`
            : ""
    ].filter(Boolean);
    appendApiDisclosure(panel, "Class details", classFacts.join("\n"));
    appendApiProficiencies(panel, selectedDetail);
    appendApiEquipmentOptions(panel, selectedDetail.starting_equipment_options, "Starting equipment option");

    if (Array.isArray(data.classSubclasses)) {
        data.classSubclasses.forEach((subclass) => {
            const subclassContent = appendApiDisclosure(
                panel,
                `Subclass: ${subclass.name}${subclass.summary ? ` — ${subclass.summary}` : ""}`,
                subclass.description || "No description provided by the API."
            );
            (subclass.features || []).forEach((feature) => {
                appendApiDisclosure(
                    subclassContent,
                    `Level ${feature.level}: ${feature.name}`,
                    feature.description || "No description provided by the API."
                );
            });
        });
    }

    if (selectedDetail.class_levels) {
        appendClassLevelOneFeatures(selectedDetail, panel, renderId);
    }
}

// [AI-Assisted: Copilot SDK | 2026-11-11]
// Intent: Show each API-backed level-one class feature as an expandable description.
async function appendClassLevelOneFeatures(classDetails, panel, renderId) {
    try {
        const classLevel = await fetchApi(`${classDetails.class_levels}/1`);
        const features = await Promise.all(classLevel.features.map((feature) => fetchApi(feature.url)));
        if (panel.dataset.selectionRenderId !== renderId) {
            return;
        }

        const heading = document.createElement("h3");
        heading.className = "h6 mt-3";
        heading.textContent = "Level 1 class features";
        panel.append(heading);
        features.forEach((feature) => {
            appendApiDisclosure(
                panel,
                feature.name,
                feature.description || "No description provided by the API."
            );
        });
    } catch (error) {
        if (panel.dataset.selectionRenderId !== renderId) {
            return;
        }
        const errorMessage = document.createElement("p");
        errorMessage.className = "text-danger mb-0";
        errorMessage.textContent = `Could not load class features: ${error.message}`;
        panel.append(errorMessage);
        console.error(`Could not load level-one features for ${classDetails.name}:`, error);
    }
}

// [AI-Assisted: Copilot SDK | 2026-11-06]
// Intent: Render proficiency choice checkboxes and enforce each API group's selection limit.
function renderChoiceGroups() {
    choiceGroupsElement.replaceChildren();
    renderBackgroundBonusControls();
    const groups = getChoiceGroups();
    choicePrompt.textContent = groups.length
        ? "Make the number of selections listed in each group."
        : "These selections do not add any selectable proficiencies.";

    groups.forEach((group) => {
        const column = document.createElement("div");
        column.className = "col-12";

        const fieldset = document.createElement("fieldset");
        fieldset.className = "border rounded p-3";

        const legend = document.createElement("legend");
        legend.className = "float-none w-auto px-2 fs-6 fw-semibold";
        legend.textContent = group.source;
        fieldset.append(legend);

        const description = document.createElement("p");
        description.className = "text-body-secondary";
        description.textContent = group.description;
        fieldset.append(description);

        const chosen = selectedChoices.get(group.id) || [];
        group.options.forEach((option) => {
            const wrapper = document.createElement("div");
            wrapper.className = "form-check";

            const checkbox = document.createElement("input");
            checkbox.className = "form-check-input";
            checkbox.type = "checkbox";
            checkbox.id = `${group.id}-${getOptionKey(option)}`;
            checkbox.value = getOptionKey(option);
            checkbox.checked = chosen.includes(checkbox.value);
            checkbox.disabled = group.choose > 0 && chosen.length >= group.choose && !checkbox.checked;

            const label = document.createElement("label");
            label.className = "form-check-label";
            label.htmlFor = checkbox.id;
            label.textContent = displayProficiencyName(option);

            checkbox.addEventListener("change", () => {
                const saved = selectedChoices.get(group.id) || [];
                const next = checkbox.checked
                    ? [...saved, checkbox.value]
                    : saved.filter((key) => key !== checkbox.value);

                if (next.length > group.choose) {
                    checkbox.checked = false;
                    return;
                }

                selectedChoices.set(group.id, next);
                renderChoiceGroups();
            });

            wrapper.append(checkbox, label);
            fieldset.append(wrapper);
        });

        if (group.options.length === 0) {
            const unavailable = document.createElement("p");
            unavailable.className = "text-danger mb-0";
            unavailable.textContent = "The API did not provide options for this proficiency choice.";
            fieldset.append(unavailable);
        }

        column.append(fieldset);
        choiceGroupsElement.append(column);
    });

    updateFinishButton();
}

// [AI-Assisted: Copilot SDK | 2026-11-10]
// Intent: Enable Done only when proficiency choices and background score bonuses are complete.
function updateFinishButton() {
    const groups = getChoiceGroups();
    const proficienciesComplete = groups.every((group) => group.options.length > 0
        ? (selectedChoices.get(group.id) || []).length === group.choose
        : group.choose === 0);
    const bonusesComplete = areBackgroundBonusesAssigned();
    const complete = proficienciesComplete && bonusesComplete;
    finishButton.disabled = !complete;
    choiceStatus.textContent = !proficienciesComplete
        ? "Complete each proficiency choice group to continue."
        : bonusesComplete
            ? "Proficiency and background bonus choices are complete."
            : "Choose the background ability-score bonuses to continue.";
}

// [AI-Assisted: Copilot SDK | 2026-11-06]
// Intent: Merge the character's fixed and selected proficiencies, retaining duplicate sources.
function collectProficiencies() {
    if (!currentCharacterData) {
        return [];
    }

    const entries = new Map();
    const addItems = (items, source) => {
        items.forEach((item) => {
            const proficiency = proficiencyRecords.get(item.index) || item;
            const name = displayProficiencyName(proficiency);
            const category = getProficiencyCategory(proficiency);
            const key = `${category}:${name.toLocaleLowerCase()}`;
            const existing = entries.get(key);

            if (existing) {
                existing.sources.add(source);
            } else {
                entries.set(key, { category, name, sources: new Set([source]) });
            }
        });
    };

    const { classDetails, background } = currentCharacterData;
    addItems(classDetails.proficiencies || [], `${classDetails.name} class`);
    addItems(background.proficiencies || [], `${background.name} background`);

    getChoiceGroups().forEach((group) => {
        if (group.selectionOnly) {
            return;
        }
        const chosen = new Set(selectedChoices.get(group.id) || []);
        addItems(
            group.options.filter((option) => chosen.has(getOptionKey(option))),
            group.source
        );
    });

    return [...entries.values()].sort((first, second) => (
        first.category.localeCompare(second.category) || first.name.localeCompare(second.name)
    ));
}

// [AI-Assisted: Copilot SDK | 2026-11-06]
// Intent: Calculate the spent point-buy budget using the standard 8–15 score costs.
function getPointsSpent() {
    return Object.values(abilityScores).reduce((total, score) => total + POINT_COSTS[score], 0);
}

// [AI-Assisted: Copilot SDK | 2026-11-10]
// Intent: Render ability scores, background bonuses, score tiles, and proficiency-aware controls.
function renderPointBuy() {
    abilityScoresElement.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((button) => {
        bootstrap.Tooltip.getInstance(button)?.dispose();
    });
    abilityScoresElement.replaceChildren();
    standardArrayPool.replaceChildren();
    standardArrayPool.classList.toggle("d-none", scoreMethod !== "standard-array");

    const proficientSkills = new Set(
        collectProficiencies()
            .filter((item) => item.category === "Skills")
            .map((item) => item.name.toLocaleLowerCase())
    );

    // [AI-Assisted: Copilot SDK | 2026-11-10]
    // Intent: Put the fixed Standard Array scores in a draggable row above the ability targets.
    if (scoreMethod === "standard-array") {
        STANDARD_ARRAY.forEach((value) => {
            const scoreBlock = document.createElement("button");
            scoreBlock.className = "standard-array-score";
            scoreBlock.type = "button";
            scoreBlock.draggable = true;
            scoreBlock.textContent = value;
            const assignedAbility = ABILITIES.find((ability) => standardArrayScores[ability.key] === value);
            scoreBlock.setAttribute(
                "aria-label",
                assignedAbility
                    ? `Standard Array score ${value}, assigned to ${assignedAbility.name}`
                    : `Standard Array score ${value}, unassigned`
            );
            scoreBlock.setAttribute("aria-pressed", selectedStandardArrayScore === value ? "true" : "false");
            scoreBlock.classList.toggle("is-selected", selectedStandardArrayScore === value);
            scoreBlock.classList.toggle(
                "is-assigned",
                Object.values(standardArrayScores).includes(value)
            );
            scoreBlock.addEventListener("click", () => {
                selectedStandardArrayScore = selectedStandardArrayScore === value ? null : value;
                standardArrayPool.querySelectorAll(".standard-array-score").forEach((block) => {
                    const isSelected = Number(block.textContent) === selectedStandardArrayScore;
                    block.classList.toggle("is-selected", isSelected);
                    block.setAttribute("aria-pressed", String(isSelected));
                });
            });
            scoreBlock.addEventListener("dragstart", (event) => {
                event.dataTransfer.setData("text/plain", String(value));
                event.dataTransfer.effectAllowed = "move";
            });
            standardArrayPool.append(scoreBlock);
        });
    }

    ABILITIES.forEach((ability) => {
        const column = document.createElement("div");
        column.className = "ability-score-column col-4";

        const card = document.createElement("article");
        card.className = "ability-score-card d-flex flex-column";

        const scoreDisplay = document.createElement("div");
        scoreDisplay.className = "ability-score-display";

        const abbreviation = document.createElement("span");
        abbreviation.className = "ability-score-abbreviation";
        abbreviation.textContent = ability.key.toUpperCase();
        abbreviation.setAttribute("aria-label", ability.name);

        const score = document.createElement("output");
        score.className = "ability-score-value";
        score.id = `${ability.key}-score`;
        score.setAttribute("aria-live", "polite");
        score.setAttribute("aria-label", `${ability.name} score`);

        const scoreNumber = document.createElement("span");
        scoreNumber.className = "ability-score-number";
        const modifier = document.createElement("span");
        modifier.className = "ability-score-modifier";
        modifier.setAttribute("aria-hidden", "true");
        score.append(scoreNumber, modifier);
        const backgroundBonus = getBackgroundAbilityBonus(ability.key);
        scoreNumber.classList.toggle("background-bonus-one", backgroundBonus === 1);
        scoreNumber.classList.toggle("background-bonus-two", backgroundBonus === 2);

        let decrease = null;
        let increase = null;
        if (scoreMethod === "point-buy") {
            const baseScore = abilityScores[ability.key];
            const currentScore = baseScore + backgroundBonus;
            const currentModifier = getAbilityModifier(currentScore);
            scoreNumber.textContent = currentScore;
            modifier.textContent = formatModifier(currentModifier);
            score.setAttribute(
                "aria-label",
                `${ability.name} score ${currentScore}, modifier ${formatModifier(currentModifier)}`
            );
            decrease = document.createElement("button");
            decrease.className = "btn btn-outline-secondary";
            decrease.type = "button";
            decrease.textContent = "-";
            decrease.setAttribute("aria-label", `Decrease ${ability.name}`);
            decrease.disabled = baseScore <= 8;
            decrease.addEventListener("click", () => changeAbilityScore(ability.key, -1));

            increase = document.createElement("button");
            increase.className = "btn btn-outline-secondary";
            increase.type = "button";
            increase.textContent = "+";
            increase.setAttribute("aria-label", `Increase ${ability.name}`);
            const increaseCost = baseScore < 15
                ? POINT_COSTS[baseScore + 1] - POINT_COSTS[baseScore]
                : Infinity;
            increase.disabled = baseScore >= 15 || increaseCost > POINT_BUY_BUDGET - getPointsSpent();
            increase.addEventListener("click", () => changeAbilityScore(ability.key, 1));
        } else {
            const baseScore = standardArrayScores[ability.key];
            const currentScore = baseScore === null ? null : baseScore + backgroundBonus;
            const currentModifier = currentScore === null ? null : getAbilityModifier(currentScore);
            scoreNumber.textContent = currentScore ?? "—";
            modifier.textContent = currentModifier === null ? "—" : formatModifier(currentModifier);
            score.classList.toggle("is-empty", currentScore === null);
            score.setAttribute("role", "button");
            score.setAttribute("tabindex", "0");
            score.setAttribute(
                "aria-label",
                currentScore === null
                    ? `${ability.name} score drop target, unassigned`
                    : `${ability.name} score ${currentScore}, modifier ${formatModifier(currentModifier)}`
            );
            score.addEventListener("click", () => {
                if (selectedStandardArrayScore !== null) {
                    assignStandardArrayScore(ability.key, selectedStandardArrayScore);
                }
            });
            score.addEventListener("keydown", (event) => {
                if ((event.key === "Enter" || event.key === " ") && selectedStandardArrayScore !== null) {
                    event.preventDefault();
                    assignStandardArrayScore(ability.key, selectedStandardArrayScore);
                }
            });
            score.addEventListener("dragover", (event) => {
                event.preventDefault();
                score.classList.add("is-drop-target");
            });
            score.addEventListener("dragleave", () => score.classList.remove("is-drop-target"));
            score.addEventListener("drop", (event) => {
                event.preventDefault();
                score.classList.remove("is-drop-target");
                assignStandardArrayScore(ability.key, Number(event.dataTransfer.getData("text/plain")));
            });
        }

        scoreDisplay.append(abbreviation, score);

        const controls = document.createElement("div");
        controls.className = "ability-score-controls";

        const info = document.createElement("button");
        info.className = "btn btn-outline-light rounded-circle";
        info.type = "button";
        info.textContent = "i";
        info.setAttribute("aria-label", `${ability.name} description and skills`);
        info.setAttribute("data-bs-toggle", "tooltip");
        info.setAttribute("data-bs-html", "true");
        info.setAttribute("data-bs-placement", "top");

        const skillDetails = ability.skills.length
            ? ability.skills.map((skill) => {
                const isProficient = proficientSkills.has(skill.toLocaleLowerCase());
                return `${skill} — ${isProficient ? "Proficient" : "Not proficient"}`;
            }).join("<br>")
            : "No skills are associated with Constitution.";
        info.setAttribute(
            "title",
            `<strong>${ability.name}</strong><br>${ability.summary}<br><br><strong>Skills</strong><br>${skillDetails}`
        );

        if (scoreMethod === "point-buy") {
            controls.append(decrease, info, increase);
        } else {
            decrease = document.createElement("button");
            decrease.className = "btn btn-outline-light rounded-circle";
            decrease.type = "button";
            decrease.textContent = "-";
            decrease.disabled = true;
            decrease.setAttribute("aria-label", `Decrease ${ability.name}`);

            increase = document.createElement("button");
            increase.className = "btn btn-outline-light rounded-circle";
            increase.type = "button";
            increase.textContent = "+";
            increase.disabled = true;
            increase.setAttribute("aria-label", `Increase ${ability.name}`);
            controls.append(decrease, info, increase);
        }

        card.append(scoreDisplay, controls);
        column.append(card);
        abilityScoresElement.append(column);
        bootstrap.Tooltip.getOrCreateInstance(info, { html: true });
    });

    updatePointBuyTotals();
}

// [AI-Assisted: Copilot SDK | 2026-11-10]
// Intent: Render the two legal 2024 background ability-score bonus distributions.
function renderBackgroundBonusControls() {
    backgroundBonusControls.replaceChildren();
    const eligibleAbilities = getBackgroundAbilityKeys();
    backgroundBonusControls.classList.toggle("d-none", eligibleAbilities.length !== 3);
    if (eligibleAbilities.length !== 3) {
        return;
    }

    const heading = document.createElement("h2");
    heading.className = "h6 mb-2";
    heading.textContent = "Background ability-score bonuses";

    const description = document.createElement("p");
    description.className = "small text-body-secondary mb-1";
    description.textContent = `Eligible: ${eligibleAbilities.map((key) => (
        ABILITIES.find((ability) => ability.key === key).name
    )).join(", ")}. Choose +2/+1 or +1 to each.`;

    const modeLabel = document.createElement("label");
    modeLabel.className = "small fw-semibold";
    modeLabel.htmlFor = "background-bonus-mode";
    modeLabel.textContent = "Distribution";

    const modeSelect = document.createElement("select");
    modeSelect.id = "background-bonus-mode";
    modeSelect.className = "form-select form-select-sm background-bonus-select";
    [
        ["two-one", "One +2, one +1"],
        ["one-each", "+1 to all three"]
    ].forEach(([value, label]) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = label;
        option.selected = backgroundBonusMode === value;
        modeSelect.append(option);
    });
    modeSelect.addEventListener("change", () => {
        backgroundBonusMode = modeSelect.value;
        renderBackgroundBonusControls();
        updateFinishButton();
    });

    backgroundBonusControls.append(heading, description, modeLabel, modeSelect);
    if (backgroundBonusMode === "one-each") {
        return;
    }

    const assignments = document.createElement("div");
    assignments.className = "row g-2 mt-1";
    [
        ["two", "Add +2 to"],
        ["one", "Add +1 to"]
    ].forEach(([assignment, label]) => {
        const column = document.createElement("div");
        column.className = "col-6 col-md-4";
        const selectLabel = document.createElement("label");
        selectLabel.className = "small fw-semibold";
        selectLabel.htmlFor = `background-bonus-${assignment}`;
        selectLabel.textContent = label;

        const select = document.createElement("select");
        select.id = `background-bonus-${assignment}`;
        select.className = "form-select form-select-sm background-bonus-select";
        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "Choose an ability";
        select.append(placeholder);
        eligibleAbilities.forEach((key) => {
            const ability = ABILITIES.find((item) => item.key === key);
            const option = document.createElement("option");
            option.value = key;
            option.textContent = ability.name;
            option.selected = backgroundBonusAssignments[assignment] === key;
            option.disabled = backgroundBonusAssignments[assignment === "two" ? "one" : "two"] === key;
            select.append(option);
        });
        select.addEventListener("change", () => {
            backgroundBonusAssignments[assignment] = select.value;
            renderBackgroundBonusControls();
            updateFinishButton();
        });

        column.append(selectLabel, select);
        assignments.append(column);
    });
    backgroundBonusControls.append(assignments);
}

// [AI-Assisted: Copilot SDK | 2026-11-10]
// Intent: Read the ability scores eligible for bonuses from the selected background's API data.
function getBackgroundAbilityKeys() {
    const scores = currentCharacterData?.background?.ability_scores;
    if (!Array.isArray(scores)) {
        return [];
    }
    return [...new Set(scores
        .map((score) => String(score.index || "").toLowerCase())
        .filter((key) => ABILITIES.some((ability) => ability.key === key)))];
}

// [AI-Assisted: Copilot SDK | 2026-11-10]
// Intent: Return the selected 2024 background's bonus for one ability score.
function getBackgroundAbilityBonus(abilityKey) {
    if (!getBackgroundAbilityKeys().includes(abilityKey)) {
        return 0;
    }
    if (backgroundBonusMode === "one-each") {
        return 1;
    }
    if (backgroundBonusAssignments.two === abilityKey) {
        return 2;
    }
    if (backgroundBonusAssignments.one === abilityKey) {
        return 1;
    }
    return 0;
}

// [AI-Assisted: Copilot SDK | 2026-11-10]
// Intent: Require a complete, non-conflicting background bonus assignment before proceeding.
function areBackgroundBonusesAssigned() {
    if (getBackgroundAbilityKeys().length !== 3) {
        return true;
    }
    return backgroundBonusMode === "one-each"
        || Boolean(
            backgroundBonusAssignments.two
            && backgroundBonusAssignments.one
            && backgroundBonusAssignments.two !== backgroundBonusAssignments.one
        );
}

// [AI-Assisted: Copilot SDK | 2026-11-06]
// Intent: Change one score only when it stays within the point-buy limits.
function changeAbilityScore(abilityKey, direction) {
    const currentScore = abilityScores[abilityKey];
    const nextScore = currentScore + direction;

    if (nextScore < 8 || nextScore > 15) {
        return;
    }

    const nextCost = POINT_COSTS[nextScore] - POINT_COSTS[currentScore];
    const pointsRemaining = POINT_BUY_BUDGET - getPointsSpent();
    if (direction > 0 && nextCost > pointsRemaining) {
        pointBuyStatus.textContent = "Not enough points remaining for that increase.";
        return;
    }

    abilityScores[abilityKey] = nextScore;
    pointBuyStatus.textContent = "";
    renderPointBuy();
}

// [AI-Assisted: Copilot SDK | 2026-11-10]
// Intent: Assign a Standard Array block to an ability while freeing any replaced score.
function assignStandardArrayScore(abilityKey, nextScore) {
    if (!STANDARD_ARRAY.includes(nextScore)) {
        return;
    }

    ABILITIES.forEach((ability) => {
        if (standardArrayScores[ability.key] === nextScore) {
            standardArrayScores[ability.key] = null;
        }
    });
    standardArrayScores[abilityKey] = nextScore;
    selectedStandardArrayScore = null;
    pointBuyStatus.textContent = "";
    renderPointBuy();
}

// [AI-Assisted: Copilot SDK | 2026-11-10]
// Intent: Keep score-method and background-bonus completion gates synchronized.
function updatePointBuyTotals() {
    finishPointBuyButton.textContent = "Continue to backstory";
    if (scoreMethod === "standard-array") {
        pointsRemainingElement.textContent = "Standard Array";
        const allScoresAssigned = ABILITIES.every((ability) => standardArrayScores[ability.key] !== null);
        const bonusesAssigned = areBackgroundBonusesAssigned();
        finishPointBuyButton.disabled = !allScoresAssigned || !bonusesAssigned;
        finishPointBuyButton.title = allScoresAssigned && bonusesAssigned
            ? "Continue to character details"
            : !allScoresAssigned
                ? "Assign each Standard Array score to an ability."
                : "Choose the background ability-score bonuses.";
        return;
    }

    const remaining = POINT_BUY_BUDGET - getPointsSpent();
    pointsRemainingElement.textContent = `Points remaining: ${remaining}`;
    const bonusesAssigned = areBackgroundBonusesAssigned();
    finishPointBuyButton.disabled = remaining !== 0 || !bonusesAssigned;
    finishPointBuyButton.title = remaining !== 0
        ? "Spend all 27 points before finishing."
        : bonusesAssigned
            ? "Continue to character details"
            : "Choose the background ability-score bonuses.";
}

// [AI-Assisted: Copilot SDK | 2026-11-06]
// Intent: Switch score assignment rules and update the guidance shown for the active method.
function setScoreMethod(method) {
    scoreMethod = method;
    scoreMethodDescription.textContent = method === "standard-array"
        ? "Drag a score to an ability, or tap a score then an ability. Use each score once."
        : "Spend 27 points on scores 8 to 15. Use the i buttons for ability and skill details.";
    pointBuyStatus.textContent = "";
    finishPointBuyButton.textContent = "Continue to backstory";
    renderPointBuy();
}

// [AI-Assisted: Copilot SDK | 2026-11-10]
// Intent: Return the final score after applying the selected background bonus.
function getActiveAbilityScore(abilityKey) {
    const baseScore = scoreMethod === "point-buy"
        ? abilityScores[abilityKey]
        : standardArrayScores[abilityKey];
    return baseScore
        + getBackgroundAbilityBonus(abilityKey)
        + (characterAdvancement.abilityBonuses[abilityKey] || 0);
}

// [AI-Generated: Copilot SDK | 2026-11-06] Intent: Convert a D&D ability score to its modifier.
function getAbilityModifier(score) {
    return Math.floor((score - 10) / 2);
}

// [AI-Generated: Copilot SDK | 2026-11-06] Intent: Format positive modifiers with an explicit plus sign.
function formatModifier(modifier) {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

// [AI-Assisted: Copilot SDK | 2026-11-06]
// Intent: Calculate armor class from worn armor, Dexterity, and the optional shield.
function getArmorClass() {
    return getArmorClassFor(armorChoiceSelect.value);
}

// [AI-Assisted: Copilot SDK | 2026-11-10]
// Intent: Calculate AC for the selected or recommended armor using armor, ability, and shield rules.
function getArmorClassFor(armorKey, includeShield = wearingShieldInput.checked) {
    const armor = ARMOR_OPTIONS[armorKey] || ARMOR_OPTIONS.unarmored;
    const dexterityModifier = getAbilityModifier(getActiveAbilityScore("dex"));
    const className = currentCharacterData?.classDetails.name.toLocaleLowerCase();
    const shieldBonus = includeShield ? 2 : 0;
    if (armorKey === "unarmored" && className === "barbarian") {
        return 10 + dexterityModifier
            + getAbilityModifier(getActiveAbilityScore("con"))
            + shieldBonus;
    }
    if (armorKey === "unarmored"
        && className === "monk"
        && !includeShield) {
        return 10 + dexterityModifier + getAbilityModifier(getActiveAbilityScore("wis"));
    }

    const armorDexterity = armor.dexCap === Infinity
        ? dexterityModifier
        : armor.proficiency === "heavy armor"
            ? 0
            : Math.min(dexterityModifier, armor.dexCap);
    return armor.base + armorDexterity + shieldBonus;
}

// [AI-Assisted: Copilot SDK | 2026-11-10]
// Intent: Explain the selected armor's AC formula and proficiency requirements on the character sheet.
function getArmorEffectDescription(armorKey, includeShield = wearingShieldInput.checked) {
    const armor = ARMOR_OPTIONS[armorKey] || ARMOR_OPTIONS.unarmored;
    const dexterityModifier = getAbilityModifier(getActiveAbilityScore("dex"));
    const className = currentCharacterData?.classDetails.name.toLocaleLowerCase();
    const shieldBonus = includeShield ? 2 : 0;

    if (armorKey === "unarmored" && className === "barbarian") {
        return `Unarmored Defense: AC = 10 + ${formatModifier(dexterityModifier)} Dexterity + ${formatModifier(
            getAbilityModifier(getActiveAbilityScore("con"))
        )} Constitution${includeShield ? " + 2 from your shield" : ""}.`;
    }
    if (armorKey === "unarmored" && className === "monk" && !includeShield) {
        return `Unarmored Defense: AC = 10 + ${formatModifier(dexterityModifier)} Dexterity + ${formatModifier(
            getAbilityModifier(getActiveAbilityScore("wis"))
        )} Wisdom. Wearing armor or using a shield turns off this benefit.`;
    }

    const dexterityRule = armor.dexCap === Infinity
        ? `add your full Dexterity modifier (${formatModifier(dexterityModifier)})`
        : armor.dexCap === 0
            ? "do not add a Dexterity modifier"
            : `add your Dexterity modifier, up to +${armor.dexCap} (current ${formatModifier(
                Math.min(dexterityModifier, armor.dexCap)
            )})`;
    const shieldRule = includeShield ? " A shield adds +2 AC." : "";
    const proficiencyRule = armor.proficiency
        ? ` Requires ${armor.proficiency} proficiency.`
        : "";
    const unarmoredDefenseRule = ["barbarian", "monk"].includes(className)
        ? ` ${className === "barbarian" ? "Barbarian" : "Monk"} Unarmored Defense does not apply while wearing armor.`
        : "";
    const strengthRule = armor.strengthRequirement
        ? ` Requires Strength ${armor.strengthRequirement} to avoid the heavy-armor speed penalty.`
        : "";
    const stealthRule = armor.stealthDisadvantage
        ? " This armor gives you disadvantage on Dexterity (Stealth) checks."
        : "";
    const monkShieldRule = armorKey === "unarmored" && className === "monk" && includeShield
        ? " A shield turns off Monk Unarmored Defense."
        : "";
    return `AC = ${armor.base} + ${dexterityRule}.${shieldRule}${proficiencyRule}${strengthRule}${stealthRule}${unarmoredDefenseRule}${monkShieldRule}`;
}

// [AI-Assisted: Copilot SDK | 2026-11-10]
// Intent: Recommend the highest-AC armor the character is proficient and strong enough to use.
function getRecommendedArmor() {
    const armorProficiencies = collectProficiencies()
        .filter((item) => item.category === "Armor & weapons")
        .map((item) => item.name.toLocaleLowerCase());
    const strength = getActiveAbilityScore("str");
    const candidates = Object.entries(ARMOR_OPTIONS)
        .filter(([, armor]) => (
            !armor.proficiency
            || armorProficiencies.includes("all armor")
            || armorProficiencies.includes(armor.proficiency)
        ))
        .filter(([, armor]) => !armor.strengthRequirement || strength >= armor.strengthRequirement)
        .map(([key, armor]) => ({
            key,
            armor,
            armorClass: getArmorClassFor(key, false)
        }))
        .sort((first, second) => second.armorClass - first.armorClass);
    return candidates[0];
}

// [AI-Assisted: Copilot SDK | 2026-11-10]
// Intent: Report armor and shield proficiency issues consistently in the backstory form and final sheet.
function getArmorWarnings(armorKey, includeShield = wearingShieldInput.checked) {
    const armor = ARMOR_OPTIONS[armorKey] || ARMOR_OPTIONS.unarmored;
    const armorProficiencies = collectProficiencies()
        .filter((item) => item.category === "Armor & weapons")
        .map((item) => item.name.toLocaleLowerCase());
    const warnings = [];

    if (armor.proficiency
        && !armorProficiencies.includes("all armor")
        && !armorProficiencies.includes(armor.proficiency)) {
        warnings.push(`Your selections do not list proficiency with ${armor.proficiency}.`);
    }
    if (armor.strengthRequirement && getActiveAbilityScore("str") < armor.strengthRequirement) {
        warnings.push(
            `Your Strength is below ${armor.strengthRequirement}; this heavy armor reduces your Speed by 10 feet.`
        );
    }
    if (includeShield
        && !armorProficiencies.some((name) => name === "shield" || name === "shields")) {
        warnings.push("Your selections do not list proficiency with shields.");
    }

    return warnings;
}

// [AI-Assisted: Copilot SDK | 2026-11-12]
// Intent: Group armor by proficiency and Strength requirements and let a player select any listed armor.
function renderArmorChoiceList() {
    armorChoiceList.replaceChildren();
    const armorProficiencies = collectProficiencies()
        .filter((item) => item.category === "Armor & weapons")
        .map((item) => item.name.toLocaleLowerCase());
    const available = [];
    const unavailable = [];

    Object.entries(ARMOR_OPTIONS).forEach(([key, armor]) => {
        const proficient = !armor.proficiency
            || armorProficiencies.includes("all armor")
            || armorProficiencies.includes(armor.proficiency);
        const strengthMet = !armor.strengthRequirement || getActiveAbilityScore("str") >= armor.strengthRequirement;
        const status = !proficient
            ? `Not proficient with ${armor.proficiency}.`
            : !strengthMet
                ? `Strength ${armor.strengthRequirement} required to avoid the heavy-armor Speed penalty.`
                : armor.proficiency
                    ? `Proficient with ${armor.proficiency}.`
                    : "No armor proficiency required.";
        (proficient && strengthMet ? available : unavailable).push({ key, armor, status });
    });

    const appendArmorGroup = (title, items, emptyMessage) => {
        const fieldset = document.createElement("fieldset");
        fieldset.className = "border rounded p-3";
        const legend = document.createElement("legend");
        legend.className = "float-none w-auto px-2 fs-6 fw-semibold";
        legend.textContent = title;
        fieldset.append(legend);

        if (!items.length) {
            const empty = document.createElement("p");
            empty.className = "small text-body-secondary mb-0";
            empty.textContent = emptyMessage;
            fieldset.append(empty);
        } else {
            const options = document.createElement("div");
            options.className = "row g-2";
            items.forEach(({ key, armor, status }) => {
                const column = document.createElement("div");
                column.className = "col-12 col-sm-6";
                const label = document.createElement("label");
                label.className = "d-flex gap-2 border rounded p-2 h-100";
                label.htmlFor = `armor-option-${key}`;
                const input = document.createElement("input");
                input.className = "form-check-input flex-shrink-0 mt-1";
                input.type = "radio";
                input.name = "armor-option";
                input.id = `armor-option-${key}`;
                input.value = key;
                input.checked = armorChoiceSelect.value === key;
                input.addEventListener("change", () => {
                    armorChoiceSelect.value = key;
                    updateArmorPreview();
                });
                const detail = document.createElement("span");
                detail.className = "small";
                const name = document.createElement("span");
                name.className = "d-block fw-semibold";
                name.textContent = `${armor.label} · AC ${getArmorClassFor(key, false)}`;
                const statusText = document.createElement("span");
                statusText.className = "d-block text-body-secondary";
                statusText.textContent = status;
                detail.append(name, statusText);
                label.append(input, detail);
                column.append(label);
                options.append(column);
            });
            fieldset.append(options);
        }
        armorChoiceList.append(fieldset);
    };

    appendArmorGroup("Proficient and meets requirements", available, "");
    appendArmorGroup("Not proficient or requirement not met", unavailable, "");
}

function getEquipmentItemLabel(item) {
    if (item.option_type === "money") {
        return `${item.count} ${String(item.unit || "gp").toLocaleUpperCase()}`;
    }
    if (item.option_type === "choice") {
        const choice = item.choice || {};
        const category = choice.from?.equipment_category?.name;
        return `${choice.desc || `Choose ${choice.choose || 1} item(s)`}${category ? ` (${category})` : ""}`;
    }
    const reference = item.of || item.item || item;
    const name = reference.note ? `${reference.name} (${reference.note})` : reference.name;
    if (!name) {
        return item.desc || "Equipment choice";
    }
    return Number(item.count) > 1 ? `${item.count} ${name}` : name;
}

// [AI-Assisted: Copilot SDK | 2026-11-12]
// Intent: Render class and background equipment packages as selectable item lists instead of description-only dropdowns.
function renderStartingEquipmentChoices() {
    startingEquipmentChoices.replaceChildren();
    const groups = [
        {
            source: "class",
            label: `${currentCharacterData.classDetails.name} class`,
            choices: currentCharacterData.classDetails.starting_equipment_options || []
        },
        {
            source: "background",
            label: `${currentCharacterData.background.name} background`,
            choices: currentCharacterData.background.equipment_options || []
        }
    ];

    groups.forEach(({ source, label, choices }) => {
        choices.forEach((group, groupIndex) => {
            const optionList = group.from?.options || [];
            if (!optionList.length) {
                return;
            }
            const key = `${source}-${groupIndex}`;
            if (!selectedStartingEquipment.has(key)) {
                selectedStartingEquipment.set(key, 0);
            }
            const column = document.createElement("div");
            column.className = "col-12 col-lg-6";
            const fieldset = document.createElement("fieldset");
            fieldset.className = "border rounded p-3 h-100";
            const legend = document.createElement("legend");
            legend.className = "float-none w-auto px-2 fs-6 fw-semibold";
            legend.textContent = `${label} starting gear`;
            fieldset.append(legend);

            optionList.forEach((option, optionIndex) => {
                const wrapper = document.createElement("div");
                wrapper.className = "form-check border rounded p-3 mb-2";
                const input = document.createElement("input");
                input.className = "form-check-input";
                input.type = "radio";
                input.name = `starting-equipment-${key}`;
                input.id = `starting-equipment-${key}-${optionIndex}`;
                input.checked = selectedStartingEquipment.get(key) === optionIndex;
                input.addEventListener("change", () => {
                    selectedStartingEquipment.set(key, optionIndex);
                });
                const labelElement = document.createElement("label");
                labelElement.className = "form-check-label fw-semibold";
                labelElement.htmlFor = input.id;
                labelElement.textContent = `Option ${String.fromCharCode(65 + optionIndex)}`;

                const items = option.option_type === "manual_equipment"
                    ? [option.desc]
                    : option.option_type === "multiple"
                        ? (option.items || []).map(getEquipmentItemLabel)
                        : [getEquipmentItemLabel(option)];
                const list = document.createElement("ul");
                list.className = "small mt-2 mb-0";
                items.forEach((itemText) => {
                    const item = document.createElement("li");
                    item.textContent = itemText;
                    list.append(item);
                });
                wrapper.append(input, labelElement, list);
                fieldset.append(wrapper);
            });

            if (group.desc) {
                const note = document.createElement("p");
                note.className = "small text-body-secondary mb-0";
                note.textContent = group.desc;
                fieldset.append(note);
            }
            column.append(fieldset);
            startingEquipmentChoices.append(column);
        });
    });
}

// [AI-Assisted: Copilot SDK | 2026-11-12]
// Intent: Offer one optional extra weapon from the selected class's API-defined weapon proficiencies.
async function renderClassWeaponChoices() {
    const requestId = ++weaponChoiceRequestId;
    classWeaponChoice.replaceChildren();
    const noWeapon = document.createElement("option");
    noWeapon.value = "";
    noWeapon.textContent = "No additional weapon";
    classWeaponChoice.append(noWeapon);
    classWeaponChoice.disabled = true;
    classWeaponStatus.textContent = "Loading weapons allowed by your class proficiencies…";

    const proficiencies = currentCharacterData.classDetails.proficiencies || [];
    const proficiencyNames = proficiencies.map((item) => item.name.toLocaleLowerCase());
    const categories = [];
    if (proficiencyNames.some((name) => name.includes("simple weapon"))) {
        categories.push("simple-weapons");
    }
    if (proficiencyNames.some((name) => name.includes("martial weapon"))) {
        categories.push("martial-weapons");
    }
    const specificProficiencies = proficiencyNames.filter((name) => (
        !name.includes("simple weapon") && !name.includes("martial weapon")
    ));
    if (!categories.length && !specificProficiencies.length) {
        classWeaponStatus.textContent = "No simple or martial weapon proficiency is listed for this class.";
        return;
    }

    try {
        const lists = await Promise.all(["simple-weapons", "martial-weapons"].map((category) => (
            fetchApi(`${API_ROOT}/equipment-categories/${category}`)
        )));
        if (requestId !== weaponChoiceRequestId) {
            return;
        }
        const simpleWeapons = lists[0].equipment || [];
        const martialWeapons = lists[1].equipment || [];
        const allowed = [
            ...(categories.includes("simple-weapons") ? simpleWeapons : []),
            ...(categories.includes("martial-weapons") ? martialWeapons : []),
            ...[...simpleWeapons, ...martialWeapons].filter((weapon) => specificProficiencies.some((name) => (
                name.replace(/s$/, "").includes(weapon.name.toLocaleLowerCase().replace(/s$/, ""))
            )))
        ];
        const weaponOptions = [...new Map(allowed.map((weapon) => [weapon.index, weapon])).values()]
            .sort((first, second) => first.name.localeCompare(second.name));
        weaponOptions.forEach((weapon) => {
            const option = document.createElement("option");
            option.value = weapon.index;
            option.textContent = weapon.name;
            classWeaponChoice.append(option);
        });
        classWeaponChoice.value = additionalWeaponName;
        classWeaponChoice.disabled = false;
        classWeaponStatus.textContent = "Choose one optional additional weapon. Starting-equipment weapons are listed separately.";
    } catch (error) {
        if (requestId !== weaponChoiceRequestId) {
            return;
        }
        classWeaponStatus.textContent = `Could not load class weapon options: ${error.message}`;
        console.error("Could not load class weapon options:", error);
    }
}

function getSelectedStartingEquipment() {
    return ["class", "background"].flatMap((source) => {
        const detail = source === "class"
            ? currentCharacterData.classDetails
            : currentCharacterData.background;
        const groups = source === "class"
            ? detail.starting_equipment_options || []
            : detail.equipment_options || [];
        return groups.flatMap((group, groupIndex) => {
            const options = group.from?.options || [];
            const selectedIndex = selectedStartingEquipment.get(`${source}-${groupIndex}`);
            const selected = options[selectedIndex];
            if (!selected) {
                return [];
            }
            const items = selected.option_type === "manual_equipment"
                ? [selected.desc]
                : selected.option_type === "multiple"
                    ? (selected.items || []).map(getEquipmentItemLabel)
                    : [getEquipmentItemLabel(selected)];
            return [`${source === "class" ? "Class" : "Background"}: ${items.join(", ")}`];
        });
    });
}

// [AI-Assisted: Copilot SDK | 2026-11-06]
// Intent: Refresh the selected armor list, AC preview, and proficiency warnings.
function updateArmorPreview() {
    if (!currentCharacterData) {
        return;
    }

    const armor = ARMOR_OPTIONS[armorChoiceSelect.value] || ARMOR_OPTIONS.unarmored;
    renderArmorChoiceList();
    armorClassPreview.textContent = `Armor Class: ${getArmorClass()}`;
    armorProficiencyWarning.textContent = getArmorWarnings(armorChoiceSelect.value).join(" ");
}

// [AI-Assisted: Copilot SDK | 2026-11-11]
// Intent: Show armor proficiencies alongside a Strength-appropriate armor recommendation on the final sheet.
function appendArmorGuidance(container) {
    const guidance = document.createElement("section");
    guidance.className = "sheet-armor-guidance mb-3";

    const heading = document.createElement("h3");
    heading.className = "h6 mb-2";
    heading.textContent = "Armor guidance";

    const recommendation = getRecommendedArmor();
    const recommended = document.createElement("p");
    recommended.className = "fw-semibold mb-1";
    recommended.textContent = recommendation
        ? `Recommended: ${recommendation.armor.label} (AC ${recommendation.armorClass})`
        : "No armor recommendation is available.";

    const armorProficiencyHeading = document.createElement("h4");
    armorProficiencyHeading.className = "h6 mt-3";
    armorProficiencyHeading.textContent = "Armor and shield proficiencies";
    const armorProficiencies = collectProficiencies()
        .filter((item) => item.category === "Armor & weapons")
        .map((item) => item.name)
        .filter((name) => /^(all armor|light armor|medium armor|heavy armor|shields?)$/i.test(name));
    const armorProficiencyList = document.createElement("ul");
    armorProficiencyList.className = "mb-2";
    if (armorProficiencies.length) {
        armorProficiencies.forEach((name) => {
            const item = document.createElement("li");
            item.textContent = name;
            armorProficiencyList.append(item);
        });
    } else {
        const item = document.createElement("li");
        item.textContent = "No armor or shield proficiencies recorded.";
        armorProficiencyList.append(item);
    }

    const effect = document.createElement("p");
    effect.className = "mb-2";
    effect.textContent = recommendation
        ? getArmorEffectDescription(recommendation.key, false)
        : "Check your class's armor proficiencies before choosing armor.";

    const note = document.createElement("p");
    note.className = "small text-body-secondary mb-2";
    note.textContent = "Recommendation uses your class armor proficiencies, Strength, and current Dexterity. It does not account for starting equipment or cost.";

    const equipped = document.createElement("p");
    equipped.className = "mb-1";
    equipped.textContent = `Equipped: ${ARMOR_OPTIONS[armorChoiceSelect.value]?.label || ARMOR_OPTIONS.unarmored.label}${wearingShieldInput.checked ? " with shield" : ""} (AC ${getArmorClass()}).`;

    const equippedEffect = document.createElement("p");
    equippedEffect.className = "mb-1";
    equippedEffect.textContent = getArmorEffectDescription(armorChoiceSelect.value);

    guidance.append(
        heading,
        recommended,
        armorProficiencyHeading,
        armorProficiencyList,
        effect,
        note,
        equipped,
        equippedEffect
    );
    const warnings = getArmorWarnings(armorChoiceSelect.value);
    if (warnings.length) {
        const warning = document.createElement("p");
        warning.className = "small mb-0";
        warning.textContent = warnings.join(" ");
        guidance.append(warning);
    }
    container.append(guidance);
}

// [AI-Assisted: Copilot SDK | 2026-11-06]
// Intent: Create a consistent Bootstrap card section for the generated character sheet.
function createSheetSection(title, columnClass = "col-12 col-lg-6") {
    const column = document.createElement("section");
    column.className = `${columnClass} character-sheet-column`;
    const card = document.createElement("article");
    card.className = "card h-100 character-sheet-panel";
    const body = document.createElement("div");
    body.className = "card-body";
    const heading = document.createElement("h2");
    heading.className = "h4 card-title";
    heading.textContent = title;
    body.append(heading);
    card.append(body);
    column.append(card);
    characterSheetContent.append(column);
    return body;
}

// [AI-Generated: Copilot SDK | 2026-11-06] Intent: Add a text-only list to a generated sheet section.
function appendSheetList(container, items, emptyMessage = "None recorded.") {
    const list = document.createElement("ul");
    list.className = "mb-0 list-unstyled";
    const values = items.length ? items : [emptyMessage];
    values.forEach((value) => {
        const item = document.createElement("li");
        item.textContent = value;
        list.append(item);
    });
    container.append(list);
}

// [AI-Generated: Copilot SDK | 2026-11-06] Intent: Render a backstory value as safe, line-preserving text.
function appendSheetText(container, label, value) {
    const field = document.createElement("section");
    field.className = "mb-3";
    const heading = document.createElement("h3");
    heading.className = "h6 mb-1";
    heading.textContent = label;
    const content = document.createElement("p");
    content.className = "mb-0 text-break";
    content.style.whiteSpace = "pre-wrap";
    content.textContent = value || "—";
    field.append(heading, content);
    container.append(field);
}

// [AI-Generated: Copilot SDK | 2026-11-06] Intent: Format numeric or movement-mode species speed for the sheet.
function getSpeciesSpeed(speed) {
    if (typeof speed === "number") {
        return `${speed} ft.`;
    }
    if (speed && typeof speed === "object") {
        return Object.entries(speed)
            .map(([movement, value]) => `${movement}: ${value} ft.`)
            .join(", ");
    }
    return "—";
}

// [AI-Generated: Copilot SDK | 2026-11-06] Intent: Look up a selected proficiency by category and display name.
function getIsProficient(category, name) {
    return collectProficiencies().some((item) => (
        item.category === category && item.name.toLocaleLowerCase() === name.toLocaleLowerCase()
    ));
}

// [AI-Assisted: Copilot SDK | 2026-11-10]
// Intent: Calculate level-scaled proficiency and hit points for the character sheet.
function getProficiencyBonusAtLevel(level) {
    return 2 + Math.floor((level - 1) / 4);
}

function getCharacterHitPoints() {
    const hitDie = Number(currentCharacterData.classDetails.hit_die);
    const constitutionModifier = getAbilityModifier(getActiveAbilityScore("con"));
    if (!Number.isFinite(hitDie) || hitDie <= 0) {
        return "—";
    }

    return Math.max(1, hitDie + constitutionModifier)
        + characterAdvancement.hitPointRolls
            .reduce((total, roll) => total + Math.max(1, roll + constitutionModifier), 0);
}

// [AI-Assisted: Copilot SDK | 2026-11-10]
// Intent: Render API-backed class features and the controls for advancing a character one level.
function appendLevelUpSection(container) {
    const section = document.createElement("section");
    section.className = "sheet-level-up mb-3";

    const heading = document.createElement("h3");
    heading.className = "h6 mb-2";
    heading.textContent = "Level advancement";

    const levelSummary = document.createElement("p");
    levelSummary.className = "mb-2";
    levelSummary.textContent = `Level ${characterAdvancement.level} of 20 · Proficiency bonus ${formatModifier(
        getProficiencyBonusAtLevel(characterAdvancement.level)
    )}`;
    section.append(heading, levelSummary);

    const levelControls = document.createElement("div");
    levelControls.className = "d-flex flex-wrap gap-2 mb-3";
    const levelUpButton = document.createElement("button");
    levelUpButton.className = "btn btn-outline-light btn-sm";
    levelUpButton.type = "button";
    levelUpButton.dataset.levelUp = "true";
    levelUpButton.textContent = characterAdvancement.level >= 20 ? "Maximum level reached" : "Level up";
    levelUpButton.disabled = characterAdvancement.level >= 20;
    levelControls.append(levelUpButton);
    const levelDownButton = document.createElement("button");
    levelDownButton.className = "btn btn-outline-secondary btn-sm";
    levelDownButton.type = "button";
    levelDownButton.dataset.levelDown = "true";
    levelDownButton.textContent = "Level down";
    levelDownButton.disabled = characterAdvancement.level <= 1;
    levelControls.append(levelDownButton);
    section.append(levelControls);

    if (characterAdvancement.subclass) {
        const subclassHeading = document.createElement("h4");
        subclassHeading.className = "h6";
        subclassHeading.textContent = `Subclass: ${characterAdvancement.subclass.name}`;
        section.append(subclassHeading);
        const subclassFeatures = (characterAdvancement.subclass.features || [])
            .filter((feature) => Number(feature.level) <= characterAdvancement.level)
            .map((feature) => `Level ${feature.level} · ${feature.name}: ${feature.description}`);
        appendSheetList(section, subclassFeatures, "No subclass features are listed for this level.");
    }

    if (characterAdvancement.levels.length) {
        characterAdvancement.levels.forEach(({ classLevel, features, advancementChoice }) => {
            const levelHeading = document.createElement("h4");
            levelHeading.className = "h6 mt-3";
            levelHeading.textContent = `${classLevel.name} features`;
            section.append(levelHeading);
            const featureDescriptions = features.map((feature) => (
                `${feature.name}: ${feature.description || "No description provided by the API."}`
            ));
            if (advancementChoice) {
                featureDescriptions.push(advancementChoice);
            }
            appendSheetList(section, featureDescriptions);
        });

        const latestLevel = characterAdvancement.levels.at(-1).classLevel;
        const classDetails = latestLevel.class_specific || {};
        const classSpecificRows = Object.entries(classDetails).map(([key, value]) => {
            const label = key.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
            const formattedValue = typeof value === "object"
                ? Object.entries(value).map(([part, amount]) => `${part.replaceAll("_", " ")} ${amount}`).join(", ")
                : value;
            return `${label}: ${formattedValue}`;
        });
        if (classSpecificRows.length) {
            const detailsHeading = document.createElement("h4");
            detailsHeading.className = "h6 mt-3";
            detailsHeading.textContent = "Class resources";
            section.append(detailsHeading);
            appendSheetList(section, classSpecificRows);
        }

        const spellcasting = latestLevel.spellcasting;
        if (spellcasting) {
            const spellRows = Object.entries(spellcasting)
                .filter(([, value]) => Number(value) > 0)
                .map(([key, value]) => (
                    `${key.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())}: ${value}`
                ));
            if (spellRows.length) {
                const spellsHeading = document.createElement("h4");
                spellsHeading.className = "h6 mt-3";
                spellsHeading.textContent = "Spellcasting progression";
                section.append(spellsHeading);
                appendSheetList(section, spellRows);
            }
        }
    } else {
        const loadingMessage = document.createElement("p");
        loadingMessage.className = "small text-body-secondary mb-0";
        loadingMessage.textContent = "Class features and spell progression load from the 2024 API when you open Level up.";
        section.append(loadingMessage);
    }

    const rulesNote = document.createElement("p");
    rulesNote.className = "small text-body-secondary mt-3 mb-0";
    rulesNote.textContent = "This tracks one class. API feature text and spell-slot progression are shown; spell selections and feature-specific choices that the API does not model must still be recorded with your DM.";
    section.append(rulesNote);
    container.append(section);
}

// [AI-Assisted: Copilot SDK | 2026-11-06]
// Intent: Generate a printable character sheet with the selected lineage and entered character details.
function renderCharacterSheet() {
    if (!currentCharacterData) {
        throw new Error("Character choices are not available to generate the sheet.");
    }

    const formData = new FormData(backstoryForm);
    const name = String(formData.get("name") || "").trim();
    if (!name) {
        document.querySelector("#character-name").focus();
        return false;
    }

    const { species, classDetails, background, speciesTraits } = currentCharacterData;
    const selectedLineage = selectedSpeciesLineage?.speciesIndex === species.index
        ? (currentCharacterData.speciesSubspecies || []).find(({ subspecies }) => (
            subspecies.index === selectedSpeciesLineage.subspeciesIndex
        ))
        : null;
    const equipment = String(formData.get("equipment") || "").trim();
    const proficiencyBonus = getProficiencyBonusAtLevel(characterAdvancement.level);
    const dexterityModifier = getAbilityModifier(getActiveAbilityScore("dex"));
    const hitDie = Number(classDetails.hit_die);
    const hitPoints = getCharacterHitPoints();
    const armor = ARMOR_OPTIONS[armorChoiceSelect.value] || ARMOR_OPTIONS.unarmored;
    const shieldText = wearingShieldInput.checked ? " + shield" : "";

    document.querySelector("#sheet-character-name").textContent = name;
    document.querySelector("#sheet-character-summary").textContent
        = `${species.name}${selectedLineage ? ` (${selectedLineage.subspecies.name})` : ""} · ${classDetails.name} ${characterAdvancement.level} · ${background.name}`;
    characterSheetContent.replaceChildren();

    const combat = createSheetSection("Combat statistics", "col-12");
    combat.closest(".character-sheet-column").classList.add("sheet-combat");
    const combatGrid = document.createElement("div");
    combatGrid.className = "row g-3";
    const combatStats = [
        ["Armor Class", getArmorClass()],
        ["Hit Points", hitPoints],
        ["Hit Dice", Number.isFinite(hitDie) && hitDie > 0 ? `${characterAdvancement.level}d${hitDie}` : "—"],
        ["Initiative", formatModifier(dexterityModifier)],
        ["Speed", getSpeciesSpeed(species.speed)],
        ["Proficiency Bonus", formatModifier(proficiencyBonus)],
        ["Passive Perception", 10 + getAbilityModifier(getActiveAbilityScore("wis"))
            + (getIsProficient("Skills", "Perception") ? proficiencyBonus : 0)]
    ];
    combatStats.forEach(([label, value]) => {
        const stat = document.createElement("div");
        stat.className = "col-6 col-md-3";
        const statCard = document.createElement("div");
        statCard.className = "sheet-combat-stat";
        const title = document.createElement("p");
        title.className = "small text-body-secondary mb-0";
        title.textContent = label;
        const output = document.createElement("p");
        output.className = "h5 mb-0";
        output.textContent = String(value);
        statCard.append(title, output);
        stat.append(statCard);
        combatGrid.append(stat);
    });
    combat.append(combatGrid);
    appendSheetText(combat, "Wearing", `${armor.label}${shieldText}`);

    const abilities = createSheetSection("Ability scores", "col-12 col-lg-4 col-xl-3");
    const abilityTable = document.createElement("div");
    abilityTable.className = "table-responsive";
    const abilityTableElement = document.createElement("table");
    abilityTableElement.className = "table table-sm mb-0";
    const abilityHead = document.createElement("thead");
    const abilityHeadRow = document.createElement("tr");
    ["Ability", "Score", "Modifier"].forEach((label) => {
        const cell = document.createElement("th");
        cell.scope = "col";
        cell.textContent = label;
        abilityHeadRow.append(cell);
    });
    abilityHead.append(abilityHeadRow);
    const abilityBody = document.createElement("tbody");
    ABILITIES.forEach((ability) => {
        const row = document.createElement("tr");
        [ability.name, getActiveAbilityScore(ability.key), formatModifier(
            getAbilityModifier(getActiveAbilityScore(ability.key))
        )].forEach((value) => {
            const cell = document.createElement("td");
            cell.textContent = String(value);
            row.append(cell);
        });
        abilityBody.append(row);
    });
    abilityTableElement.append(abilityHead, abilityBody);
    abilityTable.append(abilityTableElement);
    abilities.append(abilityTable);

    const savingThrows = createSheetSection("Saving throws", "col-12 col-sm-6 col-lg-4 col-xl-3");
    const saveRows = ABILITIES.map((ability) => {
        const proficient = getIsProficient("Saving throws", ability.key.toUpperCase())
            || getIsProficient("Saving throws", ability.name);
        const modifier = getAbilityModifier(getActiveAbilityScore(ability.key))
            + (proficient ? proficiencyBonus : 0);
        return `${ability.name}: ${formatModifier(modifier)}${proficient ? " (Proficient)" : ""}`;
    });
    appendSheetList(savingThrows, saveRows);

    const skillAbilities = {
        Acrobatics: "dex", "Animal Handling": "wis", Arcana: "int", Athletics: "str", Deception: "cha",
        History: "int", Insight: "wis", Intimidation: "cha", Investigation: "int", Medicine: "wis",
        Nature: "int", Perception: "wis", Performance: "cha", Persuasion: "cha", Religion: "int",
        "Sleight of Hand": "dex", Stealth: "dex", Survival: "wis"
    };
    const skills = createSheetSection("Skills", "col-12 col-lg-8 col-xl-3");
    const skillRows = Object.entries(skillAbilities).map(([skill, abilityKey]) => {
        const proficient = getIsProficient("Skills", skill);
        const modifier = getAbilityModifier(getActiveAbilityScore(abilityKey))
            + (proficient ? proficiencyBonus : 0);
        return `${skill}: ${formatModifier(modifier)}${proficient ? " (Proficient)" : ""}`;
    });
    appendSheetList(skills, skillRows);
    skills.querySelector("ul").classList.add("sheet-skill-list");

    const proficiencies = collectProficiencies();
    const proficiencySection = createSheetSection("Proficiencies & traits", "col-12 col-lg-4 col-xl-3");
    const categories = new Map();
    proficiencies.forEach((item) => {
        if (!categories.has(item.category)) {
            categories.set(item.category, []);
        }
        categories.get(item.category).push(item.name);
    });
    categories.forEach((items, category) => {
        const heading = document.createElement("h3");
        heading.className = "h6 mt-3";
        heading.textContent = category;
        proficiencySection.append(heading);
        appendSheetList(proficiencySection, items);
    });
    const traitNames = [
        ...speciesTraits.map((trait) => trait.name),
        ...(selectedLineage?.traits || []).map((trait) => trait.name)
    ];
    const traitHeading = document.createElement("h3");
    traitHeading.className = "h6 mt-3";
    traitHeading.textContent = `${species.name} traits`;
    proficiencySection.append(traitHeading);
    appendSheetList(proficiencySection, traitNames);

    const backstory = createSheetSection("Personality & backstory", "col-12 col-lg-8");
    [
        ["Personality traits", formData.get("personality")],
        ["Ideal", formData.get("ideal")],
        ["Bond", formData.get("bond")],
        ["Flaw", formData.get("flaw")],
        ["Backstory / notes", formData.get("backstory")]
    ].forEach(([label, value]) => appendSheetText(backstory, label, String(value || "")));

    const equipmentSection = createSheetSection("Equipment & other items", "col-12 col-lg-4");
    appendArmorGuidance(equipmentSection);
    appendSheetText(equipmentSection, "Equipped armor", `${armor.label}${shieldText}`);
    appendSheetList(equipmentSection, getSelectedStartingEquipment(), "No starting equipment option selected.");
    if (additionalWeaponName) {
        const selectedWeapon = [...classWeaponChoice.options]
            .find((option) => option.value === additionalWeaponName)?.textContent;
        if (selectedWeapon) {
            appendSheetText(equipmentSection, "Additional class weapon", selectedWeapon);
        }
    }
    appendSheetText(equipmentSection, "Additional items / notes", equipment);
    const advancementSection = createSheetSection("Level up", "col-12");
    appendLevelUpSection(advancementSection);

    return true;
}

// [AI-Assisted: Copilot SDK | 2026-11-10]
// Intent: Load a class level and its linked feature descriptions from the 2024 API.
async function fetchClassLevelProgression(level) {
    const levelUrl = `${currentCharacterData.classDetails.class_levels}/${level}`;
    const classLevel = await fetchApi(levelUrl); // Load the class-specific level record, including spell slots and resources.
    const features = await Promise.all(classLevel.features.map((feature) => fetchApi(feature.url))); // Resolve each linked class feature so the sheet can display its rules text.
    return { classLevel, features };
}

function populateAbilityIncreaseSelect(select, excludedAbility = "") {
    const eligibleAbilities = ABILITIES.filter((ability) => (
        ability.key !== excludedAbility && getActiveAbilityScore(ability.key) < 20
    ));
    select.replaceChildren();
    eligibleAbilities.forEach((ability) => {
        const option = document.createElement("option");
        option.value = ability.key;
        option.textContent = `${ability.name} (${getActiveAbilityScore(ability.key)})`;
        select.append(option);
    });
    select.disabled = eligibleAbilities.length === 0;
}

// [AI-Assisted: Copilot SDK | 2026-11-10]
// Intent: Prepare choices and API progression details before applying the next class level.
async function openLevelUpModal() {
    if (!currentCharacterData || characterAdvancement.level >= 20) {
        return;
    }

    pendingLevelAdvancement = null;
    levelUpForm.reset();
    levelUpSummary.textContent = `Loading ${currentCharacterData.classDetails.name} level ${characterAdvancement.level + 1}...`;
    levelUpStatus.textContent = "Loading class features from the 2024 API.";
    confirmLevelUpButton.disabled = true;
    levelUpSubclassField.classList.add("d-none");
    levelUpAsiField.classList.add("d-none");
    levelUpFeatChoices.classList.add("d-none");
    levelUpAbilityChoices.classList.remove("d-none");
    levelUpStatus.classList.remove("text-danger");
    bootstrap.Modal.getOrCreateInstance(levelUpModal).show();

    try {
        const currentRecords = await Promise.all(
            Array.from({ length: characterAdvancement.level }, (_, index) => index + 1)
                .filter((level) => !characterAdvancement.levels.some((record) => record.classLevel.level === level))
                .map((level) => fetchClassLevelProgression(level))
        );
        characterAdvancement.levels.push(...currentRecords);
        characterAdvancement.levels.sort((first, second) => first.classLevel.level - second.classLevel.level);
        if (currentRecords.length) {
            renderCharacterSheet();
        }

        const nextLevel = characterAdvancement.level + 1;
        pendingLevelAdvancement = await fetchClassLevelProgression(nextLevel);
        levelUpSummary.textContent = `${currentCharacterData.classDetails.name} level ${nextLevel}`;
        const hitDie = Number(currentCharacterData.classDetails.hit_die);
        const fixedRoll = Math.floor(hitDie / 2) + 1;
        const constitutionModifier = getAbilityModifier(getActiveAbilityScore("con"));
        levelUpHpPreview.textContent = `Fixed value: ${fixedRoll} on the die. Add your Constitution modifier (${formatModifier(
            constitutionModifier
        )}); each gained level adds at least 1 Hit Point.`;

        const hasSubclassChoice = pendingLevelAdvancement.classLevel.features.some((feature) => (
            feature.name.toLocaleLowerCase().includes("subclass")
        ));
        if (hasSubclassChoice && !characterAdvancement.subclass) {
            const subclasses = currentCharacterData.classDetails.subclasses || [];
            if (!subclasses.length) {
                throw new Error("The class API did not provide subclass options for this level.");
            }
            levelUpSubclassSelect.replaceChildren();
            subclasses.forEach((subclass) => {
                const option = document.createElement("option");
                option.value = subclass.url;
                option.textContent = subclass.name;
                levelUpSubclassSelect.append(option);
            });
            levelUpSubclassField.classList.remove("d-none");
        }

        const hasAbilityImprovement = pendingLevelAdvancement.classLevel.features.some((feature) => (
            feature.name.toLocaleLowerCase().includes("ability score improvement")
        ));
        if (hasAbilityImprovement) {
            levelUpAsiField.classList.remove("d-none");
            populateAbilityIncreaseSelect(levelUpAbilityOne);
            populateAbilityIncreaseSelect(levelUpAbilityTwo, levelUpAbilityOne.value);
            const abilityOption = levelUpAsiChoice.querySelector('option[value="asi"]');
            abilityOption.disabled = levelUpAbilityOne.disabled;
            if (abilityOption.disabled) {
                levelUpAsiChoice.value = "feat";
            }

            const feats = readResults(await fetchApi(`${API_ROOT}/feats?limit=100`), "feats");
            levelUpFeatSelect.replaceChildren();
            feats.forEach((feat) => {
                const option = document.createElement("option");
                option.value = feat.url;
                option.textContent = feat.name;
                levelUpFeatSelect.append(option);
            });
            if (feats.length) {
                await updateLevelUpFeatDescription();
            }
            updateLevelUpChoiceFields();
        }

        levelUpStatus.textContent = hasAbilityImprovement
            ? "Choose an ability increase or a feat. Feat benefits are recorded but are not automatically applied to calculated statistics."
            : "";
        confirmLevelUpButton.disabled = false;
    } catch (error) {
        levelUpStatus.textContent = `Could not load level-up options: ${error.message}`;
        levelUpStatus.classList.add("text-danger");
        console.error("Could not load class level progression:", error);
    }
}

function updateLevelUpChoiceFields() {
    const takingFeat = levelUpAsiChoice.value === "feat";
    const splitAbilityIncrease = levelUpAsiMethod.value === "split";
    levelUpAbilityChoices.classList.toggle("d-none", takingFeat);
    levelUpFeatChoices.classList.toggle("d-none", !takingFeat);
    const secondAbilityLabel = levelUpAbilityTwo.previousElementSibling;
    levelUpAbilityTwo.dataset.split = String(splitAbilityIncrease);
    secondAbilityLabel.classList.toggle("d-none", !splitAbilityIncrease);
    levelUpAbilityTwo.classList.toggle("d-none", !splitAbilityIncrease);
    const firstAbilityScore = levelUpAbilityOne.value
        ? getActiveAbilityScore(levelUpAbilityOne.value)
        : 20;
    const eligibleAbilities = ABILITIES.filter((ability) => getActiveAbilityScore(ability.key) < 20);
    levelUpAsiMethod.querySelector('option[value="two"]').disabled = firstAbilityScore > 18;
    levelUpAsiMethod.querySelector('option[value="split"]').disabled = eligibleAbilities.length < 2;
    if (levelUpAbilityOne.value) {
        populateAbilityIncreaseSelect(levelUpAbilityTwo, levelUpAbilityOne.value);
    }
}

async function updateLevelUpFeatDescription() {
    if (!levelUpFeatSelect.value) {
        levelUpFeatDescription.textContent = "No feats are available from the API.";
        return;
    }
    const feat = await fetchApi(levelUpFeatSelect.value);
    levelUpFeatDescription.textContent = feat.description || "No description provided by the API.";
}

// [AI-Assisted: Copilot SDK | 2026-11-10]
// Intent: Apply a validated level-up choice and refresh derived character-sheet values.
async function applyLevelUp(event) {
    event.preventDefault();
    if (!pendingLevelAdvancement) {
        return;
    }

    confirmLevelUpButton.disabled = true;
    levelUpStatus.classList.remove("text-danger");
    try {
        const nextLevel = characterAdvancement.level + 1;
        const hitDie = Number(currentCharacterData.classDetails.hit_die);
        const hpRoll = levelUpHpMethod.value === "roll"
            ? Math.floor(Math.random() * hitDie) + 1
            : Math.floor(hitDie / 2) + 1;
        let subclass = characterAdvancement.subclass;
        if (!levelUpSubclassField.classList.contains("d-none")) {
            subclass = await fetchApi(levelUpSubclassSelect.value);
        }

        const abilityBonuses = {};
        let advancementChoice = "";
        const hasAbilityImprovement = pendingLevelAdvancement.classLevel.features.some((feature) => (
            feature.name.toLocaleLowerCase().includes("ability score improvement")
        ));
        if (hasAbilityImprovement && levelUpAsiChoice.value === "feat") {
            const feat = await fetchApi(levelUpFeatSelect.value);
            advancementChoice = `Feat chosen: ${feat.name}. ${feat.description || ""}`;
        } else if (hasAbilityImprovement) {
            const firstAbility = levelUpAbilityOne.value;
            const splitAbilityIncrease = levelUpAbilityTwo.dataset.split === "true";
            if (!firstAbility || getActiveAbilityScore(firstAbility) >= 20) {
                throw new Error("Choose an ability score that is below 20.");
            }
            if (splitAbilityIncrease) {
                const secondAbility = levelUpAbilityTwo.value;
                if (!secondAbility || secondAbility === firstAbility || getActiveAbilityScore(secondAbility) >= 20) {
                    throw new Error("Choose two different ability scores that are both below 20.");
                }
                abilityBonuses[firstAbility] = 1;
                abilityBonuses[secondAbility] = 1;
                advancementChoice = `Ability Score Improvement: +1 ${ABILITIES.find(({ key }) => key === firstAbility).name}, +1 ${ABILITIES.find(({ key }) => key === secondAbility).name}.`;
            } else {
                if (getActiveAbilityScore(firstAbility) > 18) {
                    throw new Error("A +2 increase cannot raise an ability score above 20.");
                }
                abilityBonuses[firstAbility] = 2;
                advancementChoice = `Ability Score Improvement: +2 ${ABILITIES.find(({ key }) => key === firstAbility).name}.`;
            }
        }

        const selectedSubclass = subclass && !characterAdvancement.subclass ? subclass : null;
        if (selectedSubclass) {
            characterAdvancement.subclass = subclass;
            characterAdvancement.subclassLevel = nextLevel;
        }
        Object.entries(abilityBonuses).forEach(([key, amount]) => {
            characterAdvancement.abilityBonuses[key] += amount;
        });
        characterAdvancement.hitPointRolls.push(hpRoll);
        characterAdvancement.level = nextLevel;
        pendingLevelAdvancement.advancementChoice = advancementChoice;
        pendingLevelAdvancement.hitPointRoll = hpRoll;
        pendingLevelAdvancement.appliedAbilityBonuses = abilityBonuses;
        pendingLevelAdvancement.selectedSubclass = selectedSubclass;
        characterAdvancement.levels.push(pendingLevelAdvancement);
        characterAdvancement.levels.sort((first, second) => first.classLevel.level - second.classLevel.level);
        pendingLevelAdvancement = null;
        renderCharacterSheet();
        bootstrap.Modal.getOrCreateInstance(levelUpModal).hide();
    } catch (error) {
        levelUpStatus.textContent = `Could not apply level up: ${error.message}`;
        levelUpStatus.classList.add("text-danger");
        confirmLevelUpButton.disabled = false;
        console.error("Could not apply level advancement:", error);
    }
}

// [AI-Assisted: Copilot SDK | 2026-11-11]
// Intent: Reverse the most recent level and remove only the HP, ability, and subclass choices recorded for it.
function levelDownCharacter() {
    if (characterAdvancement.level <= 1) {
        return;
    }

    const levelToRemove = characterAdvancement.level;
    const removedLevel = characterAdvancement.levels.find(
        (record) => record.classLevel.level === levelToRemove
    );
    if (!removedLevel) {
        throw new Error(`The level ${levelToRemove} advancement record is unavailable.`);
    }

    Object.entries(removedLevel.appliedAbilityBonuses || {}).forEach(([key, amount]) => {
        characterAdvancement.abilityBonuses[key] -= amount;
    });
    characterAdvancement.hitPointRolls.pop();
    characterAdvancement.levels = characterAdvancement.levels.filter(
        (record) => record.classLevel.level !== levelToRemove
    );
    if (removedLevel.selectedSubclass || characterAdvancement.subclassLevel === levelToRemove) {
        characterAdvancement.subclass = null;
        characterAdvancement.subclassLevel = null;
    }
    characterAdvancement.level = levelToRemove - 1;
    renderCharacterSheet();
    bootstrap.Modal.getOrCreateInstance(levelDownModal).hide();
}

// [AI-Assisted: Copilot SDK | 2026-11-10]
// Intent: Fetch selected records, render their details, and update the explicit-confirmation gate.
async function updateCharacter() {
    const requestId = ++latestCharacterRequest;
    const selectedUrls = Object.fromEntries(
        Object.entries(selects).map(([type, select]) => [type, select.value])
    );
    const completeSelection = Object.values(selectedUrls).every(Boolean);
    const changedTypes = Object.keys(selects).filter((type) => (
        selectedUrls[type] !== renderedSelectionUrls[type]
    ));

    currentCharacterData = null;
    characterAdvancement = {
        level: 1,
        hitPointRolls: [],
        abilityBonuses: Object.fromEntries(ABILITIES.map(({ key }) => [key, 0])),
        levels: [],
        subclass: null,
        subclassLevel: null
    };
    refreshNextButton();
    changedTypes.forEach((type) => {
        renderedSelectionUrls[type] = "";
        choiceDetailData[type] = null;
        choiceDetailErrors[type] = "";
    });

    if (Object.values(selectedUrls).every((url) => !url)) {
        choiceGroupsElement.replaceChildren();
        return;
    }

    if (!completeSelection) {
        choiceGroupsElement.replaceChildren();
    }

    try {
        const selectionData = await Promise.all(
            Object.entries(selectedUrls).map(([type, url]) => (
                url ? fetchSelectionData(type, url) : Promise.resolve({})
            ))
        );

        if (requestId !== latestCharacterRequest) {
            return;
        }

        const loadedData = Object.assign({}, ...selectionData);
        changedTypes.forEach((type) => {
            const typeData = type === "species"
                ? {
                    species: loadedData.species,
                    speciesTraits: loadedData.speciesTraits,
                    speciesSubspecies: loadedData.speciesSubspecies
                }
                : type === "class"
                    ? { classDetails: loadedData.classDetails, classSubclasses: loadedData.classSubclasses }
                    : { background: loadedData.background, backgroundFeat: loadedData.backgroundFeat };
            choiceDetailData[type] = typeData;
            choiceDetailErrors[type] = "";
            renderedSelectionUrls[type] = selectedUrls[type];
            refreshChoiceControls(type);
            if (activeInfoType === type) {
                renderSelectionDetails(type, typeData);
                positionChoiceInfo();
            }
        });

        if (completeSelection) {
            currentCharacterData = loadedData;
            renderChoiceGroups();
            refreshNextButton();
        }
    } catch (error) {
        if (requestId !== latestCharacterRequest) {
            return;
        }
        changedTypes.forEach((type) => {
            if (!selectedUrls[type]) {
                return;
            }
            choiceDetailErrors[type] = `Could not load this selection: ${error.message}`;
            refreshChoiceControls(type);
            if (activeInfoType === type) {
                const message = document.createElement("p");
                message.className = "text-danger mb-0";
                message.textContent = choiceDetailErrors[type];
                choiceInfoContent.replaceChildren(message);
            }
        });
        console.error("Could not load character data:", error);
    }
}

// [AI-Assisted: Copilot SDK | 2026-11-06]
// Intent: Select a random API resource for one of the three character cards.
function chooseRandom(type) {
    const select = selects[type];
    const options = [...select.options].filter((option) => option.value);
    const alternatives = options.filter((option) => option.value !== select.value);
    const choices = alternatives.length ? alternatives : options;
    if (choices.length === 0) {
        return;
    }
    select.value = choices[Math.floor(Math.random() * choices.length)].value;
    select.dispatchEvent(new Event("change"));
}

// [AI-Assisted: Copilot SDK | 2026-11-06]
// Intent: Step forward or backward through one card's choices and wrap at either end.
function stepSelection(type, direction) {
    const select = selects[type];
    const options = [...select.options].filter((option) => option.value);
    if (options.length === 0) {
        return;
    }

    const currentIndex = options.findIndex((option) => option.value === select.value);
    const nextIndex = currentIndex < 0
        ? direction > 0 ? 0 : options.length - 1
        : (currentIndex + direction + options.length) % options.length;
    select.value = options[nextIndex].value;
    select.dispatchEvent(new Event("change"));
}

// [AI-Assisted: Copilot SDK | 2026-11-10]
// Intent: Connect the popup selectors, randomizers, and confirmation toggles to the selection state.
Object.values(selects).forEach((select) => {
    const type = Object.keys(selects).find((key) => selects[key] === select);
    select.addEventListener("change", () => {
        // [AI-Assisted: Copilot SDK | 2026-11-10]
        // Intent: Clear bonuses when changing background so a previous choice cannot carry over.
        if (type === "background") {
            backgroundBonusMode = "two-one";
            backgroundBonusAssignments = { two: "", one: "" };
        }
        if (type === "species") {
            selectedSpeciesLineage = null;
        }
        if (type === "class" || type === "background") {
            [...selectedStartingEquipment.keys()]
                .filter((key) => key.startsWith(`${type}-`))
                .forEach((key) => selectedStartingEquipment.delete(key));
        }
        if (type === "class") {
            additionalWeaponName = "";
            classWeaponChoice.value = "";
        }
        if (activeInfoType) {
            closeChoiceInfo(false);
        }
        renderedSelectionUrls[type] = "";
        choiceDetailData[type] = null;
        choiceDetailErrors[type] = "";
        refreshChoiceControls(type);
        updateCharacter();
    });
});
Object.keys(randomButtons).forEach((type) => {
    randomButtons[type].addEventListener("click", () => chooseRandom(type));
});
document.querySelectorAll("[data-open-choice]").forEach((button) => {
    button.addEventListener("click", () => openSelectionModal(button.dataset.openChoice));
});
Object.keys(infoButtons).forEach((type) => {
    infoButtons[type].addEventListener("click", () => showChoiceInfo(type, infoButtons[type]));
});
speciesLineageButton.addEventListener("click", openSpeciesLineageModal);
choiceInfoCloseButton.addEventListener("click", () => closeChoiceInfo());
document.addEventListener("pointerdown", (event) => {
    if (
        activeInfoType
        && !choiceInfoTooltip.contains(event.target)
        && !infoButtons[activeInfoType].contains(event.target)
    ) {
        closeChoiceInfo(false);
    }
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && activeInfoType) {
        closeChoiceInfo();
    }
});
window.addEventListener("resize", () => positionChoiceInfo());
window.addEventListener("scroll", () => positionChoiceInfo(), true);
document.querySelectorAll("[data-choice-step]").forEach((button) => {
    button.addEventListener("click", () => {
        stepSelection(button.dataset.choiceType, Number(button.dataset.choiceStep));
    });
});

// [AI-Assisted: Copilot SDK | 2026-11-06]
// Intent: Switch among the SPA stages without reloading and reset the active stage's scroll position.
function showWorkflowPage(activePage) {
    const pages = [characterPage, pointBuyPage, backstoryPage, characterSheetPage];
    pages.forEach((page) => {
        const active = page === activePage;
        page.classList.toggle("d-none", !active);
        page.classList.toggle("d-flex", active && (page === characterPage || page === pointBuyPage));
    });
    activePage.scrollTop = 0;
}

// [AI-Assisted: Copilot SDK | 2026-11-06]
// Intent: Open the proficiency-choice popup only after all three selections are ready.
nextButton.addEventListener("click", () => {
    if (!nextButton.disabled && currentCharacterData) {
        bootstrap.Modal.getOrCreateInstance(proficiencyModal).show();
    }
});

proficiencyModal.addEventListener("show.bs.modal", () => {
    renderChoiceGroups();
});

finishButton.addEventListener("click", () => {
    if (finishButton.disabled) {
        return;
    }

    proceedToPointBuy = true;
    bootstrap.Modal.getOrCreateInstance(proficiencyModal).hide();
});

proficiencyModal.addEventListener("hidden.bs.modal", () => {
    if (!proceedToPointBuy) {
        return;
    }
    proceedToPointBuy = false;
    showWorkflowPage(pointBuyPage);
    renderPointBuy();
});

// [AI-Assisted: Copilot SDK | 2026-11-06]
// Intent: Let players return to character choices without losing their current selections.
document.querySelector("#back-to-choices").addEventListener("click", () => {
    showWorkflowPage(characterPage);
});

// [AI-Assisted: Copilot SDK | 2026-11-06]
// Intent: Open the explanatory point-buy and race rules popup.
document.querySelector("#point-buy-info-button").addEventListener("click", () => {
    bootstrap.Modal.getOrCreateInstance(pointBuyInfoModal).show();
});

// [AI-Assisted: Copilot SDK | 2026-11-06]
// Intent: Allow toggling between Point Buy and Standard Array while preserving each method's assignments.
document.querySelectorAll('input[name="score-method"]').forEach((input) => {
    input.addEventListener("change", () => {
        if (input.checked) {
            setScoreMethod(input.value);
        }
    });
});

// [AI-Assisted: Copilot SDK | 2026-11-10]
// Intent: Continue only when ability scores and all required background bonuses are assigned.
finishPointBuyButton.addEventListener("click", () => {
    if (scoreMethod === "point-buy" && getPointsSpent() !== POINT_BUY_BUDGET) {
        return;
    }
    if (!areBackgroundBonusesAssigned()) {
        return;
    }
    if (scoreMethod === "standard-array" && ABILITIES.some((ability) => standardArrayScores[ability.key] === null)) {
        return;
    }

    const scores = ABILITIES
        .map((ability) => `${ability.name} ${getActiveAbilityScore(ability.key)}`)
        .join(", ");
    pointBuyStatus.textContent = `${scoreMethod === "point-buy" ? "Point Buy" : "Standard Array"} scores saved: ${scores}.`;
    showWorkflowPage(backstoryPage);
    renderStartingEquipmentChoices();
    renderClassWeaponChoices();
    updateArmorPreview();
});

// [AI-Assisted: Copilot SDK | 2026-11-06]
// Intent: Preserve entered backstory details while navigating between creation stages.
document.querySelector("#back-to-ability-scores").addEventListener("click", () => {
    showWorkflowPage(pointBuyPage);
    renderPointBuy();
});

backstoryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!backstoryForm.reportValidity() || !renderCharacterSheet()) {
        return;
    }
    showWorkflowPage(characterSheetPage);
});

document.querySelector("#edit-character-details").addEventListener("click", () => {
    showWorkflowPage(backstoryPage);
    renderStartingEquipmentChoices();
    renderClassWeaponChoices();
    updateArmorPreview();
});

// [AI-Assisted: Copilot SDK | 2026-11-12]
// Intent: Preserve armor, equipment, and optional class-weapon selections in character details.
classWeaponChoice.addEventListener("change", () => {
    additionalWeaponName = classWeaponChoice.value;
});

document.querySelector("#edit-ability-scores").addEventListener("click", () => {
    showWorkflowPage(pointBuyPage);
    renderPointBuy();
});

document.querySelector("#print-character-sheet").addEventListener("click", () => {
    window.print();
});

// [AI-Assisted: Copilot SDK | 2026-11-10]
// Intent: Wire the sheet's level-up action to the API-backed advancement dialog and choices.
characterSheetContent.addEventListener("click", (event) => {
    if (event.target.closest("[data-level-up]")) {
        openLevelUpModal();
        return;
    }
    if (event.target.closest("[data-level-down]")) {
        levelDownSummary.textContent = `This removes level ${characterAdvancement.level} and its Hit Die result, class features, and any ability score, feat, or subclass choice recorded at that level.`;
        bootstrap.Modal.getOrCreateInstance(levelDownModal).show();
    }
});
confirmLevelDownButton.addEventListener("click", () => {
    try {
        levelDownCharacter();
    } catch (error) {
        console.error("Could not reverse level advancement:", error);
        levelDownSummary.textContent = `Could not level down: ${error.message}`;
    }
});
levelUpForm.addEventListener("submit", applyLevelUp);
levelUpAsiChoice.addEventListener("change", updateLevelUpChoiceFields);
levelUpAsiMethod.addEventListener("change", updateLevelUpChoiceFields);
levelUpAbilityOne.addEventListener("change", () => {
    populateAbilityIncreaseSelect(levelUpAbilityTwo, levelUpAbilityOne.value);
    updateLevelUpChoiceFields();
});
levelUpFeatSelect.addEventListener("change", () => {
    updateLevelUpFeatDescription().catch((error) => {
        levelUpFeatDescription.textContent = `Could not load feat details: ${error.message}`;
        console.error("Could not load feat details:", error);
    });
});

armorChoiceSelect.addEventListener("change", updateArmorPreview);
wearingShieldInput.addEventListener("change", updateArmorPreview);

// [AI-Assisted: Copilot SDK | 2026-11-06]
// Intent: Make API collection failures visible instead of leaving the selection controls unusable silently.
loadResourceLists().catch((error) => {
    console.error("Could not load the 2024 options:", error);
});
