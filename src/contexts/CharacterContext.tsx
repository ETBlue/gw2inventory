import { createContext } from "react"
import { useQuery } from "@tanstack/react-query"

import { useToken } from "hooks/useToken"
import { queryFunction } from "helpers/api"

import { Values } from "./types/CharacterContext"

const CharacterContext = createContext<Values>({
  hasToken: false,
  characters: [],
  isFetching: false,
})

function CharacterProvider(props: { children: React.ReactNode }) {
  const { currentAccount } = useToken()

  const { data: characters = [], isFetching } = useQuery({
    queryKey: ["characters", currentAccount?.token, "ids=all"],
    queryFn: queryFunction,
    staleTime: Infinity,
    enabled: !!currentAccount?.token,
  })

  return (
    <CharacterContext.Provider
      value={{
        characters: (characters as any) || [],
        isFetching,
        hasToken: !!currentAccount?.token,
      }}
    >
      {props.children}
    </CharacterContext.Provider>
  )
}

export default CharacterContext
export { CharacterProvider }
