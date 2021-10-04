import React from "react"
import { Link, useLocation } from "react-router-dom"
import { Tag, Flex, Button } from "@chakra-ui/react"

import { useSearchParams } from "hooks/url"
import { getQueryString } from "helpers/url"
import { Items } from "contexts/ItemContext"

import { MenuItem } from "./Items"
import { UserItemInList } from "./types"
import { getTypedItemLength } from "./helpers/count"

interface Props {
  activeType: string | null
  showOnly: MenuItem["showOnly"]
  userItems: UserItemInList[]
  items: Items
}

function ItemHeader(props: Props) {
  const { activeType, showOnly, userItems, items } = props
  const { pathname } = useLocation()
  const { queryString } = useSearchParams()

  return (
    <Flex justifyContent="center" margin="1rem auto" columns={showOnly.length}>
      {showOnly.map((type) => (
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
            {getTypedItemLength([type], userItems, items)}
          </Tag>
        </Button>
      ))}
    </Flex>
  )
}

export default ItemHeader
