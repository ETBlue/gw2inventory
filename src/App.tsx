import { ChakraProvider } from "@chakra-ui/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { Navigate, Route, HashRouter as Router, Routes } from "react-router"

import { CharacterProvider } from "~/contexts/CharacterContext"
import { TokenProvider } from "~/contexts/TokenContext"
import { setupPersistence } from "~/hooks/useStaticData/persistence"
import BaseFrame from "~/layouts/BaseFrame"
import Settings from "~/pages/settings"

import "./App.css"
import { LEVEL_ONE_MENU_ITEMS } from "./layouts/constants"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
})

setupPersistence(queryClient)

const Content = () => {
  return (
    <BaseFrame>
      <Routes>
        {LEVEL_ONE_MENU_ITEMS.map((item) => (
          <Route key={item.to} path={item.path} element={item.element} />
        ))}
        <Route path="/settings" element={<Settings />} />
        <Route path="/" element={<Navigate to="/characters" replace />} />
      </Routes>
    </BaseFrame>
  )
}

export const App = () => {
  return (
    <ChakraProvider>
      <TokenProvider>
        <QueryClientProvider client={queryClient}>
          <CharacterProvider>
            <Router>
              <Content />
            </Router>
          </CharacterProvider>
        </QueryClientProvider>
      </TokenProvider>
    </ChakraProvider>
  )
}
