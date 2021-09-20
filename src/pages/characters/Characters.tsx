import React, { useContext } from "react"
import { Link, NavLink, Route, Switch, useHistory } from "react-router-dom"
import { MdSearch } from "react-icons/md"
import { useQuery } from "react-query"
import {
  Tabs,
  TabList,
  Tab,
  Center,
  Spinner,
  Button,
  Tag,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
} from "@chakra-ui/react"

import { queryFunction } from "helpers/api"
import { getQueryString } from "helpers/url"
import TokenContext from "contexts/TokenContext"

import Overview from "./Overview"
import { useSearchParams } from "hooks/url"

const MENU_ITEMS = [
  { to: "/characters", text: "Overview", component: Overview },
]

function Characters() {
  const { currentToken } = useContext(TokenContext)
  const history = useHistory()

  const { data: allCharacters, isFetching } = useQuery(
    ["characters", currentToken?.token, "ids=all"],
    queryFunction,
    { cacheTime: Infinity, enabled: !!currentToken?.token },
  )
  //const isFetching = false
  //const data = sample

  const {
    queryString,
    profession: activeProfession,
    keyword,
    sort,
    order,
  } = useSearchParams()
  const activeSort = sort || "name"
  const activeOrder = order || "asc"

  const characters = allCharacters
    ?.filter(
      (character) =>
        character.profession === activeProfession || !activeProfession,
    )
    .filter((character) =>
      !!keyword
        ? JSON.stringify(character).match(new RegExp(keyword, "i"))
        : true,
    )
    .sort((a, b) => {
      if (a[activeSort] > b[activeSort] && activeOrder === "asc") return 1
      if (a[activeSort] < b[activeSort] && activeOrder === "dsc") return 1
      if (a[activeSort] > b[activeSort] && activeOrder === "dsc") return -1
      if (a[activeSort] < b[activeSort] && activeOrder === "asc") return -1
      return 0
    })

  return (
    <Tabs display="grid" gridTemplateRows="auto 1fr" height="100%">
      <TabList>
        {MENU_ITEMS.map((item) => (
          <Tab key={item.to} as={NavLink} to={item.to}>
            {item.text}
          </Tab>
        ))}
        <Spacer />
        <InputGroup width="20ch">
          <InputLeftElement>
            <MdSearch opacity="0.5" />
          </InputLeftElement>
          <Input
            variant="unstyled"
            value={keyword || ""}
            onChange={(e) => {
              const to = `/characters?${getQueryString(
                "keyword",
                e.currentTarget.value,
                queryString,
              )}`
              history.push(to)
            }}
          />
        </InputGroup>
      </TabList>
      {isFetching ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <div>
          <Flex
            justifyContent="center"
            margin="1rem auto"
            columns={PROFESSIONS.length}
          >
            <Button
              as={Link}
              variant="ghost"
              fontWeight="normal"
              isActive={!activeProfession}
              to={`/characters?${getQueryString(
                "profession",
                "",
                queryString,
              )}`}
            >
              All
              <Tag size="sm" margin="0 0 -0.1em 0.5em">
                {allCharacters?.length}
              </Tag>
            </Button>{" "}
            {PROFESSIONS.map((profession) => (
              <Button
                key={profession}
                as={Link}
                variant="ghost"
                fontWeight="normal"
                isActive={activeProfession === profession}
                to={`/characters?${getQueryString(
                  "profession",
                  profession,
                  queryString,
                )}`}
              >
                {profession}{" "}
                <Tag size="sm" margin="0 0 -0.1em 0.5em">
                  {
                    allCharacters?.filter(
                      (character) =>
                        character.profession === profession ||
                        profession === "All",
                    ).length
                  }
                </Tag>
              </Button>
            ))}
          </Flex>
          <Switch>
            {currentToken &&
              allCharacters &&
              MENU_ITEMS.map((item) => {
                const Component = item.component
                return (
                  <Route key={item.to} path={item.to}>
                    <Component
                      characters={characters}
                      token={currentToken.token}
                      activeSort={activeSort}
                      activeOrder={activeOrder}
                      queryString={queryString}
                    />
                  </Route>
                )
              })}
          </Switch>
        </div>
      )}
    </Tabs>
  )
}

export default Characters

const PROFESSIONS = [
  "Elementalist",
  "Necromancer",
  "Mesmer",
  "Ranger",
  "Thief",
  "Engineer",
  "Warrior",
  "Guardian",
  "Revenant",
]

