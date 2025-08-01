import React, { useEffect, useContext, createContext } from "react"
import { useQuery } from "react-query"

import TokenContext from "contexts/TokenContext"
import ItemContext from "contexts/ItemContext"
import { queryFunction } from "helpers/api"

import { InventoryItem, BankItem, MaterialItem } from "./types/Account"
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

  const { data: inventory, isFetching: isInventoryFetching } = useQuery(
    ["account/inventory", currentAccount?.token],
    queryFunction,
    {
      staleTime: Infinity,
      enabled: !!currentAccount?.token,
    },
  )
  const { data: bank, isFetching: isBankFetching } = useQuery(
    ["account/bank", currentAccount?.token],
    queryFunction,
    {
      staleTime: Infinity,
      enabled: !!currentAccount?.token,
    },
  )
  const { data: materials, isFetching: isMaterialsFetching } = useQuery(
    ["account/materials", currentAccount?.token],
    queryFunction,
    {
      staleTime: Infinity,
      enabled: !!currentAccount?.token,
    },
  )

  useEffect(() => {
    if (!inventory) return
    const inventoryItems: InventoryItemInList[] = inventory.reduce(
      (prev: InventoryItemInList[], item: InventoryItem) => {
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
      (prev: BankItemInList[], item: BankItem) => {
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
      (prev: MaterialItemInList[], item: MaterialItem) => {
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
