import Overview from "pages/account/Overview"
import Achievements from "pages/account/Achievements"
import Masteries from "pages/account/Masteries"
import Home from "pages/account/Home"
import Recipes from "pages/account/Recipes"
import Legendaries from "pages/account/Legendaries"

export const MENU_ITEMS = [
  { to: "/account", text: "Overview", component: Overview },
  { to: "/account/home", text: "Home", component: Home },
  {
    to: "/account/achievements",
    text: "Achievements",
    component: Achievements,
  },
  { to: "/account/masteries", text: "Masteries", component: Masteries },
  { to: "/account/recipes", text: "Recipes", component: Recipes },
  { to: "/account/legendary", text: "Legendaries", component: Legendaries },
]
