import React from "react"
import { useQuery } from "react-query"
import { queryFunction } from "helpers/api"

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
