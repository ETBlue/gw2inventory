import {
  Center,
  Grid,
  Heading,
  SimpleGrid,
  Spinner,
  Text,
  Box,
  List,
  ListItem,
  ListIcon,
  Divider,
  Tag,
} from "@chakra-ui/react"
import { FaCheck, FaMinus } from "react-icons/fa"

import { useHomeNodes } from "~/hooks/useHomeNodes"

export default function Home() {
  const {
    hasToken,
    homeNodes,
    accountHomeNodeIds,
    enabledNodes,
    isFetching,
    error: accountHomeNodesError,
  } = useHomeNodes()

  return (
    <Grid gridTemplateRows={"auto 1fr"}>
      <SimpleGrid columns={{ base: 1 }} gap={"1rem"}>
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
                const isEnabled = enabledNodes.has(nodeId)
                return (
                  <ListItem key={nodeId} padding={"0.125rem 0"}>
                    <ListIcon
                      as={isEnabled ? FaCheck : FaMinus}
                      color={isEnabled ? "green" : "lightgray"}
                      opacity={isEnabled ? 1 : 0.5}
                    />
                    <Text
                      as={"span"}
                      textTransform={"capitalize"}
                      opacity={isEnabled ? 1 : 0.5}
                    >
                      {nodeId.replace(/_/g, " ")}
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
      ) : homeNodes.length === 0 ? (
        <Center>No home nodes found</Center>
      ) : accountHomeNodesError ? (
        <Center>
          <Text color="red.500">
            Error loading home nodes: {(accountHomeNodesError as Error).message}
          </Text>
        </Center>
      ) : null}
    </Grid>
  )
}
