import { useLocation } from "react-router-dom"

export const useSearchParams = () => {
  const { search: queryString } = useLocation()
  const searchParams = new URLSearchParams(queryString)
  const sort = searchParams.get("sort")
  const order = searchParams.get("order")
  const profession = searchParams.get("profession")
  const keyword = searchParams.get("keyword")
  const type = searchParams.get("type")

  return { queryString, sort, order, profession, keyword, type }
}
