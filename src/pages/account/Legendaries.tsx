import { useQuery } from "@tanstack/react-query"

import { useToken } from "~/contexts/TokenContext"
import { queryFunction } from "~/helpers/api"

function Legendaries() {
  const { currentAccount } = useToken()
  const token = currentAccount?.token

  const { data } = useQuery({
    queryKey: ["account/legendaryarmory", token],
    queryFn: queryFunction,
  })

  console.log(data)

  return <div>placeholder</div>
}

export default Legendaries
