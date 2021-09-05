import { QueryFunctionContext } from "react-query"

import { API_URL } from "config"

export const queryFunction = async (context: QueryFunctionContext) => {
  const { queryKey } = context
  const [endpoint, token] = queryKey
  const res = await fetch(`${API_URL}/${endpoint}?access_token=${token}`)
  if (res.ok) {
    const data = await res.json()
    return data
  }
}
