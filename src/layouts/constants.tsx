import Account from "~/pages/account"
import Characters from "~/pages/characters"
import Dyes from "~/pages/dyes"
import Items from "~/pages/items"
import Skins from "~/pages/skins"

export const LEVEL_ONE_MENU_ITEMS = [
  { to: "/account", text: "Account", path: "/account/*", element: <Account /> },
  {
    to: "/characters",
    text: "Characters",
    path: "/characters/:profession?",
    element: <Characters />,
  },
  {
    to: "/items",
    text: "Items",
    path: "/items/:category?",
    element: <Items />,
  },
  {
    to: "/skins",
    text: "Skins",
    path: "/skins/:skinType?",
    element: <Skins />,
  },
  { to: "/dyes", text: "Dyes", path: "/dyes/:hue?", element: <Dyes /> },
]
