import React from "react"
import { Link, useLocation } from "react-router"
import { CgArrowDown, CgArrowUp } from "react-icons/cg"
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react"

import { getQueryString } from "helpers/url"
import { useSearchParams } from "hooks/url"
import { Character } from "contexts/types/Character"
import { Item } from "contexts/types/Item"
import { compare } from "pages/items/helpers/compare"

import css from "./styles/SortableTable.module.css"

export interface Column {
  key: string
  title: string
  render:
    | ((data: Character) => JSX.Element | string)
    | ((data: Item) => JSX.Element | string)
}

interface Props {
  columns: Column[]
  rows: Character[] | Item[]
  defaultSortBy: string
  defaultOrder: "asc" | "dsc"
}

function SortableTable(props: Props) {
  const {
    columns,
    rows: unsortedRows,
    defaultSortBy,
    defaultOrder = "asc",
  } = props
  const { pathname } = useLocation()
  const { queryString, sortBy, order } = useSearchParams()
  const activeSort = sortBy || defaultSortBy
  const activeOrder = order || defaultOrder

  const rows = unsortedRows.sort((a: Character, b: Character) => {
    const number = compare(a[activeSort], b[activeSort])
    return activeOrder === "asc" ? number : number * -1
  })

  return (
    <Table className={css.table}>
      <Thead>
        <Tr>
          {columns.map((col) => (
            <Th
              key={col.key}
              as={Link}
              to={`${pathname}?${
                activeSort === col.title
                  ? getQueryString(
                      "order",
                      activeOrder === "asc" ? "dsc" : "",
                      queryString,
                    )
                  : getQueryString("sortBy", col.title, queryString)
              }`}
              className={`${css.title} ${
                activeSort === col.title ? css.active : ""
              }`}
            >
              {col.title}{" "}
              {activeSort === col.title ? (
                activeOrder === "asc" ? (
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
        {rows.map((row) => (
          <Tr key={row.name}>
            {columns.map((column: Column) => (
              <Td key={column.key}>{column.render(row)}</Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

export default SortableTable
