import { useQuery } from "@tanstack/react-query"

import { useToken } from "~/contexts/TokenContext"
import { queryFunction } from "~/helpers/api"

function Masteries() {
  const { currentAccount } = useToken()
  const token = currentAccount?.token

  const { data } = useQuery({
    queryKey: ["account/masteries", token],
    queryFn: queryFunction,
  })

  console.log(data)

  return <div></div>
}

export default Masteries
