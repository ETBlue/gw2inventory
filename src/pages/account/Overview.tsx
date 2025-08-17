import { useQuery } from "@tanstack/react-query"
import { Center, Spinner } from "@chakra-ui/react"
import { useToken } from "hooks/useToken"
import { Account } from "@gw2api/types/data/account"
import { queryFunction } from "helpers/api"
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

  const { data: luck, isFetching: isLuckFetching } = useQuery<
    { id: string; value: number }[]
  >({
    queryKey: ["account/luck", token],
    queryFn: queryFunction as any,
    staleTime: Infinity,
    enabled: !!token,
  })

  if (!token) return <Center>No account selected</Center>

  if (isAccountFetching || isLuckFetching)
    return (
      <Center>
        <Spinner />
      </Center>
    )

  if (!account || !luck) return null

  return (
    <div>
      <p>{account.name}</p>
      <p>Created: {format(new Date(account.created), "MMMM d, yyyy 'at' h:mm a")}</p>
      <p>Access: {account.access.map((item) => item).join(", ")}</p>
      <p>Fractal Level: {account.fractal_level}</p>
      <p>WvW Rank: {account.wvw_rank}</p>
      <p>Luck: {luck[0].value.toLocaleString()}</p>
    </div>
  )
}

export default Overview
