import React, { useContext } from "react"
import { NavLink, Route, Switch } from "react-router-dom"
import { Tabs, TabList, Tab } from "@chakra-ui/react"

import TokenContext from "contexts/TokenContext"
import Overview from "./Overview"
import Achievements from "./Achievements"
import Masteries from "./Masteries"
import Home from "./Home"
import Recipes from "./Recipes"
import Legendaries from "./Legendaries"

const MENU_ITEMS = [
  { to: "/account", text: "Overview", component: Overview },
  { to: "/account/home", text: "Home", component: Home },
  {
    to: "/account/achievements",
    text: "Achievements",
    component: Achievements,
  },
  { to: "/account/masteries", text: "Masteries", component: Masteries },
  { to: "/account/recipes", text: "Recipes", component: Recipes },
  { to: "/account/legendary", text: "Legendaries", component: Legendaries },
]

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
