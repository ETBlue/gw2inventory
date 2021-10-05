import React from "react"
import { useQuery } from "react-query"
import { queryFunction } from "helpers/api"

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
