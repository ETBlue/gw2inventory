import { useCallback, useMemo } from "react"

import {
  Box,
  Center,
  Grid,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  /* disable tooltip for now
Tooltip,
*/
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

import { CgArrowDown, CgArrowUp } from "react-icons/cg"
import { MdSearch } from "react-icons/md"
import { Link, useNavigate, useParams, useSearchParams } from "react-router"

import { compareRarity } from "~/helpers/compare"
import { getQueryString } from "~/helpers/url"
import { useDebouncedSearch } from "~/hooks/useDebouncedSearch"
import { useDyes } from "~/hooks/useDyesData"
import sharedTableCss from "~/styles/shared-table.module.css"
import sharedTextCss from "~/styles/shared-text.module.css"

type DyeHue =
  | "All"
  | "Gray"
  | "Brown"
  | "Red"
  | "Orange"
  | "Yellow"
  | "Green"
  | "Blue"
  | "Purple"
type DyeSort =
  | "name"
  | "cloth"
  | "leather"
  | "metal"
  | "fur"
  | "hue"
  | "material"
  | "rarity"
type DyeOrder = "asc" | "desc"

const DYE_HUES: DyeHue[] = [
  "All",
  "Gray",
  "Brown",
  "Red",
  "Orange",
  "Yellow",
  "Green",
  "Blue",
  "Purple",
]
const DYE_TABLE_HEADERS: DyeSort[] = [
  "name",
  "cloth",
  "leather",
  "metal",
  "fur",
  "hue",
  "material",
  "rarity",
]

// Helper function to convert RGB array to hex color
const rgbToHex = (rgb: [number, number, number]): string => {
  const [r, g, b] = rgb
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
}

// Color swatch component with tooltip
interface ColorSwatchProps {
  rgb: [number, number, number]
  label: string
  details?: string
}

const ColorSwatch = ({
  rgb,
  /* disable tooltip for now
    label, 
    details
    */
}: ColorSwatchProps) => {
  const hexColor = rgbToHex(rgb)

  return (
    /* disable tooltip for now
    <Tooltip
      label={details || `${label}: RGB(${rgb.join(", ")}) / ${hexColor}`}
      placement="top"
    >
    */
    <Box
      width="2rem"
      height="2rem"
      backgroundColor={hexColor}
      border="1px solid"
      borderColor="gray.300"
      /* disable tooltip for now
        cursor="pointer"
        */
      borderRadius="md"
    />
    /* disable tooltip for now
    </Tooltip>
    */
  )
}

export default function Dyes() {
  const { dyesWithDetails = [], isFetching, hasToken } = useDyes()
  const navigate = useNavigate()
  const { hue } = useParams<{ hue?: string }>()
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get("keyword")
  const sortBy = searchParams.get("sortBy")
  const order = searchParams.get("order")
  const queryString = searchParams.toString()

  const activeSortBy: DyeSort = (sortBy as DyeSort) || "name"
  const activeSortOrder: DyeOrder = (order as DyeOrder) || "asc"

  // Convert hue param to match the format used in filtering (capitalized)
  const selectedHue: DyeHue = hue
    ? ((hue.charAt(0).toUpperCase() + hue.slice(1)) as DyeHue)
    : "All"

  const updateSearch = useCallback(
    (value: string) => {
      const basePath =
        selectedHue === "All" ? "/dyes" : `/dyes/${selectedHue.toLowerCase()}`
      const newQueryString = getQueryString("keyword", value, queryString)
      const to = newQueryString ? `${basePath}?${newQueryString}` : basePath
      navigate(to)
    },
    [selectedHue, queryString, navigate],
  )
  const { searchText, handleChange: handleSearchChange } = useDebouncedSearch(
    keyword,
    updateSearch,
  )

  // Count dyes by hue for tags
  const getDyeCountByHue = (hue: DyeHue): number => {
    if (!dyesWithDetails) return 0
    if (hue === "All") return dyesWithDetails.length
    return dyesWithDetails.filter((entry) => {
      const hueCategory = entry.color?.categories[0]
      return hueCategory === hue
    }).length
  }

  // Filter and sort dye entries based on selected hue, search query, and sort criteria
  const filteredAndSortedDyeEntries = useMemo(() => {
    let filtered = [...dyesWithDetails]

    // Filter by hue
    if (selectedHue !== "All") {
      filtered = filtered.filter((entry) => {
        const hueCategory = entry.color?.categories[0]
        return hueCategory === selectedHue
      })
    }

    // Filter by search query
    if (keyword?.trim()) {
      const query = keyword.toLowerCase()
      filtered = filtered.filter((entry) =>
        JSON.stringify(entry).toLowerCase().includes(query),
      )
    }

    // Sort the filtered results
    return filtered.sort((a, b) => {
      let aValue: string | number = ""
      let bValue: string | number = ""

      const aColor = a.color
      const bColor = b.color

      if (!aColor || !bColor) return 0

      switch (activeSortBy) {
        case "name":
          aValue = aColor.name
          bValue = bColor.name
          break
        case "cloth":
          aValue = aColor.cloth.rgb.join(",")
          bValue = bColor.cloth.rgb.join(",")
          break
        case "leather":
          aValue = aColor.leather.rgb.join(",")
          bValue = bColor.leather.rgb.join(",")
          break
        case "metal":
          aValue = aColor.metal.rgb.join(",")
          bValue = bColor.metal.rgb.join(",")
          break
        case "fur":
          aValue = aColor.fur?.rgb.join(",") || ""
          bValue = bColor.fur?.rgb.join(",") || ""
          break
        case "hue":
          aValue = aColor.categories[0] || ""
          bValue = bColor.categories[0] || ""
          break
        case "material":
          aValue = aColor.categories[1] || ""
          bValue = bColor.categories[1] || ""
          break
        case "rarity": {
          // Map dye rarity to standard GW2 rarity scale
          const mapDyeRarity = (dyeRarity: string): string => {
            switch (dyeRarity) {
              case "Starter":
                return "Basic"
              case "Common":
                return "Fine"
              case "Uncommon":
                return "Masterwork"
              case "Rare":
                return "Rare"
              case "Exclusive":
                return "Exotic"
              default:
                return "Basic"
            }
          }

          const aMappedRarity = mapDyeRarity(aColor.categories[2] || "")
          const bMappedRarity = mapDyeRarity(bColor.categories[2] || "")
          const rarityResult = compareRarity(aMappedRarity, bMappedRarity)
          return activeSortOrder === "asc" ? rarityResult : -rarityResult
        }
        default:
          return 0
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        const result = aValue.toLowerCase().localeCompare(bValue.toLowerCase())
        return activeSortOrder === "asc" ? result : -result
      } else {
        if (aValue < bValue) return activeSortOrder === "asc" ? -1 : 1
        if (aValue > bValue) return activeSortOrder === "asc" ? 1 : -1
        return 0
      }
    })
  }, [dyesWithDetails, selectedHue, keyword, activeSortBy, activeSortOrder])

  // Handle column sorting
  const handleSort = (column: DyeSort) => {
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

    const basePath =
      selectedHue === "All" ? "/dyes" : `/dyes/${selectedHue.toLowerCase()}`
    navigate(`${basePath}?${newQueryString}`)
  }

  return (
    <Grid gridTemplateRows={"auto auto 1fr"} height={"100%"}>
      <Tabs index={DYE_HUES.indexOf(selectedHue)}>
        <TabList>
          {DYE_HUES.map((hue) => (
            <Tab
              key={hue}
              as={Link}
              to={
                hue === "All"
                  ? `/dyes?${queryString}`
                  : `/dyes/${hue.toLowerCase()}?${queryString}`
              }
            >
              {hue}
              <Tag size="sm" margin="0 0 -0.1em 0.5em">
                {getDyeCountByHue(hue)}
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
      <Table className={sharedTableCss.table}>
        <Thead>
          <Tr>
            {DYE_TABLE_HEADERS.map((header) => (
              <Th
                key={header}
                cursor="pointer"
                onClick={() => handleSort(header)}
                className={`${sharedTableCss.title} ${activeSortBy === header ? sharedTableCss.active : ""}`}
              >
                {header.charAt(0).toUpperCase() +
                  header.slice(1).replace(/_/g, " ")}
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
          {filteredAndSortedDyeEntries.map((entry) => {
            const color = entry.color
            if (!color) return null

            return (
              <Tr key={entry.id}>
                <Td className={sharedTableCss.nameCell}>
                  <Heading
                    as="h4"
                    size="sm"
                    className={`${sharedTableCss.name} ${(() => {
                      const dyeRarity = color.categories[2] || "Starter"
                      const mapDyeRarity = (dyeRarity: string): string => {
                        switch (dyeRarity) {
                          case "Starter":
                            return "basic"
                          case "Common":
                            return "fine"
                          case "Uncommon":
                            return "masterwork"
                          case "Rare":
                            return "rare"
                          case "Exclusive":
                            return "exotic"
                          default:
                            return "basic"
                        }
                      }
                      return sharedTableCss[mapDyeRarity(dyeRarity)]
                    })()}`}
                  >
                    {color.name}
                  </Heading>
                </Td>
                <Td>
                  <ColorSwatch
                    rgb={color.cloth.rgb}
                    label="Cloth"
                    details={`Cloth: RGB(${color.cloth.rgb.join(", ")}) / ${rgbToHex(color.cloth.rgb)}\nBrightness: ${color.cloth.brightness}\nContrast: ${color.cloth.contrast}\nHue: ${color.cloth.hue}°\nSaturation: ${color.cloth.saturation}%\nLightness: ${color.cloth.lightness}%`}
                  />
                </Td>
                <Td>
                  <ColorSwatch
                    rgb={color.leather.rgb}
                    label="Leather"
                    details={`Leather: RGB(${color.leather.rgb.join(", ")}) / ${rgbToHex(color.leather.rgb)}\nBrightness: ${color.leather.brightness}\nContrast: ${color.leather.contrast}\nHue: ${color.leather.hue}°\nSaturation: ${color.leather.saturation}%\nLightness: ${color.leather.lightness}%`}
                  />
                </Td>
                <Td>
                  <ColorSwatch
                    rgb={color.metal.rgb}
                    label="Metal"
                    details={`Metal: RGB(${color.metal.rgb.join(", ")}) / ${rgbToHex(color.metal.rgb)}\nBrightness: ${color.metal.brightness}\nContrast: ${color.metal.contrast}\nHue: ${color.metal.hue}°\nSaturation: ${color.metal.saturation}%\nLightness: ${color.metal.lightness}%`}
                  />
                </Td>
                <Td>
                  {color.fur ? (
                    <ColorSwatch
                      rgb={color.fur.rgb}
                      label="Fur"
                      details={`Fur: RGB(${color.fur.rgb.join(", ")}) / ${rgbToHex(color.fur.rgb)}\nBrightness: ${color.fur.brightness}\nContrast: ${color.fur.contrast}\nHue: ${color.fur.hue}°\nSaturation: ${color.fur.saturation}%\nLightness: ${color.fur.lightness}%`}
                    />
                  ) : (
                    <span className={sharedTextCss.secondary}>N/A</span>
                  )}
                </Td>
                <Td>{color.categories[0] || ""}</Td>
                <Td>{color.categories[1] || ""}</Td>
                <Td>{color.categories[2] || ""}</Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
      {isFetching ? (
        <Center>
          <Spinner />
        </Center>
      ) : !hasToken ? (
        <Center>No account selected</Center>
      ) : filteredAndSortedDyeEntries.length === 0 ? (
        <Center>No dye found</Center>
      ) : null}
    </Grid>
  )
}
