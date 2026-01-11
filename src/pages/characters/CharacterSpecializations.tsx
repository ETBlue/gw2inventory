import { useState } from "react"

import {
  Box,
  Center,
  Spinner,
  Tab,
  TabList,
  Tabs,
  Text,
} from "@chakra-ui/react"

import { useCharacters } from "~/contexts/CharacterContext"
import {
  GAME_MODES,
  GAME_MODE_LABELS,
  type GameMode,
  TRAIT_TIER_LABELS,
} from "~/types/specializations"

interface CharacterSpecializationsProps {
  characterName: string
  initialGameMode?: GameMode
}

/**
 * Displays specializations for a character in an expanded row
 * Shows specializations with their names and icons for the selected game mode
 * Includes tabs for switching between PvE, PvP, and WvW builds
 */
export function CharacterSpecializations({
  characterName,
  initialGameMode = "pve",
}: CharacterSpecializationsProps): React.JSX.Element {
  const [gameMode, setGameMode] = useState<GameMode>(initialGameMode)

  const {
    getCharacterSpecializations,
    isSpecsLoading,
    getSpecsError,
    getEnrichedSpecializations,
    hasSpecsForMode,
  } = useCharacters()

  // Specs are automatically prefetched by CharacterContext when characters load
  const loading = isSpecsLoading(characterName)
  const error = getSpecsError(characterName)
  const characterSpecs = getCharacterSpecializations(characterName)
  const hasSpecs = hasSpecsForMode(characterName, gameMode)
  const enrichedSpecs = getEnrichedSpecializations(characterName, gameMode)

  // Get the tab index for the current game mode
  const getTabIndex = (): number => GAME_MODES.indexOf(gameMode)

  // Handle tab change
  const handleTabChange = (index: number): void => {
    setGameMode(GAME_MODES[index])
  }

  // Loading state
  if (loading) {
    return (
      <Center py={4}>
        <Spinner size="sm" mr={2} />
        <Text>Loading specializations...</Text>
      </Center>
    )
  }

  // Error state
  if (error) {
    return (
      <Center py={4}>
        <Text color="red.500">
          Failed to load specializations: {error.message}
        </Text>
      </Center>
    )
  }

  // Not loaded yet
  if (!characterSpecs) {
    return (
      <Center py={4}>
        <Text color="gray.500">No specialization data available</Text>
      </Center>
    )
  }

  // No specializations configured for this mode
  if (!hasSpecs) {
    return (
      <Center py={4}>
        <Text color="gray.500">
          No {GAME_MODE_LABELS[gameMode]} specializations configured
        </Text>
      </Center>
    )
  }

  return (
    <Box py={4} px={2}>
      {/* Game mode tabs */}
      <Tabs index={getTabIndex()} onChange={handleTabChange} size="sm" mb={4}>
        <TabList>
          {GAME_MODES.map((mode) => (
            <Tab key={mode}>{GAME_MODE_LABELS[mode]}</Tab>
          ))}
        </TabList>
      </Tabs>

      {/* Specialization content */}
      {!hasSpecs ? (
        <Center py={4}>
          <Text color="gray.500">
            No {GAME_MODE_LABELS[gameMode]} specializations configured
          </Text>
        </Center>
      ) : (
        <Box display="flex" gap={4} flexWrap="wrap">
          {enrichedSpecs.map((spec, index) => (
            <Box
              key={index}
              border="1px solid"
              borderColor={
                spec.specialization?.elite ? "purple.200" : "gray.200"
              }
              borderRadius="md"
              p={3}
              minWidth="200px"
              bg={spec.specialization?.elite ? "purple.50" : "white"}
            >
              {spec.specialization ? (
                <>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    {spec.specialization.icon && (
                      <Box
                        as="img"
                        src={spec.specialization.icon}
                        alt={spec.specialization.name}
                        width="32px"
                        height="32px"
                      />
                    )}
                    <Text fontWeight="medium">{spec.specialization.name}</Text>
                    {spec.specialization.elite && (
                      <Text
                        fontSize="xs"
                        color="purple.600"
                        fontWeight="bold"
                        bg="purple.100"
                        px={1.5}
                        py={0.5}
                        borderRadius="sm"
                      >
                        Elite
                      </Text>
                    )}
                  </Box>
                  <Box display="flex" flexDirection="column" gap={1}>
                    {spec.selectedTraits.map((trait, traitIndex) => (
                      <Box
                        key={traitIndex}
                        display="flex"
                        alignItems="center"
                        gap={2}
                        fontSize="sm"
                      >
                        {trait ? (
                          <>
                            <Text
                              fontSize="xs"
                              color="gray.500"
                              minWidth="70px"
                            >
                              {TRAIT_TIER_LABELS[trait.tier + 1] || ""}
                            </Text>
                            {trait.icon && (
                              <Box
                                as="img"
                                src={trait.icon}
                                alt={trait.name}
                                width="24px"
                                height="24px"
                              />
                            )}
                            <Text>{trait.name}</Text>
                          </>
                        ) : (
                          <Text color="gray.400">Empty slot</Text>
                        )}
                      </Box>
                    ))}
                  </Box>
                </>
              ) : (
                <Text color="gray.400">Empty specialization slot</Text>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default CharacterSpecializations
