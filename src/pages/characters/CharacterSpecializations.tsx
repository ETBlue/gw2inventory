import React, { useState } from "react"

import {
  Badge,
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

  return (
    <Box display="flex">
      {/* Game mode tabs - vertical menu */}
      <Tabs
        index={getTabIndex()}
        onChange={handleTabChange}
        size="sm"
        orientation="vertical"
      >
        <TabList borderInlineStart="none">
          {GAME_MODES.map((mode) => (
            <Tab
              key={mode}
              borderInlineEnd="2px solid"
              borderColor="gray.100"
              bgColor={gameMode === mode ? "gray.200" : ""}
            >
              {GAME_MODE_LABELS[mode]}
            </Tab>
          ))}
        </TabList>
      </Tabs>

      {/* Specialization content */}
      {!hasSpecs ? (
        <Center py={4} flex={1}>
          <Text color="gray.500" fontSize="sm">
            No {GAME_MODE_LABELS[gameMode]} specializations configured
          </Text>
        </Center>
      ) : (
        <Box display="flex" flexWrap="wrap" flex={1}>
          {enrichedSpecs.map((spec, index) => (
            <Box
              key={index}
              borderLeft="1px solid"
              borderColor="gray.300"
              p={3}
              minWidth="200px"
            >
              {spec.specialization ? (
                <Box display="flex" gap={2} alignItems="flex-start">
                  <Box
                    display="flex"
                    alignItems="center"
                    flexDirection="column"
                  >
                    {spec.specialization.icon && (
                      <Box
                        as="img"
                        src={spec.specialization.icon}
                        alt={spec.specialization.name}
                        width="3rem"
                        height="3rem"
                      />
                    )}
                    <Text fontWeight="medium" fontSize="sm">
                      {spec.specialization.name}
                    </Text>
                    {spec.specialization.elite && (
                      <Badge color="purple.600" bg="purple.100" fontSize="xs">
                        Elite
                      </Badge>
                    )}
                  </Box>
                  <Box
                    display="grid"
                    gridTemplateColumns="auto auto auto"
                    alignItems="center"
                    gap={1}
                  >
                    {spec.selectedTraits.map(
                      (trait, traitIndex) =>
                        trait && (
                          <React.Fragment key={traitIndex}>
                            <Text
                              fontSize="xs"
                              color="gray.500"
                              minWidth="70px"
                            >
                              {TRAIT_TIER_LABELS[trait.tier] || ""}
                            </Text>
                            {trait.icon ? (
                              <Box
                                as="img"
                                src={trait.icon}
                                alt={trait.name}
                                width="24px"
                                height="24px"
                              />
                            ) : (
                              <span />
                            )}
                            <Text fontSize="sm">{trait.name}</Text>
                          </React.Fragment>
                        ),
                    )}
                  </Box>
                </Box>
              ) : (
                <Text color="gray.400" fontSize={"sm"}>
                  Empty specialization slot
                </Text>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default CharacterSpecializations
