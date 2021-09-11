import { QueryFunctionContext } from "react-query"

import { API_URL } from "config"

export const queryFunction = async (context: QueryFunctionContext) => {
  const { queryKey } = context
  const [endpoint, token = "", params = ""] = queryKey

  const searchParams = new URLSearchParams(params)
  searchParams.append("access_token", token)
  const queryString = searchParams.toString()

  const res = await fetch(`${API_URL}/${endpoint}?${queryString}`)
  if (res.ok) {
    const data = await res.json()
    return data
  }
}
