import React, { useState, useContext } from "react"
import {
  NavLink,
  Routes,
  Route,
  useNavigate,
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
import { useSearchParams } from "hooks/url"
import { getQueryString } from "helpers/url"
import ItemContext from "contexts/ItemContext"
import AccountContext from "contexts/AccountContext"
import CharacterContext from "contexts/CharacterContext"
import { Item as ItemDef } from "contexts/types/Item"
import { UserItemInList } from "contexts/types/ItemContext"
import Pagination from "components/Pagination"

import SubMenuItem from "./SubMenuItem"
import HeaderItem from "./HeaderItem"
import Item from "./Item"
import {
  getTypedItemLength,
  isItemInCategory,
  isItemInTypes,
} from "./helpers/count"
import { compare, compareRarity } from "./helpers/compare"
import { MENU_ITEMS } from "./consts/Items"
import { Sort, Order } from "./types/Items"
import css from "./styles/Items.module.css"

function Items() {
  const {
    items,
    materials,
    materialCategories,
    characterItems,
    inventoryItems,
    bankItems,
    materialItems,
    isFetching: isItemsFetching,
  } = useContext(ItemContext)
  const { isFetching: isCharactersFetching } = useContext(CharacterContext)
  const { isFetching: isAccountFetching } = useContext(AccountContext)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { category } = useParams()

  const {
    queryString,
    keyword,
    sortBy,
    order,
    type: activeType,
  } = useSearchParams()
  const activeSort: Sort = sortBy || "location"
  const activeOrder: Order = order || "asc"

  const allItems = [
    ...characterItems,
    ...inventoryItems,
    ...bankItems,
    ...materialItems,
  ]
  const visibleItems = allItems
    .filter((userItem: UserItemInList) => {
      if (activeType) {
        return isItemInTypes({
          types:
            activeType === "CraftingMaterial"
              ? materialCategories
              : [activeType],
          userItem,
          items,
          materials,
          pathname,
        })
      } else if (category) {
        return isItemInCategory({
          userItem,
          category,
          items,
          pathname,
        })
      } else {
        return true
      }
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
      const number =
        activeSort === "rarity"
          ? compareRarity(a.rarity, b.rarity)
          : compare(a[activeSort], b[activeSort])
      return activeOrder === "asc" ? number : number * -1
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
        <Tab as={NavLink} exact to="/items">
          All
          <Tag size="sm" margin="0 0 -0.1em 0.5em">
            {allItems?.length}
          </Tag>
        </Tab>
        {MENU_ITEMS.map((item) => (
          <Tab key={item.to} as={NavLink} to={item.to}>
            {item.text}
            <Tag size="sm" margin="0 0 -0.1em 0.5em">
              {getTypedItemLength({
                types:
                  item.to === "/items/material"
                    ? materialCategories
                    : item.showOnly,
                userItems: allItems,
                items,
                materials,
                pathname: item.to,
              })}
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
              navigate(to)
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
          <Routes>
            {MENU_ITEMS.map((menuItem) => (
              <Route key={menuItem.to} path={menuItem.to} element={
                <SubMenuItem
                  showOnly={
                    menuItem.to === "/items/material"
                      ? materialCategories
                      : menuItem.showOnly
                  }
                  activeType={activeType}
                  userItems={allItems}
                  items={items}
                  materials={materials}
                />
              } />
            ))}
          </Routes>
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
                  const materialCategory = materials[userItem.category]
                  return (
                    <Item
                      key={index}
                      item={item}
                      userItem={userItem}
                      materialCategory={materialCategory}
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
