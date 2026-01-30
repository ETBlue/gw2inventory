import { useCallback, useMemo, useState } from "react"

import {
  Button,
  Center,
  Flex,
  Grid,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
  Spinner,
  Tab,
  TabList,
  Table,
  Tabs,
  Tag,
  Tbody,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react"
import type { MaterialCategory } from "@gw2api/types/data/material"

import { chunk, findIndex, sortBy as lodashSortBy } from "lodash"
import { CgArrowDown, CgArrowUp } from "react-icons/cg"
import { MdSearch } from "react-icons/md"
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router"

import Pagination from "~/components/Pagination"
import { PAGINATION } from "~/constants"
import { useCharacters } from "~/contexts/CharacterContext"
import { compare, compareRarity } from "~/helpers/compare"
import { getQueryString } from "~/helpers/url"
import { useItemsData } from "~/hooks/useItemsData"
import { useMaterialCategoriesQuery } from "~/hooks/useStaticData"
import sharedTableCss from "~/styles/shared-table.module.css"
import {
  PatchedItem,
  UserItemInList,
  materialCategoryAliases,
} from "~/types/items"

import Item from "./Item"
import { MENU_ITEMS } from "./constants"
import { Order, Sort } from "./types"

const TABLE_HEADERS = [
  "rarity",
  "name",
  "type",
  "level",
  "location",
  "count",
  "chat_link",
]

function Items() {
  const { data: materialCategoriesData = [] } = useMaterialCategoriesQuery()

  const materialCategories = useMemo(
    () =>
      materialCategoriesData.length > 0
        ? lodashSortBy(materialCategoriesData, ["order"]).map(
            (item: MaterialCategory) => materialCategoryAliases[item.name],
          )
        : [],
    [materialCategoriesData],
  )

  const materialIdToCategoryIdMap = useMemo(
    () =>
      materialCategoriesData.reduce(
        (prev: Record<number, number>, curr: MaterialCategory) => {
          for (const id of curr.items) {
            prev[id] = curr.id
          }
          return prev
        },
        {},
      ),
    [materialCategoriesData],
  )

  const materialCategoryIdToNameMap = useMemo(
    () =>
      materialCategoriesData.reduce(
        (prev: Record<number, string>, curr: MaterialCategory) => {
          prev[curr.id] = curr.name
          return prev
        },
        {},
      ),
    [materialCategoriesData],
  )
  const {
    hasToken,
    items = {},
    characterItems,
    inventoryItems,
    bankItems,
    materialItems,
    guildVaultItems,
    isFetching: isItemsFetching,
  } = useItemsData()
  const { isFetching: isCharactersFetching } = useCharacters()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { category } = useParams()

  const [searchParams, setSearchParams] = useSearchParams()
  const keyword = searchParams.get("keyword")
  const sortBy = searchParams.get("sortBy")
  const order = searchParams.get("order")
  const itemTypeFilter = searchParams.get("type")
  const columnForItemsSorting: Sort = (sortBy as Sort) || "location"
  const itemsSortingOrder: Order = (order as Order) || "asc"

  // Query string without 'type' parameter for navigation
  const navigationQueryString = useMemo(() => {
    const params = new URLSearchParams(searchParams)
    params.delete("type")
    const result = params.toString()
    return result ? `?${result}` : ""
  }, [searchParams])

  // Handle table column sorting
  const handleSort = useCallback(
    (column: string) => {
      const queryString = searchParams.toString()
      const newUrl = `${pathname}?${
        columnForItemsSorting === column
          ? getQueryString(
              "order",
              itemsSortingOrder === "asc" ? "dsc" : "",
              queryString,
            )
          : getQueryString("sortBy", column, queryString)
      }`
      navigate(newUrl)
    },
    [
      pathname,
      columnForItemsSorting,
      itemsSortingOrder,
      searchParams,
      navigate,
    ],
  )

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

  // item filtering by category and type
  const allItems = useMemo(
    () => [
      ...characterItems,
      ...inventoryItems,
      ...bankItems,
      ...materialItems,
      ...guildVaultItems,
    ],
    [characterItems, inventoryItems, bankItems, materialItems, guildVaultItems],
  )
  const getVisibleTypesForCategoryFiltering = useCallback(
    (category: string | undefined): string[] | undefined => {
      if (!category) return undefined

      return MENU_ITEMS.find((menuItem) => menuItem.to === `/items/${category}`)
        ?.showOnly
    },
    [],
  )
  const getItemsByCategoryAndType = useCallback(
    (category: string | undefined, type?: string): UserItemInList[] => {
      if (!category) return allItems

      const itemsInCategory = allItems.filter((userItem: UserItemInList) => {
        const itemData: PatchedItem = items[userItem.id]
        if (!itemData) {
          console.warn("Item data not found for item ID:", userItem.id)
        }

        const visibleTypesInCategory =
          getVisibleTypesForCategoryFiltering(category) ?? []

        return visibleTypesInCategory.includes(itemData?.type)
      })

      if (!type) return itemsInCategory

      const itemsInType = itemsInCategory.filter((userItem: UserItemInList) => {
        const itemData: PatchedItem = items[userItem.id]
        if (!itemData) {
          console.warn("Item data not found for item ID:", userItem.id)
        }
        if (category === "material") {
          const categoryId = materialIdToCategoryIdMap[userItem.id]
          const categoryName = materialCategoryIdToNameMap[categoryId]
          const categoryShortName =
            categoryName && materialCategoryAliases[categoryName]
          return type === categoryShortName
        } else {
          return type === itemData?.type
        }
      })

      return itemsInType
    },
    [
      allItems,
      items,
      materialIdToCategoryIdMap,
      materialCategoryIdToNameMap,
      getVisibleTypesForCategoryFiltering,
    ],
  )
  const visibleItems = useMemo(() => {
    return getItemsByCategoryAndType(category, itemTypeFilter ?? undefined)
      .filter((userItem: UserItemInList) => {
        if (!keyword) return true
        const itemData: PatchedItem = items[userItem.id]
        const item = { ...userItem, ...itemData }
        return JSON.stringify(item).match(new RegExp(keyword, "i"))
      })
      .sort((_a: UserItemInList, _b: UserItemInList) => {
        const a = { ..._a, ...items[_a.id] }
        const b = { ..._b, ...items[_b.id] }
        const number =
          columnForItemsSorting === "rarity"
            ? compareRarity(a.rarity, b.rarity)
            : compare(
                (a as any)[columnForItemsSorting],
                (b as any)[columnForItemsSorting],
              )
        return itemsSortingOrder === "asc" ? number : number * -1
      })
  }, [
    itemTypeFilter,
    items,
    category,
    keyword,
    columnForItemsSorting,
    itemsSortingOrder,
    getItemsByCategoryAndType,
  ])

  // submenu
  const getVisibleTypesForSubmenuRendering = useCallback(
    (category: string | undefined) => {
      if (category === "material") {
        return materialCategories
      }
      return getVisibleTypesForCategoryFiltering(category)
    },
    [getVisibleTypesForCategoryFiltering, materialCategories],
  )
  const visibleSubmenuTypes = useMemo(
    () => getVisibleTypesForSubmenuRendering(category),
    [getVisibleTypesForSubmenuRendering, category],
  )

  // pagination
  const pages = useMemo(
    () => chunk(visibleItems, PAGINATION.ITEMS_PER_PAGE),
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
                {
                  getItemsByCategoryAndType(
                    item.to.replace("/items", "").replace("/", ""),
                  ).length
                }
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
        {visibleSubmenuTypes && (
          <Flex
            flexWrap="wrap"
            justifyContent="center"
            margin="0 auto"
            borderBottom={"1px solid var(--chakra-colors-chakra-border-color)"}
          >
            {visibleSubmenuTypes.map((type: string) => (
              <Button
                key={type}
                as={Link}
                variant="ghost"
                fontWeight="normal"
                borderRadius={0}
                isActive={type === itemTypeFilter}
                to={`${pathname}?${getQueryString("type", type, searchParams.toString())}`}
              >
                {type}{" "}
                <Tag size="sm" margin="0 0 -0.1em 0.5em">
                  {getItemsByCategoryAndType(category, type).length}
                </Tag>
              </Button>
            ))}
          </Flex>
        )}
        <Pagination
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          pages={pages}
        />
        <Table className={sharedTableCss.table}>
          <Thead>
            <Tr>
              {TABLE_HEADERS.map((title) => (
                <Th
                  key={title}
                  cursor="pointer"
                  onClick={() => handleSort(title)}
                  className={`${sharedTableCss.title} ${columnForItemsSorting === title ? sharedTableCss.active : ""}`}
                >
                  {title}
                  {columnForItemsSorting === title ? (
                    itemsSortingOrder === "asc" ? (
                      <CgArrowDown />
                    ) : (
                      <CgArrowUp />
                    )
                  ) : null}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {pages[pageIndex]?.map(
              (userItem: UserItemInList, index: number) => {
                const item: PatchedItem = items[userItem.id]
                const materialStackCategoryName =
                  "category" in userItem && userItem.category
                    ? materialCategoryIdToNameMap[userItem.category]
                    : undefined
                const materialCategoryId =
                  materialIdToCategoryIdMap[userItem.id]
                const materialCategoryName =
                  materialCategoryIdToNameMap[materialCategoryId]
                return (
                  <Item
                    key={index}
                    item={item}
                    userItem={userItem}
                    materialStackCategory={
                      materialStackCategoryName &&
                      materialCategoryAliases[materialStackCategoryName]
                    }
                    materialCategory={
                      materialCategoryAliases[materialCategoryName]
                    }
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
