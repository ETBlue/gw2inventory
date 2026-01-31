import Overview from "~/pages/account/Overview"
import Wallet from "~/pages/account/Wallet"

import Home from "./Home"
import Masteries from "./Masteries"
import Outfits from "./Outfits"

/*
import Achievements from "~/pages/account/Achievements"
import Recipes from "~/pages/account/Recipes"
import Legendaries from "~/pages/account/Legendaries"
*/

export const MENU_ITEMS = [
  { to: "", text: "Overview", component: Overview },
  { to: "wallet", text: "Wallet", component: Wallet },
  { to: "outfits", text: "Outfits", component: Outfits },
  { to: "home", text: "Home", component: Home },
  { to: "masteries/*", text: "Masteries", component: Masteries },
  /*
  {
    to: "achievements",
    text: "Achievements",
    component: Achievements,
  },
  { to: "recipes", text: "Recipes", component: Recipes },
  { to: "legendary", text: "Legendaries", component: Legendaries },
   */
]
