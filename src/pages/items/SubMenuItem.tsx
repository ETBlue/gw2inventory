import { Link, useLocation } from "react-router"
import { Tag, Flex, Button } from "@chakra-ui/react"

import { useSearchParams } from "hooks/url"
import { getQueryString } from "helpers/url"
import { Items, Materials } from "contexts/types/ItemContext"
import { UserItemInList } from "contexts/types/ItemContext"

import { MenuItem } from "./types/Items"
import { getTypedItemLength } from "./helpers/count"

interface Props {
  activeType: string | null
  showOnly: MenuItem["showOnly"]
  userItems: UserItemInList[]
  items: Items
  materials: Materials
}

function SubMenuItem(props: Props) {
  const { activeType, showOnly, userItems, items, materials } = props
  const { pathname } = useLocation()
  const { queryString } = useSearchParams()

  return (
    <Flex justifyContent="center" margin="1rem auto" columns={showOnly.length}>
      {showOnly.map((type: string) => (
        <Button
          key={type}
          as={Link}
          variant="ghost"
          fontWeight="normal"
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