export interface Character {
  name: string
  race: "Asura" | "Charr" | "Human" | "Norn" | "Sylvari"
  gender: "Male" | "Female"
  profession:
    | "Elementalist"
    | "Engineer"
    | "Guardian"
    | "Mesmer"
    | "Necromancer"
    | "Ranger"
    | "Revenant"
    | "Thief"
    | "Warrior"
  level: number // The character's level.
  guild?: string // The guild ID of the character's currently represented guild.
  age: number // The amount of seconds this character was played.
  created: string // ISO 8601 representation of the character's creation time.
  deaths: number // The amount of times this character has been defeated.
  title?: number // The currently selected title for the character. References /v2/titles.
  backstory: string[] // An array of strings representing backstory answer IDs pertaining to the questions answered during character creation. References /v2/backstory/answers.
  crafting: Crafting[] // An array containing an entry for each crafting discipline the character has unlocked
  equipment: CharacterEquipmentItem[]
  bags: CharacterBag[] // Contains one object structure per bag in the character's inventory
  skills: {
    pve: Skills // contains the information on each slotted utility for PvE
    pvp: Skills // contains the information on each slotted utility for PvP
    wvw: Skills // contains the information on each slotted utility for WvW
  } // contains the pve, pvp, and wvw objects for the current utilities equipped.
  specializations: {
    pve: Spec[] // contains the information on each slotted specialization and trait for PvE
    pvp: Spec[] // contains the information on each slotted specialization and trait for PvP
    wvw: Spec[] // contains the information on each slotted specialization and trait for WvW
  } // contains the pve, pvp, and wvw objects for the current specializations and traits equipped.
  training: Training[] // contains objects for each skill tree trained
  wvw_abilities: WvW[] // contains information on each trained wvw ability
  equipment_pvp: PvP // Contains information on character's pvp equipment setup.
  flags: "Beta"[] // Returns character flags. Possible values: Beta - Beta character for testing period of add-ons
  recipes: number[] // The endpoint returns an array, each value being the ID of a recipe that can be resolved against /v2/recipes.
}

interface Crafting {
  discipline:
    | "Armorsmith"
    | "Artificer"
    | "Chef"
    | "Huntsman"
    | "Jeweler"
    | "Leatherworker"
    | "Scribe"
    | "Tailor"
    | "Weaponsmith" // The name of the discipline. Possible values:
  rating: number // The current crafting level for the given discipline and character
  active: boolean // Describes if the given discipline is currently active or not on the character.
}

interface CharacterBag {
  id: number // The bag's item id which can be resolved against /v2/items
  size: number // The amount of slots available with this bag.
  inventory: CharacterBagItem[] // Contains one object structure per item, object is null if no item is in the given bag slot.
}

interface CharacterItem {
  id: number // The item id which can be resolved against /v2/items
  infusions?: number[] // returns an array of infusion item ids which can be resolved against /v2/items
  upgrades?: number[] // returns an array of upgrade component item ids which can be resolved against /v2/items
  skin?: number // Skin id for the given equipment piece. Can be resolved against /v2/skins
  stats?: Stats // Contains information on the stats chosen if the item offers an option for stats/prefix.
  binding?: "Character" | "Account" // describes which kind of binding the item has
  bound_to?: string // Name of the character the item is bound to.
}

interface CharacterBagItem extends CharacterItem {
  count: number // Amount of item in the stack. Minium of 1, maximum of 250.
}

interface CharacterEquipmentItem extends CharacterItem {
  slot:
    | "HelmAquatic"
    | "Backpack"
    | "Coat"
    | "Boots"
    | "Gloves"
    | "Helm"
    | "Leggings"
    | "Shoulders"
    | "Accessory1"
    | "Accessory2"
    | "Ring1"
    | "Ring2"
    | "Amulet"
    | "WeaponAquaticA"
    | "WeaponAquaticB"
    | "WeaponA1"
    | "WeaponA2"
    | "WeaponB1"
    | "WeaponB2"
    | "Sickle"
    | "Axe"
    | "Pick" // The equipment slot in which the item is slotted. Possible values:
  charges?: number // The amount of charges remaining on the item.
  dyes: number[] // Array of selected dyes for the equipment piece. Values default to null if no dye is selected. Colors can be resolved against v2/colors
}

interface Stats {
  id: number // The itemstat id, can be resolved against /v2/itemstats.
  attributes: Attributes // Contains a summary of the stats on the item.
}

interface Attributes {
  Power?: number // Shows the amount of power given
  Precision?: number // Shows the amount of Precision given
  Toughness?: number // Shows the amount of Toughness given
  Vitality?: number // Shows the amount of Vitality given
  CritDamage?: number
  ConditionDamage?: number // Shows the amount of Condition Damage given
  ConditionDuration?: number // Shows the amount of Condition Duration given
  Healing?: number // Shows the amount of Healing Power given
  BoonDuration?: number // Shows the amount of Boon Duration given
}

interface Skills {
  heal: number // contains the skill id for the heal skill, resolvable against /v2/skills.
  utilities: number[] // each integer corresponds to a skill id for the equipped utilities, resolvable against /v2/skills.
  elite: number // contains the skill id for the elite skill, resolvable against /v2/skills.
  legends?: string[] // (Revenant only) - each string corresponds to a Revenant legend, resolvable against /v2/legends.
}

interface Spec {
  id: number // Specialization id, can be resolved against /v2/specializations.
  traits: number[] // returns ids for each selected trait, can be resolved against /v2/traits.
}

interface Training {
  id: number // Skill tree id, can be compared against the training section for each /v2/professions.
  spent: number // Shows how many hero points have been spent in this tree
  done: boolean // States whether or not the tree is fully trained.
}

interface WvW {
  id: number // ability id, can be resolved against /v2/wvw/abilities
  rank: number // current rank for the given ability.
}

interface PvP {
  amulet: number // Id for the equipped pvp amulet, can be resolved against /v2/pvp/amulets.
  rune: number // Id for the equipped pvp rune, can be resolved against /v2/items.
  sigils: number[] // Returns the id for all equipped pvp sigils. Can be resolved against /v2/items.
}
