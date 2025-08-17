import { useContext, createContext } from "react"
import { useQuery } from "@tanstack/react-query"

import { useToken } from "contexts/TokenContext"
import { queryFunction } from "helpers/api"

import { Values } from "./types/CharacterContext"

const CharacterContext = createContext<Values>({
  characters: [],
  isFetching: false,
})

function CharacterProvider(props: { children: React.ReactNode }) {
  const { currentAccount } = useToken()

  const { data: characters, isFetching } = useQuery({
    queryKey: ["characters", currentAccount?.token, "ids=all"],
    queryFn: queryFunction,
    staleTime: Infinity,
    enabled: !!currentAccount?.token,
  })

  return (
    <CharacterContext.Provider value={{ characters, isFetching }}>
      {props.children}
    </CharacterContext.Provider>
  )
}

export const useCharacters = () => {
  return useContext(CharacterContext)
}

export default CharacterContext
export { CharacterProvider }
