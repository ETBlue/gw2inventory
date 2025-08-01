import React from "react"
import { useQuery } from "react-query"
import { Center, Spinner } from "@chakra-ui/react"

import { queryFunction } from "helpers/api"

function Overview(props: { token: string }) {
  const { token } = props

  const { data, isFetching } = useQuery(["account", token], queryFunction, {
    staleTime: Infinity,
  })

  const { data: luck, isFetching: isLuckFetching } = useQuery(
    ["account/luck", token],
    queryFunction,
    { staleTime: Infinity },
  )

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
