import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Center, Grid, Spinner } from "@chakra-ui/react"
import { useToken } from "~/hooks/useToken"
import { useTitles } from "~/hooks/useTitles"
import { Account } from "@gw2api/types/data/account"
import { queryFunction } from "~/helpers/api"
import { format } from "date-fns"

function Overview() {
  const { currentAccount } = useToken()
  const token = currentAccount?.token

  const { data: account, isFetching: isAccountFetching } = useQuery<Account>({
    queryKey: ["account", token],
    queryFn: queryFunction as any,
    staleTime: Infinity,
    enabled: !!token,
  })

  const { data: progression, isFetching: isProgressionFetching } = useQuery<
    { id: string; value: number }[]
  >({
    queryKey: ["account/progression", token],
    queryFn: queryFunction as any,
    staleTime: Infinity,
    enabled: !!token,
  })

  const { titles, isFetching: isTitlesFetching } = useTitles()

  // Sort titles alphabetically by name for consistent display
  const sortedTitles = useMemo(() => {
    if (!titles) return undefined
    return [...titles].sort((a, b) => a.name.localeCompare(b.name))
  }, [titles])

  if (!token) return <Center>No account selected</Center>

  if (isAccountFetching || isProgressionFetching || isTitlesFetching)
    return (
      <Center>
        <Spinner />
      </Center>
    )

  if (!account || !progression) return null

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
      <div>
        <p>{account.name}</p>
        <p>
          Created:{" "}
          {format(new Date(account.created), "MMMM d, yyyy 'at' h:mm a")}
        </p>
        <p>Access: {account.access.map((item) => item).join(", ")}</p>
        <p>WvW Rank: {account.wvw_rank}</p>
        <p>Fractal Level: {account.fractal_level}</p>
        {progression.map((item) => (
          <p key={item.id}>
            {item.id.replace(/_/g, " ")}: {item.value.toLocaleString()}
          </p>
        ))}
      </div>
      <div>
        <p>Titles ({sortedTitles?.length || 0})</p>
        <ul>
          {sortedTitles?.map((title) => (
            <li key={title.id}>
              {title.name}
              {title.ap_required && ` (${title.ap_required} AP)`}
            </li>
          ))}
        </ul>
      </div>
    </Grid>
  )
}

export default Overview
