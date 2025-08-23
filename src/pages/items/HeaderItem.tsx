import { useLocation, useSearchParams, useNavigate } from "react-router"
import { Tr, Th } from "@chakra-ui/react"
import { CgArrowDown, CgArrowUp } from "react-icons/cg"

import { getQueryString } from "helpers/url"

import { Order, Sort } from "./types"
import sharedTableCss from "~/styles/shared-table.module.css"

const TABLE_HEADERS = [
  "rarity",
  "name",
  "type",
  "level",
  "location",
  "count",
  "chat_link",
]

interface Props {
  activeSort: Sort
  activeOrder: Order
}

function HeaderItem(props: Props) {
  const { activeSort, activeOrder } = props
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const queryString = searchParams.toString()

  const handleSort = (column: string) => {
    const newUrl = `${pathname}?${
      activeSort === column
        ? getQueryString(
            "order",
            activeOrder === "asc" ? "dsc" : "",
            queryString,
          )
        : getQueryString("sortBy", column, queryString)
    }`
    navigate(newUrl)
  }

  return (
    <Tr>
      {TABLE_HEADERS.map((title) => (
        <Th
          key={title}
          cursor="pointer"
          onClick={() => handleSort(title)}
          className={`${sharedTableCss.title} ${activeSort === title ? sharedTableCss.active : ""}`}
        >
          {title}
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
