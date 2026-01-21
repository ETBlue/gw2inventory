import { useState } from "react"

import {
  Box,
  Center,
  Collapse,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListIcon,
  ListItem,
  Spacer,
  Spinner,
  Tab,
  TabList,
  Table,
  Tabs,
  Tag,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react"
import type { Character } from "@gw2api/types/data/character"

import { format, formatDistance } from "date-fns"
import { CgArrowDown, CgArrowUp } from "react-icons/cg"
import { FaCheck, FaChevronDown, FaChevronRight, FaMinus } from "react-icons/fa"
import { GiFemale, GiMale } from "react-icons/gi"
import { MdSearch } from "react-icons/md"
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router"

import { useCharacters } from "~/contexts/CharacterContext"
import { compare } from "~/helpers/compare"
import { getQueryString } from "~/helpers/url"
import { CharacterSpecializations } from "~/pages/characters/CharacterSpecializations"
import css from "~/styles/shared-table.module.css"
import { PatchedItem } from "~/types/items"

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

interface Column {
  key: string
  title: string
  render:
    | ((data: Character) => React.JSX.Element | string)
    | ((data: PatchedItem) => React.JSX.Element | string)
}

const COLUMNS: Column[] = [
  {
    key: "name",
    title: "name",
    render(row: Character) {
      return row.name
    },
  },
  {
    key: "gender",
    title: "gender",
    render(row: Character) {
      return row.gender === "Female" ? <GiFemale /> : <GiMale />
    },
  },
  {
    key: "race",
    title: "race",
    render(row: Character) {
      return row.race
    },
  },
  {
    key: "profession",
    title: "profession",
    render(row: Character) {
      return row.profession
    },
  },
  {
    key: "level",
    title: "level",
    render(row: Character) {
      return `${row.level}`
    },
  },
  {
    key: "crafting",
    title: "crafting",
    render(row: Character) {
      return (
        <List>
          {row.crafting.map((crafting) => (
            <ListItem key={crafting.discipline}>
              <ListIcon as={crafting.active ? FaCheck : FaMinus} />
              {crafting.discipline} {crafting.rating}
            </ListItem>
          ))}
        </List>
      )
    },
  },
  {
    key: "created",
    title: "created",
    render(row: Character) {
      return format(new Date(row.created), "yyyy-MM-dd")
    },
  },
  {
    key: "age",
    title: "age",
    render(row: Character) {
      return formatDistance(0, row.age * 1000)
    },
  },
  {
    key: "deaths",
    title: "deaths",
    render(row: Character) {
      return `${row.deaths}`
    },
  },
]

function Characters() {
  const { hasToken, characters, isFetching } = useCharacters()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { profession } = useParams<{ profession?: string }>()

  const [searchParams] = useSearchParams()
  const keyword = searchParams.get("keyword")
  const sortBy = searchParams.get("sortBy")
  const order = searchParams.get("order")
  const queryString = searchParams.toString()

  // Expanded character state - tracks which character's specializations are visible
  // Note: Character specs prefetching is handled automatically by CharacterContext
  const [expandedCharacter, setExpandedCharacter] = useState<string | null>(
    null,
  )

  // Toggle expand/collapse for a character
  const handleToggleExpand = (characterName: string) => {
    setExpandedCharacter((prev) =>
      prev === characterName ? null : characterName,
    )
  }

  // Sorting state
  const defaultSortBy = "name"
  const defaultOrder = "asc"
  const activeSort = sortBy || defaultSortBy
  const activeOrder = order || defaultOrder

  // Convert profession param to match the format used in filtering (capitalized)
  const activeProfession = profession
    ? profession.charAt(0).toUpperCase() + profession.slice(1)
    : undefined

  // Handle sorting
  const handleSort = (column: string) => {
    const newUrl = `${pathname}?${
      activeSort === column
        ? getQueryString(
            "order",
            activeOrder === "asc" ? "dsc" : "",
            queryString,
          )
        : getQueryString("sortBy", column, queryString)
    }`
    navigate(newUrl)
  }

  // Filter and sort characters
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
    .sort((a, b) => {
      // Type-safe property access using keyof operator
      const aValue = activeSort in a ? (a as any)[activeSort] : ""
      const bValue = activeSort in b ? (b as any)[activeSort] : ""
      const number = compare(aValue, bValue)
      return activeOrder === "asc" ? number : number * -1
    })

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
        <Table className={css.table}>
          <Thead>
            <Tr>
              {COLUMNS.map((col) => (
                <Th
                  key={col.key}
                  cursor="pointer"
                  onClick={() => handleSort(col.title)}
                  className={`${css.title} ${
                    activeSort === col.title ? css.active : ""
                  }`}
                >
                  {col.title}
                  {activeSort === col.title ? (
                    activeOrder === "asc" ? (
                      <CgArrowDown />
                    ) : (
                      <CgArrowUp />
                    )
                  ) : null}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {visibleCharacters?.map((row) => {
              const isExpanded = expandedCharacter === row.name
              return (
                <>
                  <Tr key={row.name}>
                    {COLUMNS.map((column: Column, index: number) =>
                      index === 0 ? (
                        <Td
                          key={column.key}
                          cursor="pointer"
                          onClick={() => handleToggleExpand(row.name)}
                          _hover={{ bg: "gray.50" }}
                          bgColor={isExpanded ? "gray.100" : ""}
                          borderColor={isExpanded ? "gray.300" : "gray.100"}
                        >
                          <Box display="flex" alignItems="center" gap={2}>
                            {isExpanded ? (
                              <FaChevronDown size={12} />
                            ) : (
                              <FaChevronRight size={12} />
                            )}
                            {column.render(row as any)}
                          </Box>
                        </Td>
                      ) : (
                        <Td
                          key={column.key}
                          borderColor={isExpanded ? "gray.300" : "gray.100"}
                        >
                          {column.render(row as any)}
                        </Td>
                      ),
                    )}
                  </Tr>
                  {isExpanded && (
                    <Tr key={`${row.name}-expanded`}>
                      <Td
                        colSpan={COLUMNS.length}
                        backgroundColor="gray.100"
                        borderColor="gray.300"
                        style={{ padding: 0 }}
                      >
                        <Collapse in={isExpanded} animateOpacity>
                          <CharacterSpecializations characterName={row.name} />
                        </Collapse>
                      </Td>
                    </Tr>
                  )}
                </>
              )
            })}
          </Tbody>
        </Table>
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
