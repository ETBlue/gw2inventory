import { useEffect, useContext, createContext } from "react"
import { useQuery } from "@tanstack/react-query"

import TokenContext from "contexts/TokenContext"
import ItemContext from "contexts/ItemContext"
import { queryFunction } from "helpers/api"

import type { SharedInventoryItemStack } from "@gw2api/types/data/account-inventory"
import type { ItemStack } from "@gw2api/types/data/item"
import type { MaterialStack } from "@gw2api/types/data/material"
import {
  InventoryItemInList,
  BankItemInList,
  MaterialItemInList,
  Values,
} from "./types/AccountContext"

const AccountContext = createContext<Values>({
  isFetching: false,
})

function AccountProvider(props: { children: React.ReactNode }) {
  const { currentAccount } = useContext(TokenContext)
  const { setInventoryItems, setBankItems, setMaterialItems } =
    useContext(ItemContext)

  const { data: inventory, isFetching: isInventoryFetching } = useQuery({
    queryKey: ["account/inventory", currentAccount?.token],
    queryFn: queryFunction,
    staleTime: Infinity,
    enabled: !!currentAccount?.token,
  })
  const { data: bank, isFetching: isBankFetching } = useQuery({
    queryKey: ["account/bank", currentAccount?.token],
    queryFn: queryFunction,
    staleTime: Infinity,
    enabled: !!currentAccount?.token,
  })
  const { data: materials, isFetching: isMaterialsFetching } = useQuery({
    queryKey: ["account/materials", currentAccount?.token],
    queryFn: queryFunction,
    staleTime: Infinity,
    enabled: !!currentAccount?.token,
  })

  useEffect(() => {
    if (!inventory) return
    const inventoryItems: InventoryItemInList[] = inventory.reduce(
      (prev: InventoryItemInList[], item: SharedInventoryItemStack | null) => {
        if (!item) return prev
        return [...prev, { ...item, location: "Shared inventory" }]
      },
      [],
    )
    setInventoryItems(inventoryItems)
  }, [inventory?.length])

  useEffect(() => {
    if (!bank) return
    const bankItems: BankItemInList[] = bank.reduce(
      (prev: BankItemInList[], item: ItemStack | null) => {
        if (!item) return prev
        return [...prev, { ...item, location: "Bank" }]
      },
      [],
    )
    setBankItems(bankItems)
  }, [bank?.length])

  useEffect(() => {
    if (!materials) return
    const materialItems: MaterialItemInList[] = materials.reduce(
      (prev: MaterialItemInList[], item: MaterialStack) => {
        if (!item) return prev
        return [...prev, { ...item, location: "Vault" }]
      },
      [],
    )
    setMaterialItems(materialItems)
  }, [materials?.length])

  return (
    <AccountContext.Provider
      value={{
        isFetching:
          isInventoryFetching || isBankFetching || isMaterialsFetching,
      }}
    >
      {props.children}
    </AccountContext.Provider>
  )
}

export default AccountContext
export { AccountProvider }
