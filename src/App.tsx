import React from "react"
import { HashRouter as Router, Navigate, Route, Routes } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ChakraProvider } from "@chakra-ui/react"

import { TokenProvider } from "contexts/TokenContext"
import { ItemProvider } from "contexts/ItemContext"
import { AccountProvider } from "contexts/AccountContext"
import { CharacterProvider } from "contexts/CharacterContext"
import BaseFrame from "layouts/BaseFrame"
import Characters from "pages/characters"
import Items from "pages/items"
import Settings from "pages/settings"

import "./App.css"

const queryClient = new QueryClient()

const Content = () => {
  return (
    <BaseFrame>
      <Routes>
        <Route path="/characters" element={<Characters />} />
        <Route path="/items/:category?" element={<Items />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/" element={<Navigate to="/characters" replace />} />
      </Routes>
    </BaseFrame>
  )
}

export const App = () => {
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <TokenProvider>
          <ItemProvider>
            <AccountProvider>
              <CharacterProvider>
                <Router>
                  <Content />
                </Router>
              </CharacterProvider>
            </AccountProvider>
          </ItemProvider>
        </TokenProvider>
      </QueryClientProvider>
    </ChakraProvider>
  )
}
