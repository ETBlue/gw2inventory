import React, { Dispatch } from "react"
import { format, formatDistanceStrict } from "date-fns"
import { GiFemale, GiMale } from "react-icons/gi"
import { CgArrowDown } from "react-icons/cg"
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react"

import { Character } from "./Characters"
import css from "./styles/Character.module.css"

interface Props {
  characters: Character[]
  token: string
  sortBy: string
  setSortBy: Dispatch<string>
}

function Overview(props: Props) {
  const { characters, sortBy, setSortBy } = props

  return (
    <Table>
      <Thead>
        <Tr>
          {COLUMNS.map((title) => (
            <Th
              key={title}
              onClick={() => {
                setSortBy(title)
              }}
              className={sortBy === title ? css.active : ""}
              style={{ cursor: "pointer", position: "relative" }}
            >
              {title} {sortBy === title ? <CgArrowDown /> : ""}
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

const COLUMNS = [
  "name",
  "gender",
  "race",
  "profession",
  "level",
  "age",
  "created",
  "deaths",
]

function Gender(props: { gender: string }) {
  const { gender } = props
  if (gender === "Female") {
    return <GiFemale />
  } else {
    return <GiMale />
  }
}

