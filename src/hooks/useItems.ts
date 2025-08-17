import { useContext } from "react"
import ItemContext from "contexts/ItemContext"

export const useItems = () => {
  return useContext(ItemContext)
}