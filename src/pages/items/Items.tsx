import { useState, useMemo, useCallback } from "react"
import { NavLink, useLocation, useParams, useSearchParams } from "react-router"
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
  Grid,
} from "@chakra-ui/react"

import { ITEM_COUNT_PER_PAGE } from "config"
import { useItemsData } from "hooks/useItemsData"
import { useCharacters } from "hooks/useCharacters"
import { PatchedItem, UserItemInList } from "types/items"
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

import { Sort, Order } from "./types"
import sharedTableCss from "~/styles/shared-table.module.css"
import { MENU_ITEMS } from "./constants"

function Items() {
  const {
    hasToken,
    items,
    materials,
    materialCategories,
    characterItems,
    inventoryItems,
    bankItems,
    materialItems,
    isFetching: isItemsFetching,
  } = useItemsData()
  const { isFetching: isCharactersFetching } = useCharacters()
  const { pathname } = useLocation()
  const { category } = useParams()

  const [searchParams, setSearchParams] = useSearchParams()
  const keyword = searchParams.get("keyword")
  const sortBy = searchParams.get("sortBy")
  const order = searchParams.get("order")
  const activeType = searchParams.get("type")
  const activeSort: Sort = (sortBy as Sort) || "location"
  const activeOrder: Order = (order as Order) || "asc"

  // Query string without 'type' parameter for navigation
  const navigationQueryString = useMemo(() => {
    const params = new URLSearchParams(searchParams)
    params.delete("type")
    const result = params.toString()
    return result ? `?${result}` : ""
  }, [searchParams])

  // Update search keyword in URL
  const updateSearch = useCallback(
    (value: string) => {
      setSearchParams(
        (prev) => {
          const newParams = new URLSearchParams(prev)
          if (value) {
            newParams.set("keyword", value)
          } else {
            newParams.delete("keyword")
          }
          return newParams
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const allItems = useMemo(
    () => [
      ...characterItems,
      ...inventoryItems,
      ...bankItems,
      ...materialItems,
    ],
    [characterItems, inventoryItems, bankItems, materialItems],
  )

  const visibleItems = useMemo(() => {
    return allItems
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
        const itemRaw: PatchedItem = items[userItem.id]
        const item = { ...userItem, ...itemRaw }
        return JSON.stringify(item).match(new RegExp(keyword, "i"))
      })
      .sort((_a: UserItemInList, _b: UserItemInList) => {
        const a = { ..._a, ...items[_a.id] }
        const b = { ..._b, ...items[_b.id] }
        const number =
          activeSort === "rarity"
            ? compareRarity(a.rarity, b.rarity)
            : compare((a as any)[activeSort], (b as any)[activeSort])
        return activeOrder === "asc" ? number : number * -1
      })
  }, [
    allItems,
    activeType,
    materialCategories,
    items,
    materials,
    pathname,
    category,
    keyword,
    activeSort,
    activeOrder,
  ])

  const pages = useMemo(
    () => chunk(visibleItems, ITEM_COUNT_PER_PAGE),
    [visibleItems],
  )
  const [pageIndex, setPageIndex] = useState<number>(0)

  return (
    <Grid gridTemplateRows="auto 1fr" minHeight={"100%"}>
      <Tabs
        index={findIndex(MENU_ITEMS, (item) => item.to === pathname) + 1 || 0}
      >
        <TabList>
          <Tab as={NavLink} to={`/items${navigationQueryString}`}>
            All
            <Tag size="sm" margin="0 0 -0.1em 0.5em">
              {allItems?.length}
            </Tag>
          </Tab>
          {MENU_ITEMS.map((item) => (
            <Tab
              key={item.to}
              as={NavLink}
              to={`${item.to}${navigationQueryString}`}
            >
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
              onChange={(e) => updateSearch(e.currentTarget.value)}
            />
          </InputGroup>
        </TabList>
        <SubMenuItem userItems={allItems} />
        <Pagination
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          pages={pages}
        />
        <Table className={sharedTableCss.table}>
          <Thead>
            <HeaderItem activeSort={activeSort} activeOrder={activeOrder} />
          </Thead>
          <Tbody>
            {pages[pageIndex]?.map(
              (userItem: UserItemInList, index: number) => {
                const item: PatchedItem = items[userItem.id]
                const materialCategory = materials[(userItem as any).category]
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
      </Tabs>
      {isItemsFetching || isCharactersFetching ? (
        <Center>
          <Spinner />
        </Center>
      ) : !hasToken ? (
        <Center>No account selected</Center>
      ) : visibleItems.length === 0 ? (
        <Center>No item found</Center>
      ) : null}
    </Grid>
  )
}

export default Items
