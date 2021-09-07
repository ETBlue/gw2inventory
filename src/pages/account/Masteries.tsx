import React from "react"
import { useQuery } from "react-query"
import { queryFunction } from "helpers/api"

interface Mastery {
  id: number // The id of the mastery resolvable against /v2/masteries.
  level: number // Indicates the level at which the mastery is on the account. Is a 0-indexed reference to the /v2/masteries.levels array indicating the maximum level unlocked by the user. If omitted, this mastery hasn't been started.
}

function Masteries(props: { token: string }) {
  const { token } = props

  const { data, isFetching } = useQuery(
    ["account/masteries", token],
    queryFunction,
  )

  console.log(data)

  return <div></div>
}

export default Masteries
