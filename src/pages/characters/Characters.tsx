import React, { useEffect, useContext } from "react"
import { Link, NavLink, Route, Switch, useHistory } from "react-router-dom"
import { MdSearch } from "react-icons/md"
import { useQuery } from "react-query"
import {
  Tabs,
  TabList,
  Tab,
  Center,
  Spinner,
  Button,
  Tag,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
} from "@chakra-ui/react"

import { queryFunction } from "helpers/api"
import { getQueryString } from "helpers/url"
import { useSearchParams } from "hooks/url"
import TokenContext from "contexts/TokenContext"
import ItemContext from "contexts/ItemContext"

import Overview from "./Overview"
import { CharacterBag, CharacterBagItemInList } from "./types"

const MENU_ITEMS = [
  { to: "/characters", text: "Overview", component: Overview },
]

function Characters() {
  const { currentToken } = useContext(TokenContext)
  const { addCharacterItems } = useContext(ItemContext)
  const history = useHistory()

  const { data: allCharacters, isFetching } = useQuery(
    ["characters", currentToken?.token, "ids=all"],
    queryFunction,
    { cacheTime: Infinity, enabled: !!currentToken?.token },
  )
  //const isFetching = false
  //const data = sample

  useEffect(() => {
    let characterItems: CharacterBagItemInList[] = []

    for (const character of allCharacters) {
      const bagItems = character.bags.reduce(
        (prev: CharacterBagItemInList[], currentBag: CharacterBag) => {
          const currentBagItems = currentBag.inventory.map((item) => {
            if (item) {
              return { ...item, location: character.name }
            }
          })
          return [...prev, ...currentBagItems.filter((item) => !!item)]
        },
        [],
      )
      characterItems = [...characterItems, ...bagItems]
    }
    addCharacterItems(characterItems)
  }, [allCharacters.length])

  const {
    queryString,
    profession: activeProfession,
    keyword,
    sort,
    order,
  } = useSearchParams()
  const activeSort = sort || "name"
  const activeOrder = order || "asc"

  const characters = allCharacters
    ?.filter(
      (character) =>
        character.profession === activeProfession || !activeProfession,
    )
    .filter((character) =>
      !!keyword
        ? JSON.stringify(character).match(new RegExp(keyword, "i"))
        : true,
    )
    .sort((a, b) => {
      if (a[activeSort] > b[activeSort] && activeOrder === "asc") return 1
      if (a[activeSort] < b[activeSort] && activeOrder === "dsc") return 1
      if (a[activeSort] > b[activeSort] && activeOrder === "dsc") return -1
      if (a[activeSort] < b[activeSort] && activeOrder === "asc") return -1
      return 0
    })

  return (
    <Tabs display="grid" gridTemplateRows="auto 1fr" height="100%">
      <TabList>
        {MENU_ITEMS.map((item) => (
          <Tab key={item.to} as={NavLink} to={item.to}>
            {item.text}
          </Tab>
        ))}
        <Spacer />
        <InputGroup width="20ch">
          <InputLeftElement>
            <MdSearch opacity="0.5" />
          </InputLeftElement>
          <Input
            variant="unstyled"
            value={keyword || ""}
            onChange={(e) => {
              const to = `/characters?${getQueryString(
                "keyword",
                e.currentTarget.value,
                queryString,
              )}`
              history.push(to)
            }}
          />
        </InputGroup>
      </TabList>
      {isFetching ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <div>
          <Flex
            justifyContent="center"
            margin="1rem auto"
            columns={PROFESSIONS.length}
          >
            <Button
              as={Link}
              variant="ghost"
              fontWeight="normal"
              isActive={!activeProfession}
              to={`/characters?${getQueryString(
                "profession",
                "",
                queryString,
              )}`}
            >
              All
              <Tag size="sm" margin="0 0 -0.1em 0.5em">
                {allCharacters?.length}
              </Tag>
            </Button>{" "}
            {PROFESSIONS.map((profession) => (
              <Button
                key={profession}
                as={Link}
                variant="ghost"
                fontWeight="normal"
                isActive={activeProfession === profession}
                to={`/characters?${getQueryString(
                  "profession",
                  profession,
                  queryString,
                )}`}
              >
                {profession}{" "}
                <Tag size="sm" margin="0 0 -0.1em 0.5em">
                  {
                    allCharacters?.filter(
                      (character) =>
                        character.profession === profession ||
                        profession === "All",
                    ).length
                  }
                </Tag>
              </Button>
            ))}
          </Flex>
          <Switch>
            {currentToken &&
              allCharacters &&
              MENU_ITEMS.map((item) => {
                const Component = item.component
                return (
                  <Route key={item.to} path={item.to}>
                    <Component
                      characters={characters}
                      token={currentToken.token}
                      activeSort={activeSort}
                      activeOrder={activeOrder}
                      queryString={queryString}
                    />
                  </Route>
                )
              })}
          </Switch>
        </div>
      )}
    </Tabs>
  )
}

export default Characters

const PROFESSIONS = [
  "Elementalist",
  "Necromancer",
  "Mesmer",
  "Ranger",
  "Thief",
  "Engineer",
  "Warrior",
  "Guardian",
  "Revenant",
]
