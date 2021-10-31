import React from "react"
import { Link } from "react-router-dom"
import { format, formatDistanceStrict } from "date-fns"
import { GiFemale, GiMale } from "react-icons/gi"
import { CgArrowDown, CgArrowUp } from "react-icons/cg"
import { FaCheck, FaMinus } from "react-icons/fa"
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react"

import { getQueryString } from "helpers/url"

import { Character, Crafting } from "contexts/types/Character"
import { COLUMNS } from "./consts/Overview"
import css from "./styles/Characters.module.css"

interface Props {
  characters: Character[]
  activeSort: string
  activeOrder: string
  queryString: string
}

function Overview(props: Props) {
  const { characters, activeSort, activeOrder, queryString } = props
  return (
    <Table className={css.table}>
      <Thead>
        <Tr>
          {COLUMNS.map((title) => (
            <Th
              key={title}
              as={Link}
              to={`/characters?${
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
              }`}
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
      </Thead>
      <Tbody>
        {characters.map((character) => (
          <Tr key={character.name}>
            {COLUMNS.map((column) => (
              <Td key={column}>
                {column === "age" ? (
                  formatDistanceStrict(0, character.age * 1000, {
                    unit: "hour",
                  })
                ) : column === "gender" ? (
                  <Gender gender={character.gender} />
                ) : column === "created" ? (
                  format(new Date(character.created), "yyyy-MM-dd")
                ) : column === "crafting" ? (
                  <List>
                    {character.crafting.map((crafting: Crafting) => (
                      <ListItem key={crafting.discipline}>
                        <ListIcon as={crafting.active ? FaCheck : FaMinus} />
                        {crafting.discipline} {crafting.rating}
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  character[column]
                )}
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

export default Overview

function Gender(props: { gender: string }) {
  const { gender } = props
  if (gender === "Female") {
    return <GiFemale />
  } else {
    return <GiMale />
  }
}

