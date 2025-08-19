import { useQuery } from "@tanstack/react-query"
import { queryFunction } from "helpers/api"
import { useToken } from "hooks/useToken"

function Home() {
  const { currentAccount } = useToken()
  const token = currentAccount?.token

  const { data: catsData, isFetching: catsFetching } = useQuery({
    queryKey: ["account/home/cats", token],
    queryFn: queryFunction,
  })

  console.log(catsData)

  const { data: nodesData, isFetching: nodesFetching } = useQuery({
    queryKey: ["account/home/nodes", token],
    queryFn: queryFunction,
  })

  return <div></div>
}

export default Home
