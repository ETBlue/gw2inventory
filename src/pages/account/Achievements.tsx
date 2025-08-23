import { useQuery } from "@tanstack/react-query"

import { queryFunction } from "~/helpers/api"
import { useToken } from "~/hooks/useToken"

function Achievements() {
  const { currentAccount } = useToken()
  const token = currentAccount?.token

  const { data } = useQuery({
    queryKey: ["account/achievements", token],
    queryFn: queryFunction,
  })

  console.log(data)

  return <div></div>
}

export default Achievements
