import React, { useContext } from "react"
import { Link, NavLink, useHistory, useLocation } from "react-router-dom"
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
} from "@chakra-ui/react"

import ItemContext from "contexts/ItemContext"
import { useSearchParams } from "hooks/url"
import { getQueryString } from "helpers/url"

import css from "./styles/Items.module.css"

function Items() {
  const { items, characterItems } = useContext(ItemContext)
  const history = useHistory()
  const { pathname } = useLocation()

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
      <Table className={css.table}>
        <Thead>
          <Tr>
            {["rarity", "name", "chat_link", "level", "location"].map(
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
          {characterItems.map((characterItem, index) => {
            const item = items[characterItem.id]
            return (
              <Tr key={index}>
                <Td className={css.iconCell}>
                  {item ? (
                    <Image
                      src={item.icon}
                      alt={`icon of ${item.name}`}
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
                      <p className={css.description}>{item.description}</p>
                    </>
                  ) : (
                    "(item not supported in gw2 api)"
                  )}
                </Td>
                <Td>
                  {item && (
                    <code className={css.chatLink}>{item.chat_link}</code>
                  )}
                </Td>
                <Td>
                  {item && (
                    <>
                      {item.level}
                      <div className={css.restrictions}>
                        {item && item.restrictions.join(",")}
                      </div>
                    </>
                  )}
                </Td>
                <Td>
                  {characterItem.location}
                  {characterItem.bound_to && (
                    <div className={css.boundTo}>
                      bound to {characterItem.bound_to}
                    </div>
                  )}
                </Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
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
