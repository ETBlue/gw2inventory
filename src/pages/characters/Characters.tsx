import React, { useContext } from "react"
import { Link, NavLink, Route, Switch, useHistory } from "react-router-dom"
import { MdSearch } from "react-icons/md"
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

import { getQueryString } from "helpers/url"
import { useSearchParams } from "hooks/url"
import TokenContext from "contexts/TokenContext"
import CharacterContext from "contexts/CharacterContext"
import { Character } from "contexts/types/Character"

import { PROFESSIONS } from "./consts/Characters"
import Overview from "./Overview"

function Characters() {
  const { currentAccount } = useContext(TokenContext)
  const { characters, isFetching } = useContext(CharacterContext)
  const history = useHistory()

  const {
    queryString,
    profession: activeProfession,
    keyword,
  } = useSearchParams()

  const visibleCharacters = characters
    ?.filter(
      (character: Character) =>
        character.profession === activeProfession || !activeProfession,
    )
    .filter((character: Character) =>
      !!keyword
        ? JSON.stringify(character).match(new RegExp(keyword, "i"))
        : true,
    )

  return (
    <Tabs display="grid" gridTemplateRows="auto 1fr" height="100%">
      <TabList>
        <Tab as={NavLink} to="/characters" exact>
          Overview
        </Tab>
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
                {characters?.length || "0"}
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
                  {characters?.filter(
                    (character: Character) =>
                      character.profession === profession ||
                      profession === "All",
                  ).length || "0"}
                </Tag>
              </Button>
            ))}
          </Flex>
          <Switch>
            {currentAccount && characters && (
              <>
                <Route exact path="/characters">
                  <Overview characters={visibleCharacters} />
                </Route>
              </>
            )}
          </Switch>
        </div>
      )}
    </Tabs>
  )
}

export default Characters
