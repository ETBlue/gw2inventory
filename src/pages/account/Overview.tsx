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

interface Account {
  id: string
  age: number // The age of the account in seconds.
  name: string
  world: number // The id of the home world the account is assigned to. Can be resolved against /v2/worlds.
  guilds: string[]
  guild_leader?: string[] // A list of guilds the account is leader of. Requires the additional guilds scope.
  created: string
  access: Access[] // A list of what content this account has access to
  commander: boolean // True if the player has bought a commander tag.
  fractal_level?: number // The account's personal fractal reward level. Requires the additional progression scope.
  daily_ap?: number //The daily AP the account has. Requires the additional progression scope.
  monthly_ap?: number // The monthly AP the account has. Requires the additional progression scope.
  wvw_rank?: number // The account's personal wvw rank. Requires the additional progression scope.
  last_modified: string
}

type Access =
  | "None" // should probably never happen
  | "PlayForFree" // has not yet purchased the game
  | "GuildWars2"
  | "HeartOfThorns"
  | "PathOfFire"

interface Luck {
  id: string
  value: number
}
