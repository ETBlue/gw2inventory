import {
  Box,
  Center,
  Divider,
  Grid,
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

import useHomeCats from "~/hooks/useHomeCatsData"
import useHomeNodes from "~/hooks/useHomeNodesData"
import useHomesteadGlyphs from "~/hooks/useHomesteadGlyphsData"

export default function Home() {
  const {
    hasToken,
    homeNodes,
    accountHomeNodeIds,
    enabledNodes,
    isFetching: isNodesFetching,
    error: accountHomeNodesError,
  } = useHomeNodes()

  const {
    homeCats,
    accountHomeCatIds,
    isFetching: isCatsFetching,
    error: accountCatsError,
  } = useHomeCats()

  const {
    homesteadGlyphs,
    accountGlyphIds,
    isFetching: isGlyphsFetching,
    error: accountGlyphsError,
  } = useHomesteadGlyphs()

  const isFetching = isNodesFetching || isCatsFetching || isGlyphsFetching

  return (
    <Grid gridTemplateRows={"auto 1fr"}>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={"1rem"}>
        <Box padding={"1rem"}>
          <Heading
            as="h3"
            size="sm"
            display={"flex"}
            alignItems={"center"}
            gap={"0.5rem"}
          >
            Nodes
            <Tag>
              {accountHomeNodeIds?.length ?? 0} / {homeNodes.length}
            </Tag>
          </Heading>
          <Divider margin={"0.5rem 0"} />
          <List>
            {accountHomeNodeIds &&
              homeNodes.map((nodeId) => {
                const isUnlocked = enabledNodes.has(nodeId)
                return (
                  <ListItem key={nodeId} padding={"0.125rem 0"}>
                    <ListIcon
                      as={isUnlocked ? FaCheck : FaMinus}
                      color={isUnlocked ? "green" : "lightgray"}
                      opacity={isUnlocked ? 1 : 0.5}
                    />
                    <Text
                      as={"span"}
                      textTransform={"capitalize"}
                      opacity={isUnlocked ? 1 : 0.5}
                    >
                      {nodeId.replace(/_/g, " ")}
                    </Text>
                  </ListItem>
                )
              })}
          </List>
        </Box>
        <Box padding={"1rem"}>
          <Heading
            as="h3"
            size="sm"
            display={"flex"}
            alignItems={"center"}
            gap={"0.5rem"}
          >
            Cats
            <Tag>
              {accountHomeCatIds?.length ?? 0} / {homeCats.length}
            </Tag>
          </Heading>
          <Divider margin={"0.5rem 0"} />
          <List>
            {accountHomeCatIds &&
              homeCats.map((cat) => {
                const isUnlocked = accountHomeCatIds.includes(cat.id)
                return (
                  <ListItem key={cat.id} padding={"0.125rem 0"}>
                    <ListIcon
                      as={isUnlocked ? FaCheck : FaMinus}
                      color={isUnlocked ? "green" : "lightgray"}
                      opacity={isUnlocked ? 1 : 0.5}
                    />
                    <Text
                      as={"span"}
                      textTransform={"capitalize"}
                      opacity={isUnlocked ? 1 : 0.5}
                    >
                      {cat.hint.replace(/_/g, " ")}
                    </Text>
                  </ListItem>
                )
              })}
          </List>
        </Box>
        <Box padding={"1rem"}>
          <Heading
            as="h3"
            size="sm"
            display={"flex"}
            alignItems={"center"}
            gap={"0.5rem"}
          >
            Glyphs
            <Tag>
              {accountGlyphIds?.length ?? 0} / {homesteadGlyphs.length}
            </Tag>
          </Heading>
          <Divider margin={"0.5rem 0"} />
          <List>
            {accountGlyphIds &&
              homesteadGlyphs.map((glyph) => {
                const isUnlocked = accountGlyphIds.includes(glyph.id)
                return (
                  <ListItem key={glyph.id} padding={"0.125rem 0"}>
                    <ListIcon
                      as={isUnlocked ? FaCheck : FaMinus}
                      color={isUnlocked ? "green" : "lightgray"}
                      opacity={isUnlocked ? 1 : 0.5}
                    />
                    <Text
                      as={"span"}
                      textTransform={"capitalize"}
                      opacity={isUnlocked ? 1 : 0.5}
                    >
                      {glyph.id.replace(/_/g, " ")}
                    </Text>
                  </ListItem>
                )
              })}
          </List>
        </Box>
      </SimpleGrid>
      {isFetching ? (
        <Center>
          <Spinner />
        </Center>
      ) : !hasToken ? (
        <Center>No account selected</Center>
      ) : homeNodes.length === 0 &&
        homeCats.length === 0 &&
        homesteadGlyphs.length === 0 ? (
        <Center>No home data found</Center>
      ) : accountHomeNodesError || accountCatsError || accountGlyphsError ? (
        <Center>
          <Text color="red.500">
            Error loading home data:{" "}
            {
              (
                (accountHomeNodesError ||
                  accountCatsError ||
                  accountGlyphsError) as Error
              ).message
            }
          </Text>
        </Center>
      ) : null}
    </Grid>
  )
}
