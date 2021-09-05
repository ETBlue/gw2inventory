import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "react-query"
import { Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react"
import { FaCog, FaPlus, FaUser } from "react-icons/fa"
import { MdExpandMore } from "react-icons/md"

import { APP_NAME, BASE_URL } from "config"
import { queryFunction } from "helpers/api"
import TokenContext, { UsedToken } from "contexts/TokenContext"

import css from "./styles/Header.module.css"

interface Props {
  children?: React.ReactNode
}

const Header = (props: Props) => {
  const { children } = props
  const { usedTokens, currentToken, setCurrentToken } = useContext(TokenContext)
  const { data, isFetching } = useQuery(
    ["account", currentToken?.token || ""],
    queryFunction,
    { enabled: !!currentToken?.token },
  )
  console.log(data)

  return (
    <div className={css.header}>
      <Link className={css.home} to="/">
        <img className={css.logo} alt="logo" src={`${BASE_URL}/favicon.png`} />
        {APP_NAME}
      </Link>
      <div>{children}</div>
      <div className={css.action}>
        <Menu>
          <MenuButton
            as={Button}
            variant="ghost"
            borderRadius="0"
            loadingText="Loading..."
            isLoading={isFetching}
            className={css.trigger}
            rightIcon={<MdExpandMore />}
          >
            {currentToken?.name || "Select a token"}
          </MenuButton>
          <MenuList borderRadius="0" className={css.list}>
            <MenuItem icon={<FaPlus />}>Add token...</MenuItem>
            {usedTokens.map((item: UsedToken) => (
              <MenuItem
                key={item.token}
                icon={<FaUser />}
                onClick={() => {
                  setCurrentToken(item)
                }}
              >
                {item.name}
              </MenuItem>
            ))}
            <MenuItem icon={<FaCog />}>Manage tokens...</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </div>
  )
}

export default Header
