import { useCallback, useEffect, useMemo, useState } from "react"

import {
  Box,
  Button,
  Center,
  Flex,
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
import { useDebouncedSearch } from "~/hooks/useDebouncedSearch"
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

const SKIN_TYPES: SkinType[] = ["All", "Armor", "Weapon", "Gathering", "Back"]
const ARMOR_SLOTS = [
  "Helm",
  "Shoulders",
  "Coat",
  "Gloves",
  "Leggings",
  "Boots",
  "HelmAquatic",
] as const

const formatSlotLabel = (slot: string): string =>
  slot.replace(/([A-Z])/g, " $1").trim()
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
  const slot = searchParams.get("type")
  const sortBy = searchParams.get("sortBy")
  const order = searchParams.get("order")
  const queryString = searchParams.toString()
  // Query string without armor-specific params, for use in tab links
  const tabQueryString = useMemo(() => {
    const params = new URLSearchParams(searchParams)
    params.delete("type")
    return params.toString()
  }, [searchParams])
  const [pageIndex, setPageIndex] = useState<number>(0)

  const activeSortBy: SkinSort = (sortBy as SkinSort) || "name"
  const activeSortOrder: SkinOrder = (order as SkinOrder) || "asc"

  // Convert skinType param to match the format used in filtering (capitalized)
  const selectedType: SkinType = skinType
    ? ((skinType.charAt(0).toUpperCase() + skinType.slice(1)) as SkinType)
    : "All"

  const updateSearch = useCallback(
    (value: string) => {
      const basePath = skinType ? `/skins/${skinType}` : "/skins"
      const newQueryString = getQueryString("keyword", value, queryString)
      const to = newQueryString ? `${basePath}?${newQueryString}` : basePath
      navigate(to)
    },
    [skinType, queryString, navigate],
  )
  const { searchText, handleChange: handleSearchChange } = useDebouncedSearch(
    keyword,
    updateSearch,
  )

  // Filter and sort skins based on search query, type, and sort criteria
  const filteredSkins = useMemo(() => {
    let filtered = skins

    // Filter by type
    if (selectedType !== "All") {
      filtered = filtered.filter((skin) => skin.type === selectedType)
    }

    // Filter by slot (armor slot or weapon type)
    if (
      slot &&
      (selectedType === "Armor" ||
        selectedType === "Weapon" ||
        selectedType === "Gathering")
    ) {
      filtered = filtered.filter((skin) => skin.details?.type === slot)
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
          aValue =
            a.type === "Armor" || a.type === "Weapon" || a.type === "Gathering"
              ? a.details?.type?.toLowerCase() || ""
              : a.type.toLowerCase()
          bValue =
            b.type === "Armor" || b.type === "Weapon" || b.type === "Gathering"
              ? b.details?.type?.toLowerCase() || ""
              : b.type.toLowerCase()
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
          aValue =
            a.type === "Armor"
              ? a.details?.weight_class?.toLowerCase() || ""
              : a.type === "Weapon"
                ? a.details?.damage_type?.toLowerCase() || ""
                : a.details?.type?.toLowerCase() || ""
          bValue =
            b.type === "Armor"
              ? b.details?.weight_class?.toLowerCase() || ""
              : b.type === "Weapon"
                ? b.details?.damage_type?.toLowerCase() || ""
                : b.details?.type?.toLowerCase() || ""
          break
        default:
          return 0
      }

      if (aValue < bValue) return activeSortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return activeSortOrder === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [skins, keyword, slot, selectedType, activeSortBy, activeSortOrder])

  // Create pages for pagination
  const pages = useMemo(() => {
    if (!filteredSkins) return []
    return chunk(filteredSkins, PAGINATION.ITEMS_PER_PAGE)
  }, [filteredSkins])

  // Reset page index when filters or sorting change
  useEffect(() => {
    setPageIndex(0)
  }, [keyword, slot, selectedType, activeSortBy, activeSortOrder])

  // Count skins by type for tags
  const getSkinCountByType = (type: SkinType): number => {
    if (!skins) return 0
    if (type === "All") return skins.length
    return skins.filter((skin) => skin.type === type).length
  }

  const getArmorCountBySlot = (slotName: string | null): number => {
    const armorSkins = skins.filter((skin) => skin.type === "Armor")
    if (!slotName) return armorSkins.length
    return armorSkins.filter((skin) => skin.details?.type === slotName).length
  }

  const weaponTypes = useMemo(() => {
    const types = new Set(
      skins
        .filter((skin) => skin.type === "Weapon")
        .map((skin) => skin.details?.type)
        .filter(Boolean),
    )
    return [...types].sort((a, b) => a!.localeCompare(b!)) as string[]
  }, [skins])

  const getWeaponCountByType = (weaponType: string | null): number => {
    const weaponSkins = skins.filter((skin) => skin.type === "Weapon")
    if (!weaponType) return weaponSkins.length
    return weaponSkins.filter((skin) => skin.details?.type === weaponType)
      .length
  }

  const gatheringTypes = useMemo(() => {
    const types = new Set(
      skins
        .filter((skin) => skin.type === "Gathering")
        .map((skin) => skin.details?.type)
        .filter(Boolean),
    )
    return [...types].sort((a, b) => a!.localeCompare(b!)) as string[]
  }, [skins])

  const getGatheringCountByType = (gatheringType: string | null): number => {
    const gatheringSkins = skins.filter((skin) => skin.type === "Gathering")
    if (!gatheringType) return gatheringSkins.length
    return gatheringSkins.filter((skin) => skin.details?.type === gatheringType)
      .length
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
    <Grid gridTemplateRows={"auto auto auto auto 1fr"} minHeight={"100%"}>
      <Tabs index={SKIN_TYPES.indexOf(selectedType)}>
        <TabList>
          {SKIN_TYPES.map((type) => (
            <Tab
              key={type}
              as={Link}
              to={
                type === "All"
                  ? `/skins?${tabQueryString}`
                  : `/skins/${type.toLowerCase()}?${tabQueryString}`
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
              value={searchText}
              onChange={(e) => handleSearchChange(e.currentTarget.value)}
            />
          </InputGroup>
        </TabList>
      </Tabs>
      {selectedType === "Armor" ||
      selectedType === "Weapon" ||
      selectedType === "Gathering" ? (
        <Flex
          flexWrap="wrap"
          justifyContent="center"
          margin="0 auto"
          borderBottom={"1px solid var(--chakra-colors-chakra-border-color)"}
        >
          <Button
            as={Link}
            variant="ghost"
            fontWeight="normal"
            borderRadius={0}
            isActive={!slot}
            to={`/skins/${skinType}?${getQueryString("type", "", queryString)}`}
          >
            All
            <Tag size="sm" margin="0 0 -0.1em 0.5em">
              {selectedType === "Armor"
                ? getArmorCountBySlot(null)
                : selectedType === "Weapon"
                  ? getWeaponCountByType(null)
                  : getGatheringCountByType(null)}
            </Tag>
          </Button>
          {(selectedType === "Armor"
            ? ARMOR_SLOTS.map(String)
            : selectedType === "Weapon"
              ? weaponTypes
              : gatheringTypes
          ).map((subType) => (
            <Button
              key={subType}
              as={Link}
              variant="ghost"
              fontWeight="normal"
              borderRadius={0}
              isActive={slot === subType}
              to={`/skins/${skinType}?${getQueryString("type", subType, queryString)}`}
            >
              {formatSlotLabel(subType)}
              <Tag size="sm" margin="0 0 -0.1em 0.5em">
                {selectedType === "Armor"
                  ? getArmorCountBySlot(subType)
                  : selectedType === "Weapon"
                    ? getWeaponCountByType(subType)
                    : getGatheringCountByType(subType)}
              </Tag>
            </Button>
          ))}
        </Flex>
      ) : (
        <div />
      )}
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
              <Td>
                {skin.type === "Armor" ||
                skin.type === "Weapon" ||
                skin.type === "Gathering"
                  ? skin.details?.type || skin.type
                  : skin.type}
              </Td>
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
                {skin.type === "Armor" ? (
                  <Flex columnGap="0.5rem">
                    <Tag size="sm" fontWeight="normal">
                      Weight
                    </Tag>
                    {skin.details?.weight_class}
                  </Flex>
                ) : skin.type === "Weapon" ? (
                  skin.details?.damage_type && (
                    <Flex columnGap="0.5rem">
                      <Tag size="sm" fontWeight="normal">
                        Damage
                      </Tag>
                      {skin.details.damage_type}
                    </Flex>
                  )
                ) : skin.type === "Gathering" ? null : (
                  skin.details && (
                    <>{skin.details.type || JSON.stringify(skin.details)}</>
                  )
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
