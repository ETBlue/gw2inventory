import React from "react"
import { useQuery } from "@tanstack/react-query"
import { queryFunction } from "helpers/api"

function Recipes(props: { token: string }) {
  const { token } = props

  const { data, isFetching } = useQuery({
    queryKey: ["account/recipes", token],
    queryFn: queryFunction,
  })

  console.log(data)

  return <div></div>
}

export default Recipes
