import { useState, useMemo, useEffect } from "react"
import { chunk } from "lodash"
import {
  Center,
  Spinner,
  VStack,
  Flex,
  Image,
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Tag,
  Heading,
} from "@chakra-ui/react"
import { MdSearch } from "react-icons/md"
import { CgArrowDown, CgArrowUp } from "react-icons/cg"
import { useSkins } from "~/hooks/useSkins"
import Pagination from "~/components/Pagination"
import css from "./Skins.module.css"
import { ITEM_COUNT_PER_PAGE } from "~/config"
import sharedTextCss from "~/styles/shared-text.module.css"
import { compareRarity } from "~/pages/items/helpers/compare"

type SkinType = "All" | "Armor" | "Weapon" | "Back" | "Gathering"
type SkinSort =
  | "rarity"
  | "name"
  | "type"
  | "flags"
  | "restrictions"
  | "details"
type SkinOrder = "asc" | "desc"

const SKIN_TYPES: SkinType[] = ["All", "Armor", "Weapon", "Back", "Gathering"]
const SKIN_TABLE_HEADERS: SkinSort[] = [
  "rarity",
  "name",
  "type",
  "flags",
  "restrictions",
  "details",
]

export default function Skins() {
  const { skins, isFetching, hasToken } = useSkins()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<SkinType>("All")
  const [pageIndex, setPageIndex] = useState<number>(0)
  const [sortBy, setSortBy] = useState<SkinSort>("name")
  const [sortOrder, setSortOrder] = useState<SkinOrder>("asc")

  // Filter and sort skins based on search query, type, and sort criteria
  const filteredSkins = useMemo(() => {
    if (!skins) return undefined

    let filtered = skins

    // Filter by type
    if (selectedType !== "All") {
      filtered = filtered.filter((skin) => skin.type === selectedType)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((skin) =>
        JSON.stringify(skin).toLowerCase().includes(query),
      )
    }

    // Sort skins
    filtered = filtered.sort((a, b) => {
      let aValue: string | number = ""
      let bValue: string | number = ""

      switch (sortBy) {
        case "rarity":
          const rarityComparison = compareRarity(a.rarity, b.rarity)
          return sortOrder === "asc" ? rarityComparison : rarityComparison * -1
        case "name":
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case "type":
          aValue = a.type.toLowerCase()
          bValue = b.type.toLowerCase()
          break
        case "flags":
          aValue = a.flags?.join(", ").toLowerCase() || ""
          bValue = b.flags?.join(", ").toLowerCase() || ""
          break
        case "restrictions":
          aValue = a.restrictions?.join(", ").toLowerCase() || ""
          bValue = b.restrictions?.join(", ").toLowerCase() || ""
          break
        case "details":
          // For details, we'll sort by the type property within details if it exists
          aValue = a.details?.type?.toLowerCase() || ""
          bValue = b.details?.type?.toLowerCase() || ""
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [skins, searchQuery, selectedType, sortBy, sortOrder])

  // Create pages for pagination
  const pages = useMemo(() => {
    if (!filteredSkins) return []
    return chunk(filteredSkins, ITEM_COUNT_PER_PAGE)
  }, [filteredSkins])

  // Reset page index when filters or sorting change
  useEffect(() => {
    setPageIndex(0)
  }, [searchQuery, selectedType, sortBy, sortOrder])

  // Count skins by type for tags
  const getSkinCountByType = (type: SkinType): number => {
    if (!skins) return 0
    if (type === "All") return skins.length
    return skins.filter((skin) => skin.type === type).length
  }

  // Handle column sorting
  const handleSort = (column: SkinSort) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  if (!hasToken) return <Center>No account selected</Center>

  if (isFetching)
    return (
      <Center>
        <Spinner />
      </Center>
    )

  if (!filteredSkins || filteredSkins.length === 0) {
    return (
      <VStack spacing={4} align="stretch">
        <Flex justifyContent="center" margin="1rem auto">
          {SKIN_TYPES.map((type) => (
            <Button
              key={type}
              variant="ghost"
              fontWeight="normal"
              isActive={selectedType === type}
              onClick={() => setSelectedType(type)}
            >
              {type}
              <Tag size="sm" margin="0 0 -0.1em 0.5em">
                {getSkinCountByType(type)}
              </Tag>
            </Button>
          ))}
          <InputGroup width="20ch">
            <InputLeftElement>
              <MdSearch opacity="0.5" />
            </InputLeftElement>
            <Input
              variant="unstyled"
              placeholder="Search skins by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Flex>
        {pages.length > 1 && (
          <Pagination
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
            pages={pages}
          />
        )}
        <Center>
          {searchQuery || selectedType !== "All"
            ? "No skins match your filters"
            : "No skins available"}
        </Center>
      </VStack>
    )
  }

  return (
    <div>
      <Flex justifyContent="center" margin="1rem auto">
        {SKIN_TYPES.map((type) => (
          <Button
            key={type}
            variant="ghost"
            fontWeight="normal"
            isActive={selectedType === type}
            onClick={() => setSelectedType(type)}
          >
            {type}
            <Tag size="sm" margin="0 0 -0.1em 0.5em">
              {getSkinCountByType(type)}
            </Tag>
          </Button>
        ))}
        <InputGroup width="20ch">
          <InputLeftElement>
            <MdSearch opacity="0.5" />
          </InputLeftElement>
          <Input
            variant="unstyled"
            placeholder=""
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
      </Flex>
      {pages.length > 1 && (
        <Pagination
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          pages={pages}
        />
      )}
      <Table className={css.table}>
        <Thead>
          <Tr>
            {SKIN_TABLE_HEADERS.map((header) => (
              <Th
                key={header}
                cursor="pointer"
                onClick={() => handleSort(header)}
                className={`${css.title} ${sortBy === header ? css.active : ""}`}
              >
                {header.charAt(0).toUpperCase() + header.slice(1)}
                {sortBy === header && (
                  <> {sortOrder === "asc" ? <CgArrowDown /> : <CgArrowUp />}</>
                )}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {pages[pageIndex]?.map((skin) => (
            <Tr key={skin.id}>
              <Td className={css.iconCell}>
                {skin.icon && (
                  <Image
                    src={skin.icon}
                    alt={skin.name}
                    className={`${css.icon} ${skin.rarity ? css[skin.rarity.toLowerCase()] : ""}`}
                    fallback={<Box boxSize="32px" bg="gray.200" />}
                  />
                )}
              </Td>
              <Td className={css.nameCell}>
                <Heading
                  as="h4"
                  size="sm"
                  className={`${css.name} ${css[skin?.rarity.toLowerCase()]}`}
                >
                  {skin.name}
                </Heading>
                {skin.description && (
                  <p
                    className={`${css.description} ${sharedTextCss.secondary}`}
                  >
                    {skin.description}
                  </p>
                )}
              </Td>
              <Td>{skin.type}</Td>
              <Td>
                {skin.flags && skin.flags.length > 0 && (
                  <>{skin.flags.join(", ")}</>
                )}
              </Td>
              <Td>
                {skin.restrictions && skin.restrictions.length > 0 && (
                  <>{skin.restrictions.join(", ")}</>
                )}
              </Td>
              <Td>
                {skin.details && (
                  <>{skin.details.type || JSON.stringify(skin.details)}</>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  )
}
