import React, { useContext } from "react"
import {
  Link,
  NavLink,
  Switch,
  Route,
  useHistory,
  useLocation,
  useParams,
} from "react-router-dom"
import { MdSearch } from "react-icons/md"
import { CgArrowDown, CgArrowUp } from "react-icons/cg"
import { BsQuestionOctagonFill } from "react-icons/bs"
import {
  Tabs,
  TabList,
  Tab,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
  Td,
  Tr,
  Table,
  Thead,
  Tbody,
  Th,
  Image,
  Heading,
  Tag,
  Flex,
  Button,
  Code,
} from "@chakra-ui/react"

import ItemContext from "contexts/ItemContext"
import { useSearchParams } from "hooks/url"
import { getQueryString } from "helpers/url"
import { CharacterItemInList } from "pages/characters/types"

import css from "./styles/Items.module.css"

function Items() {
  const { items, characterItems } = useContext(ItemContext)
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
      const itemRaw = items[characterItem.id]
      return types.includes(itemRaw?.type)
    })
    return typedItems.length
  }
  const visibleItems = allItems
    .filter((characterItem: CharacterItemInList) => {
      const itemRaw = items[characterItem.id]
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
      const itemRaw = items[characterItem.id]
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
        <Table className={css.table}>
          <Thead>
            <Tr>
              {["rarity", "name", "type", "level", "location", "chat_link"].map(
                (title) => (
                  <Th
                    key={title}
                    as={Link}
                    to={`${pathname}?${
                      activeSort === title
                        ? getQueryString(
                            "order",
                            activeOrder === "asc" ? "dsc" : "",
                            queryString,
                          )
                        : getQueryString("sort", title, queryString)
                    }`}
                    className={`${css.title} ${
                      activeSort === title ? css.active : ""
                    } ${title === "rarity" ? css.iconHeader : ""}`}
                  >
                    {title}{" "}
                    {activeSort === title ? (
                      activeOrder === "asc" ? (
                        <CgArrowDown />
                      ) : (
                        <CgArrowUp />
                      )
                    ) : null}
                  </Th>
                ),
              )}
            </Tr>
          </Thead>
          <Tbody>
            {visibleItems.map(
              (characterItem: CharacterItemInList, index: number) => {
                const item = items[characterItem.id]
                return (
                  <Tr key={index}>
                    <Td className={css.iconCell}>
                      {item ? (
                        <Image
                          src={item.icon}
                          alt={item.rarity}
                          className={`${css.icon} ${
                            css[item.rarity.toLowerCase()]
                          }`}
                          border="5px yellow solid"
                        />
                      ) : (
                        <BsQuestionOctagonFill size="3.5rem" />
                      )}
                    </Td>
                    <Td className={css.nameCell}>
                      {item ? (
                        <>
                          <Heading
                            as="h4"
                            size="sm"
                            className={`${css.name} ${
                              css[item?.rarity.toLowerCase()]
                            }`}
                          >
                            {item.name}
                          </Heading>
                          <p className={`${css.description} ${css.secondary}`}>
                            {item.description}
                          </p>
                        </>
                      ) : (
                        <>
                          Item not exists in Guild Wars 2 API. ID:{" "}
                          <Code>{characterItem.id}</Code>
                        </>
                      )}
                    </Td>
                    <Td>
                      {item?.type}
                      <div className={css.secondary}>{item?.details?.type}</div>
                    </Td>
                    <Td>
                      {item && (
                        <>
                          {item.level}
                          <div className={css.secondary}>
                            {item && item.restrictions.join(",")}
                          </div>
                        </>
                      )}
                    </Td>
                    <Td>
                      {characterItem.location}{" "}
                      {characterItem.isEquipped && (
                        <Tag size="sm" fontWeight="normal">
                          Equipped
                        </Tag>
                      )}
                      {characterItem.bound_to && (
                        <div className={css.secondary}>
                          bound to {characterItem.bound_to}
                        </div>
                      )}
                    </Td>
                    <Td>
                      {item && (
                        <Code className={css.secondary}>{item.chat_link}</Code>
                      )}
                    </Td>
                  </Tr>
                )
              },
            )}
          </Tbody>
        </Table>
      </div>
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
