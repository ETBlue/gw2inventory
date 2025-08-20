import { HashRouter as Router, Navigate, Route, Routes } from "react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ChakraProvider } from "@chakra-ui/react"

import { TokenProvider } from "contexts/TokenContext"
import { CharacterProvider } from "contexts/CharacterContext"
import { StaticDataProvider } from "contexts/StaticDataContext"
import BaseFrame from "layouts/BaseFrame"
import Settings from "pages/settings"

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
          <StaticDataProvider>
            <CharacterProvider>
              <Router>
                <Content />
              </Router>
            </CharacterProvider>
          </StaticDataProvider>
        </QueryClientProvider>
      </TokenProvider>
    </ChakraProvider>
  )
}
