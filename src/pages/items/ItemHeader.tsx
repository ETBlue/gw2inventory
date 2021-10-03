import React from "react"
import { Link, useLocation } from "react-router-dom"
import { Tr, Th } from "@chakra-ui/react"
import { CgArrowDown, CgArrowUp } from "react-icons/cg"

import { useSearchParams } from "hooks/url"
import { getQueryString } from "helpers/url"

import css from "./styles/ItemHeader.module.css"

interface Props {
  activeSort: string
  activeOrder: string
}

function ItemHeader(props: Props) {
  const { activeSort, activeOrder } = props
  const { pathname } = useLocation()
  const { queryString } = useSearchParams()

  return (
    <Tr>
      {[
        "rarity",
        "name",
        "type",
        "level",
        "location",
        "count",
        "chat_link",
      ].map((title) => (
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
          className={`${css.title} ${activeSort === title ? css.active : ""}`}
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
      ))}
    </Tr>
  )
}

export default ItemHeader
