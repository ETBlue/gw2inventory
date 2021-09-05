export const APP_NAME = "Guild Wars 2 Inventory"

export const API_URL = "https://api.guildwars2.com/v2"

export const BASE_URL = "/gw2inventory"

const LOCAL_STORAGE_KEY_PREFIX = "gw2i"

export const LOCAL_STORAGE_KEYS = {
  legacy: LOCAL_STORAGE_KEY_PREFIX,
  tokens: `${LOCAL_STORAGE_KEY_PREFIX}Tokens`,
  account: `${LOCAL_STORAGE_KEY_PREFIX}Account`,
  characters: `${LOCAL_STORAGE_KEY_PREFIX}Characters`,
  items: `${LOCAL_STORAGE_KEY_PREFIX}Items`,
}

