import { Button, Flex, Tag } from "@chakra-ui/react"

import { isEqual } from "lodash"
import { Link, useLocation, useSearchParams } from "react-router"

import { useStaticData } from "~/contexts/StaticDataContext"
import { getTypedItemLength } from "~/helpers/itemFiltering"
import { getQueryString } from "~/helpers/url"
import { UserItemInList } from "~/types/items"

import { MENU_ITEMS } from "./constants"

interface Props {
  userItems: UserItemInList[]
}

function SubMenuItem(props: Props) {
  const { userItems } = props
  const { items, materials, materialCategories } = useStaticData()
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const queryString = searchParams.toString()
  const activeType = searchParams.get("type")

  const menuItem = MENU_ITEMS.find((item) => item.to === pathname)

  const showOnly = menuItem
    ? isEqual(menuItem.showOnly, ["CraftingMaterial"])
      ? materialCategories
      : menuItem.showOnly
    : []

  if (showOnly.length <= 1) return null

  return (
    <Flex
      justifyContent="center"
      margin="0 auto"
      borderBottom={"1px solid var(--chakra-colors-chakra-border-color)"}
    >
      {showOnly.map((type: string) => (
        <Button
          key={type}
          as={Link}
          variant="ghost"
          fontWeight="normal"
          borderRadius={0}
          isActive={type === activeType}
          to={`${pathname}?${getQueryString("type", type, queryString)}`}
        >
          {type}{" "}
          <Tag size="sm" margin="0 0 -0.1em 0.5em">
            {getTypedItemLength({
              types: [type],
              userItems,
              items,
              materials,
              pathname,
            })}
          </Tag>
        </Button>
      ))}
    </Flex>
  )
}

export default SubMenuItem
