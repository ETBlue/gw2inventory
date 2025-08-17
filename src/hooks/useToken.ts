import { useContext } from "react"
import TokenContext from "contexts/TokenContext"

export const useToken = () => {
  return useContext(TokenContext)
}