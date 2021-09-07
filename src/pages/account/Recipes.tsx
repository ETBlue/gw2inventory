import React from "react"
import { useQuery } from "react-query"
import { queryFunction } from "helpers/api"

type Recipe = number // each value being the ID of a recipe that can be resolved against /v2/recipes.

function Recipes(props: { token: string }) {
  const { token } = props

  const { data, isFetching } = useQuery(
    ["account/recipes", token],
    queryFunction,
  )

  console.log(data)

  return <div></div>
}

export default Recipes
