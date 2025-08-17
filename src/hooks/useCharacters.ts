import { useContext } from "react"
import CharacterContext from "contexts/CharacterContext"

export const useCharacters = () => {
  return useContext(CharacterContext)
}