import {
  Box,
  Center,
  Divider,
  Heading,
  List,
  ListIcon,
  ListItem,
  SimpleGrid,
  Spinner,
  Tag,
  Text,
} from "@chakra-ui/react"

import { FaCheck, FaMinus } from "react-icons/fa"

import useMasteriesData from "~/hooks/useMasteriesData"

export default function Masteries() {
  const { hasToken, masteriesByRegion, accountMasteryMap, isFetching, error } =
    useMasteriesData()

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={"1rem"}>
      {masteriesByRegion.map((group) => (
        <Box key={group.region} padding={"1rem"}>
          <Heading
            as="h3"
            size="sm"
            display={"flex"}
            alignItems={"center"}
            gap={"0.5rem"}
          >
            {group.region}
            <Tag>
              {group.unlockedLevels} / {group.totalLevels}
            </Tag>
          </Heading>
          <Divider margin={"0.5rem 0"} />
          {group.tracks.map((track) => {
            const accountLevel = accountMasteryMap.get(track.id)
            return (
              <Box key={track.id} marginBottom={"0.75rem"}>
                <Text fontWeight={"bold"} fontSize={"sm"}>
                  {track.name}
                </Text>
                <List>
                  {track.levels.map((level, index) => {
                    const isUnlocked =
                      accountLevel !== undefined && index <= accountLevel
                    return (
                      <ListItem key={level.name} padding={"0.125rem 0"}>
                        <ListIcon
                          as={isUnlocked ? FaCheck : FaMinus}
                          color={isUnlocked ? "green" : "lightgray"}
                          opacity={isUnlocked ? 1 : 0.5}
                        />
                        <Text
                          as={"span"}
                          opacity={isUnlocked ? 1 : 0.5}
                          fontSize={"sm"}
                        >
                          {level.name}
                        </Text>
                      </ListItem>
                    )
                  })}
                </List>
              </Box>
            )
          })}
        </Box>
      ))}
      {isFetching ? (
        <Center>
          <Spinner />
        </Center>
      ) : !hasToken ? (
        <Center>No account selected</Center>
      ) : masteriesByRegion.length === 0 ? (
        <Center>No mastery data found</Center>
      ) : error ? (
        <Center>
          <Text color="red.500">
            Error loading masteries: {(error as Error).message}
          </Text>
        </Center>
      ) : null}
    </SimpleGrid>
  )
}
