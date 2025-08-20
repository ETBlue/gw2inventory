import { Link, NavLink } from "react-router"
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  SimpleGrid,
  Flex,
  Image,
} from "@chakra-ui/react"
import { FaCog, FaUser } from "react-icons/fa"
import { MdExpandMore } from "react-icons/md"

import { APP_NAME, BASE_URL } from "config"
import { useToken } from "hooks/useToken"
import { COLORS, COMPONENT_THEME, LAYOUT } from "constants"
import { UsedAccount } from "contexts/types/TokenContext"

const MENU_ITEMS = [
  { to: "/account", text: "Account" },
  { to: "/characters", text: "Characters" },
  { to: "/items", text: "Items" },
  { to: "/skins", text: "Skins" },
  // { to: "/unlocks", text: "Unlocks" },
  // { to: "/trades", text: "Trades" },
  // { to: "/wallet", text: "Wallet" },
]

function Header() {
  const { usedAccounts, currentAccount, setCurrentAccount } = useToken()

  return (
    <SimpleGrid
      templateColumns="auto 1fr auto"
      gap="1rem"
      padding="0 1rem"
      alignContent="stretch"
      alignItems="stretch"
      borderBottom={COMPONENT_THEME.HEADER.BORDER_BOTTOM}
      fontFamily="Rosario"
    >
      <Flex
        as={Link}
        alignItems="center"
        borderBottom={COMPONENT_THEME.HEADER.BORDER_BOTTOM}
        to="/"
      >
        <Image
          marginRight="1rem"
          height="3.5rem"
          marginBottom="-2px"
          alt="logo"
          src={`${BASE_URL}/favicon.png`}
        />
        {APP_NAME}
      </Flex>
      <Flex as="nav" justifyContent="center">
        {MENU_ITEMS.map((item) => (
          <Button
            key={item.to}
            as={NavLink}
            to={item.to}
            variant="ghost"
            fontWeight="normal"
            borderRadius="0"
            height="3.5rem"
            borderBottom={COMPONENT_THEME.HEADER.BORDER_BOTTOM}
            _hover={{ background: COLORS.PRIMARY_HOVER }}
            sx={{
              "&[data-active]": {
                background: COLORS.PRIMARY,
                color: "#f9f9f9",
                cursor: "initial",
              },
            }}
          >
            {item.text}
          </Button>
        ))}
      </Flex>
      <Menu>
        <MenuButton
          as={Button}
          variant="ghost"
          fontWeight="normal"
          borderRadius="0"
          height={LAYOUT.HEADER_HEIGHT}
          padding="1rem"
          marginRight="-0.5rem"
          borderBottom={COMPONENT_THEME.HEADER.BORDER_BOTTOM}
          rightIcon={<MdExpandMore />}
        >
          {currentAccount?.name || "Select a token"}
        </MenuButton>
        <MenuList borderRadius="0" position="relative" top="-0.75rem">
          {usedAccounts.map((item: UsedAccount) => (
            <MenuItem
              key={item.token}
              icon={<FaUser />}
              onClick={() => {
                setCurrentAccount(item)
              }}
            >
              {item.name}
            </MenuItem>
          ))}
          <MenuItem as={Link} to="/settings" icon={<FaCog />}>
            Manage tokens...
          </MenuItem>
        </MenuList>
      </Menu>
    </SimpleGrid>
  )
}

export default Header
