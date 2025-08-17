import { useContext } from "react"
import TokenContext from "contexts/TokenContext"
import { Values } from "contexts/types/TokenContext"

export const useToken = (): Values => {
  return useContext(TokenContext)
}
