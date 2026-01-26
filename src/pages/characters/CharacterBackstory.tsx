import React from "react"

import { Box, Flex, Text } from "@chakra-ui/react"

import { useCharacters } from "~/contexts/CharacterContext"

interface CharacterBackstoryProps {
  characterName: string
}

/**
 * Displays backstory question/answer pairs for a character in an expanded row
 * Uses inline flex layout matching the tablet-only hidden columns pattern
 */
export function CharacterBackstory({
  characterName,
}: CharacterBackstoryProps): React.JSX.Element | null {
  const { getEnrichedBackstory, isBackstoryLoading } = useCharacters()

  const loading = isBackstoryLoading(characterName)
  const enrichedBackstory = getEnrichedBackstory(characterName)

  if (loading || enrichedBackstory.length === 0) {
    return null
  }

  return (
    <Box p={3} borderBottom="1px solid" borderColor="gray.300">
      <Flex columnGap="2rem" fontSize="sm" flexWrap="wrap">
        {enrichedBackstory.map((item) => (
          <Box key={item.answer.id}>
            <Text color="gray.500" fontSize="xs">
              {item.question.title}
            </Text>
            <Text>{item.answer.title}</Text>
          </Box>
        ))}
      </Flex>
    </Box>
  )
}

export default CharacterBackstory
