import { useQuery } from "@tanstack/react-query"
import { queryFunction } from "helpers/api"

function Legendaries(props: { token: string }) {
  const { token } = props

  const { data, isFetching } = useQuery({
    queryKey: ["account/legendaryarmory", token],
    queryFn: queryFunction,
  })

  console.log(data)

  return <div></div>
}

export default Legendaries
