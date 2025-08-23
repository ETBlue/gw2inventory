import { Tab, TabList, Tabs, Tag } from "@chakra-ui/react"

import { isNumber } from "lodash"
import { NavLink, Route, Routes, useLocation } from "react-router"

import { useOutfits } from "~/hooks/useOutfitsData"
import { useWallet } from "~/hooks/useWalletData"

import { MENU_ITEMS } from "./contants"

function Account() {
  const location = useLocation()
  const { walletData } = useWallet()
  const { outfits } = useOutfits()

  const getActiveTabIndex = (): number => {
    const currentPath = location.pathname
      .replace("/account/", "")
      .replace("/account", "")
    const activeIndex = MENU_ITEMS.findIndex((item) => item.to === currentPath)
    return activeIndex >= 0 ? activeIndex : 0
  }

  const getItemCount = (menuTo: string): number | undefined => {
    switch (menuTo) {
      case "":
        return undefined
      case "wallet":
        return walletData?.length ?? 0
      case "outfits":
        return outfits?.length ?? 0
      default:
        return undefined
    }
  }

  return (
    <Tabs
      defaultIndex={getActiveTabIndex()}
      display="grid"
      gridTemplateRows="auto 1fr"
      height="100%"
    >
      <TabList>
        {MENU_ITEMS.map((item) => {
          const count = getItemCount(item.to)
          return (
            <Tab key={item.to} as={NavLink} to={`/account/${item.to}`}>
              {item.text}
              {isNumber(count) && (
                <Tag size="sm" margin="0 0 -0.1em 0.5em">
                  {count || 0}
                </Tag>
              )}
            </Tab>
          )
        })}
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
