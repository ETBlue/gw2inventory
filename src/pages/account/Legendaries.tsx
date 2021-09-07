import React from "react"
import { useQuery } from "react-query"
import { queryFunction } from "helpers/api"

interface LegendaryArmory {
  id: number // The id of the armory items, resolvable against /v2/items and /v2/legendaryarmory.
  count: number // The count of that item available for use in a single equipment template.
}

function Legendaries(props: { token: string }) {
  const { token } = props

  const { data, isFetching } = useQuery(
    ["account/legendaryarmory", token],
    queryFunction,
  )

  console.log(data)

  return <div></div>
}

export default Legendaries
