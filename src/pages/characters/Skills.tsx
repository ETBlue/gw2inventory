import React, { useContext } from "react"
import { format, formatDistanceStrict } from "date-fns"
import { GiFemale, GiMale } from "react-icons/gi"
import { FaCheck, FaMinus } from "react-icons/fa"
import { List, ListItem, ListIcon } from "@chakra-ui/react"

import SkillContext from "contexts/SkillContext"
import { Character, Crafting } from "contexts/types/Character"
import SortableTable, { Column } from "components/SortableTable"
import css from "./styles/Skills.module.css"
import { Skills, Specializations } from "contexts/types/SkillContext"

interface Props {
  characters: Character[]
}

function PvE(props: Props) {
  const { characters } = props
  const { skills, specializations } = useContext(SkillContext)
  return (
    <SortableTable
      columns={getColumns(skills)}
      rows={characters.map((c) => {
        return { skills: c.skills.pve, spec: c.specializations.pve }
      })}
      defaultSortBy="name"
      defaultOrder="asc"
    />
  )
}

export default PvE

const getColumns = (skills: Skills): Column[] => {
  return [
    {
      key: "skill",
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
  ]
}
//skills: {
//  pve: Skills // contains the information on each slotted utility for Skills
//  pvp: Skills // contains the information on each slotted utility for PvP
//  wvw: Skills // contains the information on each slotted utility for WvW
//} // contains the pve, pvp, and wvw objects for the current utilities equipped.
//specializations: {
//  pve: Spec[] // contains the information on each slotted specialization and trait for Skills
//  pvp: Spec[] // contains the information on each slotted specialization and trait for PvP
//  wvw: Spec[] // contains the information on each slotted specialization and trait for WvW
//} // contains the pve, pvp, and wvw objects for the current specializations and traits equipped.
//training: Training[] // contains objects for each skill tree trained
//wvw_abilities: WvW[] // contains information on each trained wvw ability
