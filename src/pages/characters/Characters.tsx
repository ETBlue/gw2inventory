import { Link, Route, Routes, useNavigate } from "react-router"
import { MdSearch } from "react-icons/md"
import {
  Tabs,
  Center,
  Spinner,
  Button,
  Tag,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react"

import { getQueryString } from "helpers/url"
import { useSearchParams } from "hooks/url"
import { useToken } from "hooks/useToken"
import { useCharacters } from "hooks/useCharacters"
import type { Character } from "@gw2api/types/data/character"

import Overview from "./Overview"

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

function Characters() {
  const { currentAccount } = useToken()
  const { characters, isFetching } = useCharacters()
  const navigate = useNavigate()

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
      keyword
        ? JSON.stringify(character).match(new RegExp(keyword, "i"))
        : true,
    )

  return (
    <Tabs display="grid" gridTemplateRows="auto 1fr" height="100%">
      {isFetching ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <div>
          <Flex justifyContent="center" margin="1rem auto">
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
            </Button>
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
                  navigate(to)
                }}
              />
            </InputGroup>
          </Flex>
          <Routes>
            {currentAccount && characters && (
              <Route
                path="/"
                element={<Overview characters={visibleCharacters} />}
              />
            )}
          </Routes>
        </div>
      )}
    </Tabs>
  )
}

export default Characters
