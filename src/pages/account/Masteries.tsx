import { useQuery } from "@tanstack/react-query"
import { queryFunction } from "helpers/api"

function Masteries(props: { token: string }) {
  const { token } = props

  const { data, isFetching } = useQuery({
    queryKey: ["account/masteries", token],
    queryFn: queryFunction,
  })

  console.log(data)

  return <div></div>
}

export default Masteries
