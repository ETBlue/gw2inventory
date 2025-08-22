import React from "react"
import { Link, useLocation, useSearchParams } from "react-router"
import { CgArrowDown, CgArrowUp } from "react-icons/cg"
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react"

import { getQueryString } from "helpers/url"
import type { Character } from "@gw2api/types/data/character"

import { compare } from "pages/items/helpers/compare"

import css from "./styles/SortableTable.module.css"
import { PatchedItem } from "~/types/items"

export interface Column {
  key: string
  title: string
  render:
    | ((data: Character) => React.JSX.Element | string)
    | ((data: PatchedItem) => React.JSX.Element | string)
}

interface Props {
  columns: Column[]
  rows: Character[] | PatchedItem[]
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
  const [searchParams] = useSearchParams()
  const sortBy = searchParams.get("sortBy")
  const order = searchParams.get("order")
  const queryString = searchParams.toString()
  const activeSort = sortBy || defaultSortBy
  const activeOrder = order || defaultOrder

  const rows = unsortedRows.sort((a, b) => {
    // Type-safe property access using keyof operator
    const aValue = activeSort in a ? (a as any)[activeSort] : ""
    const bValue = activeSort in b ? (b as any)[activeSort] : ""
    const number = compare(aValue, bValue)
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
              {col.title}
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
              <Td key={column.key}>{column.render(row as any)}</Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

export default SortableTable
