import React from "react"
import { useQuery } from "@tanstack/react-query"
import { Center, Spinner } from "@chakra-ui/react"

import { queryFunction } from "helpers/api"

function Overview(props: { token: string }) {
  const { token } = props

  const { data, isFetching } = useQuery({
    queryKey: ["account", token],
    queryFn: queryFunction,
    staleTime: Infinity,
  })

  const { data: luck, isFetching: isLuckFetching } = useQuery({
    queryKey: ["account/luck", token],
    queryFn: queryFunction,
    staleTime: Infinity,
  })

  if (isFetching || isLuckFetching)
    return (
      <Center>
        <Spinner />
      </Center>
    )

  if (!data || !luck) return null

  return (
    <div>
      <p>{data.name}</p>
      <p>{luck[0].value}</p>
    </div>
  )
}

export default Overview
