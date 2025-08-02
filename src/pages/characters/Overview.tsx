import { format, formatDistanceStrict } from "date-fns"
import { GiFemale, GiMale } from "react-icons/gi"
import { FaCheck, FaMinus } from "react-icons/fa"
import { List, ListItem, ListIcon } from "@chakra-ui/react"

import type { Character } from "@gw2api/types/data/character"
import type { CraftingDiscipline } from "@gw2api/types/data/recipe"
import SortableTable, { Column } from "components/SortableTable"

interface Props {
  characters: Character[]
}

function Overview(props: Props) {
  const { characters } = props

  return (
    <SortableTable
      columns={COLUMNS}
      rows={characters}
      defaultSortBy="name"
      defaultOrder="asc"
    />
  )
}

export default Overview

const COLUMNS: Column[] = [
  {
    key: "name",
    title: "name",
    render(row: Character) {
      return row.name
    },
  },
  {
    key: "gender",
    title: "gender",
    render(row: Character) {
      return row.gender === "Female" ? <GiFemale /> : <GiMale />
    },
  },
  {
    key: "race",
    title: "race",
    render(row: Character) {
      return row.race
    },
  },
  {
    key: "profession",
    title: "profession",
    render(row: Character) {
      return row.profession
    },
  },
  {
    key: "level",
    title: "level",
    render(row: Character) {
      return `${row.level}`
    },
  },
  {
    key: "crafting",
    title: "crafting",
    render(row: Character) {
      return (
        <List>
          {row.crafting.map((crafting: CraftingDiscipline) => (
            <ListItem key={crafting.discipline}>
              <ListIcon as={crafting.active ? FaCheck : FaMinus} />
              {crafting.discipline} {crafting.rating}
            </ListItem>
          ))}
        </List>
      )
    },
  },
  {
    key: "created",
    title: "created",
    render(row: Character) {
      return format(new Date(row.created), "yyyy-MM-dd")
    },
  },
  // {
  //   key: "age",
  //   title: "age",
  //   render(row: Character) {
  //     return formatDistanceStrict(0, row.age * 1000, { unit: "hour" })
  //   },
  // },
  // {
  //   key: "deaths",
  //   title: "deaths",
  //   render(row: Character) {
  //     return `${row.deaths}`
  //   },
  // },
]
