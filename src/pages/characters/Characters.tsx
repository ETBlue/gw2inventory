import {
  Link,
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router"
import { MdSearch } from "react-icons/md"
import {
  Tabs,
  TabList,
  Tab,
  Center,
  Spinner,
  Tag,
  Spacer,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react"

import { getQueryString } from "helpers/url"
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
  const { hasToken, characters, isFetching } = useCharacters()
  const navigate = useNavigate()
  const { profession } = useParams<{ profession?: string }>()

  const [searchParams] = useSearchParams()
  const keyword = searchParams.get("keyword")
  const queryString = searchParams.toString()

  // Convert profession param to match the format used in filtering (capitalized)
  const activeProfession = profession
    ? profession.charAt(0).toUpperCase() + profession.slice(1)
    : undefined

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

  const getActiveTabIndex = (): number => {
    if (!activeProfession) return 0 // "All" tab
    const professionIndex = PROFESSIONS.findIndex((p) => p === activeProfession)
    return professionIndex >= 0 ? professionIndex + 1 : 0 // +1 because "All" is at index 0
  }

  return (
    <Tabs
      defaultIndex={getActiveTabIndex()}
      display="grid"
      gridTemplateRows="auto 1fr"
      height="100%"
    >
      <div>
        <TabList>
          <Tab as={Link} to={`/characters?${queryString}`}>
            All
            <Tag size="sm" margin="0 0 -0.1em 0.5em">
              {characters?.length || "0"}
            </Tag>
          </Tab>
          {PROFESSIONS.map((profession) => (
            <Tab
              key={profession}
              as={Link}
              to={`/characters/${profession.toLowerCase()}?${queryString}`}
            >
              {profession}
              <Tag size="sm" margin="0 0 -0.1em 0.5em">
                {characters?.filter(
                  (character: Character) => character.profession === profession,
                ).length || "0"}
              </Tag>
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
                const searchValue = e.currentTarget.value
                const basePath = profession
                  ? `/characters/${profession}`
                  : "/characters"
                const newQueryString = getQueryString(
                  "keyword",
                  searchValue,
                  queryString,
                )
                const to = newQueryString
                  ? `${basePath}?${newQueryString}`
                  : basePath
                navigate(to)
              }}
            />
          </InputGroup>
        </TabList>
        <Routes>
          <Route
            path="/"
            element={<Overview characters={visibleCharacters} />}
          />
        </Routes>
      </div>
      {isFetching ? (
        <Center>
          <Spinner />
        </Center>
      ) : !hasToken ? (
        <Center>No account selected</Center>
      ) : visibleCharacters.length === 0 ? (
        <Center>No character found</Center>
      ) : null}
    </Tabs>
  )
}

export default Characters
