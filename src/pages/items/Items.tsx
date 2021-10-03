import React, { useState, useContext } from "react"
import {
  Link,
  NavLink,
  Switch,
  Route,
  useHistory,
  useLocation,
  useParams,
} from "react-router-dom"
import { chunk } from "lodash"
import { MdSearch } from "react-icons/md"
import {
  Tabs,
  TabList,
  Tab,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
  Table,
  Thead,
  Tbody,
  Tag,
  Flex,
  Button,
  Center,
  Spinner,
} from "@chakra-ui/react"

import { ITEM_COUNT_PER_PAGE } from "config"
import ItemContext from "contexts/ItemContext"
import CharacterContext from "contexts/CharacterContext"
import { useSearchParams } from "hooks/url"
import { getQueryString } from "helpers/url"
import { CharacterItemInList } from "pages/characters/types"

import Pagination from "components/Pagination"
import { Item as ItemDef } from "./types"
import ItemHeader from "./ItemHeader"
import Item from "./Item"
import css from "./styles/Items.module.css"

function Items() {
  const {
    items,
    characterItems,
    isFetching: isItemsFetching,
  } = useContext(ItemContext)
  const { isFetching: isCharactersFetching } = useContext(CharacterContext)
  const history = useHistory()
  const { pathname } = useLocation()
  const { category } = useParams()

  const {
    queryString,
    keyword,
    sort,
    order,
    type: activeType,
  } = useSearchParams()
  const activeSort = sort || "location"
  const activeOrder = order || "asc"

  const allItems = characterItems
  const getTypedItemLength = (types: string[]) => {
    const typedItems = allItems.filter((characterItem: CharacterItemInList) => {
      const itemRaw: ItemDef = items[characterItem.id]
      return types.includes(itemRaw?.type)
    })
    return typedItems.length
  }
  const visibleItems = allItems
    .filter((characterItem: CharacterItemInList) => {
      const itemRaw: ItemDef = items[characterItem.id]
      if (activeType) {
        return activeType === itemRaw?.type
      }
      if (category) {
        const activeTypes =
          MENU_ITEMS.find((menuItem) => menuItem.to === pathname)?.showOnly ||
          []
        return activeTypes.includes(itemRaw?.type)
      }
      return true
    })
    .filter((characterItem: CharacterItemInList) => {
      if (!keyword) return true
      const itemRaw: ItemDef = items[characterItem.id]
      const item = { ...characterItem, ...itemRaw }
      return JSON.stringify(item).match(new RegExp(keyword, "i"))
    })
    .sort((_a: CharacterItemInList, _b: CharacterItemInList) => {
      const a = { ..._a, ...items[_a.id] }
      const b = { ..._b, ...items[_b.id] }
      if (a[activeSort] > b[activeSort] && activeOrder === "asc") return 1
      if (a[activeSort] < b[activeSort] && activeOrder === "dsc") return 1
      if (a[activeSort] > b[activeSort] && activeOrder === "dsc") return -1
      if (a[activeSort] < b[activeSort] && activeOrder === "asc") return -1
      return 0
    })

  const pages = chunk(visibleItems, ITEM_COUNT_PER_PAGE)
  const [pageIndex, setPageIndex] = useState<number>(0)

  return (
    <Tabs display="grid" gridTemplateRows="auto 1fr" height="100%">
      <TabList>
        <Tab key="/items" as={NavLink} to="/items">
          All
          <Tag size="sm" margin="0 0 -0.1em 0.5em">
            {allItems?.length}
          </Tag>
        </Tab>
        {MENU_ITEMS.map((item) => (
          <Tab key={item.to} as={NavLink} to={item.to}>
            {item.text}
            <Tag size="sm" margin="0 0 -0.1em 0.5em">
              {getTypedItemLength(item.showOnly)}
            </Tag>
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
              const to = `${pathname}?${getQueryString(
                "keyword",
                e.currentTarget.value,
                queryString,
              )}`
              history.push(to)
            }}
          />
        </InputGroup>
      </TabList>
      {isItemsFetching || isCharactersFetching ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <div>
          <Switch>
            {MENU_ITEMS.map((menuItem) => (
              <Route key={menuItem.to} path={menuItem.to}>
                <Flex
                  justifyContent="center"
                  margin="1rem auto"
                  columns={menuItem.showOnly.length}
                >
                  {menuItem.showOnly.map((type) => (
                    <Button
                      key={type}
                      as={Link}
                      variant="ghost"
                      fontWeight="normal"
                      isActive={type === activeType}
                      to={`${pathname}?${getQueryString(
                        "type",
                        type,
                        queryString,
                      )}`}
                    >
                      {type}{" "}
                      <Tag size="sm" margin="0 0 -0.1em 0.5em">
                        {getTypedItemLength([type])}
                      </Tag>
                    </Button>
                  ))}
                </Flex>
              </Route>
            ))}
          </Switch>
          <Pagination
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
            pages={pages}
          />
          <Table className={css.table}>
            <Thead>
              <ItemHeader activeSort={activeSort} activeOrder={activeOrder} />
            </Thead>
            <Tbody>
              {pages[pageIndex]?.map(
                (characterItem: CharacterItemInList, index: number) => {
                  const item: ItemDef = items[characterItem.id]
                  return (
                    <Item
                      key={index}
                      item={item}
                      characterItem={characterItem}
                    />
                  )
                },
              )}
            </Tbody>
          </Table>
        </div>
      )}
    </Tabs>
  )
}

export default Items

const MENU_ITEMS = [
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
