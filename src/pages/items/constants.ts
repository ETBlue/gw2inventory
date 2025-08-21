import { MenuItem } from "./types"

export const MENU_ITEMS: MenuItem[] = [
  {
    to: "/items/equipable",
    text: "Equipable",
    showOnly: [
      "Armor",
      "Back",
      "Bag",
      "Gathering",
      "JadeTechModule",
      "PowerCore",
      "Relic",
      "Trinket",
      "UpgradeComponent",
      "Weapon",
    ],
  },
  {
    to: "/items/consumable",
    text: "Consumable",
    showOnly: [
      "Consumable",
      "Container",
      "Gizmo",
      "Key",
      "MiniPet",
      "Tool",
      "Trait",
    ],
  },
  { to: "/items/material", text: "Material", showOnly: ["CraftingMaterial"] },
  { to: "/items/trophy", text: "Trophy", showOnly: ["Trophy"] },
]
