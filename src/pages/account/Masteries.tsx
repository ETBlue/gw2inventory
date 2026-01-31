import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  List,
  ListIcon,
  ListItem,
  Spinner,
  Tag,
  Text,
} from "@chakra-ui/react"

import { FaCheck, FaMinus } from "react-icons/fa"
import { Link, Navigate, useParams } from "react-router"

import useMasteriesData, {
  type MasteryRegionGroup,
} from "~/hooks/useMasteriesData"

export default function Masteries() {
  const { hasToken, masteriesByRegion, accountMasteryMap, isFetching, error } =
    useMasteriesData()

  const { "*": regionParam } = useParams()
  const regionFilter = regionParam ? decodeURIComponent(regionParam) : null

  // Redirect bare /account/masteries to first region once data is loaded
  if (!regionFilter && masteriesByRegion.length > 0) {
    return (
      <Navigate
        to={`/account/masteries/${encodeURIComponent(masteriesByRegion[0].region)}`}
        replace
      />
    )
  }

  const visibleGroups = regionFilter
    ? masteriesByRegion.filter((g) => g.region === regionFilter)
    : masteriesByRegion

  return (
    <Grid gridTemplateRows={"auto 1fr"}>
      {masteriesByRegion.length > 0 && (
        <Flex
          flexWrap="wrap"
          justifyContent="center"
          margin="0 auto"
          borderBottom={"1px solid var(--chakra-colors-chakra-border-color)"}
        >
          {masteriesByRegion.map((group) => (
            <Button
              key={group.region}
              as={Link}
              variant="ghost"
              fontWeight="normal"
              borderRadius={0}
              isActive={group.region === regionFilter}
              to={`/account/masteries/${encodeURIComponent(group.region)}`}
            >
              {group.region}{" "}
              <Tag size="sm" margin="0 0 -0.1em 0.5em">
                {group.unlockedLevels} / {group.totalLevels}
              </Tag>
            </Button>
          ))}
        </Flex>
      )}
      {visibleGroups.map((group) => (
        <Box key={group.region} padding={"1rem"}>
          {renderTracks(group, accountMasteryMap)}
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
    </Grid>
  )
}

function renderTracks(
  group: MasteryRegionGroup,
  accountMasteryMap: Map<number, number>,
) {
  return group.tracks.map((track) => {
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
        <Divider margin={"0.25rem 0"} />
      </Box>
    )
  })
}
