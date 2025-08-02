import { Link, useLocation } from "react-router"
import { Tr, Th } from "@chakra-ui/react"
import { CgArrowDown, CgArrowUp } from "react-icons/cg"

import { useSearchParams } from "hooks/url"
import { getQueryString } from "helpers/url"

import { Order, Sort } from "./types/Items"
import { TABLE_HEADERS } from "./consts/Items"
import css from "./styles/HeaderItem.module.css"

interface Props {
  activeSort: Sort
  activeOrder: Order
}

function HeaderItem(props: Props) {
  const { activeSort, activeOrder } = props
  const { pathname } = useLocation()
  const { queryString } = useSearchParams()

  return (
    <Tr>
      {TABLE_HEADERS.map((title) => (
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
              : getQueryString("sortBy", title, queryString)
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

export default HeaderItem
