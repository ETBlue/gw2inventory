import Overview from "~/pages/account/Overview"
import Wallet from "~/pages/account/Wallet"
import Skins from "~/pages/account/Skins"
import Outfits from "./Outfits"
import Dyes from "./Dyes"
/* 
import Achievements from "pages/account/Achievements"
import Masteries from "pages/account/Masteries"
import Home from "pages/account/Home"
import Recipes from "pages/account/Recipes"
import Legendaries from "pages/account/Legendaries"
*/

export const MENU_ITEMS = [
  { to: "", text: "Overview", component: Overview },
  { to: "wallet", text: "Wallet", component: Wallet },
  { to: "skins", text: "Skins", component: Skins },
  { to: "outfits", text: "Outfits", component: Outfits },
  { to: "dyes", text: "Dyes", component: Dyes },
  /*
  { to: "home", text: "Home", component: Home },
  {
    to: "achievements",
    text: "Achievements",
    component: Achievements,
  },
  { to: "masteries", text: "Masteries", component: Masteries },
  { to: "recipes", text: "Recipes", component: Recipes },
  { to: "legendary", text: "Legendaries", component: Legendaries },
   */
]
