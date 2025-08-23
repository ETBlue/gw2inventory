import { useEffect, useMemo, useState } from "react"

import {
  Box,
  Center,
  Grid,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
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

import { chunk } from "lodash"
import { CgArrowDown, CgArrowUp } from "react-icons/cg"
import { MdSearch } from "react-icons/md"
import { Link, useNavigate, useParams, useSearchParams } from "react-router"

import Pagination from "~/components/Pagination"
import { PAGINATION } from "~/constants"
import { compareRarity } from "~/helpers/compare"
import { getQueryString } from "~/helpers/url"
import { useSkins } from "~/hooks/useSkinsData"
import sharedTextCss from "~/styles/shared-text.module.css"

import css from "./Skins.module.css"

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
  const { skins = [], isFetching, hasToken } = useSkins()
  const navigate = useNavigate()
  const { skinType } = useParams<{ skinType?: string }>()
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get("keyword")
  const sortBy = searchParams.get("sortBy")
  const order = searchParams.get("order")
  const queryString = searchParams.toString()
  const [pageIndex, setPageIndex] = useState<number>(0)

  const activeSortBy: SkinSort = (sortBy as SkinSort) || "name"
  const activeSortOrder: SkinOrder = (order as SkinOrder) || "asc"

  // Convert skinType param to match the format used in filtering (capitalized)
  const selectedType: SkinType = skinType
    ? ((skinType.charAt(0).toUpperCase() + skinType.slice(1)) as SkinType)
    : "All"

  // Filter and sort skins based on search query, type, and sort criteria
  const filteredSkins = useMemo(() => {
    let filtered = skins

    // Filter by type
    if (selectedType !== "All") {
      filtered = filtered.filter((skin) => skin.type === selectedType)
    }

    // Filter by search query
    if (keyword?.trim()) {
      const query = keyword.toLowerCase()
      filtered = filtered.filter((skin) =>
        JSON.stringify(skin).toLowerCase().includes(query),
      )
    }

    // Sort skins
    filtered = filtered.sort((a, b) => {
      let aValue: string | number = ""
      let bValue: string | number = ""

      switch (activeSortBy) {
        case "rarity": {
          const rarityComparison = compareRarity(a.rarity, b.rarity)
          return activeSortOrder === "asc"
            ? rarityComparison
            : rarityComparison * -1
        }
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

      if (aValue < bValue) return activeSortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return activeSortOrder === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [skins, keyword, selectedType, activeSortBy, activeSortOrder])

  // Create pages for pagination
  const pages = useMemo(() => {
    if (!filteredSkins) return []
    return chunk(filteredSkins, PAGINATION.ITEMS_PER_PAGE)
  }, [filteredSkins])

  // Reset page index when filters or sorting change
  useEffect(() => {
    setPageIndex(0)
  }, [keyword, selectedType, activeSortBy, activeSortOrder])

  // Count skins by type for tags
  const getSkinCountByType = (type: SkinType): number => {
    if (!skins) return 0
    if (type === "All") return skins.length
    return skins.filter((skin) => skin.type === type).length
  }

  // Handle column sorting
  const handleSort = (column: SkinSort) => {
    const currentPath = skinType ? `/skins/${skinType}` : "/skins"
    let newQueryString: string

    if (activeSortBy === column) {
      // Toggle order if same column
      const newOrder = activeSortOrder === "asc" ? "desc" : "asc"
      newQueryString = getQueryString("order", newOrder, queryString)
    } else {
      // Set new column and reset to asc
      const tempQueryString = getQueryString("sortBy", column, queryString)
      newQueryString = getQueryString("order", "asc", tempQueryString)
    }

    navigate(`${currentPath}?${newQueryString}`)
  }

  return (
    <Grid gridTemplateRows={"auto auto auto 1fr"} minHeight={"100%"}>
      <Tabs index={SKIN_TYPES.indexOf(selectedType)}>
        <TabList>
          {SKIN_TYPES.map((type) => (
            <Tab
              key={type}
              as={Link}
              to={
                type === "All"
                  ? `/skins?${queryString}`
                  : `/skins/${type.toLowerCase()}?${queryString}`
              }
            >
              {type}
              <Tag size="sm" margin="0 0 -0.1em 0.5em">
                {getSkinCountByType(type)}
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
              placeholder=""
              value={keyword || ""}
              onChange={(e) => {
                const searchValue = e.currentTarget.value
                const basePath = skinType ? `/skins/${skinType}` : "/skins"
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
      </Tabs>
      <Pagination
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        pages={pages}
      />
      <Table className={css.table}>
        <Thead>
          <Tr>
            {SKIN_TABLE_HEADERS.map((header) => (
              <Th
                key={header}
                cursor="pointer"
                onClick={() => handleSort(header)}
                className={`${css.title} ${activeSortBy === header ? css.active : ""}`}
              >
                {header.charAt(0).toUpperCase() + header.slice(1)}
                {activeSortBy === header && (
                  <>
                    {activeSortOrder === "asc" ? (
                      <CgArrowDown />
                    ) : (
                      <CgArrowUp />
                    )}
                  </>
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
      {isFetching ? (
        <Center>
          <Spinner />
        </Center>
      ) : !hasToken ? (
        <Center>No account selected</Center>
      ) : filteredSkins.length === 0 ? (
        <Center>No skin found</Center>
      ) : null}
    </Grid>
  )
}
