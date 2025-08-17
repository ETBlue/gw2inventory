import { useContext } from "react"
import CharacterContext from "contexts/CharacterContext"
import { Values } from "contexts/types/CharacterContext"

export const useCharacters = (): Values => {
  return useContext(CharacterContext)
}
