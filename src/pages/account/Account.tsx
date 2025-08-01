import React, { useContext } from "react"
import { NavLink, Route, Switch } from "react-router-dom"
import { Tabs, TabList, Tab } from "@chakra-ui/react"

import TokenContext from "contexts/TokenContext"
import { MENU_ITEMS } from "./consts/Account"

function Account() {
  const { currentAccount } = useContext(TokenContext)

  return (
    <Tabs display="grid" gridTemplateRows="auto 1fr" height="100%">
      <TabList>
        {MENU_ITEMS.map((item) => (
          <Tab key={item.to} as={NavLink} to={item.to}>
            {item.text}
          </Tab>
        ))}
      </TabList>
      <Switch>
        {currentAccount &&
          MENU_ITEMS.map((item) => {
            const Component = item.component
            return (
              <Route key={item.to} path={item.to}>
                <Component token={currentAccount.token} />
              </Route>
            )
          })}
      </Switch>
    </Tabs>
  )
}

export default Account
