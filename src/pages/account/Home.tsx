import React from "react"
import { useQuery } from "react-query"
import { queryFunction } from "helpers/api"

interface Cat {
  id: number // The id for the cat that can be resolved against /v2/cats.
  hint?: string // A hint to identify what is needed for each cat.
}

type Node = string // Each string represents the id of a particular node that can be resolved against /v2/home/nodes.

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
