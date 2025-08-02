import { useLocation } from "react-router"

export const useSearchParams = () => {
  const { search: queryString } = useLocation()
  const searchParams = new URLSearchParams(queryString)
  const sortBy: string | null = searchParams.get("sortBy")
  const order: "asc" | "dsc" | string | null = searchParams.get("order")
  const profession: string | null = searchParams.get("profession")
  const keyword: string | null = searchParams.get("keyword")
  const type: string | null = searchParams.get("type")

  return { queryString, sortBy, order, profession, keyword, type }
}
