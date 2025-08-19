import { NavLink, Route, Routes } from "react-router"
import { Tabs, TabList, Tab } from "@chakra-ui/react"

import { MENU_ITEMS } from "./contants"

function Account() {
  return (
    <Tabs display="grid" gridTemplateRows="auto 1fr" height="100%">
      <TabList>
        {MENU_ITEMS.map((item) => (
          <Tab key={item.to} as={NavLink} to={`/account/${item.to}`}>
            {item.text}
          </Tab>
        ))}
      </TabList>
      <Routes>
        {MENU_ITEMS.map((item) => {
          const Component = item.component
          return <Route key={item.to} path={item.to} element={<Component />} />
        })}
      </Routes>
    </Tabs>
  )
}

export default Account
