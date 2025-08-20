import { useState, useMemo } from "react"
import {
  Center,
  Spinner,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Box,
  /* disable tooltip for now
  Tooltip,
  */
} from "@chakra-ui/react"
import { CgArrowDown, CgArrowUp } from "react-icons/cg"
import { useDyes } from "~/hooks/useDyes"
import sharedTableCss from "~/styles/shared-table.module.css"
import sharedTextCss from "~/styles/shared-text.module.css"

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
  const { dyesWithDetails, isFetching, hasToken } = useDyes()
  const [sortBy, setSortBy] = useState<DyeSort>("name")
  const [sortOrder, setSortOrder] = useState<DyeOrder>("asc")

  // Sort dye entries based on selected criteria
  const sortedDyeEntries = useMemo(() => {
    if (!dyesWithDetails) return undefined
    return [...dyesWithDetails].sort((a, b) => {
      let aValue: string | number = ""
      let bValue: string | number = ""

      const aColor = a.color
      const bColor = b.color

      if (!aColor || !bColor) return 0

      switch (sortBy) {
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
        case "rarity":
          aValue = aColor.categories[2] || ""
          bValue = bColor.categories[2] || ""
          break
        default:
          return 0
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        const result = aValue.toLowerCase().localeCompare(bValue.toLowerCase())
        return sortOrder === "asc" ? result : -result
      } else {
        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
        return 0
      }
    })
  }, [dyesWithDetails, sortBy, sortOrder])

  // Handle column sorting
  const handleSort = (column: DyeSort) => {
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

  if (!sortedDyeEntries || sortedDyeEntries.length === 0) {
    return <Center>No dye data available</Center>
  }

  return (
    <VStack spacing={4} align="stretch">
      <Table className={sharedTableCss.table}>
        <Thead>
          <Tr>
            {DYE_TABLE_HEADERS.map((header) => (
              <Th
                key={header}
                cursor="pointer"
                onClick={() => handleSort(header)}
                className={`${sharedTableCss.title} ${sortBy === header ? sharedTableCss.active : ""}`}
              >
                {header.charAt(0).toUpperCase() +
                  header.slice(1).replace(/_/g, " ")}
                {sortBy === header && (
                  <> {sortOrder === "asc" ? <CgArrowDown /> : <CgArrowUp />}</>
                )}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {sortedDyeEntries.map((entry) => {
            const color = entry.color
            if (!color) return null

            return (
              <Tr key={entry.id}>
                <Td className={sharedTableCss.nameCell}>
                  <Heading
                    as="h4"
                    size="sm"
                    className={`${sharedTableCss.name}`}
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
    </VStack>
  )
}
