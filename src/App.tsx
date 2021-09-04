import React from "react"
import { HashRouter as Router, Route, Switch } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "react-query"
import { ChakraProvider } from "@chakra-ui/react"

import BaseFrame from "layouts/BaseFrame"
import { TokenProvider } from "contexts/TokenContext"

import "./App.css"

const queryClient = new QueryClient()

const Content = () => {
  return (
    <Switch>
      <Route path="*">
        <BaseFrame>test</BaseFrame>
      </Route>
    </Switch>
  )
}

export const App = () => {
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <TokenProvider>
          <Router>
            <Content />
          </Router>
        </TokenProvider>
      </QueryClientProvider>
    </ChakraProvider>
  )
}
