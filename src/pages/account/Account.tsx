import { NavLink, Route, Routes } from "react-router"
import { Tabs, TabList, Tab, Tag } from "@chakra-ui/react"

import { MENU_ITEMS } from "./contants"
import { useWallet } from "~/hooks/useWallet"
import { useSkins } from "~/hooks/useSkins"
import { useOutfits } from "~/hooks/useOutfits"
import { useDyes } from "~/hooks/useDyes"
import { isNumber } from "lodash"

function Account() {
  const { walletData } = useWallet()
  const { skins } = useSkins()
  const { outfits } = useOutfits()
  const { dyesData } = useDyes()

  const getItemCount = (menuTo: string): number | undefined => {
    switch (menuTo) {
      case "":
        return undefined
      case "wallet":
        return walletData?.length ?? 0
      case "skins":
        return skins?.length ?? 0
      case "outfits":
        return outfits?.length ?? 0
      case "dyes":
        return dyesData?.length ?? 0
      default:
        return undefined
    }
  }

  return (
    <Tabs display="grid" gridTemplateRows="auto 1fr" height="100%">
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
