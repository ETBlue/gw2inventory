import React, { useState, useContext } from "react"
import {
  NavLink,
  Switch,
  Route,
  useHistory,
  useLocation,
  useParams,
} from "react-router-dom"
import { chunk, findIndex } from "lodash"
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
  Center,
  Spinner,
} from "@chakra-ui/react"

import { ITEM_COUNT_PER_PAGE } from "config"
import ItemContext from "contexts/ItemContext"
import AccountContext from "contexts/AccountContext"
import CharacterContext from "contexts/CharacterContext"
import { useSearchParams } from "hooks/url"
import { getQueryString } from "helpers/url"
import Pagination from "components/Pagination"

import SubMenuItem from "./SubMenuItem"
import HeaderItem from "./HeaderItem"
import { Item as ItemDef, UserItemInList } from "./types"
import Item from "./Item"
import { getTypedItemLength } from "./helpers/count"
import css from "./styles/Items.module.css"

function Items() {
  const {
    items,
    characterItems,
    inventoryItems,
    bankItems,
    materialItems,
    isFetching: isItemsFetching,
  } = useContext(ItemContext)
  const { isFetching: isCharactersFetching } = useContext(CharacterContext)
  const { isFetching: isAccountFetching } = useContext(AccountContext)
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

  const allItems = [
    ...characterItems,
    ...inventoryItems,
    ...bankItems,
    ...materialItems,
  ]
  const visibleItems = allItems
    .filter((userItem: UserItemInList) => {
      const itemRaw: ItemDef = items[userItem.id]
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
    .filter((userItem: UserItemInList) => {
      if (!keyword) return true
      const itemRaw: ItemDef = items[userItem.id]
      const item = { ...userItem, ...itemRaw }
      return JSON.stringify(item).match(new RegExp(keyword, "i"))
    })
    .sort((_a: UserItemInList, _b: UserItemInList) => {
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
    <Tabs
      display="grid"
      gridTemplateRows="auto 1fr"
      height="100%"
      index={findIndex(MENU_ITEMS, (item) => item.to === pathname) + 1 || 0}
    >
      <TabList>
        <Tab key="/items" as={NavLink} exact to="/items">
          All
          <Tag size="sm" margin="0 0 -0.1em 0.5em">
            {allItems?.length}
          </Tag>
        </Tab>
        {MENU_ITEMS.map((item) => (
          <Tab key={item.to} as={NavLink} to={item.to}>
            {item.text}
            <Tag size="sm" margin="0 0 -0.1em 0.5em">
              {getTypedItemLength(item.showOnly, allItems, items)}
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
      {isItemsFetching || isCharactersFetching || isAccountFetching ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <div>
          <Switch>
            {MENU_ITEMS.map((menuItem) => (
              <Route key={menuItem.to} path={menuItem.to}>
                <SubMenuItem
                  showOnly={menuItem.showOnly}
                  activeType={activeType}
                  userItems={allItems}
                  items={items}
                />
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
              <HeaderItem activeSort={activeSort} activeOrder={activeOrder} />
            </Thead>
            <Tbody>
              {pages[pageIndex]?.map(
                (userItem: UserItemInList, index: number) => {
                  const item: ItemDef = items[userItem.id]
                  return <Item key={index} item={item} userItem={userItem} />
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

export interface MenuItem {
  to: string
  text: string
  showOnly: string[]
}

const MENU_ITEMS: MenuItem[] = [
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
