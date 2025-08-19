import { useQuery } from "@tanstack/react-query"
import { queryFunction } from "helpers/api"
import { useToken } from "hooks/useToken"

function Masteries() {
  const { currentAccount } = useToken()
  const token = currentAccount?.token

  const { data, isFetching } = useQuery({
    queryKey: ["account/masteries", token],
    queryFn: queryFunction,
  })

  console.log(data)

  return <div></div>
}

export default Masteries
