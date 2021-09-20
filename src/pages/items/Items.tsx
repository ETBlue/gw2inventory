import React, { useContext } from "react"
import { NavLink, Switch, useHistory } from "react-router-dom"
import { MdSearch } from "react-icons/md"
import {
  Tabs,
  TabList,
  Tab,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
} from "@chakra-ui/react"

import ItemContext from "contexts/ItemContext"
import { useSearchParams } from "hooks/url"
import { getQueryString } from "helpers/url"

import { Item } from "./types"

function Items() {
  const { items } = useContext(ItemContext)
  const history = useHistory()

  const { queryString, keyword, sort, order } = useSearchParams()
  const activeSort = sort || "location"
  const activeOrder = order || "asc"

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
              const to = `/items?${getQueryString(
                "keyword",
                e.currentTarget.value,
                queryString,
              )}`
              history.push(to)
            }}
          />
        </InputGroup>
      </TabList>
      <div>
        <Switch></Switch>
      </div>
    </Tabs>
  )
}

export default Items

const MENU_ITEMS = [
  { to: "/items", text: "All", showOnly: null },
  {
    to: "/items/equipable",
    text: "Equipable",
    showOnly: [
      "Armor",
      "Weapon",
      "Back",
      "Trinket",
      "Gathering",
      "UpgradeComponent",
      "Bag",
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
