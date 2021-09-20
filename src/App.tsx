import React from "react"
import { HashRouter as Router, Route, Switch } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "react-query"
import { ChakraProvider } from "@chakra-ui/react"

import BaseFrame from "layouts/BaseFrame"
import { TokenProvider } from "contexts/TokenContext"
import { ItemProvider } from "contexts/ItemContext"

import Account from "pages/account"
import Characters from "pages/characters"

import "./App.css"
import Items from "pages/items"

const queryClient = new QueryClient()

const Content = () => {
  return (
    <BaseFrame>
      <Switch>
        <Route path="/account">
          <Account />
        </Route>
        <Route path="/characters">
          <Characters />
        </Route>
        <Route path="/items">
          <Items />
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
            <Router>
              <Content />
            </Router>
          </ItemProvider>
        </TokenProvider>
      </QueryClientProvider>
    </ChakraProvider>
  )
}
