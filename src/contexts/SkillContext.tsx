import React, { useState, useEffect, useReducer, createContext } from "react"
import { useQuery } from "react-query"
import { chunk, sortBy } from "lodash"

import { fetchGW2, queryFunction } from "helpers/api"

import { Skill, Specialization } from "./types/Skill"
import { Values, Skills, Specializations } from "./types/SkillContext"

const SkillContext = createContext<Values>({
  skills: {},
  //traits: {},
  specializations: {},
  isFetching: false,
})

function SkillProvider(props: { children: React.ReactNode }) {
  const { data: specializationsData, isFetching: isSpecializationFetghing } =
    useQuery(["specializations", , "ids=all"], queryFunction, {
      staleTime: Infinity,
    })
  const specializations = specializationsData?.reduce(
    (prev: Specializations, curr: Specialization) => {
      return { ...prev, [curr.id]: curr }
    },
    {},
  )

  const { data: skillLlistData, isFetching: isSkillListFetching } = useQuery(
    ["skills"],
    queryFunction,
    {
      staleTime: Infinity,
    },
  )
  const skillIds: number[] = skillLlistData || []
  const [isSkillsFetching, setIsSkillsFetching] = useState<boolean>(false)
  const [skills, setSkills] = useState<Skills>({})
  const fetchSkills = async (skillIds: number[]) => {
    setIsSkillsFetching(true)
    const newSkills: Skills = {}
    const chunks = chunk(skillIds, 200)
    for (const chunk of chunks) {
      const data: Skill[] = await fetchGW2("skills", `ids=${chunk.join(",")}`)
      if (data) {
        for (const skill of data) {
          newSkills[skill.id] = skill
        }
      }
    }
    setSkills((prev) => {
      return { ...prev, ...newSkills }
    })
    setIsSkillsFetching(false)
  }
  useEffect(() => {
    fetchSkills(skillIds)
  }, [skillIds.length])

  return (
    <SkillContext.Provider
      value={{
        skills,
        specializations,
        isFetching:
          isSkillListFetching || isSkillsFetching || isSpecializationFetghing,
      }}
    >
      {props.children}
    </SkillContext.Provider>
  )
}

export default SkillContext
export { SkillProvider }
