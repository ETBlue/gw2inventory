import { Tab, TabList, Tabs, Tag } from "@chakra-ui/react"

import { NavLink, Route, Routes, useLocation } from "react-router"

import useMasteriesData from "~/hooks/useMasteriesData"
import { useOutfits } from "~/hooks/useOutfitsData"
import { useWallet } from "~/hooks/useWalletData"

import { MENU_ITEMS } from "./contants"

function Account() {
  const location = useLocation()
  const { walletData } = useWallet()
  const { outfits } = useOutfits()
  const { masteriesByRegion } = useMasteriesData()

  const getActiveTabIndex = (): number => {
    const currentPath = location.pathname
      .replace("/account/", "")
      .replace("/account", "")
    const activeIndex = MENU_ITEMS.findIndex((item) => {
      const base = item.to.replace("/*", "")
      return base === currentPath || currentPath.startsWith(base + "/")
    })
    return activeIndex >= 0 ? activeIndex : 0
  }

  const getTabTag = (menuTo: string): string | undefined => {
    switch (menuTo) {
      case "wallet":
        return `${walletData?.length ?? 0}`
      case "outfits":
        return `${outfits?.length ?? 0}`
      case "masteries/*": {
        const unlocked = masteriesByRegion.reduce(
          (sum, g) => sum + g.unlockedLevels,
          0,
        )
        const total = masteriesByRegion.reduce(
          (sum, g) => sum + g.totalLevels,
          0,
        )
        return `${unlocked} / ${total}`
      }
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
          const tag = getTabTag(item.to)
          return (
            <Tab
              key={item.to}
              as={NavLink}
              to={`/account/${item.to.replace("/*", "")}`}
            >
              {item.text}
              {tag !== undefined && (
                <Tag size="sm" margin="0 0 -0.1em 0.5em">
                  {tag}
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
