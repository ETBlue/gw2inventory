import React from "react"
import { useQuery } from "react-query"
import { queryFunction } from "helpers/api"

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
