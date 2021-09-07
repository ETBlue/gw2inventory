import React from "react"
import { useQuery } from "react-query"
import { queryFunction } from "helpers/api"

interface Achievement {
  id: number
  bits?: number[] // The meaning of each value varies with each achievement. Bits start at zero. If an achievement is done, the in-progress bits are not displayed.
  current?: number // The player's current progress towards the achievement.
  max?: number // The amount needed to complete the achievement.
  done: boolean
  repeated?: number // The number of times the achievement has been completed if the achievement is repeatable.
  unlocked?: boolean // if this property does not exist, the achievement is unlocked as well.
}

function Achievements(props: { token: string }) {
  const { token } = props

  const { data, isFetching } = useQuery(
    ["account/achievements", token],
    queryFunction,
  )

  console.log(data)

  return <div></div>
}

export default Achievements
