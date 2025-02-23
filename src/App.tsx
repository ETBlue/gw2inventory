import React from "react"
import { HashRouter as Router, Redirect, Route, Switch } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "react-query"
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
import { SkillProvider } from "contexts/SkillContext"

const queryClient = new QueryClient()

const Content = () => {
  return (
    <BaseFrame>
      <Switch>
        <Route path="/characters">
          <Characters />
        </Route>
        <Route path="/items/:category?">
          <Items />
        </Route>
        <Route path="/settings">
          <Settings />
        </Route>
        <Route path="/">
          <Redirect to="/characters" />
        </Route>
      </Switch>
    </BaseFrame>
  )
}

export const App = () => {
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <TokenProvider>
          <ItemProvider>
            <SkillProvider>
              <AccountProvider>
                <CharacterProvider>
                  <Router>
                    <Content />
                  </Router>
                </CharacterProvider>
              </AccountProvider>
            </SkillProvider>
          </ItemProvider>
        </TokenProvider>
      </QueryClientProvider>
    </ChakraProvider>
  )
}
