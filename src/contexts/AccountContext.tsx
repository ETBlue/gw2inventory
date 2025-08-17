import { createContext } from "react"

import { Values } from "./types/AccountContext"

const AccountContext = createContext<Values>({
  isFetching: false,
})

function AccountProvider(props: { children: React.ReactNode }) {
  return (
    <AccountContext.Provider
      value={{
        isFetching: false,
      }}
    >
      {props.children}
    </AccountContext.Provider>
  )
}

export default AccountContext
export { AccountProvider }
