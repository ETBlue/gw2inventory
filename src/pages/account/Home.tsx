import React from "react"
import { useQuery } from "react-query"
import { queryFunction } from "helpers/api"

function Home(props: { token: string }) {
  const { token } = props

  const { data: catsData, isFetching: catsFetching } = useQuery(
    ["account/home/cats", token],
    queryFunction,
  )

  console.log(catsData)

  const { data: nodesData, isFetching: nodesFetching } = useQuery(
    ["account/home/nodes", token],
    queryFunction,
  )

  return <div></div>
}

export default Home
