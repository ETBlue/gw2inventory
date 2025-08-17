import { QueryFunctionContext } from "@tanstack/react-query"

import { API_URL, API_LANG } from "config"

type TQueryKey = readonly [
  endpoint: string,
  token?: string,
  paramsString?: string,
]

export const queryFunction = async (
  context: QueryFunctionContext<TQueryKey>,
) => {
  const { queryKey } = context
  const [endpoint, token = "", paramsString = ""] = queryKey
  if (!endpoint) return

  const searchParams = new URLSearchParams(paramsString)
  searchParams.append("access_token", token)
  const queryString = searchParams.toString()

  const data = await fetchGW2(endpoint, queryString)
  return data
}

export const fetchGW2 = async (endpoint: string, queryString?: string) => {
  const res = await fetch(`${API_URL}/${endpoint}?${queryString}`, {
    headers: {
      "Accept-Language": API_LANG,
    },
  })
  if (res.ok) {
    const data = await res.json()
    return data
  }
}
