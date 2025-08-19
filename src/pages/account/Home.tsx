import { useQuery } from "@tanstack/react-query"
import { queryFunction } from "helpers/api"
import { useToken } from "hooks/useToken"

function Home() {
  const { currentAccount } = useToken()
  const token = currentAccount?.token

  const { data: catsData } = useQuery({
    queryKey: ["account/home/cats", token],
    queryFn: queryFunction,
  })

  console.log(catsData)

  const { data: _nodesData } = useQuery({
    queryKey: ["account/home/nodes", token],
    queryFn: queryFunction,
  })

  return <div></div>
}

export default Home
